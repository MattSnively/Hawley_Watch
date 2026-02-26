# FuckJoshHawley.com — Launch Roadmap & Recommendations

**Created:** February 24, 2026
**Status:** Pre-launch planning
**Focus:** Twitter/social media tracking, fact-checking blog, campaign finance transparency

---

## Executive Summary

This site has strong planning documentation but zero implementation. The tech stack is **Astro + Tailwind CSS**, deployed to Cloudflare Pages or Netlify. This gives full control over design, content automation, and the ability to embed live social media posts and screenshots. The site should look and feel like a credible, no-nonsense news outlet — not a merch store with a blog attached.

The site's signature feature is the **Receipts Bot** — an automated system that monitors Hawley's Twitter/X feed and instantly surfaces contradictions between his tweets and his votes, donors, or past statements. Every tweet is classified into one of three buckets: **Receipts** (contradicted), **Credit Where It's Due** (consistent), or **Noise** (no verifiable claim). A live Consistency Ratio tracks how often Hawley's words match his actions.

---

## Key Recommendations

### 1. Tech Stack: Astro + Tailwind CSS

**Decision made.** The site will be built with Astro and Tailwind CSS, not Squarespace. This gives us:
- Full design control (the red/white/blue news aesthetic)
- Markdown-based blog posts (content already written in markdown)
- Free or near-free hosting (Netlify, Vercel, Cloudflare Pages)
- Ability to automate Twitter screenshot capture via Playwright
- API integration for campaign finance data and the Receipts Bot
- No monthly platform fees

**Confirmed stack:**
| Component | Tool | Why |
|-----------|------|-----|
| Framework | **Astro** | Fast, markdown-native, component islands for interactive elements |
| Styling | **Tailwind CSS** | Rapid design iteration, responsive out of the box |
| Hosting | **Cloudflare Pages** or **Netlify** | Free tier covers everything, global CDN |
| CMS (optional) | **Decap CMS** (formerly Netlify CMS) | Git-based, free, lets non-technical contributors add posts |
| Automation | **Node.js + Playwright** | Receipts Bot tweet monitoring and screenshot capture |
| Domain | Register via **Cloudflare** or **Namecheap** | Cheapest registrar options |

### 2. Restructure the Site Around Content, Not Commerce

The current architecture puts the Shop on equal footing with core content. For launch, the site should be a **political accountability news site first**. Merch can come later as a sidebar concern.

**Reworked site architecture:**
```
HOME (latest posts + stats dashboard + consistency ratio)
├── HAWLEY WATCH (main blog feed — tweet analysis)
│   ├── Individual Post Pages (Receipts — full analysis)
│   └── Credit Where It's Due (consistent positions tracker)
├── MONEY TRAIL (campaign finance tracker)
├── VOTING RECORD (votes vs. tweets contradictions)
├── MISSOURI WATCH (expand scope to other MO politicians)
│   ├── Eric Schmitt
│   ├── Denny Hoskins
│   └── Mike Kehoe
└── ABOUT (methodology, sources, contact)
```

**What changed from original plan:**
- Shop removed from primary nav (add as footer link or secondary page later)
- Added **Missouri Watch** section to expand scope beyond just Hawley
- Voting Record promoted to required (not optional)
- Home page redesigned as a news feed with live Consistency Ratio
- Added **Credit Where It's Due** sub-page under Hawley Watch
- **Receipts Bot** system classifies all tweets into three buckets
- Contradiction cards designed as shareable social media images

### 3. The Receipts Bot — Automated Contradiction Engine

This is the site's signature feature and most impactful technical investment. The Receipts Bot monitors Hawley's Twitter/X feed and classifies every tweet into one of three buckets:

#### Three-Bucket Classification System

| Bucket | Criteria | What Happens |
|--------|----------|--------------|
| **Receipts** | Tweet is contradicted by his voting record, donor connections, or past statements | Auto-generates a contradiction card (tweet on left, receipt on right). Queued for full blog post. Shareable image posted to site's X account. |
| **Credit Where It's Due** | Tweet is consistent with his voting record. No contradicting donor angle. | Added to the Consistent Positions tracker. Short note explaining the alignment (e.g., "Hawley voted YES on S.2024 — consistent with his Big Tech antitrust statements"). |
| **Noise** | Retweets, memes, generic party cheerleading, holiday greetings, no verifiable claim | Logged in the database but not scored or published. Keeps the dataset clean. |

