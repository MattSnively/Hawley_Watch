# FuckJoshHawley.com - Site Structure & Wireframe

## Site Architecture

```
HOME
├── HAWLEY WATCH (main feed)
│   └── Individual Post Pages
├── MONEY TRAIL
│   ├── Top Donors
│   ├── PAC Contributions
│   └── Industry Breakdown
├── VOTING RECORD
├── SHOP (merch)
└── ABOUT
```

---

## Page Designs

### 1. HOME PAGE

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO                            [Nav: Watch | Money | Vote | Shop | About]
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     "HOLDING JOSH HAWLEY ACCOUNTABLE"                       │
│     One tweet at a time.                                    │
│                                                             │
│     [See Latest Posts]        [Follow the Money]            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  QUICK STATS BAR                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ XX%      │  │ $X.XM    │  │ XX       │  │ XX%      │    │
│  │ Truth    │  │ PAC $    │  │ Posts    │  │ Corp     │    │
│  │ Score    │  │ Received │  │ Analyzed │  │ Donors   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
├─────────────────────────────────────────────────────────────┤
│  LATEST POSTS                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Tweet Embed]                                        │   │
│  │ TRUTH SCORE: ████████░░ 80% - Mostly True           │   │
│  │ "Here's why this matters..." [Read More]            │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Tweet Embed]                                        │   │
│  │ TRUTH SCORE: ███░░░░░░░ 30% - Misleading            │   │
│  │ "Hawley conveniently forgot..." [Read More]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                      [Load More Posts]                      │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. HAWLEY WATCH (Main Feed)

The primary content section - your blog posts analyzing his tweets.

