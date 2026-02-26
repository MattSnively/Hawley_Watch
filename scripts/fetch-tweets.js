/**
 * fetch-tweets.js — Fetches latest tweets from @HawleyMO
 *
 * This script fetches recent tweets from Josh Hawley's X/Twitter account
 * using a third-party API (to avoid the $200/mo official API cost).
 *
 * Supported providers (in priority order):
 *   1. TwitterAPI.io — ~$0.15 per 1K tweets
 *   2. Xpoz — 100K results/mo free tier
 *   3. Direct web fetch fallback — scrapes the public profile (fragile)
 *
 * The fetched tweets are deduplicated against data/past-tweets.json
 * and new tweets are appended with `processed: false`.
 *
 * Usage:
 *   node scripts/fetch-tweets.js
 *
 * Environment variables:
 *   TWITTER_API_KEY  — API key for TwitterAPI.io or Xpoz
 *   TWITTER_API_PROVIDER — "twitterapi.io" | "xpoz" (default: "twitterapi.io")
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve project root relative to this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const TWEETS_FILE = join(PROJECT_ROOT, 'data', 'past-tweets.json');

// Target account to monitor
const TARGET_HANDLE = 'HawleyMO';

/**
 * Load the existing tweets database from disk.
 * Returns the parsed JSON object, or a default structure if the file is missing.
 */
function loadTweetsDb() {
  if (!existsSync(TWEETS_FILE)) {
    return {
      politician: 'josh-hawley',
      handle: `@${TARGET_HANDLE}`,
      lastFetched: null,
      tweets: [],
    };
  }
  const raw = readFileSync(TWEETS_FILE, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Save the tweets database back to disk.
 * Pretty-prints for readability in the git repo.
 */
function saveTweetsDb(db) {
  db.lastFetched = new Date().toISOString().split('T')[0];
  writeFileSync(TWEETS_FILE, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`[fetch-tweets] Saved ${db.tweets.length} tweets to ${TWEETS_FILE}`);
}

/**
 * Fetch tweets from TwitterAPI.io.
 * Docs: https://twitterapi.io/docs
 * Cost: ~$0.15 per 1,000 tweets
 */
async function fetchFromTwitterApiIo(apiKey) {
  const url = `https://api.twitterapi.io/twitter/user/last_tweets?userName=${TARGET_HANDLE}&count=50`;

  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TwitterAPI.io returned ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  // Normalize the response into our standard tweet format
  // (actual field names depend on the provider's response schema)
  const tweets = (data.tweets || data.data || []).map((tweet) => ({
    id: tweet.id || tweet.id_str,
    url: `https://x.com/${TARGET_HANDLE}/status/${tweet.id || tweet.id_str}`,
    date: tweet.created_at
      ? new Date(tweet.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    text: tweet.text || tweet.full_text || '',
    topics: [], // will be classified by match-contradictions.js
    bucket: null, // will be classified by match-contradictions.js
    screenshotPath: null, // will be set by capture-tweet.js
    processed: false,
    truthScore: null,
    rating: null,
  }));

  return tweets;
}

/**
 * Fetch tweets from Xpoz API.
 * Docs: https://xpoz.ai/docs
 * Cost: Free tier — 100K results/month
 */
async function fetchFromXpoz(apiKey) {
  const url = `https://api.xpoz.ai/v1/twitter/user/${TARGET_HANDLE}/tweets?limit=50`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Xpoz returned ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  // Normalize response to our standard format
  const tweets = (data.results || data.data || []).map((tweet) => ({
    id: tweet.id || tweet.tweet_id,
    url: `https://x.com/${TARGET_HANDLE}/status/${tweet.id || tweet.tweet_id}`,
    date: tweet.created_at
      ? new Date(tweet.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    text: tweet.text || tweet.content || '',
    topics: [],
    bucket: null,
    screenshotPath: null,
    processed: false,
    truthScore: null,
    rating: null,
  }));

  return tweets;
}

/**
 * Deduplicate fetched tweets against the existing database.
 * Returns only tweets whose IDs are not already in the DB.
 */
function deduplicateTweets(existingTweets, newTweets) {
  const existingIds = new Set(existingTweets.map((t) => t.id));
  const unique = newTweets.filter((t) => !existingIds.has(t.id));
  console.log(
    `[fetch-tweets] Found ${newTweets.length} tweets, ${unique.length} are new`
  );
  return unique;
}

/**
 * Main entry point.
 * Fetches tweets, deduplicates, and saves to the database file.
 */
async function main() {
  const apiKey = process.env.TWITTER_API_KEY;
  const provider = process.env.TWITTER_API_PROVIDER || 'twitterapi.io';

  // Load existing database
  const db = loadTweetsDb();
  console.log(
    `[fetch-tweets] Loaded ${db.tweets.length} existing tweets. Last fetched: ${db.lastFetched || 'never'}`
  );

  let fetchedTweets = [];

  if (!apiKey) {
    console.log('[fetch-tweets] No TWITTER_API_KEY set.');
    console.log('[fetch-tweets] To fetch live tweets, set one of:');
    console.log('  TWITTER_API_KEY=<key> TWITTER_API_PROVIDER=twitterapi.io');
    console.log('  TWITTER_API_KEY=<key> TWITTER_API_PROVIDER=xpoz');
    console.log('');
    console.log('[fetch-tweets] Running in demo mode with existing data.');
    return;
  }

  // Fetch from the configured provider
  try {
    if (provider === 'xpoz') {
      console.log('[fetch-tweets] Fetching from Xpoz...');
      fetchedTweets = await fetchFromXpoz(apiKey);
    } else {
      console.log('[fetch-tweets] Fetching from TwitterAPI.io...');
      fetchedTweets = await fetchFromTwitterApiIo(apiKey);
    }
  } catch (err) {
    console.error(`[fetch-tweets] Error fetching tweets: ${err.message}`);
    console.error('[fetch-tweets] Will proceed with existing data.');
    return;
  }

  // Deduplicate against existing tweets
  const newTweets = deduplicateTweets(db.tweets, fetchedTweets);

  if (newTweets.length === 0) {
    console.log('[fetch-tweets] No new tweets found. Database is up to date.');
    saveTweetsDb(db);
    return;
  }

  // Append new tweets to the database
  db.tweets = [...newTweets, ...db.tweets];
  saveTweetsDb(db);

  console.log(`[fetch-tweets] Added ${newTweets.length} new tweets.`);
  // Print new tweets for review
  newTweets.forEach((t) => {
    console.log(`  [${t.date}] ${t.text.substring(0, 80)}...`);
  });
}

main().catch((err) => {
  console.error('[fetch-tweets] Fatal error:', err);
  process.exit(1);
});
