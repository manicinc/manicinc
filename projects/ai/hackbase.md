---
title: HackBase.io — Founders Launchpad for Indie Makers
description: Link building intelligence meets Product Hunt. Validate startup ideas with AI-powered debates, discover your founder archetype with HEXACO-60, and launch with confidence.
date: 2026-01-17
category: ai
tags: [ai, saas, indie-hackers, startup, validation, link-building, product-hunt, anthropic, super-cloud-mcp, featured]
link: https://hackbase.io
image: /assets/projects/hackbase/hackbase-logo.svg
images: [
  /assets/projects/hackbase/hackbase-logo.svg,
  /assets/projects/hackbase/og-home.svg,
  /assets/projects/hackbase/og-launchpad.svg
]
featured: true
draft: false
status: ongoing
license: MIT
stats:
  - label: "AI Debate Agents"
    value: "12 Crucible-Style"
  - label: "Assessment"
    value: "HEXACO-60 + Archetypes"
  - label: "Social Platforms"
    value: "8 Brand Checks"
  - label: "Part of"
    value: "Super Cloud MCP"
technologies: [Express.js, React, TypeScript, SQLite, Anthropic Claude, OpenAI, Stripe, Transformers.js, Puppeteer]
languages: [TypeScript, JavaScript, SQL]
team:
  - name: "Manic Agency"
    role: "Core Development"
    link: "https://manic.agency"
---

<div class="hackbase-hero">
  <img
    src="/assets/projects/hackbase/hackbase-logo.svg"
    alt="HackBase logo - hexagonal portal with rocket for founders launchpad"
    class="hackbase-hero__logo"
    decoding="async"
    loading="eager"
  />
  <h1 class="hackbase-hero__title" aria-label="founders launchpad">founders launchpad</h1>
  <p class="hackbase-hero__subtitle">
    validate your startup idea before you build. scrape pain points. generate personas. ship with confidence.
  </p>
  <a class="hackbase-hero__cta" href="https://hackbase.io" target="_blank" rel="noopener">
    explore hackbase →
  </a>
</div>

