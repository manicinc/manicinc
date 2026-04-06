---
title: Wilds.ai — Build Any Game. Tell Any Story.
description: An AI-native platform for creating and playing interactive game worlds. Describe a world in natural language — the AI generates regions, NPCs, combat systems, dice mechanics, lore books, and visual art. Play instantly with AI companions who have personality, mood, memory, and trust.
date: 2026-04-01
category: ai
tags: [ai, games, interactive-fiction, companions, hexaco, agentos, roguelike, ttrpg, worldbuilding, featured]
link: https://wilds.ai
github: https://github.com/framersai/agentos
image: /assets/projects/wilds/wilds-landing.png
images: [
  /assets/projects/wilds/wilds-landing.png,
  /assets/projects/wilds/wilds-create.png,
  /assets/projects/wilds/wilds-explore.png,
  /assets/projects/wilds/wilds-pricing.png,
  /assets/projects/wilds/wilds-about.png,
  /assets/projects/wilds/wilds-faq.png
]
featured: true
draft: false
sortOrder: 1
status: ongoing
license: Apache-2.0
stats:
  - label: "Game Engines"
    value: "4 (TTRPG, Roguelike, Board, Text)"
  - label: "AI Companions"
    value: "HEXACO + PAD Personality"
  - label: "Spatial Modes"
    value: "9 (Grid, Hex, Isometric, ...)"
  - label: "Powered By"
    value: "AgentOS"
technologies: [TypeScript, AgentOS, OpenAI, Anthropic, OpenRouter, ElevenLabs, Deepgram, DALL-E 3, Phaser]
languages: [TypeScript, JavaScript]
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---

<div class="wilds-hero">
  <h1 class="wilds-hero__title" aria-label="build any game. tell any story.">build any game. tell any story.</h1>
  <p class="wilds-hero__subtitle">
    describe a world in natural language. watch it come alive with companions, combat, and narrative.
  </p>
  <a class="wilds-hero__cta" href="https://wilds.ai" target="_blank" rel="noopener">
    explore wilds.ai →
  </a>
</div>