#### Known Consistent Positions (starting list)

These are positions where Hawley has demonstrated alignment between his rhetoric and his actions:

- **Congressional stock trading ban** — PELOSI Act (2022), consistent legislation and voting
- **Big Tech antitrust** — multiple bills introduced, voted accordingly
- **TikTok ban** — consistent rhetoric and legislative action
- **Railroad worker safety** — co-sponsored bipartisan legislation post-East Palestine

These entries are genuine, not sarcastic. The credibility of the Receipts depends on the fairness of the Credit list.

#### The Consistency Ratio

The home page displays a live ratio: **"Consistent on X of Y analyzed posts (Z%)"**

This number does all the editorial work. If Hawley is consistent 15% of the time, the number says more than any opinion piece could. If he improves, the number goes up — and that's genuinely newsworthy too. Over time, if a Consistent position develops a crack (e.g., a tech donor appears in his FEC filing while he claims to fight Big Tech), that entry migrates from Credit to Receipts, and the movement itself becomes the story.

#### Contradiction Card Format

Each Receipts card is a shareable image designed for maximum social media impact:

```
┌─────────────────────────────────────────────────┐
│  RECEIPTS                           hawleywatch  │
├────────────────────┬────────────────────────────┤
│  WHAT HE SAID      │  THE RECEIPT               │
│                     │                            │
│  [Tweet screenshot] │  Hawley co-sponsored the   │
│                     │  Credit Card Rate Cap Act  │
│  "Trump is working  │  with Bernie Sanders in    │
│   to cap credit     │  2023 — the same policy    │
│   card rates"       │  he's now praising Trump   │
│                     │  for. He voted with "The   │
│  Jan 13, 2026       │  Left" on this exact issue.│
│                     │                            │
│                     │  Source: Congress.gov       │
├────────────────────┴────────────────────────────┤
│  TRUTH SCORE: 30% — MISLEADING                   │
│  ███████░░░░░░░░░░░░░░░                          │
│                          Read full analysis →     │
└─────────────────────────────────────────────────┘
```

#### Technical Implementation

**Tweet monitoring and capture:**
- Monitor Hawley's X feed via RSS (nitter instances) or X API
- On new tweet detected: Playwright script auto-screenshots at desktop + mobile widths
- Screenshots saved to `/assets/tweets/YYYY-MM-DD-slug.png`
- oEmbed HTML also saved for live rendering (with screenshot as fallback if tweet deleted)

**Contradiction matching:**
- Maintain a tagged database of: votes (GovTrack), donor industries (OpenSecrets), past tweets
- Keyword-match new tweets against the database
- Auto-generate draft contradiction card for manual review before publishing
- Human reviews and approves/edits before the card goes live (no fully automated publishing)

**Screenshot automation tools:**
- **Playwright** (primary) — Node.js script for tweet screenshots and contradiction card generation
- **ArchiveBox** (backup) — Self-hosted full-page web archiving
- **archive.org Wayback Machine** — Third-party backup for permanence

### 4. Refresh the Truth Score System

The existing methodology is solid. Two refinements:

**a) Add a cumulative "running average" Truth Score.**
Display Hawley's overall average across all analyzed posts on the home page stats bar. This creates a compelling narrative number (e.g., "Hawley's average Truth Score: 28% — MISLEADING").

**b) Add comparison context.**
When scoring a claim, note how it compares to similar claims by other politicians. This adds credibility and shows you're applying the methodology consistently.

### 5. Content Calendar & Posting Cadence

For launch credibility, you need a backlog of content. Target:

| Milestone | Posts Needed | Timeline |
|-----------|-------------|----------|
| **Soft launch** | 5-8 posts | Before going public |
| **Public launch** | 10-15 posts | First month |
| **Steady state** | 2-3 posts/week | Ongoing |

**Content mix per week:**
- 1-2 tweet fact-checks (core content)
- 1 "Money Trail" connection piece (linking donations to positions)
- 1 "Missouri Watch" piece (other MO politicians, optional at first)

