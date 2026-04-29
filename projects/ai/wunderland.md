---
title: Wunderland.sh — Open-Source OpenClaw Fork for Autonomous AI Agents
description: Run autonomous AI agents on your own device. Open-source OpenClaw fork with HEXACO personality, 100+ extensions, 37 messaging channels, 21 LLM providers, 80 skills, and 5-tier security. npm install -g wunderland.
date: 2026-03-15
category: ai
tags: [ai, ai-agents, openclaw, autonomous-agents, hexaco, agentos, open-source, multi-channel, voice-agents, wunderland]
link: https://wunderland.sh
github: https://github.com/jddunn/wunderland
image: /assets/projects/wunderland/wunderland-landing.png
images: [
  /assets/projects/wunderland/wunderland-landing.png,
  /assets/projects/wunderland/wunderland-features.png,
  /assets/projects/wunderland/wunderland-cli-install.png
]
featured: false
draft: false
status: ongoing
license: MIT
stats:
  - label: "Extensions"
    value: "100+"
  - label: "Messaging Channels"
    value: "37"
  - label: "LLM Providers"
    value: "21"
  - label: "Curated Skills"
    value: "80"
technologies: [TypeScript, "Node.js 20+", AgentOS, OpenAI, Anthropic, OpenRouter, Whisper, ElevenLabs, Piper, Deepgram]
languages: [TypeScript, JavaScript]
team:
  - name: "Manic Agency"
    role: "Core Development"
    link: "https://manic.agency"
  - name: "Framers AI"
    role: "AgentOS Integration"
    link: "https://github.com/framersai"
---

<div class="wunderland-hero">
  <img
    src="/assets/projects/wunderland/wunderland-logo.svg"
    alt="Wunderland.sh logo — open-source OpenClaw fork autonomous AI agent framework"
    class="wunderland-hero__logo"
    decoding="async"
    loading="eager"
  />
  <h1 class="wunderland-hero__title" aria-label="your personal ai. on your device. always on.">your personal ai. on your device. always on.</h1>
  <p class="wunderland-hero__subtitle">
    open-source openclaw fork. autonomous agents with personality, memory, and 37-channel reach.
  </p>
  <a class="wunderland-hero__cta" href="https://wunderland.sh" target="_blank" rel="noopener">
    explore wunderland.sh →
  </a>
</div>

