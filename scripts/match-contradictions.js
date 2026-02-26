/**
 * match-contradictions.js — The Receipts Engine
 *
 * This script classifies tweets into three buckets:
 *   - "receipt"  → Contradicted by voting record, donor data, or past statements
 *   - "credit"   → Consistent with voting record, no contradicting donor angle
 *   - "noise"    → No verifiable claim (retweets, cheerleading, holidays, etc.)
 *
 * It works by keyword-matching tweet text against two databases:
 *   - data/votes.json  (voting record with keywords and contradiction notes)
 *   - data/donors.json (industry donors with keywords and hypocrisy angles)
 *
 * Each classified tweet gets:
 *   - A bucket assignment (receipt/credit/noise)
 *   - Matched votes and donors with their contradiction/consistency notes
 *   - A suggested topic classification
 *
 * The output is written back to data/past-tweets.json and a summary
 * is printed for human review before publishing.
 *
 * Usage:
 *   node scripts/match-contradictions.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const TWEETS_FILE = join(PROJECT_ROOT, 'data', 'past-tweets.json');
const VOTES_FILE = join(PROJECT_ROOT, 'data', 'votes.json');
const DONORS_FILE = join(PROJECT_ROOT, 'data', 'donors.json');

/**
 * Noise indicators — tweets matching these patterns are classified as noise.
 * These are generic posts with no verifiable factual claims.
 */
const NOISE_PATTERNS = [
  /^RT @/i,                          // Retweets
  /happy (thanksgiving|christmas|easter|new year|holiday|birthday|memorial|independence|labor|veterans)/i,
  /god bless/i,                      // Generic well-wishes
  /merry christmas/i,
  /thank you to (our|the) (troops|veterans|first responders)/i,
  /prayers for/i,
  /^great (to|meeting|seeing)/i,     // Photo-op posts
  /proud to (be|stand|represent)/i,  // Generic pride posts
];

/**
 * Topic mapping — keywords that suggest which topic category a tweet belongs to.
 */
const TOPIC_KEYWORDS = {
  'economy': ['economy', 'jobs', 'tax', 'taxes', 'inflation', 'trade', 'wage', 'credit card', 'interest rate', 'debt', 'deficit', 'spending', 'stock market', 'wall street', 'working class', 'working families'],
  'healthcare': ['healthcare', 'health care', 'hospital', 'doctor', 'insurance', 'medicare', 'medicaid', 'drug', 'pharma', 'prescription'],
  'immigration': ['border', 'immigration', 'immigrant', 'illegal', 'asylum', 'migrant', 'deport', 'ice', 'caravan'],
  'democracy': ['election', 'vote', 'voting', 'january 6', 'jan 6', 'capitol', 'democracy', 'constitution', 'electoral'],
  'tech': ['big tech', 'tiktok', 'google', 'facebook', 'meta', 'amazon', 'apple', 'twitter', 'social media', 'antitrust', 'monopoly', 'censorship'],
  'culture-war': ['trans', 'transgender', 'woke', 'crt', 'critical race', 'gender', 'lgbtq', 'abortion', 'pro-life', 'school', 'education', 'parents rights', 'dei'],
  'foreign-policy': ['china', 'chinese', 'russia', 'russian', 'ukraine', 'taiwan', 'military', 'defense', 'war', 'troops'],
  'missouri': ['missouri', 'missourians', 'st. louis', 'kansas city', 'springfield', 'columbia'],
};

/**
 * Check if a tweet's text matches any keywords in a list.
 * Returns true if any keyword is found (case-insensitive).
 */
function matchesKeywords(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
}

/**
 * Detect topics for a tweet based on keyword matching.
 * Returns an array of matched topic strings.
 */
function detectTopics(text) {
  const topics = [];
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (matchesKeywords(text, keywords)) {
      topics.push(topic);
    }
  }
  return topics;
}

/**
 * Check if a tweet is noise (no verifiable claim).
 */
