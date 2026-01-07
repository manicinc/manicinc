---
title: Quarry.space — AI-Native Personal Knowledge Management
description: Transform how you capture, connect, and recall knowledge. Zettelkasten-powered PKM with semantic search, FSRS flashcards, and knowledge graphs built for the AI era.
date: 2026-01-06
category: ai
tags: [ai, pkms, knowledge-management, zettelkasten, semantic-search, flashcards, fsrs, knowledge-graph, note-taking, second-brain, framers-ai, frame-dev, featured]
link: https://quarry.space
github: https://github.com/framersai
image: /assets/projects/quarry/quarry-logo-color@4x.png
images: [
  /assets/projects/quarry/quarry-logo-color@4x.png,
  /assets/projects/quarry/quarry-app-screenshot.png
]
featured: true
draft: false
stats:
  - label: "Powered By"
    value: "Frame.dev"
  - label: "Learning Algorithm"
    value: "FSRS Spaced Repetition"
  - label: "Platforms"
    value: "Web + Desktop + Mobile"
  - label: "Search"
    value: "Semantic AI (ONNX)"
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---

<div class="quarry-hero">
  <img
    src="/assets/projects/quarry/quarry-logo-color.svg"
    alt="Quarry.space logo - AI-native personal knowledge management system"
    class="quarry-hero__logo"
    decoding="async"
    loading="eager"
  />
  <h1 class="quarry-hero__title" aria-label="denoising the web">denoising the web</h1>
  <p class="quarry-hero__subtitle">
    the os for your life. capture everything, connect anything, recall instantly.
  </p>
  <a class="quarry-hero__cta" href="https://quarry.space" target="_blank" rel="noopener">
    explore quarry.space →
  </a>
</div>

