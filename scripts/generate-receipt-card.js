/**
 * generate-receipt-card.js — Generates shareable contradiction card images
 *
 * Creates a visually compelling side-by-side image:
 *   Left side:  What Hawley said (tweet text + date)
 *   Right side: The receipt (contradiction from votes/donors/past statements)
 *   Bottom:     Truth score bar + link back to full analysis
 *
 * Uses Playwright to render an HTML template to a PNG image.
 * This "HTML-to-image" approach gives us full CSS control over the card design
 * without needing a separate image library like Canvas or Sharp.
 *
 * Output: public/assets/receipts/<date>-<slug>.png (1200x630, optimized for social sharing)
 *
 * Usage:
 *   node scripts/generate-receipt-card.js              # Generate cards for all ungenerated receipts
 *   node scripts/generate-receipt-card.js <tweet-id>   # Generate card for a specific tweet
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const RECEIPTS_DIR = join(PROJECT_ROOT, 'public', 'assets', 'receipts');
const TWEETS_FILE = join(PROJECT_ROOT, 'data', 'past-tweets.json');

// Ensure output directory exists
if (!existsSync(RECEIPTS_DIR)) {
  mkdirSync(RECEIPTS_DIR, { recursive: true });
}

// Card dimensions — optimized for Twitter/Facebook Open Graph
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

/**
 * Map a truth score rating to its display color.
 */
function ratingColor(rating) {
  const colors = {
    false: '#DC2626',
    misleading: '#EA580C',
    mixed: '#CA8A04',
    'mostly-true': '#16A34A',
    true: '#059669',
  };
  return colors[rating] || '#737373';
}

/**
 * Build the HTML template for a receipt card.
 * This is a self-contained HTML document that Playwright will render and screenshot.
 *
 * @param {object} tweet - The tweet record from past-tweets.json
 * @returns {string} Complete HTML document string
 */
