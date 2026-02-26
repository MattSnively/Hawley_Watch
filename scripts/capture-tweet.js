/**
 * capture-tweet.js — Screenshots tweets using Playwright
 *
 * Takes a tweet URL (or processes all unscreenshotted tweets from the database)
 * and captures a high-quality screenshot using headless Chromium.
 *
 * Screenshots are saved to public/assets/tweets/ with a date-based filename.
 * Each screenshot captures just the tweet element, not the full page.
 *
 * Usage:
 *   node scripts/capture-tweet.js                          # Process all unscreenshotted tweets
 *   node scripts/capture-tweet.js <tweet-url>              # Screenshot a single tweet
 *   node scripts/capture-tweet.js <tweet-url> <filename>   # Screenshot with custom filename
 *
 * Note: X.com may require a logged-in session for consistent rendering.
 *       Set X_SESSION_COOKIE env var if tweets fail to load.
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const TWEETS_DIR = join(PROJECT_ROOT, 'public', 'assets', 'tweets');
const TWEETS_FILE = join(PROJECT_ROOT, 'data', 'past-tweets.json');

// Ensure the output directory exists
if (!existsSync(TWEETS_DIR)) {
  mkdirSync(TWEETS_DIR, { recursive: true });
}

/**
 * Generate a filename for a tweet screenshot based on its date and a slug.
 * Format: YYYY-MM-DD-<slug>.png
 */
function generateFilename(tweetDate, tweetText) {
  // Create a slug from the first few words of the tweet
  const slug = tweetText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove special chars
    .trim()
    .split(/\s+/)
    .slice(0, 5) // first 5 words
    .join('-');

  return `${tweetDate}-${slug}.png`;
}

/**
 * Capture a screenshot of a single tweet.
 *
 * Strategy:
 *   1. Navigate to the tweet URL
 *   2. Wait for the tweet content to render
 *   3. Find the primary tweet article element
 *   4. Screenshot just that element (not the full page)
 *   5. Fall back to a viewport screenshot if element selection fails
 *
 * @param {import('playwright').Browser} browser - Playwright browser instance
 * @param {string} tweetUrl - Full URL of the tweet
 * @param {string} outputPath - Where to save the screenshot
 * @returns {boolean} True if screenshot was captured successfully
 */
async function screenshotTweet(browser, tweetUrl, outputPath) {
  const context = await browser.newContext({
    // Desktop viewport for clean rendering
    viewport: { width: 1280, height: 900 },
    // Set a realistic user agent to avoid bot detection
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    console.log(`[capture] Navigating to ${tweetUrl}`);
    await page.goto(tweetUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for tweet content to appear.
    // X/Twitter uses article[data-testid="tweet"] for tweet elements.
    // The first one on a status page is the main tweet.
    await page.waitForSelector('article[data-testid="tweet"]', {
      timeout: 15000,
    });

    // Brief pause to let images and embeds finish rendering
    await page.waitForTimeout(2000);

    // Try to screenshot just the tweet element for a clean capture
    const tweetElement = await page.$('article[data-testid="tweet"]');

    if (tweetElement) {
      await tweetElement.screenshot({ path: outputPath });
      console.log(`[capture] Saved tweet screenshot to ${outputPath}`);
    } else {
      // Fallback: screenshot the visible viewport
      console.log('[capture] Could not isolate tweet element, taking viewport screenshot');
      await page.screenshot({ path: outputPath, fullPage: false });
      console.log(`[capture] Saved viewport screenshot to ${outputPath}`);
    }

    return true;
  } catch (err) {
    console.error(`[capture] Failed to screenshot ${tweetUrl}: ${err.message}`);

    // Last-resort fallback: screenshot whatever loaded
    try {
      await page.screenshot({ path: outputPath, fullPage: false });
      console.log(`[capture] Saved fallback screenshot to ${outputPath}`);
      return true;
    } catch (fallbackErr) {
      console.error(`[capture] Fallback screenshot also failed: ${fallbackErr.message}`);
      return false;
    }
  } finally {
    await context.close();
  }
}

/**
 * Process a single tweet URL passed as a command-line argument.
 */
async function processSingleTweet(browser, url, customFilename) {
  const date = new Date().toISOString().split('T')[0];
  const filename = customFilename || `${date}-manual-capture.png`;
  const outputPath = join(TWEETS_DIR, filename);

  const success = await screenshotTweet(browser, url, outputPath);
  if (success) {
    console.log(`[capture] Screenshot saved: ${outputPath}`);
  }
  return success;
}

/**
 * Process all unscreenshotted tweets from the database.
 * Updates the database file with screenshot paths for successful captures.
 */
async function processUnscreenshotted(browser) {
  if (!existsSync(TWEETS_FILE)) {
    console.log('[capture] No tweets database found. Run fetch-tweets.js first.');
    return;
  }

  const db = JSON.parse(readFileSync(TWEETS_FILE, 'utf-8'));

  // Find tweets that don't have screenshots yet
  const needScreenshot = db.tweets.filter(
    (t) => !t.screenshotPath && t.url
  );

  if (needScreenshot.length === 0) {
    console.log('[capture] All tweets already have screenshots.');
    return;
  }

  console.log(`[capture] ${needScreenshot.length} tweets need screenshots.`);

  let successCount = 0;

  for (const tweet of needScreenshot) {
    const filename = generateFilename(tweet.date, tweet.text);
    const outputPath = join(TWEETS_DIR, filename);
    const relativePath = `/assets/tweets/${filename}`;

    const success = await screenshotTweet(browser, tweet.url, outputPath);

    if (success) {
      // Update the tweet record with the screenshot path
      tweet.screenshotPath = relativePath;
      successCount++;
    }

    // Rate-limit: wait between requests to avoid triggering anti-bot measures
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Save updated database
  writeFileSync(TWEETS_FILE, JSON.stringify(db, null, 2), 'utf-8');
  console.log(
    `[capture] Done. ${successCount}/${needScreenshot.length} screenshots captured.`
  );
}

/**
 * Main entry point.
 */
async function main() {
  const args = process.argv.slice(2);

  // Launch headless Chromium
  console.log('[capture] Launching browser...');
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    if (args.length > 0 && args[0].startsWith('http')) {
      // Single tweet mode: screenshot a specific URL
      await processSingleTweet(browser, args[0], args[1]);
    } else {
      // Batch mode: process all unscreenshotted tweets from the database
      await processUnscreenshotted(browser);
    }
  } finally {
    await browser.close();
    console.log('[capture] Browser closed.');
  }
}

main().catch((err) => {
  console.error('[capture] Fatal error:', err);
  process.exit(1);
});
