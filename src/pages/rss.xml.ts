/**
 * RSS Feed — Generates an RSS 2.0 feed of published posts.
 * Available at /rss.xml for feed readers and news aggregators.
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Load all published posts, sorted by date descending
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'Hawley Watch',
    description: 'Tracking what Josh Hawley says vs. what he does. Fact-checks, campaign finance data, and voting record analysis.',
    site: context.site!.toString(),
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt || post.data.title,
      link: `/hawley-watch/${post.slug}/`,
    })),
  });
}