---

## Step-by-Step Launch Plan

### Phase 1: Foundation (Weeks 1-2)

- [ ] **1.1** Choose and set up the tech stack
  - Initialize Astro project with Tailwind CSS
  - Set up Git repository and CI/CD deployment to Cloudflare Pages or Netlify
  - Configure markdown blog with frontmatter schema for truth scores

- [ ] **1.2** Register and configure domain
  - Register `fuckjoshhawley.com` (check availability, consider alternatives like `hawleywatch.com` for broader appeal)
  - Set up DNS, SSL, email forwarding

- [ ] **1.3** Build core page templates
  - Home page (news feed layout)
  - Blog post template (with truth score meter, tweet embed, money trail sidebar)
  - Hawley Watch feed page (filterable by topic and truth score)
  - Money Trail page (static data from existing research)
  - About page (methodology, sources, mission)

- [ ] **1.4** Design the visual identity
  - Red (#B31942), white (#FFFFFF), blue (#0A3161) color palette — derived from official US flag colors
  - Clean serif headlines (Georgia, Playfair Display, or similar)
  - Sans-serif body text (Inter, Source Sans Pro)
  - Truth score meter component (colored progress bar)
  - News-style card layouts for post previews

### Phase 2: Content Pipeline & Receipts Bot (Weeks 2-4)

- [ ] **2.1** Build the tweet capture workflow
  - Set up Playwright screenshot automation script (`scripts/capture-tweet.js`)
  - Create `/assets/tweets/` and `/assets/receipts/` directory structures
  - Document the process so it's repeatable

- [ ] **2.2** Build the Receipts Bot infrastructure
  - Create `data/votes.json` — tagged database of Hawley's voting record from GovTrack
  - Create `data/donors.json` — industry/donor database from OpenSecrets
  - Create `data/past-tweets.json` — archive of past tweets for contradiction matching
  - Build `scripts/monitor-feed.js` — RSS/API polling for new tweets
  - Build `scripts/generate-receipt-card.js` — contradiction card image generator
  - Implement three-bucket classification logic (receipt/credit/noise)
  - Set up manual review queue (bot drafts, human approves before publish)

- [ ] **2.3** Seed the Credit Where It's Due tracker
  - Write initial Credit entries for known consistent positions:
    - Congressional stock trading ban (PELOSI Act)
    - Big Tech antitrust
    - TikTok ban
    - Railroad worker safety
  - Build the Credit page and sidebar widget
  - Implement the Consistency Ratio calculation and display

- [ ] **2.4** Write initial batch of 5-8 Receipts blog posts
  - Migrate and polish the existing January 13 post
  - Write 4-7 new tweet analyses covering different topics
  - Ensure each post has: tweet screenshot, contradiction card, truth score breakdown, money trail connection, sources
  - Generate shareable receipt card images for each

- [ ] **2.5** Populate the Money Trail page
  - Format existing campaign finance data into the page template
  - Add visualizations (bar charts for industry breakdown, donor tables)
  - Set up a quarterly data refresh reminder

- [ ] **2.6** Build the Voting Record page
  - Pull key votes from GovTrack/ProPublica
  - Focus on votes that contradict his tweets (hypocrisy angles)
  - Link relevant blog posts to specific votes

### Phase 3: Quality & Testing (Week 4)

- [ ] **3.1** Cross-browser and mobile testing
  - Test on Chrome, Firefox, Safari, Edge
  - Verify mobile responsive design
  - Check accessibility (contrast ratios, screen reader compatibility, alt text)

- [ ] **3.2** SEO and metadata
  - Open Graph tags for social sharing (each post should have a compelling share image)
  - Structured data for articles (schema.org NewsArticle)
  - XML sitemap, robots.txt
  - Meta descriptions for every page

- [ ] **3.3** Legal review
  - Ensure all content is clearly opinion/analysis with sourced facts
  - Add disclaimer: "This is an independent accountability project. We are not affiliated with any political campaign or organization."
  - Fair use compliance for tweet screenshots and quotes

### Phase 4: Soft Launch (Week 5)

- [ ] **4.1** Deploy to production domain
- [ ] **4.2** Share with trusted friends/contacts for feedback
- [ ] **4.3** Fix any issues from feedback
- [ ] **4.4** Set up basic analytics (Plausible or Umami — privacy-respecting alternatives to Google Analytics)

### Phase 5: Public Launch (Week 6)

- [ ] **5.1** Announce on social media
  - Create dedicated Twitter/X account for the site
  - Post on Reddit (r/missouri, r/politics, r/stlouis, r/kansascity)
  - Share in relevant Facebook groups

- [ ] **5.2** Submit to news aggregators
  - Google News (requires structured data)
  - Apple News (requires RSS feed)

- [ ] **5.3** Begin regular posting cadence (2-3x/week)

### Phase 6: Expansion (Months 2-3)

- [ ] **6.1** Launch Missouri Watch section
  - Add Eric Schmitt tracking page
  - Add Denny Hoskins tracking page
  - Add Mike Kehoe tracking page

- [ ] **6.2** Set up automated monitoring
  - RSS/notification alerts for Hawley's Twitter activity
  - OpenSecrets API integration for campaign finance updates
  - GovTrack alerts for new votes

- [ ] **6.3** Newsletter
  - Weekly email digest of new posts
  - Use Ghost, Buttondown, or Substack for distribution

- [ ] **6.4** Community features
  - Tip submission form (let readers flag tweets to analyze)
  - Comment system (Disqus, Giscus, or self-hosted)

---

## Technical Architecture (Recommended)

```
fuckjoshhawley-site/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Home page (feed + stats + consistency ratio)
│   │   ├── hawley-watch.astro       # Blog feed with filters
│   │   ├── credit.astro             # Credit Where It's Due (consistent positions)
│   │   ├── money-trail.astro        # Campaign finance data
│   │   ├── voting-record.astro      # Votes vs. tweets
│   │   ├── missouri-watch.astro     # Other MO politicians
│   │   └── about.astro              # Methodology & mission
│   ├── content/
│   │   ├── posts/                   # Markdown blog posts (Receipts — full analyses)
│   │   │   ├── 2026-01-13-trans-athletes-credit-cards.md
│   │   │   └── ...
│   │   └── credit/                  # Consistent position entries
│   │       ├── congressional-stock-trading.md
│   │       ├── big-tech-antitrust.md
│   │       ├── tiktok-ban.md
│   │       └── railroad-worker-safety.md
│   ├── components/
│   │   ├── TruthScoreMeter.astro    # Reusable truth score bar
│   │   ├── TweetEmbed.astro         # Tweet display (live + screenshot fallback)
│   │   ├── ReceiptCard.astro        # Contradiction card (tweet vs. receipt)
│   │   ├── ConsistencyRatio.astro   # Live ratio display widget
│   │   ├── CreditTracker.astro      # Credit Where It's Due sidebar/page
│   │   ├── PostCard.astro           # Blog post preview card
│   │   ├── MoneyTrailSidebar.astro  # Related donations for each post
│   │   └── Navigation.astro         # Site header/nav
│   ├── layouts/
│   │   ├── BaseLayout.astro         # HTML shell, meta, nav, footer
│   │   └── PostLayout.astro         # Blog post wrapper
│   └── styles/
│       └── global.css               # Tailwind + custom properties
├── public/
│   └── assets/
│       ├── tweets/                  # Archived tweet screenshots
│       └── receipts/                # Generated contradiction card images
├── scripts/
│   ├── capture-tweet.js             # Playwright tweet screenshot script
│   ├── generate-receipt-card.js     # Contradiction card image generator
│   └── monitor-feed.js             # Tweet feed monitor (RSS/API polling)
├── data/
│   ├── votes.json                   # Tagged voting record database
│   ├── donors.json                  # Industry/donor database from OpenSecrets
│   └── past-tweets.json             # Archive of past tweets for contradiction matching
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

### Blog Post Frontmatter Schema (Receipts)

```yaml
---
title: "Democrats, Trans Athletes, and Credit Cards: Hawley's Misleading Tweet"
date: 2026-01-13
bucket: "receipt"            # "receipt" | "credit" | "noise"
topic: ["culture-war", "economy"]
politician: "josh-hawley"
tweetUrl: "https://x.com/HawleyMO/status/..."
tweetScreenshot: "/assets/tweets/2026-01-13-trans-athletes.png"
receiptCard: "/assets/receipts/2026-01-13-trans-athletes.png"
truthScore: 30
factualAccuracy: 45
intentToMislead: 20
contextScore: 20
rating: "misleading"
contradictionType: "past-position"   # "vote" | "donor" | "past-position" | "multiple"
contradictionSummary: "Co-sponsored same credit card rate cap with Bernie Sanders in 2023"
sources:
  - name: "PolitiFact"
    url: "https://..."
  - name: "OpenSecrets"
    url: "https://..."
relatedDonors:
  - industry: "Securities & Investment"
    amount: 833820
  - industry: "Real Estate"
    amount: 738153
relatedVotes:
  - bill: "S.XXX"
    title: "Credit Card Rate Cap Act"
    vote: "co-sponsor"
    date: 2023-XX-XX
---
```

### Credit Entry Frontmatter Schema

```yaml
---
title: "Congressional Stock Trading Ban"
date: 2026-01-15
bucket: "credit"
politician: "josh-hawley"
topic: ["economy", "democracy"]
status: "consistent"          # "consistent" | "cracked" (migrated to receipt)
legislation:
  - bill: "PELOSI Act"
    year: 2022
    action: "introduced"
  - bill: "Bipartisan Ban on Congressional Stock Ownership"
    year: 2023
    action: "co-sponsor"
summary: "Hawley has consistently pushed to ban members of Congress from trading stocks. He introduced the PELOSI Act in 2022 and has voted in alignment with this position."
---
```

---

## Domain Strategy

| Option | Pros | Cons |
|--------|------|------|
| `fuckjoshhawley.com` | Memorable, visceral, shareable | Profanity limits SEO, email deliverability, and some social sharing |
| `hawleywatch.com` | Professional, journalist-friendly, SEO-friendly | Less memorable, less emotional punch |
| `showhawley.com` | Missouri "Show-Me" pun, clean, brandable | Less immediately clear what it is |
| **Recommendation** | Register all three. Primary site on `hawleywatch.com` for credibility. Redirect `fuckjoshhawley.com` to it for the viral factor. | Small additional cost for extra domains |

---

## Content Strategy: What Makes This Site Valuable

The site's competitive advantage is the **three-layer analysis** on every post:

1. **What he said** (the tweet, with screenshot archive)
2. **Whether it's true** (truth score with transparent methodology)
3. **Who profits** (follow-the-money connection to donors/industries)

No other site consistently connects all three for a single politician. PolitiFact fact-checks but doesn't follow the money. OpenSecrets tracks money but doesn't fact-check claims. This site does both, for one target, with a clear visual scoring system.

The **Receipts Bot** adds a fourth layer: **speed and shareability**. Within minutes of a Hawley tweet, a contradiction card is drafted and queued for review. The shareable image format means the analysis meets people in Hawley's own replies, not just on a website they have to remember to visit.

The **Credit Where It's Due** tracker adds a fifth layer: **fairness**. By visibly tracking his consistent positions (congressional stock trading ban, Big Tech antitrust, etc.), the site demonstrates it applies its methodology honestly. The Consistency Ratio — the percentage of tweets that match his actions — tells the story without editorializing. If he's consistent 15% of the time, that number speaks for itself.

---

## Risk Considerations

| Risk | Mitigation |
|------|------------|
| Hawley deletes tweets | Screenshot archive every tweet before analysis |
| Accusations of bias | Transparent methodology, source everything, **Credit Where It's Due tracker** visibly acknowledges consistent positions |
| Legal threats | Stick to facts, cite sources, label opinions clearly, consult First Amendment attorney |
| X/Twitter API changes | Screenshot-first approach reduces API dependency |
| Burnout (solo operation) | Set sustainable cadence (2-3 posts/week), use templates to reduce per-post effort |
| Scope creep | Launch with Hawley only, expand to Missouri Watch after establishing credibility |

---

*This roadmap assumes a solo operator with basic web development skills. Adjust timelines based on available time and technical comfort.*