<style>
  .quarry-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .quarry-hero__logo {
    width: clamp(160px, 38vw, 320px);
    height: auto;
    opacity: 0.95;
  }
  @media (prefers-color-scheme: dark) {
    .quarry-hero__logo {
      filter: brightness(1.1) drop-shadow(0 0 24px rgba(25,255,166,0.25));
      opacity: 1;
    }
  }
  .quarry-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #19ffa6 0%, #00d4ff 50%, #8a5cff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .quarry-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 56ch;
  }
  @media (prefers-color-scheme: light) {
    .quarry-hero__subtitle { color: #2a2a2a; }
  }
  .quarry-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(25,255,166,0.18), rgba(0,212,255,0.08)),
      linear-gradient(90deg, rgba(25,255,166,0.35), rgba(0,212,255,0.35));
    border: 1px solid rgba(25,255,166,0.35);
    backdrop-filter: blur(6px);
    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease,
      background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .quarry-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(25,255,166,0.9), rgba(0,212,255,0.9), rgba(138,92,255,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .quarry-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(25,255,166,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(138,92,255,0.2), rgba(0,212,255,0.12)),
      linear-gradient(90deg, rgba(25,255,166,0.5), rgba(0,212,255,0.5));
    box-shadow: 0 10px 32px rgba(25,255,166,0.25), 0 2px 8px rgba(0,212,255,0.2);
  }
  .quarry-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .quarry-hero__cta {
      color: #0f0f0f;
      border-color: rgba(25,255,166,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .quarry-hero__cta:hover {
      box-shadow: 0 10px 28px rgba(0,0,0,0.12);
    }
  }
</style>

## What is Quarry?

Quarry is an **AI-native personal knowledge management system** (PKM) built on the [Frame.dev](/projects/ai/frame) ecosystem. Unlike traditional note-taking apps that bolt on AI as an afterthought, Quarry was designed from the ground up for the age of large language models.

It combines the time-tested **Zettelkasten methodology** with cutting-edge **semantic search**, **FSRS spaced repetition**, and **knowledge graph visualization**—all running locally with on-device AI inference for complete privacy.

![Quarry.space application interface showing the knowledge management dashboard with semantic search and note connections - AI-native PKM for the modern age|size=large|align=center|caption=The Quarry Knowledge Interface](/assets/projects/quarry/quarry-app-screenshot.png)

## Why Quarry Exists

The web is noise. Every day we consume thousands of pieces of information, but retention is abysmal. Traditional note-taking creates digital graveyards—folders full of markdown files that never get revisited.

Quarry solves this with three core principles:

1. **Capture Friction = Zero** — Voice input, browser extensions, mobile apps. Getting knowledge in should never interrupt flow.
2. **Connection is Automatic** — Semantic embeddings find relationships you'd never spot manually.
3. **Recall is Active** — FSRS flashcards surface knowledge before you forget it.

## Core Features

### 🧠 Zettelkasten Architecture

Quarry implements the Zettelkasten method pioneered by Niklas Luhmann—atomic notes (Supernotes) connected through meaningful links rather than hierarchical folders.

- **Supernotes** — Atomic knowledge units with structured metadata
- **Bi-directional Links** — Every connection works both ways
- **Recursive Strands** — Long-form content that composes from atomic units
- **Supertags** — Cross-cutting organization beyond traditional folders

### 🔍 Semantic Search (WebGPU Accelerated)

Forget keyword matching. Quarry uses **on-device embeddings** via ONNX Runtime with WebGPU acceleration for instant semantic search.

- **Hybrid BM25 + Semantic** — Best of lexical and neural approaches
- **MiniLM Embeddings** — 384-dimensional vectors for precise similarity
- **Zero Cloud Dependency** — All inference happens on your device
- **< 50ms Query Time** — WebGPU makes local AI genuinely fast

### 📚 FSRS Flashcards & Spaced Repetition

The **Free Spaced Repetition Scheduler** (FSRS) is the most advanced open-source algorithm for memory retention. Quarry integrates it natively.

- **Automatic Card Generation** — AI extracts key concepts from your notes
- **Adaptive Intervals** — Reviews scheduled for optimal retention
- **Difficulty Ratings** — System learns what's hard for *you*
- **Progress Tracking** — XP, streaks, and mastery visualization

### 🕸️ Knowledge Graph Visualization

See the structure of your knowledge in real-time. Connections you never knew existed become obvious.

- **Force-Directed Layout** — Automatic clustering of related concepts
- **Temporal Evolution** — Watch your knowledge grow over time
- **Path Finding** — Discover unexpected routes between ideas
- **Export to Obsidian/Roam** — Interoperability with existing tools

### 📱 Multi-Platform (Web + Desktop + Mobile)

Quarry goes everywhere you do.

- **Web App** — Full-featured PWA at [quarry.space](https://quarry.space)
- **Electron Desktop** — Native macOS, Windows, Linux apps
- **Capacitor Mobile** — iOS and Android with offline sync
- **Offline-First** — Works without internet, syncs when connected

## Part of the Frame.dev Ecosystem

Quarry is powered by [Frame.dev](/projects/ai/frame)—the open-source AI orchestration runtime developed by [Framers AI](https://github.com/framersai) in strategic partnership with [Manic Agency](https://manic.agency).

The same infrastructure that powers:

- **[AgentOS](https://agentos.sh)** — Modular AI agent runtime
- **[OpenStrand](https://openstrand.ai)** — Collaborative knowledge architecture
- **[Voice Chat Assistant](/projects/ai/voice-chat-assistant)** — Voice-first AI coding

## Technical Architecture

```
quarry/
├── apps/
│   ├── web/                    # Next.js 14 PWA
│   ├── desktop/                # Electron wrapper
│   └── mobile/                 # Capacitor iOS/Android
├── packages/
│   ├── @quarry/core/           # Business logic
│   ├── @quarry/editor/         # TipTap-based editor
│   ├── @quarry/search/         # ONNX semantic search
│   └── @quarry/flashcards/     # FSRS implementation
└── lib/
    ├── embeddings/             # MiniLM + ONNX Runtime
    ├── graph/                  # Force-directed visualization
    └── sync/                   # Offline-first sync engine
```

**Key Technologies:**
- **Frontend**: Next.js 14, React 18, TailwindCSS, Framer Motion
- **Editor**: TipTap with 15+ custom extensions
- **AI/ML**: ONNX Runtime (WebGPU), Transformers.js, MiniLM
- **Storage**: IndexedDB, SQL.js (WASM), optional Supabase sync
- **Mobile**: Capacitor for iOS/Android, Electron for desktop

## Getting Started

### Web (Instant)

Visit [quarry.space](https://quarry.space) — no installation required.

### Desktop

```bash
# macOS
brew install --cask quarry

# Linux
snap install quarry

# Windows
winget install framersai.quarry
```

### Self-Hosted

```bash
# Clone and run locally
git clone https://github.com/framersai/quarry.git
cd quarry
pnpm install
pnpm dev
```

## Open Source Philosophy

Quarry is **Apache-2.0 licensed**. Your knowledge should never be locked into proprietary formats or dependent on a company's survival.

- **Community Edition**: Full-featured, self-hostable, forever free
- **Premium Edition**: Optional cloud sync, advanced collaboration, managed infrastructure

## Built by Framers AI × Manic Agency

Quarry is developed by [Framers AI](https://github.com/framersai) in strategic partnership with [Manic Agency](https://manic.agency). Together, we're building the infrastructure for the AI-native future of knowledge work.

---

*Ready to denoise your knowledge? [Get started with Quarry →](https://quarry.space)*
