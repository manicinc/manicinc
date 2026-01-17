---
title: SynthStack — AI-Native SaaS Boilerplate
description: Your Agency in a Box. Open-source, cross-platform SaaS boilerplate built with Vue Quasar. Ships for web, iOS, Android, desktop, and PWA from a single codebase with AI Copilot, Stripe billing, and Directus CMS.
date: 2026-01-14
category: ai
tags: [ai, saas, boilerplate, vue, quasar, typescript, cross-platform, stripe, directus, supabase, oss, featured]
link: https://synthstack.app
github: https://github.com/manicinc/synthstack
image: /assets/projects/synthstack/synthstack-logo-512.png
images: [
  /assets/projects/synthstack/synthstack-logo-512.png,
  /assets/projects/synthstack/synthstack-mark-512.png
]
featured: true
draft: false
status: ongoing
license: MIT
stats:
  - label: "Tests"
    value: "920+"
  - label: "Platforms"
    value: "Web + iOS + Android + Desktop"
  - label: "AI Copilot"
    value: "GPT-4o + Claude"
  - label: "Billing Tiers"
    value: "4 + Lifetime"
technologies: [Vue 3, Quasar, TypeScript, Fastify, PostgreSQL, Redis, Directus, Qdrant, Docker]
languages: [TypeScript, Vue, SQL]
team:
  - name: "Manic Agency"
    role: "Core Development"
    link: "https://manic.agency"
---

<div class="synthstack-hero">
  <img
    src="/assets/projects/synthstack/synthstack-logo.svg"
    alt="SynthStack logo - AI-native SaaS boilerplate for cross-platform applications"
    class="synthstack-hero__logo"
    decoding="async"
    loading="eager"
  />
  <h1 class="synthstack-hero__title" aria-label="your agency in a box">your agency in a box</h1>
  <p class="synthstack-hero__subtitle">
    open-source saas boilerplate. one codebase → web, ios, android, desktop. ship in days, not months.
  </p>
  <a class="synthstack-hero__cta" href="https://synthstack.app" target="_blank" rel="noopener">
    explore synthstack →
  </a>
</div>

