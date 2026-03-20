# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

---

## Project Overview

**FuckJoshHawley.com** - A political accountability website tracking Senator Josh Hawley's public statements against his voting record and campaign finance data. Features a truth scoring system to rate the accuracy of his claims.

**Purpose:** Hold Senator Hawley accountable by fact-checking his tweets and connecting them to his voting record and donor interests.

---

## Site Architecture

```
HOME (src/pages/index.astro)
├── HAWLEY WATCH (src/pages/hawley-watch.astro)
│   └── Individual Post Pages (src/pages/hawley-watch/[...slug].astro)
├── MONEY TRAIL (src/pages/money-trail.astro)
├── VOTING RECORD (src/pages/voting-record.astro)
├── MISSOURI WATCH (src/pages/missouri-watch.astro)
├── CREDIT WHERE IT'S DUE (src/pages/credit.astro)
└── ABOUT (src/pages/about.astro)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/content.config.ts` | Content collection schemas (posts + credit) |
| `src/lib/data.ts` | Data loading utilities (donors, votes, tweets, stats) |
| `src/layouts/BaseLayout.astro` | Root HTML shell with nav/footer |
| `src/layouts/PostLayout.astro` | Blog post layout (article + sidebar) |
| `src/styles/global.css` | Tailwind layers + custom component styles |
| `data/donors.json` | OpenSecrets campaign finance data |
| `data/votes.json` | GovTrack voting record |
| `data/past-tweets.json` | Tweet archive with classifications |
| `mock/index.html` | Design mockup (source of truth for visual design) |
| `TRUTH_SCORE_METHODOLOGY.md` | How truth scores are calculated |
| `CAMPAIGN_FINANCE_DATA.md` | Donor and PAC research |

---

## Truth Score System

```
0-25%   = FALSE (Red)
25-50%  = MISLEADING (Orange)
50-75%  = MIXED (Yellow)
75-90%  = MOSTLY TRUE (Light Green)
90-100% = TRUE (Green)
```

Scores are based on fact-checks from:
- PolitiFact
- Snopes
- Washington Post Fact Checker
- AP Fact Check

---

## Data Sources

| Type | Source | URL |
|------|--------|-----|
| Campaign Finance | OpenSecrets | opensecrets.org/members-of-congress/josh-hawley |
| PAC Contributions | FEC | fec.gov |
| Voting Record | GovTrack | govtrack.us/congress/members/josh_hawley |
| Voting Record | ProPublica | projects.propublica.org/represent |
| Fact Checks | PolitiFact | politifact.com/personalities/josh-hawley |

---

## Current Status

- Site architecture: **Complete** — Astro 5 + Tailwind CSS + MDX
- All pages built: Home, Hawley Watch, Money Trail, Voting Record, Missouri Watch, Credit, About
- Content collections: `posts` (4 published + 1 draft) and `credit` (4 entries)
- 14 components: Navigation, Footer, FlagStripe, TickerBar, StatsDashboard, TruthScoreMeter, TweetEmbed, ReceiptCard, PostCard, ConsistencyRatio, CreditTracker, MoneyTrailSidebar, RecentVotes, MissouriWatchTeaser
- SEO: Open Graph, Twitter Cards, sitemap, RSS feed, robots.txt
- Data integration: Build-time stats computed from JSON data files
- Build: `npm run build` generates 11 static pages
- Hosting: Not yet deployed (configured for Cloudflare Pages / Netlify)
- Skills installed: `seo-audit`, `playwright-best-practices`, `copywriting` (via skills.sh, in `.agents/skills/`)

---

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run bot` | Run full receipts bot pipeline |

---

## Content Categories

Posts should be tagged with topics (used for topic-badge CSS classes):
- economy
- healthcare
- immigration
- democracy
- tech
- culture-war
- foreign-policy
- missouri
- voting
- elections

---

## Adding New Posts

1. Create `src/content/posts/YYYY-MM-DD-slug.md`
2. Add YAML frontmatter (see `src/content.config.ts` for schema)
3. Required fields: `title`, `date`, `bucket`, `topic`, `politician`
4. Set `draft: true` to exclude from feeds
5. Run `npm run build` to verify

---

## Next Steps

1. Register domain (`hawleywatch.com`)
2. Deploy to Cloudflare Pages or Netlify
3. Add tweet screenshots to `public/assets/tweets/`
4. Generate receipt card images
5. Write additional blog posts (target: 5-8 before launch)
6. Set up CI/CD for automated builds

---

*Last Updated: March 2026*
