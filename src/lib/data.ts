/**
 * Data loading and aggregation utilities.
 * Loads JSON data files (donors, votes, tweets) and computes aggregate stats
 * used by the StatsDashboard and sidebar widgets at build time.
 */

import donorData from '../../data/donors.json';
import voteData from '../../data/votes.json';
import tweetData from '../../data/past-tweets.json';
import impactDataRaw from '../../data/missouri-impact.json';

// Re-export raw data for direct access
export const donors = donorData;
export const votes = voteData;
export const tweets = tweetData;
export const impactData = impactDataRaw;

/**
 * Look up a vote entry by its unique ID.
 * Used for cross-referencing impact KPIs with specific votes.
 */
export function getVoteById(voteId: string) {
  return voteData.votes.find((v) => v.id === voteId) || null;
}

/**
 * Look up a donor industry by name (case-insensitive partial match).
 * Used for cross-referencing impact KPIs with donor data.
 */
export function getDonorIndustry(name: string) {
  const lower = name.toLowerCase();
  return donorData.industries.find(
    (ind) => ind.name.toLowerCase().includes(lower)
  ) || null;
}

/**
 * Compute aggregate stats from the tweet archive and content collections.
 * Returns the four key metrics displayed in the StatsDashboard.
 */
export function computeStats(posts?: Array<{ data: { bucket?: string; truthScore?: number; draft?: boolean } }>) {
  // Count tweets by bucket from the tweet archive
  const allTweets = tweetData.tweets;
  const receiptCount = allTweets.filter((t) => t.bucket === 'receipt').length;
  const creditCount = allTweets.filter((t) => t.bucket === 'credit').length;
  const noiseCount = allTweets.filter((t) => t.bucket === 'noise').length;
  const totalAnalyzed = allTweets.length;

  // If posts from content collections are provided, use those for more accurate counts
  let consistent = creditCount;
  let receipts = receiptCount;
  let noise = noiseCount;
  let total = totalAnalyzed;

  if (posts && posts.length > 0) {
    const published = posts.filter((p) => !p.data.draft);
    consistent = published.filter((p) => p.data.bucket === 'credit').length + creditCount;
    receipts = published.filter((p) => p.data.bucket === 'receipt').length + receiptCount;
    noise = published.filter((p) => p.data.bucket === 'noise').length + noiseCount;
    total = consistent + receipts + noise;
  }

  // Calculate consistency ratio
  const consistencyRatio = total > 0 ? ((consistent / total) * 100).toFixed(1) + '%' : '0%';

  // Calculate average truth score from scored tweets
  const scoredTweets = allTweets.filter((t) => t.truthScore != null);
  let avgScore = 0;
  if (scoredTweets.length > 0) {
    const sumScores = scoredTweets.reduce((sum, t) => sum + (t.truthScore || 0), 0);
    avgScore = Math.round(sumScores / scoredTweets.length);
  }

  // Count consistent positions from votes.json
  const consistentVotes = voteData.votes.filter((v) => 'consistent' in v && v.consistent).length;

  // Career fundraising total from donors.json
  const careerTotal = donorData.careerTotal;
  const careerStr = careerTotal >= 1_000_000
    ? `$${Math.round(careerTotal / 1_000_000)}M+`
    : `$${Math.round(careerTotal / 1_000)}K`;

  return {
    consistencyRatio,
    avgTruthScore: `${avgScore}%`,
    consistentPositions: `${consistentVotes} / ${total || totalAnalyzed}`,
    careerFundraising: careerStr,
    // Raw numbers for sidebar widgets
    consistent,
    receipts,
    noise,
    total,
  };
}

/**
 * Format a dollar amount for display.
 * Over 1M: "$X.XXM", otherwise "$XXXK"
 */
export function formatDollars(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  return `$${Math.round(amount / 1_000)}K`;
}