```
┌─────────────────────────────────────────────────────────────┐
│  HAWLEY WATCH                                               │
│  Tracking what he says vs. what he does                     │
├─────────────────────────────────────────────────────────────┤
│  FILTER BY:  [All] [Misleading] [False] [True] [Topic ▼]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  January 12, 2026                                    │   │
│  │  Topic: ECONOMY                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │                                             │    │   │
│  │  │         [Embedded Tweet]                    │    │   │
│  │  │                                             │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  TRUTH SCORE                                         │   │
│  │  ███░░░░░░░░ 30%                                    │   │
│  │  RATING: MISLEADING                                  │   │
│  │  Source: PolitiFact, WaPo Fact Checker              │   │
│  │                                                      │   │
│  │  [Read Full Analysis →]                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. INDIVIDUAL POST PAGE

Each tweet gets its own detailed analysis page.

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Hawley Watch                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              [Large Embedded Tweet]                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐                                   │
│  │  TRUTH SCORE         │                                   │
│  │  ███████░░░ 70%      │                                   │
│  │  MOSTLY TRUE         │                                   │
│  │                      │                                   │
│  │  Fact-Check Sources: │                                   │
│  │  • PolitiFact        │                                   │
│  │  • Snopes            │                                   │
│  │  • WaPo Checker      │                                   │
│  └──────────────────────┘                                   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  MY ANALYSIS                                                │
│  Posted: January 12, 2026 | Topic: Healthcare               │
│                                                             │
│  [Your blog post content here - explaining why you          │
│   agree or disagree, providing context, connecting          │
│   to his voting record or donor interests]                  │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  💰 FOLLOW THE MONEY                                        │
│  Related to this topic, Hawley has received:                │
│  • $XXX,XXX from Pharmaceutical Industry                    │
│  • $XX,XXX from Insurance PACs                              │
│  [See full donor breakdown →]                               │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🗳️ RELATED VOTES                                          │
│  • HR 1234 - Voted NO (Jan 2025)                           │
│  • S 567 - Voted YES (Dec 2024)                            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  SHARE: [Twitter] [Facebook] [Copy Link]                    │
│                                                             │
│  ← Previous Post                          Next Post →       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. MONEY TRAIL PAGE

Campaign finance deep-dive.

```
┌─────────────────────────────────────────────────────────────┐
│  MONEY TRAIL                                                │
│  Who funds Josh Hawley?                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CAREER FUNDRAISING TOTAL: $XX,XXX,XXX                      │
│  2024 Cycle: $X,XXX,XXX                                     │
│  Source: OpenSecrets.org, FEC.gov                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TOP INDUSTRIES                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Securities & Investment  ████████████████  $XXX,XXX │   │
│  │ Real Estate              ██████████████    $XXX,XXX │   │
│  │ Insurance                ████████████      $XXX,XXX │   │
│  │ Oil & Gas                ██████████        $XXX,XXX │   │
│  │ Health Professionals     ████████          $XXX,XXX │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TOP PACS                                                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │  PAC Name                          Amount        │      │
│  │  ─────────────────────────────────────────────── │      │
│  │  Senate Leadership Fund            $XXX,XXX      │      │
│  │  National Republican Senatorial    $XXX,XXX      │      │
│  │  [PAC Name]                        $XX,XXX       │      │
│  │  [PAC Name]                        $XX,XXX       │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TOP INDIVIDUAL DONORS                                      │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Name                   Employer        Amount   │      │
│  │  ─────────────────────────────────────────────── │      │
│  │  [Donor Name]           [Company]       $XX,XXX  │      │
│  │  [Donor Name]           [Company]       $XX,XXX  │      │
│  │  [Donor Name]           [Company]       $XX,XXX  │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💡 WHAT THIS MEANS                                         │
│  [Your editorial about conflicts of interest,               │
│   how donations may influence his positions]                │
│                                                             │
│  Data updated: [Date] | Sources: OpenSecrets, FEC           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. VOTING RECORD PAGE (Optional but Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│  VOTING RECORD                                              │
│  How Hawley votes vs. what he tweets                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FILTER: [All] [Healthcare] [Economy] [Immigration] [...]   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HR 1234 - Affordable Healthcare Act Extension      │   │
│  │  Date: Jan 15, 2025                                 │   │
│  │  Hawley Vote: ❌ NO                                 │   │
│  │                                                      │   │
│  │  But he tweeted...                                   │   │
│  │  [Mini tweet embed about supporting healthcare]      │   │
│  │                                                      │   │
│  │  [Read Analysis →]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. ABOUT PAGE

```
┌─────────────────────────────────────────────────────────────┐
│  ABOUT THIS SITE                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WHO WE ARE                                                 │
│  [Your bio/mission - concerned citizen, etc.]               │
│                                                             │
│  OUR METHODOLOGY                                            │
│  How we determine Truth Scores:                             │
│  • We link to established fact-checkers                     │
│  • Sources: PolitiFact, Snopes, WaPo, etc.                 │
│  • We show our work - all sources linked                    │
│                                                             │
│  ABOUT JOSH HAWLEY                                          │
│  • Senator from Missouri (2019-present)                     │
│  • Former Missouri Attorney General                         │
│  • [Key facts, controversies - Jan 6 fist pump, etc.]      │
│                                                             │
│  DATA SOURCES                                               │
│  • Campaign Finance: OpenSecrets.org, FEC.gov              │
│  • Voting Record: Congress.gov, GovTrack                   │
│  • Fact-Checking: PolitiFact, Snopes, WaPo                 │
│                                                             │
│  CONTACT                                                    │
│  [Email or contact form]                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7. SHOP PAGE (Merch)

Sell swag and support the site. Squarespace has built-in e-commerce.

```
┌─────────────────────────────────────────────────────────────┐
│  SHOP                                                       │
│  Support the site. Look good doing it.                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │             │  │             │  │             │         │
│  │   [IMAGE]   │  │   [IMAGE]   │  │   [IMAGE]   │         │
│  │             │  │             │  │             │         │
│  │ Classic Tee │  │  Bumper     │  │   Hoodie    │         │
│  │   $25.00    │  │  Sticker    │  │   $45.00    │         │
│  │             │  │   $5.00     │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │             │  │             │  │             │         │
│  │   [IMAGE]   │  │   [IMAGE]   │  │   [IMAGE]   │         │
│  │             │  │             │  │             │         │
│  │    Mug      │  │  Sticker    │  │   Yard      │         │
│  │   $18.00    │  │   Pack      │  │   Sign      │         │
│  │             │  │   $12.00    │  │   $20.00    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WHERE DOES THE MONEY GO?                                   │
│  100% of profits support:                                   │
│  • Maintaining this site                                    │
│  • Research and fact-checking                               │
│  • [Optional: Missouri voter registration efforts]          │
│  • [Optional: Donate to opponent campaigns]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Product Ideas:**
- Classic "Fuck Josh Hawley" t-shirt (black, navy, red)
- "I Remember January 6th" tee with fist pump silhouette
- Bumper stickers
- Sticker packs (variety)
- Yard signs (election season)
- Coffee mugs
- Hoodies
- Hats/caps
- Tote bags

**Fulfillment Options for Squarespace:**
1. **Print-on-demand** (Printful, Printify) - No inventory, they print & ship
2. **Self-fulfill** - Buy inventory, ship yourself
3. **Hybrid** - POD for most items, self-fulfill popular ones

---

## Truth Score Visual Design

The truth score meter - a key visual element:

```
FALSE        MISLEADING      MIXED       MOSTLY TRUE      TRUE
  |______________|______________|______________|______________|
  0%            25%            50%            75%           100%

Visual Examples:

█░░░░░░░░░ 10% - FALSE (Red)
███░░░░░░░ 30% - MISLEADING (Orange)
█████░░░░░ 50% - MIXED (Yellow)
███████░░░ 70% - MOSTLY TRUE (Light Green)
██████████ 95% - TRUE (Green)
```

---

## Content Categories/Tags

Organize posts by topic:

- **Economy** - Jobs, taxes, trade, inflation
- **Healthcare** - Insurance, Medicare, pharma
- **Immigration** - Border, asylum, visas
- **Jan 6 / Democracy** - Election denial, Capitol riot
- **Tech / Big Tech** - Social media, antitrust
- **Culture War** - Education, LGBTQ+, religion
- **Foreign Policy** - China, Russia, military
- **Missouri Issues** - State-specific topics

---

## Data Sources to Integrate

| Data Type | Source | URL |
|-----------|--------|-----|
| Campaign Finance | OpenSecrets | opensecrets.org/members-of-congress/josh-hawley |
| PAC Contributions | FEC | fec.gov |
| Voting Record | GovTrack | govtrack.us/congress/members/josh_hawley |
| Voting Record | ProPublica | projects.propublica.org/represent |
| Fact Checks | PolitiFact | politifact.com/personalities/josh-hawley |
| Congressional Info | Congress.gov | congress.gov |

---

## Mobile Considerations

All pages should be mobile-responsive:
- Hamburger menu for navigation
- Single-column layout for posts
- Touch-friendly truth score display
- Swipeable post cards

---

## Next Steps (Squarespace Redesign)

1. **Upgrade Squarespace plan** - Need Commerce plan for merch ($33/mo or $27/mo annual)
2. **Set up print-on-demand** - Connect Printful or Printify for merch fulfillment
3. **Gather initial data** - Campaign finance from OpenSecrets
4. **Create blog template** - Standardized format for tweet analysis posts
5. **Build static pages** - Money Trail, Voting Record, About, Shop
6. **Create first 3-5 posts** - Build initial content
7. **Design product mockups** - T-shirts, stickers, etc.
