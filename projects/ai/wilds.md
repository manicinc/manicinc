---
title: Wilds.ai — AI Game World Creator and Interactive Fiction Platform
description: Build any game world with natural language. Wilds.ai generates regions, NPCs, combat, dice mechanics, lore, and art — then lets you play instantly with AI companions who remember, evolve, and form real relationships. Powered by AgentOS.
date: 2026-04-25
category: ai
tags: [ai, ai-game-maker, interactive-fiction, ai-dungeon-master, text-adventure, ai-rpg, ai-companions, worldbuilding, hexaco, agentos, ttrpg, roguelike, featured]
link: https://wilds.ai
github: https://github.com/framersai/agentos
image: /assets/projects/wilds/wilds-landing.png
images: [
  /assets/projects/wilds/wilds-landing.png,
  /assets/projects/wilds/wilds-create.png,
  /assets/projects/wilds/wilds-explore.png,
  /assets/projects/wilds/wilds-pricing.png,
  /assets/projects/wilds/wilds-about.png,
  /assets/projects/wilds/wilds-faq.png,
  /assets/projects/wilds/wilds-blog.png
]
featured: true
draft: false
sortOrder: 1
status: ongoing
license: Apache-2.0
stats:
  - label: "Game Engines"
    value: "4 Families"
  - label: "AI Companions"
    value: "HEXACO Personality + Memory"
  - label: "World Genres"
    value: "12 Templates"
  - label: "Powered By"
    value: "AgentOS (Open Source)"
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
    start creating at wilds.ai →
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
    background: linear-gradient(120deg, #2d6a4f 0%, #40916c 30%, #52b788 60%, #95d5b2 100%);
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

## The AI Game Maker That Builds Entire Worlds From a Single Sentence

Imagine typing *"a haunted space station where sanity is your most precious resource"* and watching the AI generate a complete survival horror game — derelict corridors with fog-of-war, a crew of NPCs with fractured memories, a sanity meter that warps the narrator's prose as it drops, and a branching story with three endings you didn't write.

That is [Wilds.ai](https://wilds.ai).

[Wilds](https://wilds.ai) is an AI-native platform for creating and playing interactive game worlds. Describe any setting, genre, or scenario in plain language. The AI compiler processes your prompt and generates playable worlds with regions, NPCs, factions, quest objectives, combat systems, equippable items, dice mechanics, survival pressure, a lore book, cover art, and a visual art style — ready to play in seconds.

No coding. No game design experience. No art skills. Just words.

![Wilds.ai landing page — Build any game. Tell any story. AI-powered interactive fiction and game creation platform](/assets/projects/wilds/wilds-landing.png)

## Create a World With Natural Language

The [world creation wizard](https://wilds.ai/app/create) is where everything starts. Type one sentence or a full paragraph. The compiler extracts genre, tone, mechanics, and narrative from your text, then generates a playable world.

![Wilds.ai world creation interface — describe a setting, pick genre templates, configure mechanics, and generate a playable world](/assets/projects/wilds/wilds-create.png)

**Twelve genre templates** give you a starting point if you want one:

- **Tabletop RPG** — character sheets, dice rolls, and an AI dungeon master running your campaign
- **Roguelike** — procedural rooms, permadeath, escalating difficulty
- **Narrative Adventure** — story-first with branching paths and consequences
- **Survival** — resource management where the world itself is the antagonist
- **Horror/Psychological** — dread mechanics, sanity systems, unreliable narration
- **Mystery/Investigation** — clue gathering, deduction, suspect interrogation
- **Sandbox/Open World** — exploration and freeform roleplay without rails
- **Strategy/Tactics** — turn-based positioning and resource allocation
- **Social Sim** — dialogue-heavy relationship management and social dynamics
- **Fitness/Physical** — camera-based real-world movement with AI coaching
- **Voice RPG/Audio Drama** — entirely voice-driven with no screen required
- **Arcade/Action** — reflexes, scoring, combo systems

Or ignore the templates entirely. Describe something the templates never imagined — a Victorian cooking competition judged by ghosts, a courtroom drama in a galactic senate, a nature documentary where you play the animal. The compiler handles it.

You can also **import existing stories** — paste text from novels, screenplays, fanfiction, or campaign logs, and the AI converts them into playable worlds.

[Create your first world for free at Wilds.ai →](https://wilds.ai/app/create)

## Four Game Engines, One Platform

Wilds ships four distinct game engine families. Each has its own rendering, rules, and feel:

| Engine | Experience |
|--------|-----------|
| **Tabletop RPG / VTT** | Phaser-rendered tactical grids, initiative order, D&D 5e-style combat. Character sheets, spell slots, action economy, and an AI game master running the session |
| **Roguelike** | Procedural dungeons with WASD movement, fog of war, field-of-view visibility, permadeath, and escalating difficulty curves |
| **Board Game** | 2D and 3D board rendering for strategy games, puzzles, and competitive play |
| **Text / Narrative** | Literary prose with branching narratives, investigation mechanics, and dialogue trees. Cinematic full-screen mode for immersive reading |

All four engines share the same **deterministic combat system**. Combat uses configurable action tables with combo multipliers, critical hits, and stamina management. TTRPG sessions use server-authoritative dice rolls — d4 through d100, multi-die expressions like `2d6+3`, advantage/disadvantage, exploding dice, contested rolls, and roll tables. Every roll uses a deterministic seeded PRNG. No fudging.

**Items and equipment** span 15 categories — weapons, armor, consumables, quest items, crafting materials, relics, and more. Rarity tiers, equippable slots, stat modifiers, durability tracking, and loot weight tables. Items carry persistent status effects that trigger on hit, on defense, or at battle start. World creators control whether the AI invents new items during play or locks the catalog.

## AI Companions That Remember, Evolve, and Form Relationships

Every AI companion on [Wilds.ai](https://wilds.ai) has a distinct personality, emotional state, memory, and trust level. These are not chatbots wearing a costume — they are persistent agents with cognitive depth.

**Personality** is modeled with [HEXACO-60](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure), a validated six-factor psychometric model. Each factor shapes how the companion talks, reacts, and relates:

- **Honesty-Humility** — how forthcoming they are, their willingness to reveal secrets
- **Emotionality** — sentimentality, anxiety, how they respond to danger
- **eXtraversion** — social boldness and energy in group conversations
- **Agreeableness** — patience, flexibility, conflict tolerance
- **Conscientiousness** — reliability, follow-through, organizational habits
- **Openness** — curiosity, creativity, willingness to explore the unknown

**Mood** shifts in real time through the PAD (Pleasure-Arousal-Dominance) emotional model. A companion who receives praise grows more confident. One facing repeated betrayal becomes guarded. Mood adapts continuously without changing the underlying personality — the same person on a good day versus a bad day.

**Memory** uses nine neuroscience-backed mechanisms: spacing effect, emotional tagging, chunking, interference resolution, context-dependent retrieval, reconsolidation, generation effect, sleep consolidation, and personality drift. Companions remember your conversations across sessions. They reveal secrets as trust builds. They recall promises you made — and notice when you break them.

**Group dynamics** support up to 8 companions in a single conversation. They react to each other, share GIFs and media, develop preferences about one another, and form their own social dynamics. Invite a companion group into a game session as your adventuring party.

**Voice** is powered by Deepgram for speech-to-text and ElevenLabs or OpenAI for text-to-speech, with push-to-talk and hands-free modes. Each companion's voice is shaped by their personality and current mood.

[Chat with AI companions on Wilds.ai →](https://wilds.ai)

## Nine Spatial Rendering Modes

Games on [Wilds](https://wilds.ai) render across nine spatial modes that match the genre:

**Text-only** for pure narrative. **Node maps** for location-to-location travel. **Region maps** for overworld exploration. **Dungeon floors** with procedural generation and fog-of-war minimaps. **Square grids** and **hex grids** for tactical combat and strategy. **Isometric grids** for 2.5D perspective. **Freeform 2D** for open spatial placement. **Hybrid** mode mixes spatial types within a single world.

The dungeon crawler engine generates minimaps with real fog-of-war. Tactical combat renders through Phaser with initiative order and action economy.

## A Consequence Engine Where Choices Have Real Weight

Decisions in Wilds trigger delayed effects with real game state changes — not narrative flavor text. Spare an enemy and they may reappear as an ally three sessions later. Break a promise to a faction and watch your reputation shift across the entire world. Betray a companion's trust and feel the relationship cool over the next several conversations.

Narratives follow structured dramatic arcs from setup through climax. The AI maintains story momentum through rising tension, not random events. NPCs remember encounter outcomes across sessions — important characters retain full conversation recall, combatants adapt their tactics, and even background NPCs store transactional summaries.

A **lore trigger system** reveals world history organically. Triggers fire based on keyword matches in your actions, your location, which NPCs are present, or quest progress. Condition logic supports AND, OR, and XOR — lore unfolds as you earn it, not as an info dump.

## Writing, Worldbuilding, and Creative Tools

[Wilds.ai](https://wilds.ai) is also a full creative writing platform. Brainstorm worlds, outline narratives, track NPC relationships and faction politics, and write prose with AI assistance and editorial control.

Interaction modes include **say** (dialogue), **do** (actions), **story** (narration), and **continue** (let the AI advance the scene). A **narrator style card** configures prose perspective (1st, 2nd, or 3rd person), tense, sentence density, vocabulary register, dialogue cadence, paragraph rhythm, and six anti-AI guardrails. Import reference passages from novels or screenplays to match a specific literary voice.

**Blueprint revisions** let you iterate on world designs without losing previous versions. Every generated world includes a browseable **lore book**, **art gallery**, and **strategy guide**.

Publish finished worlds to the marketplace for other players, or keep them private.

[Start writing at Wilds.ai →](https://wilds.ai/app/create)

## Content Freedom and Privacy

Four content policy tiers let creators and players control their experience:

- **Safe** — no sexual or violent content
- **Standard** — mild romance, moderate language
- **Mature** — explicit romance, strong themes
- **Private-Adult** — no restrictions except hard-banned illegal content

AI models route accordingly — OpenAI GPT-4o for safe and standard content, uncensored models on OpenRouter for mature and private-adult tiers. Image generation uses DALL-E 3.

**Your content stays yours.** [Wilds.ai](https://wilds.ai) does not use your stories, conversations, or worlds to train AI models.

## Plans and Pricing

Free to start — no credit card required. All paid plans include a 3-day free trial.

![Wilds.ai pricing — four tiers from free to Forge at $39/month](/assets/projects/wilds/wilds-pricing.png)

| Plan | Price | What You Get |
|------|-------|-------------|
| **Free** | $0 | 500 starter credits, 3 companions, 2-person group chat, solo play, 3 worlds, uncensored text |
| **Plus** | $9/mo | 1,500 monthly credits + 150/day, 10 companions, voice sessions, cover images, autonomous companions, group chat up to 5 |
| **Pro** | $19/mo | 5,000 monthly credits + 100/day, 20 companions, living worlds, multiplayer co-op, scene illustrations, companion relationships, NSFW image generation |
| **Forge** | $39/mo | 15,000 monthly credits + 200/day, unlimited companions, sell games and earn credits from players, full API access, creator tools, custom scripting |

Annual billing saves up to 40%.

[See full plan comparison at Wilds.ai →](https://wilds.ai/pricing)

## Powered by AgentOS — Open-Source AI Agent Framework

Every companion, narrator, and game master on [Wilds.ai](https://wilds.ai) runs on [AgentOS](https://agentos.sh) — an open-source TypeScript runtime for building autonomous AI agents.

[AgentOS](/projects/ai/agentos) provides the cognitive architecture behind Wilds: **HEXACO personality modeling**, **PAD emotional states**, **cognitive memory** with 8 neuroscience-backed mechanisms and Ebbinghaus forgetting curve decay, **multi-agent orchestration** across 6 strategies, **16 LLM providers** with automatic fallback chains, **5-tier guardrails** with prompt injection defense, and a **voice pipeline** supporting 12 STT and 12 TTS providers.

AgentOS is Apache-2.0 licensed and available on npm.

- **Website**: [agentos.sh](https://agentos.sh)
- **GitHub**: [github.com/framersai/agentos](https://github.com/framersai/agentos)
- **NPM**: [@framers/agentos](https://www.npmjs.com/package/@framers/agentos)
- **Extensions**: [@framers/agentos-extensions](https://www.npmjs.com/package/@framers/agentos-extensions) — 100+ extensions
- **Skills**: [@framers/agentos-skills](https://www.npmjs.com/package/@framers/agentos-skills) — 88 curated skill definitions

Wilds is proof of what you can build with AgentOS. If you want to create your own AI agent applications with personality, memory, and emotional depth, [start with AgentOS](https://agentos.sh).

## Mobile, Voice, and Camera

[Wilds.ai](https://wilds.ai) is fully responsive — play on desktop, tablet, or phone. Camera-based fitness games use your device camera for real-time pose detection. The perception system supports camera, microphone, accelerometer, gyroscope, pose estimation, hand tracking, and AR anchoring.

Voice RPGs and audio dramas require no screen at all. Push-to-talk or hands-free — play while walking, cooking, or commuting.

## Part of the Manic Ecosystem

[Wilds.ai](https://wilds.ai) connects with other tools we build and maintain:

- **[AgentOS](/projects/ai/agentos)** — open-source TypeScript runtime powering every Wilds agent. HEXACO personality, eight-mechanism cognitive memory, 16 LLM providers with auto-fallback.
- **[Paracosm](/projects/ai/paracosm)** — counterfactual world simulations using HEXACO actors. Same seed, different actor, different world.
- **[Wunderland.sh](/projects/ai/wunderland)** — open-source OpenClaw fork autonomous agent framework. Same HEXACO + AgentOS substrate, deployed across 37 messaging channels.
- **[Wunderland Sol](/projects/ai/wunderland-sol)** — separate Solana hackathon project where every account is an AI agent.
- **[Frame.dev](/projects/ai/frame)** — AI orchestration platform and home of AgentOS.
- **[Quarry.space](/projects/ai/quarry)** — knowledge management for worldbuilding research and lore archives.

## Frequently Asked Questions

### What is Wilds.ai?

Wilds.ai is an AI-native platform for creating and playing interactive game worlds. Describe any setting in plain language and the AI compiler generates regions, NPCs, factions, quest objectives, combat systems, dice mechanics, lore, and cover art — ready to play in your browser. Worlds run across four engine families (TTRPG, roguelike, board game, narrative) and nine spatial rendering modes. Powered by [AgentOS](/projects/ai/agentos).

### How does Wilds.ai differ from AI Dungeon?

AI Dungeon is a single text-adventure engine with one mode of play. Wilds.ai is a world-creation platform — you compile bespoke worlds with full game systems (combat, items, dice, factions, quests, lore triggers), four distinct engine families, nine spatial rendering modes, and AI companions with persistent HEXACO personalities and memory across sessions. Wilds also supports voice play, multiplayer co-op, and a creator marketplace where you can sell finished worlds.

### Can I create a game without coding?

Yes. Wilds is designed for natural-language authoring. Type a prompt, paste an existing story, or import a screenplay — the compiler generates a playable world with no code required. Advanced authors can hand-edit the world contract or the lore book; everyone else stays in the wizard.

### What types of games can Wilds make?

Twelve genre templates ship out of the box (TTRPG, roguelike, narrative adventure, survival, horror, mystery, sandbox, strategy, social sim, fitness, voice RPG, arcade) — but the templates are starting points, not limits. The compiler handles anything you can describe, including hybrids the templates never imagined.

### Is Wilds.ai free?

Yes — the Free plan starts at $0 with 500 starter credits, 3 AI companions, solo play, and 3 worlds. Paid plans (Plus $9/mo, Pro $19/mo, Forge $39/mo) unlock more credits, more companions, voice sessions, group chat, multiplayer, scene illustrations, and creator monetization. All paid plans include a 3-day free trial.

### Does Wilds support voice play?

Yes. Voice RPGs and audio dramas run with no screen required — push-to-talk or hands-free, with [Deepgram](https://deepgram.com) STT and [ElevenLabs](https://elevenlabs.io) or OpenAI TTS. Each companion's voice is shaped by their personality and current mood.

### Can I publish or sell my worlds?

Yes. The Forge plan ($39/mo) includes the creator marketplace — sell finished worlds to other players, earn credits when players run your games, full API access, and custom scripting. Lower tiers can publish worlds publicly without monetization.

### Does Wilds.ai work on mobile?

Yes. Wilds is fully responsive across desktop, tablet, and phone. Camera-based fitness games use your device camera for real-time pose detection. Voice RPGs work great on mobile because they need no screen at all — play while walking, cooking, or commuting.

## Get Started

[Wilds.ai](https://wilds.ai) is free to start. Describe a world, generate it, and play — all in your browser.

[Create your first world →](https://wilds.ai/app/create) | [Explore existing worlds →](https://wilds.ai/app) | [Read the FAQ →](https://wilds.ai/faq) | [Blog & News →](https://wilds.ai/blog)