<style>
  .synthstack-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .synthstack-hero__logo {
    width: clamp(160px, 38vw, 320px);
    height: auto;
    opacity: 0.95;
  }
  @media (prefers-color-scheme: dark) {
    .synthstack-hero__logo {
      filter: brightness(1.1) drop-shadow(0 0 24px rgba(99,102,241,0.35));
      opacity: 1;
    }
  }
  .synthstack-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .synthstack-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 56ch;
  }
  @media (prefers-color-scheme: light) {
    .synthstack-hero__subtitle { color: #2a2a2a; }
  }
  .synthstack-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(99,102,241,0.18), rgba(139,92,246,0.08)),
      linear-gradient(90deg, rgba(99,102,241,0.35), rgba(139,92,246,0.35));
    border: 1px solid rgba(99,102,241,0.35);
    backdrop-filter: blur(6px);
    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease,
      background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .synthstack-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(236,72,153,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .synthstack-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(99,102,241,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(236,72,153,0.2), rgba(139,92,246,0.12)),
      linear-gradient(90deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5));
    box-shadow: 0 10px 32px rgba(99,102,241,0.25), 0 2px 8px rgba(139,92,246,0.2);
  }
  .synthstack-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .synthstack-hero__cta {
      color: #0f0f0f;
      border-color: rgba(99,102,241,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .synthstack-hero__cta:hover {
      box-shadow: 0 10px 28px rgba(0,0,0,0.12);
    }
  }
</style>

## What is SynthStack?

SynthStack is an **AI-native SaaS boilerplate** that ships production-ready applications for web, iOS, Android, and desktop from a single codebase. Built on [Vue 3](https://vuejs.org/) and [Quasar Framework](https://quasar.dev/), it's the foundation we use at [Manic Agency](https://manic.agency) to launch client projects in days instead of months.

Unlike typical boilerplates that bolt on features as afterthoughts, SynthStack was designed from the ground up for the AI era—with a built-in AI Copilot, semantic vector search, and intelligent automation baked into every layer.

## The Problem We Solve

Every new SaaS project starts the same way: weeks spent on authentication, billing, email, CMS, deployment. Then you add AI features and spend more weeks integrating OpenAI, handling rate limits, managing costs. Finally, a client asks for a mobile app and you're back to square one.

**SynthStack eliminates this entirely:**

- **Auth complexity?** Toggle between Supabase (managed OAuth) or local PostgreSQL (self-hosted) with zero code changes
- **Billing setup?** Stripe subscriptions, lifetime licenses, usage-based pricing—already configured with webhooks and customer portal
- **AI integration?** GPT-4o + Claude fallback with streaming, cost tracking, and credit systems built-in
- **Cross-platform?** One `pnpm build` produces web, PWA, Electron desktop, and Capacitor iOS/Android

## Core Features

### 🤖 AI Copilot (GPT-4o + Claude)

A production-ready chat assistant available throughout the app via `⌘K` or the floating button:

- **Real-time streaming** with markdown and code syntax highlighting
- **RAG-powered context** from indexed documentation via Qdrant
- **Cost tracking** with per-organization breakdowns and budget alerts
- **Automatic fallback** from GPT-4o to Claude 3.5 for reliability

### 🔐 Flexible Authentication

Choose your auth provider at runtime—no code changes required:

| Provider | Best For | OAuth Support |
|----------|----------|---------------|
| **Supabase** (default) | Teams wanting managed auth | Google, GitHub, Discord, Microsoft |
| **Local PostgreSQL** | Self-hosted deployments | Email/password (OAuth coming soon) |

Both include: Argon2id password hashing, JWT access/refresh tokens, account lockout, email verification, and session management with token rotation.

### 💳 Stripe Billing (4 Tiers + Lifetime)

Complete billing system with subscriptions and one-time payments:

| Tier | Monthly | Annual | Credits/Day |
|------|---------|--------|-------------|
| **Free** | $0 | $0 | 10 |
| **Maker** | $12.99 | $116.91 | 30 |
| **Pro** | $24.99 | $224.91 | 100 |
| **Agency** | $39.99 | $359.91 | Unlimited |
| **Lifetime** | $149-249 one-time | — | Pro features forever |

### 📝 Directus CMS

[Directus](https://directus.io/) provides a headless CMS that automatically models your PostgreSQL database:

- **WYSIWYG editor** for blog posts, product pages, documentation
- **Media library** with image transformations and asset management
- **Custom extensions** for themes, newsletters, FAQ management
- **REST & GraphQL APIs** for accessing content from any client

### 🌐 Cross-Platform Builds

One codebase, five platforms:

```bash
# Web + PWA
pnpm build:web

# iOS (requires Xcode)
pnpm build:ios

# Android (requires Android Studio)
pnpm build:android

# Desktop (Electron)
pnpm build:electron
```

### 🔍 Vector Search (Qdrant)

Semantic search powered by [Qdrant](https://qdrant.tech/) for:

- RAG-based document retrieval for the AI Copilot
- Intelligent search across knowledge bases
- Similarity matching for content recommendations

### 🎮 Gamification & Referrals

Built-in engagement systems (Pro Edition):

- **XP and achievements** for user progression
- **Referral codes** with reward tracking
- **Leaderboards** for community competition

## Development Journey

SynthStack emerged from a simple realization: we kept building the same foundation for every client project. Here's how it evolved:

### December 7, 2025 — Initial Commit

The first commit laid the foundation: Vue 3 + Quasar with TypeScript, PostgreSQL, Redis, and Docker Compose. We integrated Stripe, email systems (Mailgun/SendGrid), and analytics from day one.

### December 12, 2025 — Onboarding & CMS

Added a comprehensive onboarding wizard for new users and deep Directus integration. The CMS became the central hub for managing all content—blog, products, themes, newsletters.

### December 25, 2025 — AI Agents & Gamification

The Christmas release brought the AI Copilot, gamification system, and referral tracking. We also added support for Python backends (FastAPI, Django) for teams preferring that stack.

### January 2026 — Cross-Platform & Stabilization

Mobile builds arrived via Capacitor, desktop builds via Electron. The test suite grew to 920+ tests. CI/CD pipelines now auto-deploy to any VPS provider.

## Technical Architecture

```
synthstack/
├── apps/
│   └── web/                      # Vue 3 + Quasar (PWA, iOS, Android, Desktop)
├── packages/
│   ├── api-gateway/              # Fastify REST API
│   ├── ts-ml-service/            # NestJS ML service (TypeScript-only)
│   ├── types/                    # Shared TypeScript types
│   └── directus-extension-synthstack/  # CMS extensions
├── services/
│   └── directus/                 # Directus config (101 migrations)
└── deploy/
    ├── docker-compose.yml        # Production stack
    └── nginx.conf                # Reverse proxy config
```

**Key Technologies:**
- **Frontend**: Vue 3, Quasar 2, TypeScript, Pinia, SCSS
- **Backend**: Fastify (Node.js), NestJS (ML service)
- **AI/ML**: OpenAI SDK, Anthropic SDK, Qdrant
- **Database**: PostgreSQL 16, Redis 7
- **CMS**: Directus 11.x with custom extensions
- **Deployment**: Docker Compose, GitHub Actions, Nginx

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Quick Start

```bash
# Clone
git clone https://github.com/manicinc/synthstack.git
cd synthstack

# Install
pnpm install

# Configure
cp .env.example .env
# Edit .env with your Supabase/Stripe/OpenAI keys

# Start services
docker compose up -d

# Run frontend
pnpm dev:web
```

**Access points:**
- Frontend: http://localhost:3050
- API: http://localhost:3003
- Directus: http://localhost:8099/admin

## Part of the Manic Ecosystem

SynthStack connects with other tools we've built:

- **[Frame.dev](/projects/ai/frame)** — AI orchestration runtime powering the copilot
- **[Quarry.space](/projects/ai/quarry)** — Knowledge management with semantic search
- **[HackBase.io](/projects/ai/hackbase)** — Startup validation and link building for launches

## Open Source

SynthStack Community Edition is **MIT licensed**. Use it for side projects, client work, or as a learning resource.

**[SynthStack Pro](https://synthstack.app/pro)** adds Python backends (FastAPI, Django), referral systems, and advanced AI copilots for commercial use.

---

*Ready to build your agency? [Get started with SynthStack →](https://synthstack.app)*