function isNoise(text) {
  return NOISE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Match a tweet against the voting record.
 * Returns an array of matched vote entries with their contradiction/consistency info.
 */
function matchVotes(text, votes) {
  const matches = [];

  for (const vote of votes) {
    if (matchesKeywords(text, vote.keywords)) {
      matches.push({
        voteId: vote.id,
        bill: vote.bill,
        title: vote.title,
        vote: vote.vote,
        date: vote.date,
        isContradiction: !!vote.contradicts,
        isConsistent: !!vote.consistent,
        note: vote.contradicts || vote.consistentNote || vote.summary,
      });
    }
  }

  return matches;
}

/**
 * Match a tweet against donor industries.
 * Returns an array of matched donor entries with hypocrisy angles.
 */
function matchDonors(text, industries, outsideSpending) {
  const matches = [];

  // Check industry donors
  for (const industry of industries) {
    if (industry.keywords.length > 0 && matchesKeywords(text, industry.keywords)) {
      matches.push({
        type: 'industry',
        name: industry.name,
        amount: industry.amount,
        hasHypocrisyAngle: !!industry.hypocrisyAngle,
        hypocrisyAngle: industry.hypocrisyAngle || null,
      });
    }
  }

  // Check outside spending groups (Super PACs, etc.)
  for (const group of outsideSpending) {
    if (matchesKeywords(text, group.keywords)) {
      matches.push({
        type: 'outside-spending',
        name: group.group,
        amount: group.amount,
        year: group.year,
        hasHypocrisyAngle: !!group.hypocrisyAngle,
        hypocrisyAngle: group.hypocrisyAngle || null,
      });
    }
  }

  return matches;
}

/**
 * Classify a single tweet into a bucket based on all matched data.
 *
 * Decision logic:
 *   1. If it matches noise patterns → "noise"
 *   2. If it matches a contradicting vote or a donor hypocrisy angle → "receipt"
 *   3. If it matches only consistent votes and no donor conflicts → "credit"
 *   4. If it matches some data but nothing clearly contradictory → "receipt" (needs human review)
 *   5. If it matches nothing at all → "noise" (no verifiable claim found)
 */
function classifyTweet(tweet, votesData, donorsData) {
  const text = tweet.text;

  // Step 1: Check for noise
  if (isNoise(text)) {
    return {
      bucket: 'noise',
      topics: detectTopics(text),
      matchedVotes: [],
      matchedDonors: [],
      reason: 'Matched noise pattern (no verifiable claim)',
    };
  }

  // Step 2: Match against databases
  const matchedVotes = matchVotes(text, votesData.votes);
  const matchedDonors = matchDonors(
    text,
    donorsData.industries,
    donorsData.outsideSpending
  );
  const topics = detectTopics(text);

  // Step 3: Determine bucket
  const hasContradiction = matchedVotes.some((v) => v.isContradiction);
  const hasHypocrisy = matchedDonors.some((d) => d.hasHypocrisyAngle);
  const hasConsistency = matchedVotes.some((v) => v.isConsistent);
  const hasAnyMatch = matchedVotes.length > 0 || matchedDonors.length > 0;

  let bucket;
  let reason;

  if (hasContradiction) {
    // Voting record contradiction is the strongest signal — always a receipt
    bucket = 'receipt';
    const reasons = ['contradicts voting record'];
    if (hasHypocrisy) reasons.push('conflicts with donor interests');
    reason = `Receipt: ${reasons.join(' and ')}`;
  } else if (hasConsistency) {
    // Consistent vote record overrides donor matches.
    // If he's fighting AGAINST his donors' interests (e.g., stock trading ban
    // despite Wall Street donors), that's actually MORE consistent, not less.
    bucket = 'credit';
    reason = hasHypocrisy
      ? 'Consistent with voting record — notably, this position goes against his donor interests'
      : 'Consistent with voting record, no donor conflict';
  } else if (hasHypocrisy && !hasConsistency) {
    // Donor hypocrisy without any consistent vote to offset it — receipt
    bucket = 'receipt';
    reason = 'Receipt: conflicts with donor interests';
  } else if (hasAnyMatch) {
    // Has some data matches but nothing clearly contradictory or consistent.
    // Flag for human review — default to receipt since it needs analysis.
    bucket = 'receipt';
    reason = 'Matches data but needs human review for classification';
  } else if (topics.length > 0) {
    // Has a topic but no database matches — could be a new claim to research
    bucket = 'receipt';
    reason = 'Topical claim detected but no database match — needs research';
  } else {
    // Nothing matched — likely noise or a topic we don't track
    bucket = 'noise';
    reason = 'No verifiable claim or topic match found';
  }

  return {
    bucket,
    topics,
    matchedVotes,
    matchedDonors,
    reason,
  };
}

/**
 * Main entry point.
 * Processes all unclassified tweets and prints a summary for human review.
 */
async function main() {
  // Load databases
  if (!existsSync(TWEETS_FILE)) {
    console.log('[match] No tweets database found. Run fetch-tweets.js first.');
    return;
  }
  if (!existsSync(VOTES_FILE)) {
    console.log('[match] No votes database found. Create data/votes.json first.');
    return;
  }
  if (!existsSync(DONORS_FILE)) {
    console.log('[match] No donors database found. Create data/donors.json first.');
    return;
  }

  const tweetsDb = JSON.parse(readFileSync(TWEETS_FILE, 'utf-8'));
  const votesData = JSON.parse(readFileSync(VOTES_FILE, 'utf-8'));
  const donorsData = JSON.parse(readFileSync(DONORS_FILE, 'utf-8'));

  // Find unprocessed tweets (no bucket assigned yet)
  const unclassified = tweetsDb.tweets.filter((t) => !t.bucket);

  if (unclassified.length === 0) {
    console.log('[match] All tweets are already classified.');
    printSummary(tweetsDb.tweets);
    return;
  }

  console.log(`[match] Classifying ${unclassified.length} tweets...\n`);

  // Classify each tweet
  for (const tweet of unclassified) {
    const result = classifyTweet(tweet, votesData, donorsData);

    // Update the tweet record
    tweet.bucket = result.bucket;
    tweet.topics = result.topics;
    tweet.matchedVotes = result.matchedVotes;
    tweet.matchedDonors = result.matchedDonors;
    tweet.classificationReason = result.reason;

    // Print classification result for review
    const icon =
      result.bucket === 'receipt' ? '[RECEIPT]' :
      result.bucket === 'credit' ? '[CREDIT]' :
      '[NOISE]';

    console.log(`${icon} ${tweet.date} — ${tweet.text.substring(0, 70)}...`);
    console.log(`  Reason: ${result.reason}`);
    if (result.matchedVotes.length > 0) {
      console.log(`  Matched votes: ${result.matchedVotes.map((v) => v.bill).join(', ')}`);
    }
    if (result.matchedDonors.length > 0) {
      console.log(`  Matched donors: ${result.matchedDonors.map((d) => d.name).join(', ')}`);
    }
    console.log('');
  }

  // Save updated database
  writeFileSync(TWEETS_FILE, JSON.stringify(tweetsDb, null, 2), 'utf-8');
  console.log(`[match] Saved classifications to ${TWEETS_FILE}`);
  console.log('');

  // Print overall summary
  printSummary(tweetsDb.tweets);
}

/**
 * Print a summary of all tweet classifications and the consistency ratio.
 */
function printSummary(tweets) {
  const classified = tweets.filter((t) => t.bucket);
  const receipts = classified.filter((t) => t.bucket === 'receipt');
  const credits = classified.filter((t) => t.bucket === 'credit');
  const noise = classified.filter((t) => t.bucket === 'noise');

  // Consistency ratio: credit / (credit + receipts)
  // Noise is excluded from the ratio since it's not a verifiable claim
  const scoreable = receipts.length + credits.length;
  const ratio = scoreable > 0 ? ((credits.length / scoreable) * 100).toFixed(1) : '0.0';

  console.log('=== CLASSIFICATION SUMMARY ===');
  console.log(`Total tweets:     ${tweets.length}`);
  console.log(`Classified:       ${classified.length}`);
  console.log(`  Receipts:       ${receipts.length}`);
  console.log(`  Credit:         ${credits.length}`);
  console.log(`  Noise:          ${noise.length}`);
  console.log(`Unclassified:     ${tweets.length - classified.length}`);
  console.log('');
  console.log(`CONSISTENCY RATIO: ${credits.length} / ${scoreable} (${ratio}%)`);
  console.log('');
  console.log('NOTE: All classifications should be reviewed by a human before publishing.');
  console.log('The bot drafts; you decide.');
}

main().catch((err) => {
  console.error('[match] Fatal error:', err);
  process.exit(1);
});
