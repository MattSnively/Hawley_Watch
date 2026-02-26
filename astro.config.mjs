// Astro configuration for Hawley Watch
// Uses Tailwind CSS for styling, MDX for rich blog posts, deploys as static site
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [tailwind(), mdx(), sitemap()],
  // Static output for Cloudflare Pages / Netlify deployment
  output: 'static',
  site: 'https://hawleywatch.com',
});
