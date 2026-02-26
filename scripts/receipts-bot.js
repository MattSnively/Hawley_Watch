/**
 * receipts-bot.js — Main orchestrator for the Hawley Watch Receipts Bot
 *
 * This is the primary entry point that chains the full pipeline:
 *   1. Fetch new tweets from @HawleyMO
 *   2. Screenshot each new tweet
 *   3. Classify tweets into buckets (receipt / credit / noise)
 *   4. Generate shareable receipt card images for contradictions
 *   5. Draft markdown blog posts for human review
 *
 * The bot drafts everything but publishes nothing automatically.
 * All output goes to a drafts/ directory for human review.
 *
 * Usage:
 *   node scripts/receipts-bot.js            # Run the full pipeline
 *   node scripts/receipts-bot.js --dry-run  # Fetch and classify only, no screenshots or cards
 *   node scripts/receipts-bot.js --skip-fetch  # Skip fetching, process existing unclassified tweets
 *
 * Recommended: Run daily via cron job or scheduled task.
 *   Cron example: 0 8 * * * cd /path/to/project && node scripts/receipts-bot.js >> logs/bot.log 2>&1
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const TWEETS_FILE = join(PROJECT_ROOT, 'data', 'past-tweets.json');
const DRAFTS_DIR = join(PROJECT_ROOT, 'drafts');

// Parse command-line flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SKIP_FETCH = args.includes('--skip-fetch');

// Ensure drafts directory exists
if (!existsSync(DRAFTS_DIR)) {
  mkdirSync(DRAFTS_DIR, { recursive: true });
}

/**
 * Run a child script and log its output.
 * Each step in the pipeline is a separate script for modularity —
 * you can run any step independently for debugging.
 */
function runStep(stepName, scriptPath) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`STEP: ${stepName}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // Run the script as a child process, inheriting env vars and stdio
    execSync(`node "${scriptPath}"`, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: process.env,
    });
    console.log(`\n[bot] ${stepName} completed successfully.`);
  } catch (err) {
    console.error(`\n[bot] ${stepName} failed: ${err.message}`);
    console.error('[bot] Continuing with remaining steps...');
  }
}

/**
 * Generate a draft markdown blog post for a receipt tweet.
 * This creates a starter template that a human will flesh out with analysis.
 *
 * The draft includes:
 *   - Frontmatter with all metadata
 *   - The tweet text (to be replaced with embed/screenshot)
 *   - Auto-generated contradiction notes from matched data
 *   - Placeholders for human analysis
 *   - Source links
 */
function generateDraftPost(tweet) {
  const topics = (tweet.topics || []).map((t) => `"${t}"`).join(', ');
  const rating = tweet.rating || 'misleading';
  const score = tweet.truthScore || 0;

  // Build contradiction summary from matched data
  let contradictionSummary = '';
  let contradictionType = 'unknown';

  if (tweet.matchedVotes && tweet.matchedVotes.length > 0) {
    const contradictions = tweet.matchedVotes.filter((v) => v.isContradiction);
    if (contradictions.length > 0) {
      contradictionType = 'vote';
      contradictionSummary = contradictions.map((v) => v.note).join('. ');
    }
  }

  if (tweet.matchedDonors && tweet.matchedDonors.length > 0) {
    const hypocrisy = tweet.matchedDonors.filter((d) => d.hasHypocrisyAngle);
    if (hypocrisy.length > 0) {
      contradictionType =
        contradictionType === 'vote' ? 'multiple' : 'donor';
      const donorNotes = hypocrisy
        .map((d) => d.hypocrisyAngle)
        .join('. ');
      contradictionSummary += contradictionSummary
        ? `. ${donorNotes}`
        : donorNotes;
    }
  }

  // Generate slug for filename
  const slug = tweet.text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join('-');

  const filename = `${tweet.date}-${slug}.md`;

  // Build the donor table rows
  let donorTable = '';
  if (tweet.matchedDonors && tweet.matchedDonors.length > 0) {
    donorTable = tweet.matchedDonors
      .map((d) => {
        const amount =
          d.amount >= 1000000
            ? `$${(d.amount / 1000000).toFixed(1)}M`
            : `$${(d.amount / 1000).toFixed(0)}K`;
        return `| ${d.name} | ${amount} |`;
      })
      .join('\n');
  }

  // Build the matched votes list
  let votesList = '';
  if (tweet.matchedVotes && tweet.matchedVotes.length > 0) {
    votesList = tweet.matchedVotes
      .map((v) => `- **${v.bill}** — ${v.title} — Voted: ${v.vote} (${v.date})`)
      .join('\n');
  }

  const markdown = `---
title: "DRAFT: ${tweet.text.substring(0, 60)}..."
date: ${tweet.date}
bucket: "receipt"
topic: [${topics}]
politician: "josh-hawley"
tweetUrl: "${tweet.url}"
tweetScreenshot: "${tweet.screenshotPath || 'PENDING'}"
receiptCard: "${tweet.receiptCardPath || 'PENDING'}"
truthScore: ${score}
factualAccuracy: 0
intentToMislead: 0
contextScore: 0
rating: "${rating}"
contradictionType: "${contradictionType}"
contradictionSummary: "${contradictionSummary.replace(/"/g, '\\"')}"
draft: true
---

# DRAFT — Needs Human Review

**Auto-generated by Receipts Bot on ${new Date().toISOString().split('T')[0]}**
**Classification: ${tweet.bucket?.toUpperCase()}**
**Reason: ${tweet.classificationReason || 'N/A'}**