function buildCardHtml(tweet) {
  // Extract the best contradiction text from matched data
  let receiptText = 'Contradiction detected — see full analysis for details.';
  let receiptSource = '';

  // Prioritize vote contradictions, then donor hypocrisy angles
  if (tweet.matchedVotes && tweet.matchedVotes.length > 0) {
    const contradiction = tweet.matchedVotes.find((v) => v.isContradiction);
    if (contradiction) {
      receiptText = contradiction.note;
      receiptSource = `Source: Congress.gov — ${contradiction.bill}`;
    } else {
      receiptText = tweet.matchedVotes[0].note;
      receiptSource = `Source: Congress.gov — ${tweet.matchedVotes[0].bill}`;
    }
  }

  if (tweet.matchedDonors && tweet.matchedDonors.length > 0) {
    const hypocrisy = tweet.matchedDonors.find((d) => d.hasHypocrisyAngle);
    if (hypocrisy) {
      // Append donor info to the receipt
      const amount = hypocrisy.amount >= 1000000
        ? `$${(hypocrisy.amount / 1000000).toFixed(1)}M`
        : `$${(hypocrisy.amount / 1000).toFixed(0)}K`;
      receiptText += `\n\nMeanwhile, Hawley has received ${amount} from the ${hypocrisy.name} industry.`;
      receiptSource = receiptSource || 'Source: OpenSecrets.org';
    }
  }

  // Truncate tweet text for the card (keep it readable)
  const tweetText = tweet.text.length > 200
    ? tweet.text.substring(0, 197) + '...'
    : tweet.text;

  // Truncate receipt text similarly
  const cardReceipt = receiptText.length > 250
    ? receiptText.substring(0, 247) + '...'
    : receiptText;

  const score = tweet.truthScore || 0;
  const rating = tweet.rating || 'misleading';
  const ratingLabel = rating.charAt(0).toUpperCase() + rating.slice(1);
  const color = ratingColor(rating);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* Reset and base styles */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: ${CARD_WIDTH}px;
      height: ${CARD_HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #FFFFFF;
      overflow: hidden;
    }

    /* Top banner — red with RECEIPTS branding */
    .header {
      background: #B31942;
      color: white;
      padding: 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .header-brand {
      font-size: 14px;
      opacity: 0.8;
    }

    /* Two-column body */
    .body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: ${CARD_HEIGHT - 56 - 70}px;
    }

    .side {
      padding: 24px 28px;
    }

    .side-left {
      border-right: 2px solid #E5E5E5;
      background: #FAFAFA;
    }

    .side-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #737373;
      margin-bottom: 14px;
    }

    .tweet-meta {
      font-size: 13px;
      font-weight: 700;
      color: #0A3161;
      margin-bottom: 10px;
    }

    .tweet-text {
      font-size: 16px;
      line-height: 1.5;
      color: #171717;
    }

    .receipt-text {
      font-size: 16px;
      line-height: 1.5;
      color: #171717;
      white-space: pre-line;
    }

    .receipt-source {
      font-size: 12px;
      color: #737373;
      margin-top: 12px;
      font-style: italic;
    }

    /* Bottom bar — truth score */
    .footer {
      height: 70px;
      border-top: 2px solid #E5E5E5;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FAFAFA;
    }

    .score-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .score-badge {
      font-size: 14px;
      font-weight: 700;
      padding: 4px 16px;
      color: white;
      text-transform: uppercase;
      background: ${color};
    }

    .score-bar-container {
      width: 200px;
      height: 10px;
      background: #E5E5E5;
      border-radius: 5px;
      overflow: hidden;
    }

    .score-bar-fill {
      height: 100%;
      border-radius: 5px;
      background: ${color};
      width: ${score}%;
    }

    .score-number {
      font-family: 'SF Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: #404040;
    }

    .footer-link {
      font-size: 13px;
      color: #0A3161;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="header-title">Receipts</span>
    <span class="header-brand">hawleywatch.com</span>
  </div>

  <div class="body">
    <div class="side side-left">
      <div class="side-label">What He Said</div>
      <div class="tweet-meta">@HawleyMO &middot; ${tweet.date}</div>
      <div class="tweet-text">${escapeHtml(tweetText)}</div>
    </div>
    <div class="side side-right">
      <div class="side-label">The Receipt</div>
      <div class="receipt-text">${escapeHtml(cardReceipt)}</div>
      <div class="receipt-source">${escapeHtml(receiptSource)}</div>
    </div>
  </div>

  <div class="footer">
    <div class="score-section">
      <span class="score-badge">${ratingLabel} &mdash; ${score}%</span>
      <div class="score-bar-container">
        <div class="score-bar-fill"></div>
      </div>
      <span class="score-number">${score} / 100</span>
    </div>
    <span class="footer-link">Read full analysis &rarr;</span>
  </div>
</body>
</html>`;
}

/**
 * Escape HTML entities to prevent XSS in the rendered card.
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/**
 * Generate a slug for the output filename from tweet text.
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-');
}

/**
 * Render a receipt card image using Playwright.
 *
 * @param {import('playwright').Browser} browser - Playwright browser instance
 * @param {object} tweet - Tweet record with matched data
 * @param {string} outputPath - Where to save the PNG
 */
async function renderCard(browser, tweet, outputPath) {
  const html = buildCardHtml(tweet);
  const context = await browser.newContext({
    viewport: { width: CARD_WIDTH, height: CARD_HEIGHT },
    // High DPI for sharp text rendering
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  try {
    // Load the HTML template directly (no network requests needed)
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Screenshot the full page (which is exactly card-sized)
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      type: 'png',
    });

    console.log(`[card] Generated receipt card: ${outputPath}`);
  } finally {
    await context.close();
  }
}

/**
 * Main entry point.
 */
async function main() {
  if (!existsSync(TWEETS_FILE)) {
    console.log('[card] No tweets database found. Run fetch-tweets.js and match-contradictions.js first.');
    return;
  }

  const db = JSON.parse(readFileSync(TWEETS_FILE, 'utf-8'));
  const args = process.argv.slice(2);

  // Filter to receipts that don't have a card generated yet
  let tweetsToProcess;

  if (args.length > 0) {
    // Process a specific tweet by ID
    tweetsToProcess = db.tweets.filter((t) => t.id === args[0]);
    if (tweetsToProcess.length === 0) {
      console.log(`[card] No tweet found with ID: ${args[0]}`);
      return;
    }
  } else {
    // Process all receipt-bucket tweets that don't have a card yet
    tweetsToProcess = db.tweets.filter(
      (t) => t.bucket === 'receipt' && !t.receiptCardPath
    );
  }

  if (tweetsToProcess.length === 0) {
    console.log('[card] All receipt tweets already have cards generated.');
    return;
  }

  console.log(`[card] Generating ${tweetsToProcess.length} receipt cards...\n`);

  // Launch browser
  const browser = await chromium.launch({ headless: true });

  try {
    for (const tweet of tweetsToProcess) {
      const slug = generateSlug(tweet.text);
      const filename = `${tweet.date}-${slug}.png`;
      const outputPath = join(RECEIPTS_DIR, filename);
      const relativePath = `/assets/receipts/${filename}`;

      await renderCard(browser, tweet, outputPath);

      // Update the tweet record with the card path
      tweet.receiptCardPath = relativePath;
    }

    // Save updated database
    writeFileSync(TWEETS_FILE, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`\n[card] Done. ${tweetsToProcess.length} cards generated.`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[card] Fatal error:', err);
  process.exit(1);
});