<style>
  .hackbase-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .hackbase-hero__logo {
    width: clamp(120px, 30vw, 200px);
    height: auto;
    opacity: 0.95;
  }
  @media (prefers-color-scheme: dark) {
    .hackbase-hero__logo {
      filter: brightness(1.1) drop-shadow(0 0 24px rgba(0,245,255,0.35));
      opacity: 1;
    }
  }
  .hackbase-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #00f5ff 0%, #ff00ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hackbase-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 56ch;
  }
  @media (prefers-color-scheme: light) {
    .hackbase-hero__subtitle { color: #2a2a2a; }
  }
  .hackbase-hero__cta {
    --h: 52px;
    display: inline-grid;
    place-items: center;
    height: var(--h);
    padding: 0 1.25rem;
    border-radius: 999px;
    font-weight: 800;
    text-transform: lowercase;
    text-decoration: none;
    letter-spacing: 0.02em;
    color: var(--text-primary, #fff);
    position: relative;
    isolation: isolate;
    background:
      radial-gradient(120% 120% at 0% 0%, rgba(0,245,255,0.18), rgba(255,0,255,0.08)),
      linear-gradient(90deg, rgba(0,245,255,0.35), rgba(255,0,255,0.35));
    border: 1px solid rgba(0,245,255,0.35);
    backdrop-filter: blur(6px);
    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease,
      background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .hackbase-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(0,245,255,0.9), rgba(168,85,247,0.9), rgba(255,0,255,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .hackbase-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(0,245,255,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(255,0,255,0.2), rgba(0,245,255,0.12)),
      linear-gradient(90deg, rgba(0,245,255,0.5), rgba(255,0,255,0.5));
    box-shadow: 0 10px 32px rgba(0,245,255,0.25), 0 2px 8px rgba(255,0,255,0.2);
  }
  .hackbase-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .hackbase-hero__cta {
      color: #0f0f0f;
      border-color: rgba(0,245,255,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .hackbase-hero__cta:hover {
      box-shadow: 0 10px 28px rgba(0,0,0,0.12);
    }
  }
</style>

## What is HackBase?

HackBase is a **Founders Launchpad**—an AI-powered platform that helps indie makers validate startup ideas, discover their founder archetype, and launch products with confidence. It combines three powerful modules:

1. **Link Builder** — SEO campaign management for building domain authority
2. **Directory** — A mini Product Hunt for indie products with upvoting, comments, and moderation
3. **Founders Launchpad** — AI-powered validation engine with psychometric assessments and multi-agent debates

Unlike typical idea validation tools that give you a single score, HackBase puts your idea through a **12-agent advisory board debate**, complete with a Devil's Advocate, Red Team, and Finance Expert arguing different perspectives before synthesizing actionable recommendations.

## The Indie Maker's Dilemma

Every indie hacker faces the same questions:

- **Is my idea any good?** — You've been noodling on this concept for months, but how do you know if real pain exists?
- **Am I the right founder for this?** — Some founders thrive in chaos; others need structure. Which are you?
- **Is the brand available?** — You find the perfect name, but is `yourname.com` taken? What about Twitter, GitHub, ProductHunt?
- **Where do I launch?** — There are hundreds of directories and link building opportunities—which ones matter?

**HackBase answers all of these:**

- **Scrape real pain points** from Reddit, Hacker News, and RSS feeds to validate problem existence
- **Discover your founder archetype** with HEXACO-60 personality assessment and risk tolerance profiling
- **Check brand availability** across domains and 8 social platforms in one click
- **Submit to curated directories** with campaign tracking and SEO analytics

## Core Modules

### 🚀 Founders Launchpad

The heart of HackBase—a comprehensive startup validation system.

#### Psychometric Assessment Suite

Three validated instruments to understand yourself as a founder:

| Assessment | Questions | Measures |
|------------|-----------|----------|
| **HEXACO-60** | 60 items | Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness |
| **Founder Archetypes** | 25 items | Builder, Visionary, Operator, Scientist, Hustler |
| **Risk Tolerance** | 15 items | Financial, career, social, and innovation risk comfort |

After completing the assessments, you receive:
- Your dominant **founder archetype** with strengths and blind spots
- **Ideal co-founder types** based on complementary archetypes
- **Personalized recommendations** tailored to your profile

#### 12-Agent Crucible Debate System

Your idea goes before an AI advisory board with 12 specialized agents:

| Agent | Role | Perspective |
|-------|------|-------------|
| **Devil's Advocate** | Challenge assumptions | Skeptical |
| **Market Analyst** | Market sizing & trends | Data-driven |
| **Tech Lead** | Technical feasibility | Engineering |
| **Finance Expert** | Unit economics & funding | ROI-focused |
| **User Advocate** | Customer needs | Empathy |
| **Legal & Compliance** | Risk & regulations | Conservative |
| **Operations Expert** | Execution & scaling | Practical |
| **Growth Hacker** | Acquisition & virality | Aggressive |
| **Industry Expert** | Domain knowledge | Contextual |
| **Red Team** | Security & failure modes | Adversarial |
| **The Optimist** | Opportunities | Positive |
| **The Realist** | Constraints | Balanced |

**The Debate Flow:**
1. **Thesis** — Each agent provides their initial position on your idea
2. **Antithesis** — Agents critique each other's positions, surfacing conflicts
3. **Synthesis** — The orchestrator builds consensus and actionable recommendations

The result is an **Executive Brief** with confidence scores, consensus points, dissenting opinions, and prioritized next actions.

#### Idea Validation Engine

Real-time validation using free data sources:

- **Reddit** — Scrapes r/startups, r/SaaS, r/Entrepreneur for pain points
- **Hacker News** — Searches via Algolia API for discussions and launches
- **RSS Feeds** — Monitors TechCrunch, The Verge, and tech publications
- **DuckDuckGo** — Web search for competitor and market analysis

For each idea, you get:
- **Idea Score** (0-100) based on problem signal strength
- **Problem Signals** with sentiment and engagement metrics
- **Market Signals** showing discussion volume and trends
- **Competitor Analysis** with differentiation opportunities
- **Risks and Opportunities** identified by pattern matching

#### Brand Availability Checker

Comprehensive availability checking in one request:

- **Domains**: `.com`, `.io`, `.co`, `.dev`, `.app`, `.ai` via WHOIS/DNS/RDAP
- **Social Platforms**: Twitter, GitHub, Instagram, LinkedIn, TikTok, YouTube, Reddit, ProductHunt

Returns an **availability score** and recommendations for alternatives if your preferred name is taken.

### 📁 Directory Module (Product Hunt Style)

A public submission directory for indie products:

**User Features:**
- Browse and discover products by category
- Upvote products (one per user)
- Comment on submissions
- Submit your product with logo, screenshots, and details
- Track submission status through moderation

**Admin Features:**
- Moderation queue with AI-assisted scoring
- Approve, reject, or feature submissions
- Category management (CRUD with nested categories)
- Promotion tiers: Featured, Promoted, Sponsored

**Submission Workflow:**
```
Draft → Pending → [Approved/Rejected] → Published
```

### 🤖 AI Copilot

Context-aware chat assistant with multiple modes:

| Mode | Purpose |
|------|---------|
| **Chat** | General conversation and guidance |
| **Brainstorm** | Structured ideation with SCAMPER, Six Hats, First Principles, JTBD |
| **Analyze** | Deep analysis with RAG context from your knowledge base |
| **Debate** | Quick multi-agent perspective on a specific question |
| **Task** | Autonomous task execution via AgentOS bridge |

The copilot adapts its responses based on your founder archetype—a Builder gets technical deep-dives while a Hustler gets action-oriented advice.

### 🔍 RAG Semantic Search

Local semantic search powered by:

- **BERT embeddings** via `@xenova/transformers` (ONNX Runtime)
- **SQLite-backed vector storage** for persistence
- **Automatic document chunking** and indexing

All your validation data, debate transcripts, and brainstorm sessions are indexed and searchable semantically—not just keyword matching.

## Part of Super Cloud MCP

HackBase is part of the **[Super Cloud MCP](https://github.com/manicinc/super-cloud-mcps)** ecosystem—a comprehensive AI toolkit with 61 tool facades consolidating 530+ actions. This means:

- **SEO Submission automation** via the `seo_submit` facade (queue → approve → execute workflow)
- **Social media cross-posting** via `twitter`, `reddit`, `pinterest`, `producthunt` facades
- **Research integration** via `research` and `search_router` facades for multi-source validation
- **Documentary generation** via `documentary` facade to create launch videos from your journey

## Technical Architecture

```
packages/link-builder/
├── src/
│   ├── api/
│   │   └── routes/
│   │       ├── directory.ts          # Public directory routes
│   │       ├── admin-directory.ts    # Admin moderation routes
│   │       └── launchpad.ts          # Founders Launchpad API
│   ├── directory/
│   │   └── types.ts                  # Directory types
│   └── launchpad/
│       ├── availability/             # Domain + social checking
│       ├── copilot/                  # AI chat modes
│       ├── debate/                   # 12-agent system
│       │   ├── agent-pool.ts         # Agent personas
│       │   ├── debate-orchestrator.ts
│       │   └── synthesis-engine.ts
│       ├── psychometric/             # HEXACO-60, archetypes
│       │   ├── hexaco-questions.ts
│       │   ├── founder-archetypes.ts
│       │   └── assessment-engine.ts
│       ├── rag/                      # Semantic search
│       │   ├── embedding-service.ts
│       │   ├── vector-store.ts
│       │   └── semantic-search.ts
│       └── validation/               # Idea validation
│           ├── reddit-scraper.ts
│           ├── hackernews-scraper.ts
│           └── validation-engine.ts
└── apps/
    └── link-builder-ui/              # React frontend
        └── src/
            └── pages/
                ├── directory/
                ├── admin/
                └── launchpad/
```

**Key Technologies:**
- **Backend**: Express.js, TypeScript, SQLite (better-sqlite3)
- **Frontend**: React, TypeScript, TailwindCSS
- **AI/ML**: Anthropic Claude, OpenAI, Transformers.js (ONNX)
- **Scraping**: Puppeteer, Cheerio, Algolia API
- **Payments**: Stripe (for directory promotions)

## The Vision

HackBase exists because we believe **indie makers deserve the same validation tools as well-funded startups**.

Y Combinator has advisors and a network. Funded startups have boards and mentors. Solo founders have... Google and gut instinct?

Not anymore. HackBase gives you:
- An **AI advisory board** that debates your ideas from 12 perspectives
- **Psychometric profiles** that help you understand your strengths and blind spots
- **Real-time validation** from the places your customers actually hang out
- **Brand checking** that saves hours of manual searching
- **A launchpad** that guides you from idea to shipped product

## Part of the Manic Ecosystem

HackBase connects with other tools we've built:

- **[SynthStack](/projects/ai/synthstack)** — AI-native SaaS boilerplate to build your validated idea
- **[DomainHQ](/projects/ai/domainhq)** — Domain portfolio management for your brand acquisitions
- **[Frame.dev](/projects/ai/frame)** — AI orchestration runtime powering the debate system
- **[Quarry.space](/projects/ai/quarry)** — Knowledge management for your research and validation data
- **[Wunderland.sh](/projects/ai/wunderland)** — AI agent social network using the same HEXACO-60 personality model
- **[RabbitHole](/projects/ai/rabbithole)** — Deploy autonomous agents across Slack, Discord, and Telegram

## Open Source

HackBase is **MIT licensed** and part of the Super Cloud MCP monorepo. Clone it, extend it, or use it as reference for your own launchpad.

---

*Ready to validate your idea? [Launch with HackBase →](https://hackbase.io)*