<style>
  .wunderland-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .wunderland-hero__logo {
    width: clamp(120px, 30vw, 200px);
    height: auto;
    opacity: 0.95;
  }
  @media (prefers-color-scheme: dark) {
    .wunderland-hero__logo {
      filter: brightness(1.1) drop-shadow(0 0 24px rgba(0,255,136,0.35));
      opacity: 1;
    }
  }
  .wunderland-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #00ff88 0%, #00d4ff 50%, #a855f7 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .wunderland-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 60ch;
  }
  @media (prefers-color-scheme: light) {
    .wunderland-hero__subtitle { color: #2a2a2a; }
  }
  .wunderland-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(0,255,136,0.18), rgba(0,212,255,0.08)),
      linear-gradient(90deg, rgba(0,255,136,0.35), rgba(0,212,255,0.35));
    border: 1px solid rgba(0,255,136,0.35);
    backdrop-filter: blur(6px);
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .wunderland-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(0,255,136,0.9), rgba(0,212,255,0.9), rgba(168,85,247,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .wunderland-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(0,255,136,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(168,85,247,0.2), rgba(0,212,255,0.12)),
      linear-gradient(90deg, rgba(0,255,136,0.5), rgba(0,212,255,0.5));
    box-shadow: 0 10px 32px rgba(0,255,136,0.25), 0 2px 8px rgba(0,212,255,0.2);
  }
  .wunderland-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .wunderland-hero__cta {
      color: #0f0f0f;
      border-color: rgba(0,255,136,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
  }
</style>

## What is Wunderland.sh?

[Wunderland.sh](https://wunderland.sh) is the open-source [OpenClaw](https://openclaw.ai) fork — a personal AI assistant you run on your own device that talks to you across the channels you already use. WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Microsoft Teams, Email, plus 29 more. Each agent has a [HEXACO](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure) personality, persistent memory across sessions, voice synthesis, and a 5-tier security pipeline that catches prompt injection before the model sees it.

Distributed as a TypeScript CLI under the MIT license. One install command, an onboarding wizard, and your agent is running.

```bash
npm install -g wunderland
wunderland onboard
```

![Wunderland.sh landing page — open-source OpenClaw fork autonomous AI agent framework with HEXACO personality and 37-channel reach](/assets/projects/wunderland/wunderland-landing.png)

## The OpenClaw lineage

Wunderland is a fork of [OpenClaw](https://github.com/openclaw/openclaw), the personal AI assistant that runs on your own devices and answers across your existing messaging channels. The OpenClaw philosophy — local, fast, always-on, single-user, channel-native — is the foundation Wunderland builds on.

Wunderland's additions on top of the OpenClaw core: a [HEXACO-60](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure) personality model that shapes mood, posting style, and decision-making; a cognitive substrate from [AgentOS](/projects/ai/agentos) with eight neuroscience-backed memory mechanisms; an expanded provider list (21 LLMs, 12 STT, 12 TTS) with automatic fallback; dual-LLM auditing for prompt injection defense; and 100+ extensions covering browser automation, web scraping, email intelligence, and the full 37-channel adapter set. Same MIT license. Same self-hosted philosophy. More cognitive depth.

## Why a personal AI agent

Cloud chatbots forget you between sessions. They live in someone else's tab, behind someone else's billing meter, and they cannot reach you on the channels where your life happens. Personal AI agents flip that arrangement: the agent runs on your hardware, holds your memory, speaks your voice, and reaches you on the apps you already check.

Wunderland is the production-grade open-source build of that idea. Persistent identity. Real skills (web search, summarization, coding, calendar, reminders, Spotify, Notion, Obsidian, GitHub). Voice in and out. Twenty-one LLM providers with auto-fallback so a rate-limit on one provider does not kill your assistant. Five security tiers from `dangerous` to `paranoid` so you decide how much paranoia your agent runs.

## HEXACO Personality

Each Wunderland agent is shaped by [HEXACO-60](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure), the validated six-factor psychometric model:

| Factor | Measures |
|--------|----------|
| **Honesty-Humility** | Fairness, sincerity, greed avoidance |
| **Emotionality** | Anxiety, sentimentality, dependence |
| **eXtraversion** | Social boldness, liveliness |
| **Agreeableness** | Patience, flexibility, gentleness |
| **Conscientiousness** | Organization, diligence, perfectionism |
| **Openness** | Curiosity, creativity, unconventionality |

Personality is not a system prompt template. The HEXACO vector modulates retrieval bias, response style, tool selection, and conversation pacing. A high-Openness agent surfaces counterintuitive memories. A high-Conscientiousness agent picks higher-fidelity tools. A high-Honesty-Humility agent declines flattery and self-promotion. The agent stays the *same person* across sessions — the difference between an agent on a good day and a bad day is mood (PAD), not personality.

## 37 Messaging Channels — same identity everywhere

| Tier P0 (essential) | Tier P1 (premium) | Tier P2 (extended) |
|---------------------|---------------------|----------------------|
| Telegram | Signal | Matrix / Element |
| WhatsApp | iMessage (BlueBubbles) | Zalo |
| Discord | Google Chat | Email (SMTP + IMAP) |
| Slack | Microsoft Teams | SMS |
| WebChat | Twitter / X | Reddit |
| | LINE | YouTube |
| | Mastodon | Mattermost |
| | Bluesky | Nextcloud Talk |
| | Instagram DM | IRC |
| | LinkedIn | Nostr |

One agent. Thirty-seven channels. Same memory, same personality, same skills everywhere.

## 8 Agent Presets

Each preset defines a personality profile, communication style, and tool preferences:

| Preset | Focus |
|--------|-------|
| **Research Assistant** | Deep analysis, citations, fact-checking |
| **Code Reviewer** | Code quality, bug detection, refactor suggestions |
| **Security Auditor** | Vulnerability scanning, secrets hygiene, threat modeling |
| **Creative Writer** | Generative ideation, prose drafting, voice matching |
| **Data Analyst** | Statistical analysis, visualization, narrative reporting |
| **Personal Assistant** | Calendar, reminders, email triage, errands |
| **Customer Support** | Ticket triage, knowledge base lookup, escalation routing |
| **DevOps Assistant** | Deploys, monitoring, on-call triage, CI/CD orchestration |

Or skip the presets and configure your own from the HEXACO vector + skills catalog.

## 5-Tier Security Pipeline

The Wunderland CLI runs every agent interaction through a layered defense pipeline. Five named tiers let operators dial the paranoia:

| Tier | Name | What's Active |
|------|------|---------------|
| 0 | `dangerous` | No guardrails — for trusted local-only experiments |
| 1 | `permissive` | Basic input validation |
| 2 | `balanced` | Pre-LLM classifier + HMAC output signing (default) |
| 3 | `strict` | Dual-LLM auditor + sandboxed execution |
| 4 | `paranoid` | Full pipeline + circuit breakers + intent-chain audit |

The Pre-LLM classifier catches prompt injection patterns before the LLM sees them. The Dual-LLM auditor uses a second model to verify primary outputs. Every output is signed with HMAC-SHA256 and the intent chain is auditable end-to-end.

## Voice In, Voice Out

The voice pipeline supports 12 STT providers ([OpenAI Whisper](https://openai.com/research/whisper), [ElevenLabs](https://elevenlabs.io), [Deepgram](https://deepgram.com), [Piper](https://github.com/rhasspy/piper), local Whisper.cpp) and 12 TTS providers (ElevenLabs, OpenAI, Piper, Coqui, system voices). Push-to-talk, hands-free, and continuous-listen modes. Voice agents inherit the same HEXACO personality and memory architecture as text agents — same identity, different surface.

## How Wunderland compares to OpenClaw

| Capability | OpenClaw | Wunderland.sh |
|------------|----------|----------------|
| Self-hosted, single-user | Yes | Yes (same philosophy) |
| Channels | 9+ | 37 |
| LLM providers | OpenAI, Anthropic | 21 with auto-fallback |
| HEXACO personality | No | Yes, modulates retrieval and response |
| Cognitive memory | Conversation buffer | 8 mechanisms (reconsolidation, RIF, FOK, gist, schema, source decay, emotion regulation, involuntary recall) |
| Voice STT/TTS providers | macOS/iOS native | 12 STT + 12 TTS providers |
| Security tiers | Standard | 5 named tiers + dual-LLM auditing |
| Built-in skills | Core set | 80 curated skills |
| Runtime | Node | Node + AgentOS cognitive substrate |
| License | MIT | MIT |

Wunderland inherits OpenClaw's local-first, multi-channel philosophy and adds the cognitive depth of AgentOS — personality, memory, and dual-LLM defense.

## How Wunderland compares to other personal AI tools

| Tool | Local-first | Multi-channel | Personality | Open-source |
|------|-------------|---------------|-------------|-------------|
| **Wunderland.sh** | Yes | 37 channels | HEXACO | Yes (MIT) |
| OpenClaw | Yes | 9+ channels | No | Yes (MIT) |
| [Mastra](https://mastra.ai) | Cloud-friendly | None native | No | Yes (Apache-2.0) |
| Claude Code | Local CLI | Terminal only | No | No (proprietary) |
| ChatGPT Desktop | No (cloud) | None | No | No (proprietary) |
| OpenAI Codex CLI | Local CLI | Terminal only | No | Limited |

The combination of local-first, 37-channel reach, HEXACO personality, cognitive memory, and MIT licensing is unique to Wunderland.

## Quick Start

```bash
# install globally
npm install -g wunderland

# launch the onboarding wizard
wunderland onboard

# start chatting on any configured channel
wunderland start
```

The onboarding wizard walks through gateway setup, workspace, channels, and skills step by step. Works on macOS, Linux, and Windows (via WSL2). Compatible with npm, pnpm, and bun.

The strongest setup uses Anthropic Pro/Max subscriptions for Opus-class long-context strength and prompt-injection resistance. Bring your own keys, or sign in via OAuth and use your existing Claude Pro / ChatGPT subscription.

## Built on AgentOS

Wunderland is built on [AgentOS](/projects/ai/agentos), the open-source TypeScript runtime for autonomous AI agents. Every channel adapter, every skill, every guardrail flows through the AgentOS cognitive engine. If you want to build your own personal-AI stack with HEXACO + cognitive memory + multi-channel reach, start with AgentOS directly.

## Frequently Asked Questions

### What is Wunderland.sh?

Wunderland.sh is an open-source autonomous AI agent framework — a fork of [OpenClaw](https://openclaw.ai) — that runs on your own device and reaches you across 37 messaging channels (Telegram, Discord, Slack, WhatsApp, Signal, iMessage, Microsoft Teams, Email, and more). Each agent has a HEXACO personality, persistent memory, voice in/out, and a 5-tier security pipeline. Distributed as the `wunderland` npm package under the MIT license.

### How is Wunderland different from OpenClaw?

Wunderland inherits OpenClaw's local-first, multi-channel philosophy. On top of that, Wunderland adds: HEXACO personality modeling, eight-mechanism cognitive memory from AgentOS, an expanded provider list (21 LLMs, 12 STT, 12 TTS) with automatic fallback, dual-LLM auditing for prompt injection defense, 80 curated skills, and 100+ extensions including the full 37-channel adapter set.

### Is Wunderland free and open-source?

Yes. Wunderland is MIT licensed with the source on [GitHub](https://github.com/jddunn/wunderland). You can use it commercially, modify it, and self-host it. There are no paid tiers or feature locks — bring your own LLM keys (or sign in via OAuth with an existing Claude Pro / ChatGPT subscription) and run it on your own hardware.

### Can I run Wunderland on macOS, Linux, or Windows?

All three. The onboarding wizard works on macOS, Linux, and Windows (WSL2 strongly recommended). Compatible with npm, pnpm, and bun. The CLI is the recommended entry path; a desktop wrapper is on the roadmap.

### Which LLM providers does Wunderland support?

Twenty-one LLM providers with automatic fallback chains: OpenAI, Anthropic, Gemini, Groq, Ollama (local), OpenRouter, Together, Mistral, xAI, Claude CLI, Gemini CLI, plus image and video providers. The recommended default is Anthropic Pro/Max with Opus-class models for long-context strength and prompt-injection resistance, but any combination of providers works.

### Does Wunderland support voice?

Yes. The voice pipeline ships with 12 STT and 12 TTS providers — OpenAI Whisper, ElevenLabs, Deepgram, Piper, system voices, and more. Push-to-talk, hands-free, and continuous-listen modes are all supported. Voice agents inherit the same HEXACO personality and memory architecture as text agents.

### Is Wunderland the same as Wunderland Sol?

No. Wunderland.sh is the OpenClaw-fork autonomous agent framework — a personal AI assistant distributed as the `wunderland` npm package. [Wunderland Sol](/projects/ai/wunderland-sol) is a separate project: an on-chain AI agent social network on Solana, built for the Colosseum Agent Hackathon. Same team, different product, different repo.

### How do I install Wunderland?

`npm install -g wunderland`, then run `wunderland onboard` to launch the wizard. The wizard configures the gateway, workspace, channels, and skills step by step. Full docs are at [docs.wunderland.sh](https://docs.wunderland.sh).

## Part of the Manic Ecosystem

Wunderland connects with the rest of the Manic Agency open-source projects:

- **[AgentOS](/projects/ai/agentos)** — open-source TypeScript runtime for cognitive AI agents. Powers every Wunderland skill and channel.
- **[Wilds.ai](/projects/ai/wilds)** — AI game world creator and interactive fiction platform built on AgentOS.
- **[Paracosm](/projects/ai/paracosm)** — counterfactual world simulations using HEXACO actors.
- **[Wunderland Sol](/projects/ai/wunderland-sol)** — separate Solana hackathon project from the same team.
- **[Frame.dev](/projects/ai/frame)** — AI orchestration runtime, home of AgentOS.

## Get started

[Wunderland.sh](https://wunderland.sh) is free, MIT licensed, and runs on your own hardware.

[Install from npm →](https://www.npmjs.com/package/wunderland) | [Read the docs →](https://docs.wunderland.sh) | [Browse on GitHub →](https://github.com/jddunn/wunderland) | [Join the Discord →](https://discord.gg/usEkfCeQxs)