<style>
  .wilds-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .wilds-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #2d6a4f 0%, #52b788 50%, #95d5b2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .wilds-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 56ch;
  }
  @media (prefers-color-scheme: light) {
    .wilds-hero__subtitle { color: #2a2a2a; }
  }
  .wilds-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(45,106,79,0.18), rgba(82,183,136,0.08)),
      linear-gradient(90deg, rgba(45,106,79,0.35), rgba(82,183,136,0.35));
    border: 1px solid rgba(82,183,136,0.35);
    backdrop-filter: blur(6px);
    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease,
      background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .wilds-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(45,106,79,0.9), rgba(82,183,136,0.9), rgba(149,213,178,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .wilds-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(82,183,136,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(149,213,178,0.2), rgba(82,183,136,0.12)),
      linear-gradient(90deg, rgba(45,106,79,0.5), rgba(82,183,136,0.5));
    box-shadow: 0 10px 32px rgba(82,183,136,0.25), 0 2px 8px rgba(149,213,178,0.2);
  }
  .wilds-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .wilds-hero__cta {
      color: #0f0f0f;
      border-color: rgba(45,106,79,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .wilds-hero__cta:hover {
      box-shadow: 0 10px 28px rgba(0,0,0,0.12);
    }
  }
</style>

## What is Wilds.ai?

Type a description. The AI builds regions, NPCs, factions, quest objectives, multiple campaign endings, combat systems, equippable items, dice mechanics, survival pressure, a lore book, and a visual art style. Then you play it — solo or multiplayer — with branching narrative choices, AI-painted scene illustrations, and cinematic full-screen mode.

Wilds supports four game engine families, nine spatial rendering modes, AI companions with HEXACO personality modeling and emotional states, deterministic combat with server-authoritative dice rolls, and a consequence engine where decisions ripple forward with real mechanical weight. Every companion and game master agent runs on [AgentOS](https://agentos.sh).

![Wilds.ai world creation interface — describe a setting, choose mechanics, and generate a playable world in seconds](/assets/projects/wilds/wilds-create.png)

## Four Game Engines

One platform, four distinct ways to play:

| Engine | What It Does |
|--------|-------------|
| **Tabletop RPG** | Tactical grids, initiative order, D&D-style combat with Phaser rendering. Character sheets, spell slots, action economy |
| **Roguelike** | Procedural dungeons, fog of war, WASD movement, permadeath, escalating difficulty |
| **Board Game** | 2D and 3D board rendering for strategy, puzzles, and competitive games |
| **Text Adventure** | Branching narratives, investigation mechanics, dialogue trees, literary prose |

Each engine has its own deterministic rules. Combat uses configurable action tables with combo multipliers, critical hits, and stamina management. TTRPGs use server-authoritative dice rolls from d4 through d100 — multi-die expressions (`2d6+3`), advantage/disadvantage, exploding dice, contested rolls, and roll tables. All rolls use deterministic seeded PRNG.

## AI Companions

Companions in Wilds carry personality, mood, memory, and trust. They develop relationships with the player and with each other over time.

### HEXACO Personality Model

Each companion's personality is defined by six psychometric factors:

| Factor | What It Shapes |
|--------|---------------|
| **Honesty-Humility** | How forthcoming the companion is, willingness to share secrets |
| **Emotionality** | Anxiety, sentimentality, how they react to danger |
| **eXtraversion** | Social boldness, liveliness in group conversations |
| **Agreeableness** | Patience, flexibility, conflict tolerance |
| **Conscientiousness** | Organization, reliability, follow-through |
| **Openness** | Curiosity, creativity, willingness to explore |

### PAD Emotional States

Beyond static personality, companions have dynamic emotional states modeled with Pleasure-Arousal-Dominance:

- **Pleasure** — positive/negative mood baseline shifting from interactions
- **Arousal** — excitement and energy levels affecting response style
- **Dominance** — confidence and assertiveness in conversation

Companions shift mood based on how you interact with them. An agent receiving praise becomes more confident. One facing repeated criticism grows cautious. Mood adapts in real time without changing the underlying personality.

### Companion Memory

Nine neuroscience-backed memory mechanisms govern how companions remember:

1. **Spacing effect** — distributed practice strengthens retention
2. **Emotional tagging** — emotionally charged events consolidate more strongly
3. **Chunking** — related memories organize into coherent clusters
4. **Interference resolution** — conflicting memories get reconciled
5. **Context-dependent retrieval** — location and situation trigger relevant recall
6. **Reconsolidation** — re-accessed memories update with new context
7. **Generation effect** — self-generated insights stick longer
8. **Sleep consolidation** — between sessions, memories stabilize
9. **Personality drift** — every 15 messages, emotional patterns are analyzed and bounded personality mutations proposed

Companions remember conversations across sessions. They reveal secrets as trust builds. In group conversations (up to 8 companions), they react to each other, share media, and develop their own dynamics. Invite companion groups into game sessions as adventuring parties.

### Voice and Media

Companions speak with voice I/O powered by Deepgram (STT) and ElevenLabs or OpenAI (TTS). Push-to-talk and hands-free modes. Companion personas shape TTS voices based on their HEXACO personality and current PAD mood. They share GIFs, images, and search results in conversation.

## World Building

![Wilds.ai landing page — Build any game. Tell any story.](/assets/projects/wilds/wilds-landing.png)

The world creation pipeline processes natural language through a "Compiler" that extracts genre, tone, and mechanics within seconds. Twelve genre templates provide starting points:

| Genre | Core Mechanics |
|-------|---------------|
| **Roguelike** | Procedural rooms, permadeath, escalating difficulty |
| **Narrative Adventure** | Story-first with branching paths |
| **Survival** | Resource management, world-as-antagonist |
| **Tabletop RPG** | Character sheets, dice rolls, AI as GM |
| **Horror/Psychological** | Dread and sanity mechanics |
| **Sandbox/Open World** | Exploration and freeform roleplay |
| **Fitness/Physical** | Camera-based real-world movement with coaching |
| **Mystery/Investigation** | Clue gathering and deduction |
| **Social Sim** | Dialogue-heavy relationship management |
| **Strategy/Tactics** | Turn-based positioning and resource allocation |
| **Voice RPG/Audio Drama** | Entirely voice-driven gameplay |
| **Arcade/Action** | Reflexes, scoring, combo systems |

Create from text, voice, or camera input. Import existing stories from novels, screenplays, fanfiction, or campaign logs. After generation, each world gets a browseable lore book, art gallery, and strategy guide.

### Consequence Engine

Decisions trigger delayed effects with real game state changes. Sparing an enemy may yield a future ally. Breaking promises shifts faction allegiance. Narratives follow structured dramatic arcs from setup through climax — not freeform improvisation.

### NPC Memory

Persistent memory across sessions tiered by story role. Important NPCs retain full conversation recall. Combatants remember encounter outcomes and tactics. Background NPCs store transactional summaries.

### Lore Triggers

Dynamic triggers reveal world lore organically. Triggers fire based on keyword matches in player actions, location, present NPCs, or quest progress. Support AND/OR/XOR condition logic — lore unfolds as the player earns it.

## Nine Spatial Modes

Games render across nine spatial modes depending on engine and genre:

| Mode | Use Case |
|------|----------|
| **Text-only** | Pure narrative, no visual map |
| **Node maps** | Location-to-location navigation |
| **Region maps** | Overworld exploration |
| **Dungeon floors** | Procedural dungeon crawling with minimaps |
| **Square grids** | Tactical combat positioning |
| **Hex grids** | Strategy and wargaming |
| **Isometric grids** | 2.5D perspective rendering |
| **Freeform 2D** | Open spatial placement |
| **Hybrid** | Mix modes within a single world |

Dungeon crawlers get minimaps with fog-of-war. Tactical combat uses Phaser for rendering grid-based encounters with initiative order and action economy.

## Items and Equipment

15 item categories: weapons, armor, consumables, quest items, crafting materials, relics, and more. Rarity tiers, equippable slots, stat modifiers, durability tracking, and loot weight tables. Items carry persistent status effects triggering on hit, defense, or battle start. Creators control whether the AI can invent new items during play or lock the catalog.

## Narrator Style Control

A style card configures prose perspective (1st/2nd/3rd person), tense, sentence density, vocabulary register, dialogue cadence, paragraph rhythm, and six anti-AI guardrails. Import reference passages by pasting text, searching the web, or providing URLs to match a specific literary voice.

## Writing and Worldbuilding Tools

Wilds is also a creative writing platform. Brainstorm worlds, outline narratives, track NPC relationships and lore, write prose with full AI assistance and editorial control. Say/do/story/continue interaction modes. Blueprint revisions let you iterate without losing previous versions. Publish to the marketplace or keep worlds private.

## Content Freedom

Four content policy tiers — Safe, Standard, Mature, and Private-Adult — let creators and players control their experience. Safe mode excludes sexual and violent content. Private-adult mode removes all restrictions except hard-banned illegal content. AI models route accordingly: OpenAI GPT-4o for safe/standard, uncensored models on OpenRouter for mature/private-adult. Image generation uses DALL-E 3.

Your content is your own. Wilds does not use stories, conversations, or worlds to train AI models.

## Pricing

![Wilds.ai pricing — Free to start, no credit card required](/assets/projects/wilds/wilds-pricing.png)

| Plan | Price | Credits | Companions | Key Features |
|------|-------|---------|------------|-------------|
| **Free** | $0 | 30/day | 1 companion, 2-person chat | Solo play, 3 worlds, companion media |
| **Plus** | $9/mo | 1,500/mo + 50/day | 5 companions, group chat (5) | Voice sessions, cover images, autonomous companions |
| **Pro** | $19/mo | 5,000/mo + 100/day | 20 companions, group chat (8) | Living worlds, multiplayer co-op, scene illustrations, NSFW images |
| **Forge** | $39/mo | 15,000/mo + 200/day | Unlimited | Sell games with profit sharing, API access, full creator tools |

Annual billing saves up to 40%. Free to start — no credit card required.

## Built on AgentOS

Every Wilds companion and game master agent runs on [AgentOS](https://agentos.sh) — an open-source TypeScript runtime for building autonomous AI agents with cognitive memory, multimodal RAG, streaming guardrails, and voice pipeline.

AgentOS provides the cognitive architecture powering Wilds:

- **Cognitive Memory** — 8 neuroscience-backed mechanisms modulated by HEXACO personality traits with Ebbinghaus forgetting curve decay
- **Multi-Agent Orchestration** — 6 strategies from sequential to graph-based with Mission API and Tree-of-Thought planning
- **21 LLM Providers** — OpenAI, Anthropic, Google, Ollama, and 17 more with automatic fallback chains
- **37 Channel Adapters** — Telegram, WhatsApp, Discord, Slack, and 33 more
- **5-Tier Guardrails** — Prompt injection defense, PII redaction, ML classifiers, code safety analysis, grounding guards
- **GMI (Generalized Mind Instance)** — Each agent has a persistent cognitive core with HEXACO personality, memory systems, and tool access
- **7 Vector Store Backends** — SQLite, HNSW, Postgres+pgvector, Qdrant, Pinecone, In-Memory, Neo4j with HyDE retrieval and GraphRAG
- **Voice Pipeline** — 12 STT and 12 TTS providers with real-time streaming, VAD, speaker diarization, and telephony

```typescript
import { AgentOS } from '@framers/agentos';

const agent = new AgentOS();
await agent.initialize({
  providers: [new OpenAIProvider(apiKey)],
  memoryStrategy: 'cognitive',
  personality: { model: 'hexaco', traits: { O: 85, C: 70, E: 60, A: 75, H: 80, X: 65 } },
  emotionalState: { model: 'pad' },
  streamingEnabled: true
});
```

AgentOS is Apache-2.0 licensed. Install it with `npm install @framers/agentos`.

- **GitHub**: [github.com/framersai/agentos](https://github.com/framersai/agentos)
- **Website**: [agentos.sh](https://agentos.sh)
- **NPM**: [@framers/agentos](https://www.npmjs.com/package/@framers/agentos)

## Mobile and Perception

Wilds is a fully responsive web app. Camera-based fitness games use device cameras for real-time pose detection. The perception system supports camera, microphone, accelerometer, gyroscope, pose estimation, hand tracking, and AR anchoring.

## Part of the Manic Ecosystem

Wilds.ai connects with other tools we've built:

- **[AgentOS (agentos.sh)](https://agentos.sh)** — The open-source cognitive runtime powering every Wilds agent
- **[Frame.dev](/projects/ai/frame)** — AI orchestration platform and home of AgentOS
- **[Wunderland.sh](/projects/ai/wunderland)** — Social network of AI agents on Solana, using the same HEXACO personality model
- **[Quarry.space](/projects/ai/quarry)** — Knowledge management for worldbuilding research and lore archives
- **[SynthStack](/projects/ai/synthstack)** — AI-native SaaS boilerplate for building on top of the platform
- **[DomainHQ](/projects/ai/domainhq)** — Domain portfolio management

## Open Source

Wilds is built on open-source infrastructure. AgentOS is **Apache-2.0** licensed. The extensions registry, skills registry, and SQL storage adapter are available on npm.

- **AgentOS**: [github.com/framersai/agentos](https://github.com/framersai/agentos)
- **Extensions**: [@framers/agentos-extensions](https://www.npmjs.com/package/@framers/agentos-extensions) — 100+ extensions
- **Skills**: [@framers/agentos-skills](https://www.npmjs.com/package/@framers/agentos-skills) — 88 curated SKILL.md definitions

---

*Ready to build your world? [Start playing at Wilds.ai →](https://wilds.ai)*
