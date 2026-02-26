/**
 * Content Collections Configuration (Astro 5 content layer)
 *
 * Defines two collections:
 *   - posts: Blog posts with truth scores, tweet references, and receipt metadata
 *   - credit: "Credit Where It's Due" entries for consistent positions
 */

import { defineCollection, z } from 'astro:content';

/** Schema for blog posts — matches ROADMAP frontmatter spec */
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    // Classification bucket: receipt (contradiction), credit (consistent), or noise
    bucket: z.enum(['receipt', 'credit', 'noise']).default('receipt'),
    // Topic tags for filtering and display
    topic: z.array(z.string()).default([]),
    // Which politician this post is about
    politician: z.string().default('josh-hawley'),
    // Tweet reference data
    tweetUrl: z.string().optional(),
    tweetScreenshot: z.string().optional(),
    // Receipt card image path (for shareable contradiction cards)
    receiptCard: z.string().optional(),
    // Truth Score breakdown (0-100 scale)
    truthScore: z.number().min(0).max(100).optional(),
    factualAccuracy: z.number().min(0).max(100).optional(),
    intentToMislead: z.number().min(0).max(100).optional(),
    contextScore: z.number().min(0).max(100).optional(),
    // Overall rating label
    rating: z.enum(['false', 'misleading', 'mixed', 'mostly-true', 'true']).optional(),
    // Contradiction details
    contradictionType: z.string().optional(),
    contradictionSummary: z.string().optional(),
    // Related data links
    sources: z.array(z.string()).default([]),
    relatedDonors: z.array(z.string()).default([]),
    relatedVotes: z.array(z.string()).default([]),
    // Draft flag — true means the post won't appear in feeds
    draft: z.boolean().default(false),
    // Optional excerpt for post cards (auto-generated from content if not provided)
    excerpt: z.string().optional(),
  }),
});

/** Schema for "Credit Where It's Due" entries — consistent positions */
const credit = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Related legislation (bill number or name)
    legislation: z.string(),
    // Date the position was established or legislation introduced
    date: z.string(),
    // Summary of why this position is consistent
    summary: z.string(),
    // Current status (e.g., "Introduced", "Passed", "Consistent")
    status: z.string().default('Consistent'),
  }),
});

export const collections = { posts, credit };