---

## The Tweet

> "${tweet.text}"
>
> — Josh Hawley (@HawleyMO), ${tweet.date}

---

## Auto-Detected Contradictions

${contradictionSummary || '_No contradictions auto-detected. Needs manual research._'}

${votesList ? `### Related Votes\n\n${votesList}` : ''}

${donorTable ? `### Related Donors\n\n| Industry | Amount |\n|----------|--------|\n${donorTable}` : ''}

---

## TODO: Human Analysis Needed

- [ ] Verify auto-detected contradictions
- [ ] Score Factual Accuracy (0-100)
- [ ] Score Intent to Mislead (0-100)
- [ ] Score Context & Cherry-Picking (0-100)
- [ ] Calculate final Truth Score
- [ ] Write analysis for each factor
- [ ] Add fact-check sources
- [ ] Review and approve receipt card image
- [ ] Move from drafts/ to src/content/posts/ when ready to publish
- [ ] Remove \`draft: true\` from frontmatter

---

## Sources

- [ ] _Add fact-check sources here_
- [OpenSecrets — Josh Hawley](https://www.opensecrets.org/members-of-congress/josh-hawley/summary?cid=N00041620)
- [GovTrack — Josh Hawley](https://www.govtrack.us/congress/members/josh_hawley/412838)
`;

  return { filename, markdown };
}

/**
 * Main pipeline orchestrator.
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║        HAWLEY WATCH — RECEIPTS BOT              ║');
  console.log('║        "The bot drafts. You decide."            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no screenshots or cards)' : 'FULL PIPELINE'}`);
  console.log(`Date: ${new Date().toISOString()}`);

  // Step 1: Fetch new tweets
  if (!SKIP_FETCH) {
    runStep('Fetch Tweets', join(__dirname, 'fetch-tweets.js'));
  } else {
    console.log('\n[bot] Skipping fetch (--skip-fetch flag set)');
  }

  // Step 2: Screenshot new tweets
  if (!DRY_RUN) {
    runStep('Capture Tweet Screenshots', join(__dirname, 'capture-tweet.js'));
  } else {
    console.log('\n[bot] Skipping screenshots (--dry-run mode)');
  }

  // Step 3: Classify tweets into buckets
  runStep('Match Contradictions', join(__dirname, 'match-contradictions.js'));

  // Step 4: Generate receipt card images
  if (!DRY_RUN) {
    runStep('Generate Receipt Cards', join(__dirname, 'generate-receipt-card.js'));
  } else {
    console.log('\n[bot] Skipping card generation (--dry-run mode)');
  }

  // Step 5: Generate draft blog posts for receipt tweets
  console.log(`\n${'='.repeat(60)}`);
  console.log('STEP: Generate Draft Blog Posts');
  console.log(`${'='.repeat(60)}\n`);

  if (!existsSync(TWEETS_FILE)) {
    console.log('[bot] No tweets database found. Nothing to draft.');
    return;
  }

  const db = JSON.parse(readFileSync(TWEETS_FILE, 'utf-8'));

  // Find receipt tweets that haven't had drafts generated yet
  const needDrafts = db.tweets.filter(
    (t) => t.bucket === 'receipt' && !t.draftGenerated
  );

  if (needDrafts.length === 0) {
    console.log('[bot] No new receipt tweets need draft posts.');
  } else {
    console.log(`[bot] Generating ${needDrafts.length} draft posts...\n`);

    for (const tweet of needDrafts) {
      const { filename, markdown } = generateDraftPost(tweet);
      const draftPath = join(DRAFTS_DIR, filename);
      writeFileSync(draftPath, markdown, 'utf-8');
      tweet.draftGenerated = true;
      tweet.draftPath = `drafts/${filename}`;
      console.log(`[bot] Draft created: ${draftPath}`);
    }

    // Save updated database
    writeFileSync(TWEETS_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }

  // Final summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('PIPELINE COMPLETE');
  console.log(`${'='.repeat(60)}\n`);

  const allTweets = db.tweets;
  const receipts = allTweets.filter((t) => t.bucket === 'receipt');
  const credits = allTweets.filter((t) => t.bucket === 'credit');
  const noise = allTweets.filter((t) => t.bucket === 'noise');
  const scoreable = receipts.length + credits.length;
  const ratio = scoreable > 0 ? ((credits.length / scoreable) * 100).toFixed(1) : '0.0';

  console.log(`Total tweets in database: ${allTweets.length}`);
  console.log(`  Receipts:  ${receipts.length}`);
  console.log(`  Credit:    ${credits.length}`);
  console.log(`  Noise:     ${noise.length}`);
  console.log(`  Unclassified: ${allTweets.length - receipts.length - credits.length - noise.length}`);
  console.log('');
  console.log(`Consistency Ratio: ${credits.length} / ${scoreable} (${ratio}%)`);
  console.log('');

  if (needDrafts.length > 0) {
    console.log('NEW DRAFTS READY FOR REVIEW:');
    needDrafts.forEach((t) => {
      console.log(`  ${t.draftPath}`);
    });
    console.log('');
    console.log('Next steps:');
    console.log('  1. Review each draft in drafts/');
    console.log('  2. Add your analysis, score each factor, and add sources');
    console.log('  3. Move approved posts to src/content/posts/');
    console.log('  4. Remove draft: true from frontmatter');
    console.log('  5. Run "npm run build" to rebuild the site');
  }
}

main().catch((err) => {
  console.error('[bot] Fatal error:', err);
  process.exit(1);
});
