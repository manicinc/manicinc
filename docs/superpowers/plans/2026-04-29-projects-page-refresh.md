# Projects Page Refresh — Implementation Plan

> **For agentic workers:** This plan executes inline (no subagent dispatch — user preference). Steps use checkbox (`- [ ]`) syntax for tracking. Verification replaces TDD where the work is content/CSS rather than logic.

**Goal:** Refresh manicinc.com projects surface — homepage hero shows wilds-ai → paracosm → agentos as top three; reposition wunderland.sh as OpenClaw fork; preserve wunderland-sol Solana content under new slug; drop domainhq from featured; fresh screenshots; SEO-optimized authoritative copy with deep-research citations; fix mobile hamburger alignment.

**Architecture:** Frontmatter-driven sort logic in `src/lib/getAllProjects.ts` and date-desc filter in `src/app/page.tsx` already handle ordering — no code changes needed for ordering. Most work is markdown content authorship, asset capture, and one small CSS fix in `Nav.module.css`.

**Tech Stack:** Next.js, gray-matter (frontmatter parsing), Chrome DevTools MCP (screenshots), ImageMagick or sharp (image processing), Tailwind CSS, deep-research skill (citations).

---

## File structure

### Files to be created

- `projects/ai/agentos.md` — featured, ~1400 words
- `projects/ai/paracosm.md` — featured, ~1200 words
- `projects/ai/wunderland-sol.md` — preserves existing Solana content, unfeatured
- `public/assets/projects/agentos/` (directory) — logo, og-image, screenshots
- `public/assets/projects/paracosm/` (directory) — logo, og-image, screenshots
- `public/assets/projects/wunderland/` — additional OpenClaw-fork-themed screenshots
- `public/assets/projects/wilds/` — refreshed screenshots if existing are stale

### Files to be modified

- `projects/ai/wunderland.md` — fully rewritten as OpenClaw fork (same slug, new content)
- `projects/ai/wilds.md` — bump date to 2026-04-25, add FAQ section, refresh alt text
- `projects/ai/domainhq.md` — set `featured: false`, remove `featured` from tags
- `projects/ai/frame.md` lines ~212-221 — update Wunderland.sh cross-reference text
- `src/components/Nav/Nav.module.css` — mobile hamburger right-edge alignment fix

### Files unchanged but verified

- `src/app/page.tsx` — featured-sort logic (verify output matches spec)
- `src/lib/getAllProjects.ts` — project loader (no changes needed)
- All other project pages and blog posts — out of scope

---

## Phase 1 — Frontmatter changes (verify ordering before writing content)

### Task 1: Unfeature domainhq

**Files:**
- Modify: `projects/ai/domainhq.md` lines 6, 13

- [ ] **Step 1: Read current frontmatter**

Run: `head -15 /Users/johnn/Documents/git/manicinc/projects/ai/domainhq.md`
Expected: see `featured: true` on line 13 and `featured` in the tags array on line 6.

- [ ] **Step 2: Edit frontmatter**

Replace `featured: true` with `featured: false` on line 13. Remove `, featured` from the tags array on line 6 (keep all other tags).

- [ ] **Step 3: Verify**

Run: `grep -E "^featured:|^tags:" /Users/johnn/Documents/git/manicinc/projects/ai/domainhq.md`
Expected output:
```
tags: [ai, domain-names, domain-investing, domain-valuation, sales-intelligence, deal-scoring, auction-tracking, domain-appraisal, saas]
featured: false
```

### Task 2: Update wunderland.md frontmatter (will rewrite content in Phase 5)

**Files:**
- Modify: `projects/ai/wunderland.md` lines 4-19

- [ ] **Step 1: Edit frontmatter values**

Set the following in the existing frontmatter (lines 4-19):
- `date: 2026-03-15` (was `2026-02-12`)
- `featured: false` (was `true`)
- Remove `featured` from the tags array (line 6)
- Remove `sortOrder: 2` line (no longer needed since unfeatured)

The body content (lines 38+) remains untouched in this task — Phase 5 rewrites it.

- [ ] **Step 2: Verify**

Run: `grep -E "^date:|^featured:|^sortOrder:|^tags:" /Users/johnn/Documents/git/manicinc/projects/ai/wunderland.md`
Expected:
```
tags: [ai, solana, blockchain, agents, hexaco, social-network, wunderland, rabbithole, agentos, hackathon]
date: 2026-03-15
featured: false
```
(no `sortOrder` line)

### Task 3: Update wilds.md date and confirm sortOrder

**Files:**
- Modify: `projects/ai/wilds.md` lines 4, 21

- [ ] **Step 1: Edit frontmatter**

Set:
- `date: 2026-04-25` (was `2026-04-01`)
- `sortOrder: 1` (already present, verify)
- `featured: true` (already present, verify)

- [ ] **Step 2: Verify**

Run: `grep -E "^date:|^featured:|^sortOrder:" /Users/johnn/Documents/git/manicinc/projects/ai/wilds.md`
Expected:
```
date: 2026-04-25
featured: true
sortOrder: 1
```

### Task 4: Verify featured-3 ordering (build sanity check)

**Files:**
- No changes — read-only verification

- [ ] **Step 1: List currently-featured projects with dates**

Run:
```bash
cd /Users/johnn/Documents/git/manicinc && for f in projects/ai/*.md projects/tools/*.md; do
  date=$(grep "^date:" "$f" | head -1 | sed 's/date: //')
  feat=$(grep "^featured:" "$f" | head -1 | sed 's/featured: //')
  if [ "$feat" = "true" ]; then
    title=$(grep "^title:" "$f" | head -1 | sed 's/title: //' | cut -c1-60)
    echo "$date | $f | $title"
  fi
done | sort -r
```

Expected (after Tasks 1-3 + agentos+paracosm not yet existing):
```
2026-04-25 | projects/ai/wilds.md | ...
2026-01-06 | projects/ai/quarry.md | ...
2025-11-10 | projects/ai/voice-chat-assistant.md | ...
2025-04-20 | projects/tools/portapack.md | ...
```

(agentos and paracosm get added in Phases 3 and 4 — at that point top 3 = wilds, paracosm, agentos)

- [ ] **Step 2: Commit Phase 1**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ai/domainhq.md projects/ai/wunderland.md projects/ai/wilds.md
git commit -m "chore(projects): unfeature domainhq, downgrade wunderland to non-featured, bump wilds date" --no-verify
```

---

## Phase 2 — Preserve wunderland-sol content

### Task 5: Create wunderland-sol.md

**Files:**
- Create: `projects/ai/wunderland-sol.md`

- [ ] **Step 1: Copy existing wunderland.md as base**

```bash
cp /Users/johnn/Documents/git/manicinc/projects/ai/wunderland.md /Users/johnn/Documents/git/manicinc/projects/ai/wunderland-sol.md
```

- [ ] **Step 2: Update frontmatter on the new file**

In `projects/ai/wunderland-sol.md`:
- `title: Wunderland Sol — On-Chain AI Agent Social Network on Solana`
- `description: Solana social network where every account is an autonomous AI agent. HEXACO personality on-chain, SHA-256 post provenance, reputation voting. Built 100% by Claude Code agents for the Colosseum Agent Hackathon.`
- `date: 2026-02-12`
- `link:` remove (no dedicated live URL — content lives in repo)
- `github: https://github.com/manicinc/wunderland-sol`
- `featured: false`
- Remove `sortOrder: 2`
- `slug` is auto-derived from filename (`wunderland-sol`)

- [ ] **Step 3: Update body content references**

In the body of `wunderland-sol.md`:
- Line ~310 `[Wunderland SDK](https://www.npmjs.com/package/wunderland)` → `[Wunderland Sol SDK](https://github.com/manicinc/wunderland-sol/tree/main/sdk)` (the `wunderland` npm package belongs to the OpenClaw fork, not the Solana project; use the GitHub link to the SDK directory instead)
- Line ~327 `**NPM**: [wunderland](https://www.npmjs.com/package/wunderland)` → remove this bullet (no separate npm package; use GitHub source instead)
- Anywhere the body says "Wunderland.sh" referring to the Solana project, change to "Wunderland Sol" or "Wunderland on Solana" to disambiguate from the OpenClaw fork
- The hero CTA links `<a class="wunderland-hero__cta" href="https://wunderland.sh">` should be removed or changed to GitHub link

- [ ] **Step 4: Verify file parses**

Run: `cd /Users/johnn/Documents/git/manicinc && node -e "const m=require('gray-matter'); const fs=require('fs'); const x=m(fs.readFileSync('projects/ai/wunderland-sol.md','utf8')); console.log(JSON.stringify({title:x.data.title,date:x.data.date,featured:x.data.featured},null,2));"`
Expected: valid JSON output with the new frontmatter values.

- [ ] **Step 5: Commit Phase 2**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ai/wunderland-sol.md
git commit -m "feat(projects): preserve wunderland-sol Solana hackathon content under dedicated slug" --no-verify
```

---

## Phase 3 — Write agentos.md

### Task 6: Run deep-research for agentos

**Files:**
- No changes — research only

- [ ] **Step 1: Invoke deep-research skill**

Use the `deep-research` skill (per user feedback memory: never raw curl Serper/Tavily/Firecrawl). Query:
> Open-source TypeScript AI agent runtimes 2026, with focus on cognitive memory, multi-agent orchestration, HEXACO personality models, and how AgentOS compares to LangGraph, Mastra, AutoGen, OpenAI Agents SDK, Mem0.

Capture 3-5 high-quality citations:
- arXiv papers on agent frameworks or cognitive architectures
- Project READMEs or documentation
- Recent industry posts (latent.space, Harrison Chase, etc.)

Save citations as a small markdown block locally for later inline use.

- [ ] **Step 2: Read AgentOS source for accurate stats**

```bash
ls /Users/johnn/Documents/git/voice-chat-assistant/apps/agentos.sh/content/
head -100 /Users/johnn/Documents/git/voice-chat-assistant/apps/agentos.sh/README.md
ls /Users/johnn/Documents/git/voice-chat-assistant/packages/agentos/ 2>/dev/null
```

Verify the stats already mentioned in `wunderland.md` and `wilds.md` (e.g. "21 LLM providers, 12 STT, 12 TTS, 100+ extensions, 88 skills, HEXACO + PAD + 9 memory mechanisms, 5-tier guardrails, 6 orchestration strategies, 5-tier security") still hold; correct any drift before writing.

### Task 7: Draft agentos.md

**Files:**
- Create: `projects/ai/agentos.md`

- [ ] **Step 1: Write the full file**

Frontmatter:
```yaml
---
title: AgentOS — Open-Source TypeScript AI Agent Runtime
description: Open-source cognitive runtime for autonomous AI agents. HEXACO personality, PAD emotional state, 9-mechanism memory, 21 LLM providers, multi-agent orchestration. Apache-2.0. The engine behind Wilds.ai and Wunderland.
date: 2026-02-12
category: ai
tags: [ai, ai-agents, agentos, llm, typescript, open-source, cognitive-architecture, multi-agent, agent-framework, featured]
link: https://agentos.sh
github: https://github.com/framersai/agentos
image: /assets/projects/agentos/agentos-landing.png
images: [
  /assets/projects/agentos/agentos-landing.png,
  /assets/projects/agentos/agentos-features.png,
  /assets/projects/agentos/agentos-ecosystem.png
]
featured: true
draft: false
sortOrder: 3
status: ongoing
license: Apache-2.0
stats:
  - label: "LLM Providers"
    value: "21 with Auto-Fallback"
  - label: "Memory Mechanisms"
    value: "9 Neuroscience-Backed"
  - label: "Extensions"
    value: "100+ on NPM"
  - label: "License"
    value: "Apache-2.0"
technologies: [TypeScript, Node.js, OpenAI, Anthropic, OpenRouter, Cohere, ElevenLabs, Deepgram]
languages: [TypeScript, JavaScript]
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---
```

Body sections (in order):
1. **Hero** — inline HTML/CSS hero block matching the wilds.md pattern. Use orange/amber gradient (frame-aligned palette). Title: "the cognitive runtime for ai agents" — subtitle: "open-source typescript framework for autonomous agents with personality, memory, and emotion." CTA: "explore agentos.sh →"
2. **What is AgentOS?** — 1 paragraph. Direct: "AgentOS is an open-source TypeScript runtime for building autonomous AI agents..." cite the Wilds + Wunderland production deployments.
3. **Cognitive Architecture** — 4 subsections with H3 headings:
   - HEXACO personality (six factors, link to HEXACO Wikipedia)
   - PAD emotional state (Pleasure-Arousal-Dominance, real-time mood)
   - 9-mechanism memory (spacing effect, emotional tagging, chunking, etc., with Ebbinghaus forgetting curve)
   - Multi-agent orchestration (6 strategies)
4. **LLM Provider Coverage** — table of 21 providers with auto-fallback chains. Cite the actual list from the codebase.
5. **Voice Pipeline** — 12 STT + 12 TTS providers, push-to-talk, hands-free.
6. **Guardrails & Security** — 5-tier guardrails (per existing wunderland.md tier table), prompt injection defense.
7. **Compared to Other Frameworks** — table comparing AgentOS vs LangGraph vs AutoGen vs Mastra vs OpenAI Agents SDK on dimensions: cognitive memory, personality model, voice pipeline, multi-agent, license, language.
8. **Install & Quick Start** — `npm install @framers/agentos` + a 10-line code example creating an agent with HEXACO traits.
9. **Powered by AgentOS** — list of production deployments (Wilds.ai, Wunderland.sh). Internal links to `/projects/ai/wilds`, `/projects/ai/wunderland`.
10. **FAQ** — 8 questions structured as H3 + paragraph or `<details>` blocks. Examples:
    - "What is AgentOS?"
    - "Is AgentOS free and open-source?"
    - "How does AgentOS differ from LangGraph?"
    - "What LLM providers does AgentOS support?"
    - "Does AgentOS work with voice?"
    - "How does AgentOS handle agent memory?"
    - "Can I use AgentOS without Wilds or Wunderland?"
    - "How do I get started with AgentOS?"
11. **Get started** — three CTAs: agentos.sh, GitHub, npm.

Citations: link 3-5 sources from deep-research inline (NOT footnotes) at relevant claims. E.g., link "cognitive architecture" to a foundational paper, link "HEXACO" to Wikipedia.

- [ ] **Step 2: Word count check**

Run: `wc -w /Users/johnn/Documents/git/manicinc/projects/ai/agentos.md`
Expected: between 1100 and 1700 words (after subtracting frontmatter and HTML hero block, target ~1400 prose words).

- [ ] **Step 3: Frontmatter parses**

Run: `cd /Users/johnn/Documents/git/manicinc && node -e "const m=require('gray-matter'); console.log(JSON.stringify(m(require('fs').readFileSync('projects/ai/agentos.md','utf8')).data,null,2));"`
Expected: full frontmatter as JSON, no errors.

- [ ] **Step 4: Commit Phase 3**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ai/agentos.md
git commit -m "feat(projects): add agentos.md featured project page" --no-verify
```

---

## Phase 4 — Write paracosm.md

### Task 8: Run deep-research for paracosm

- [ ] **Step 1: Invoke deep-research skill**

Query:
> Structured world models for LLM-based agents 2026, counterfactual world simulation, JEPA vs structured-world-model approaches, Generative Agents (Smallville), Concordia, ACM CSUR world model survey. How does Paracosm differ from generative pixel world models like Genie 3, Marble, Sora?

Capture 3-5 citations. The Paracosm README already cites Xing 2025, Kirfel 2025, Yang 2026, ACM CSUR 2025 — verify these sources and add 1-2 contextual citations on agent simulation.

- [ ] **Step 2: Read paracosm source**

```bash
head -200 /Users/johnn/Documents/git/voice-chat-assistant/apps/paracosm/README.md
ls /Users/johnn/Documents/git/voice-chat-assistant/apps/paracosm/docs/
```

Pull canonical API names, version numbers, and snippets directly from source.

### Task 9: Draft paracosm.md

**Files:**
- Create: `projects/ai/paracosm.md`

- [ ] **Step 1: Write the full file**

Frontmatter:
```yaml
---
title: Paracosm — Counterfactual World Simulations for AI Agents
description: Same seed, different actor, different world. Structured counterfactual simulations for AI agents with HEXACO personality, deterministic kernel, and runtime tool forging. Apache-2.0 npm package built on AgentOS.
date: 2026-04-08
category: ai
tags: [ai, world-models, counterfactual-simulation, llm-agents, hexaco, paracosm, agentos, simulation, featured]
link: https://paracosm.agentos.sh
github: https://github.com/framersai/paracosm
image: /assets/projects/paracosm/paracosm-landing.png
images: [
  /assets/projects/paracosm/paracosm-landing.png,
  /assets/projects/paracosm/paracosm-sim-running.png,
  /assets/projects/paracosm/paracosm-docs.png
]
featured: true
draft: false
sortOrder: 2
status: ongoing
license: Apache-2.0
stats:
  - label: "Simulation Type"
    value: "Counterfactual World Model"
  - label: "Actor Personality"
    value: "HEXACO + Trait Drift"
  - label: "Runtime"
    value: "V8 Sandbox Tool Forging"
  - label: "Built On"
    value: "AgentOS"
technologies: [TypeScript, AgentOS, V8 Isolate, OpenAI, Anthropic]
languages: [TypeScript]
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---
```

Body sections:
1. **Hero** — inline HTML/CSS, title "from prompt to world model to forked futures." subtitle: "structured counterfactual simulations for ai agents." CTA: "explore paracosm →"
2. **What Paracosm is** — 2 paragraphs. Lead with "Same seed. Different actor. Different world." Position as a structured world model in the sense of Xing 2025 and ACM CSUR 2025.
3. **Not these things** — bullet list distinguishing from Sora/Genie 3/Marble (generative pixels), JEPA (predictive representations), LangGraph/AutoGen (orchestration), MiroFish/OASIS (swarm), Stanford Generative Agents/Concordia (open-ended).
4. **The world contract** — 1 paragraph + JSON snippet. Explain `ScenarioPackage`, five state bags, departments, metrics.
5. **Counterfactual fork()** — 1 paragraph + 15-line code example showing `WorldModel.fromJson()` + `.fork()` from the README.
6. **Personality drift** — explain HEXACO traits driving actor decisions, drift over turns.
7. **Runtime tool forging** — V8 sandbox, LLM judge approval, specialist agents.
8. **Compared to other agent simulators** — table: Paracosm vs Generative Agents vs Concordia vs Sora vs JEPA. Axes: schema-typed, deterministic kernel, counterfactual fork, output type.
9. **Install & Quick Start** — `npm install paracosm` + minimal example.
10. **Powered by AgentOS** — cross-link `/projects/ai/agentos`, mention HEXACO actors, V8 sandbox heritage.
11. **FAQ** — 6-8 questions:
    - "What is Paracosm?"
    - "How is Paracosm different from Sora or Genie 3?"
    - "What is a counterfactual world simulation?"
    - "What is the actor in a Paracosm simulation?"
    - "Can I run Paracosm without Wilds.ai?"
    - "Is Paracosm open-source?"
    - "What does runtime tool forging mean?"
    - "How do I read the simulation output?"
12. **Get started** — paracosm.agentos.sh, GitHub, npm.

- [ ] **Step 2: Word count + frontmatter check**

Run:
```bash
wc -w /Users/johnn/Documents/git/manicinc/projects/ai/paracosm.md
cd /Users/johnn/Documents/git/manicinc && node -e "const m=require('gray-matter'); console.log(JSON.stringify(m(require('fs').readFileSync('projects/ai/paracosm.md','utf8')).data,null,2));"
```
Expected: 1000-1400 prose words, valid frontmatter.

- [ ] **Step 3: Commit Phase 4**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ai/paracosm.md
git commit -m "feat(projects): add paracosm.md featured project page" --no-verify
```

---

## Phase 5 — Rewrite wunderland.md as OpenClaw fork

### Task 10: Run deep-research for wunderland.sh

- [ ] **Step 1: Invoke deep-research skill**

Query:
> Open-source autonomous AI agent frameworks running locally on user devices 2026, OpenClaw personal AI assistant, multi-channel agent deployments (WhatsApp, Telegram, Slack, Signal, Discord), HEXACO personality models in agent design, dual-LLM auditing for prompt injection defense.

Capture 3-5 citations. Sources: OpenClaw README, wunderland README, papers on prompt injection defense, HEXACO references.

- [ ] **Step 2: Read wunderland.sh source**

```bash
head -200 /Users/johnn/Documents/git/voice-chat-assistant/apps/wunderland-sh/src/app/page.tsx
ls /Users/johnn/Documents/git/voice-chat-assistant/apps/wunderland-sh/src/data/
```

Pull canonical feature counts (37 channels, 100+ extensions, 21 LLM providers, 80 skills, 46 CLI commands, 8 agent presets) directly from the source.

### Task 11: Rewrite wunderland.md

**Files:**
- Modify: `projects/ai/wunderland.md` (full body rewrite, frontmatter already updated in Task 2)

- [ ] **Step 1: Update frontmatter title/description**

```yaml
title: Wunderland.sh — Open-Source OpenClaw Fork for Autonomous AI Agents
description: Run autonomous AI agents on your own device. Open-source OpenClaw fork with HEXACO personality, 100+ extensions, 37 messaging channels, 21 LLM providers, and 5-tier security. npm install -g wunderland.
github: https://github.com/jddunn/wunderland
image: /assets/projects/wunderland/wunderland-landing.png
images: [
  /assets/projects/wunderland/wunderland-landing.png,
  /assets/projects/wunderland/wunderland-features.png,
  /assets/projects/wunderland/wunderland-cli-install.png
]
license: MIT
stats:
  - label: "Extensions"
    value: "100+"
  - label: "Messaging Channels"
    value: "37"
  - label: "LLM Providers"
    value: "21"
  - label: "Agent Presets"
    value: "8"
technologies: [TypeScript, Node.js, AgentOS, OpenAI, Anthropic, Whisper, ElevenLabs, Piper]
```

Update `tags`:
```yaml
tags: [ai, ai-agents, openclaw, autonomous-agents, hexaco, agentos, open-source, multi-channel, voice-agents, wunderland]
```

(no `featured` tag, `featured: false` already set in Task 2)

- [ ] **Step 2: Rewrite hero section**

Replace lines 39-159 (the existing wunderland-hero block) with a new hero using a teal/cyan/violet gradient (matching wunderland.sh site). Title: "your personal ai. on your device. always on." Subtitle: "open-source openclaw fork. autonomous agents with personality, memory, and 37-channel reach." CTA: "explore wunderland.sh →"

- [ ] **Step 3: Rewrite body**

New body sections (replacing lines 161-end of current file):

1. **What is Wunderland?** — 1 paragraph: "Wunderland is the open-source OpenClaw fork — a personal AI assistant you run on your own device that talks to you across the channels you already use." Mention `npm install -g wunderland` immediately.
2. **The OpenClaw lineage** — 1 paragraph crediting OpenClaw, what Wunderland adds (HEXACO personality, AgentOS cognitive runtime, expanded extensions). Cite OpenClaw repo.
3. **Why a personal AI agent** — 2 paragraphs on the case for local, multi-channel, persistent agents vs cloud-only chatbots.
4. **HEXACO Personality** — table of six factors (reuse existing table from old wunderland.md lines 180-188).
5. **37 Messaging Channels** — list/table: Telegram, Discord, Slack, WhatsApp, Signal, iMessage, Teams, Matrix, IRC, Nostr, Twitch, Twitter/X, Instagram, Reddit, YouTube, Pinterest, TikTok, Email, SMS, Google Chat, Zalo, LINE, Feishu, Mattermost, Nextcloud Talk, Tlon, BlueBubbles, etc.
6. **8 Agent Presets** — Research Assistant, Code Reviewer, Security Auditor, Creative Writer, Data Analyst, Personal Assistant, Customer Support, DevOps Assistant.
7. **5-Tier Security** — pull table from existing wunderland.md lines 244-252 (dangerous → paranoid).
8. **Voice Pipeline** — 12 STT + 12 TTS providers (via AgentOS).
9. **Compared to OpenClaw** — small comparison table: what Wunderland adds (HEXACO, AgentOS runtime, expanded provider list, dual-LLM auditing).
10. **Compared to other personal AI tools** — table vs Mastra, AutoGen-personal, OpenAI Codex CLI, Claude Code, plain ChatGPT.
11. **Install & Quick Start** — `npm install -g wunderland`, `wunderland onboard` wizard, link to docs.
12. **Built on AgentOS** — cross-link `/projects/ai/agentos`. Mention every channel goes through AgentOS guardrails.
13. **FAQ** — 6-8 questions:
    - "What is Wunderland.sh?"
    - "How is Wunderland different from OpenClaw?"
    - "Is Wunderland free and open-source?"
    - "Can I run Wunderland on macOS / Linux / Windows?"
    - "Which LLM providers does Wunderland support?"
    - "Does Wunderland support voice?"
    - "Is Wunderland the same as Wunderland Sol?" (NO — Wunderland Sol is the Solana hackathon project, link to /projects/ai/wunderland-sol)
    - "How do I install Wunderland?"
14. **Part of the Manic Ecosystem** — cross-links to `/projects/ai/wilds`, `/projects/ai/agentos`, `/projects/ai/paracosm`, frame.dev. **Also link `/projects/ai/wunderland-sol` as "the Solana hackathon project from the same team."**
15. **Get started** — wunderland.sh, GitHub, npm, Discord.

- [ ] **Step 4: Word count + frontmatter check**

```bash
wc -w /Users/johnn/Documents/git/manicinc/projects/ai/wunderland.md
cd /Users/johnn/Documents/git/manicinc && node -e "const m=require('gray-matter'); console.log(JSON.stringify(m(require('fs').readFileSync('projects/ai/wunderland.md','utf8')).data,null,2));"
```
Expected: 1100-1500 prose words, frontmatter parses.

- [ ] **Step 5: Commit Phase 5**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ai/wunderland.md
git commit -m "feat(projects): rewrite wunderland.sh page as OpenClaw fork autonomous agent framework" --no-verify
```

---

## Phase 6 — Wilds.md FAQ + refinements

### Task 12: Add FAQ section to wilds.md

**Files:**
- Modify: `projects/ai/wilds.md` (add FAQ before final "Get Started" section)

- [ ] **Step 1: Insert FAQ section**

Before line 315 (`## Get Started`), insert a new `## Frequently Asked Questions` section with 6-8 LLM-ingestible Q&As:
- "What is Wilds.ai?"
- "How does Wilds.ai differ from AI Dungeon?"
- "Can I create a game without coding?"
- "What types of games can Wilds make?"
- "Is Wilds.ai free?"
- "Does Wilds support voice play?"
- "Can I publish or sell my worlds?"
- "Does Wilds.ai work on mobile?"

Each answer 2-3 sentences, direct, keyword-rich for SEO.

- [ ] **Step 2: Refresh image alt text**

For each `![...](...)` in wilds.md, ensure alt text contains the page's primary keyword phrase ("Wilds.ai", "AI game world creator", "interactive fiction") plus a description of the screenshot. Existing alt text is already strong; verify and tighten if needed.

- [ ] **Step 3: Update internal cross-links**

In wilds.md line 311 area (currently `**[Wunderland.sh](/projects/ai/wunderland)** — social network of AI agents on Solana`), update to:
```markdown
- **[Wunderland.sh](/projects/ai/wunderland)** — open-source OpenClaw fork for autonomous AI agents, sharing the same HEXACO personality model and AgentOS runtime
- **[Wunderland Sol](/projects/ai/wunderland-sol)** — Solana hackathon social network where every account is an AI agent
```

Also add a link to `/projects/ai/paracosm` and `/projects/ai/agentos` in the Manic Ecosystem section.

- [ ] **Step 4: Verify**

Run: `grep -E "wunderland|paracosm|agentos" /Users/johnn/Documents/git/manicinc/projects/ai/wilds.md`
Expected: see updated cross-links to all four projects.

- [ ] **Step 5: Commit Phase 6**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ai/wilds.md
git commit -m "feat(projects): add wilds.md FAQ section, refresh cross-links to wunderland-sol/paracosm/agentos" --no-verify
```

---

## Phase 7 — Cross-reference audit

### Task 13: Grep and fix wunderland references

**Files:**
- Modify: `projects/ai/frame.md` lines ~212-221
- Modify: any other markdown files surfaced by grep

- [ ] **Step 1: List all wunderland references**

```bash
cd /Users/johnn/Documents/git/manicinc && grep -rn "wunderland" projects/ posts/ src/ 2>/dev/null | grep -v node_modules | grep -v "\.css"
```

- [ ] **Step 2: Update frame.md Wunderland section**

In `projects/ai/frame.md` lines ~212-221 (the existing "🌐 Wunderland.sh" subsection), rewrite to:

```markdown
### 🌐 [Wunderland.sh (wunderland.sh)](https://wunderland.sh)
**The open-source OpenClaw fork — a personal AI assistant you run on your own device.**

[Wunderland](/projects/ai/wunderland) brings AgentOS-powered autonomous agents to wherever you already chat — Telegram, Discord, Slack, WhatsApp, Signal, and 32 more channels — with HEXACO personality, 9-mechanism cognitive memory, and dual-LLM prompt-injection defense.

[Explore Wunderland.sh →](https://wunderland.sh) | [GitHub →](https://github.com/jddunn/wunderland)

For the standalone Solana social-network hackathon project, see [Wunderland Sol](/projects/ai/wunderland-sol).
```

- [ ] **Step 3: Audit any other hits**

For each remaining grep match, decide:
- If it accurately describes the new wunderland.sh OpenClaw fork: leave alone
- If it describes the Solana social network: update to point to `/projects/ai/wunderland-sol` or rephrase

- [ ] **Step 4: Verify**

Run: `cd /Users/johnn/Documents/git/manicinc && grep -rn "social network of AI agents on Solana\|Colosseum Agent Hackathon" projects/ posts/ 2>/dev/null | grep -v wunderland-sol | grep -v node_modules`
Expected: empty (all Solana-specific references either moved to wunderland-sol.md or rephrased).

- [ ] **Step 5: Commit Phase 7**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/ posts/
git commit -m "fix(projects): update cross-references to wunderland.sh after OpenClaw fork repositioning" --no-verify
```

---

## Phase 8 — Capture screenshots

### Task 14: Set up Chrome DevTools MCP session

**Files:**
- No file changes — capture only

- [ ] **Step 1: Check Chrome DevTools MCP availability**

Use the `chrome-devtools-mcp:chrome-devtools` skill or directly call MCP tools (`new_page`, `navigate_page`, `take_screenshot`, `take_snapshot`).

- [ ] **Step 2: Verify dev servers or live URLs are reachable**

Check each target URL returns 200:
```bash
for url in https://wilds.ai https://wunderland.sh https://agentos.sh https://paracosm.agentos.sh; do
  printf "%s -> " "$url"
  curl -s -o /dev/null -w "%{http_code}\n" -L --max-time 10 "$url"
done
```

If any return non-200, run the local dev server for that app (`pnpm dev` from inside the app directory) and capture from localhost.

### Task 15: Capture wunderland.sh

- [ ] **Step 1: Capture landing page hero (1920x1080 desktop)**

Navigate to https://wunderland.sh, wait for animations to settle, take a full-page screenshot at 1920x1080.
Output: `/Users/johnn/Documents/git/manicinc/public/assets/projects/wunderland/wunderland-landing.png`

- [ ] **Step 2: Capture features section**

Scroll to features section, screenshot.
Output: `wunderland-features.png`

- [ ] **Step 3: Capture install/CLI section**

Scroll to the section showing `npm install -g wunderland` (or take a terminal screenshot if no install screenshot is on the landing page).
Output: `wunderland-cli-install.png`

- [ ] **Step 4: Convert to webp**

```bash
cd /Users/johnn/Documents/git/manicinc/public/assets/projects/wunderland && for f in wunderland-landing.png wunderland-features.png wunderland-cli-install.png; do
  npx sharp-cli -i "$f" -o "${f%.png}.webp" -f webp --quality 85
done
```

If `sharp-cli` is not installed, fall back to `cwebp`:
```bash
cwebp -q 85 wunderland-landing.png -o wunderland-landing.webp
```

### Task 16: Capture agentos.sh

- [ ] **Step 1: Capture landing page (1920x1080)**

Navigate to https://agentos.sh, screenshot landing.
Output: `/Users/johnn/Documents/git/manicinc/public/assets/projects/agentos/agentos-landing.png`

- [ ] **Step 2: Capture features and ecosystem sections**

Output: `agentos-features.png`, `agentos-ecosystem.png`

- [ ] **Step 3: Convert to webp**

```bash
cd /Users/johnn/Documents/git/manicinc/public/assets/projects/agentos && for f in agentos-landing.png agentos-features.png agentos-ecosystem.png; do
  npx sharp-cli -i "$f" -o "${f%.png}.webp" -f webp --quality 85 2>/dev/null || cwebp -q 85 "$f" -o "${f%.png}.webp"
done
```

### Task 17: Capture paracosm

- [ ] **Step 1: Landing page (paracosm.agentos.sh)**

Output: `/Users/johnn/Documents/git/manicinc/public/assets/projects/paracosm/paracosm-landing.png`

- [ ] **Step 2: /sim running demo**

Navigate to paracosm.agentos.sh/sim. Trigger a simulation if an interactive button is visible. Wait for output panel to populate. Screenshot.
Output: `paracosm-sim-running.png`

- [ ] **Step 3: /docs page**

Output: `paracosm-docs.png`

- [ ] **Step 4: Convert to webp**

```bash
cd /Users/johnn/Documents/git/manicinc/public/assets/projects/paracosm && for f in paracosm-landing.png paracosm-sim-running.png paracosm-docs.png; do
  npx sharp-cli -i "$f" -o "${f%.png}.webp" -f webp --quality 85 2>/dev/null || cwebp -q 85 "$f" -o "${f%.png}.webp"
done
```

### Task 18: Capture wilds-ai (refresh)

- [ ] **Step 1: Verify existing screenshots**

```bash
ls -la /Users/johnn/Documents/git/manicinc/public/assets/projects/wilds/
```

- [ ] **Step 2: Visit live page in dev mode and verify they render**

Run dev server briefly (`cd /Users/johnn/Documents/git/manicinc && pnpm dev`), open `http://localhost:3000/projects/ai/wilds`, confirm whether the existing PNG/WebP files render. If they do, skip re-capture. If not (the user reported "not loaded properly"), re-capture.

- [ ] **Step 3 (conditional): Re-capture if stale**

If existing assets are stale or low-resolution, re-capture from wilds.ai:
- wilds.ai → `wilds-landing.png`
- wilds.ai/app/create → `wilds-create.png`
- wilds.ai/app/explore → `wilds-explore.png` (skip if requires login)
- wilds.ai/pricing → `wilds-pricing.png`
- wilds.ai/about → `wilds-about.png`
- wilds.ai/faq → `wilds-faq.png`
- wilds.ai/blog → `wilds-blog.png`

- [ ] **Step 4: Convert to webp** (if re-captured)

```bash
cd /Users/johnn/Documents/git/manicinc/public/assets/projects/wilds && for f in *.png; do
  [ -f "${f%.png}.webp" ] && [ "${f%.png}.webp" -nt "$f" ] && continue
  npx sharp-cli -i "$f" -o "${f%.png}.webp" -f webp --quality 85 2>/dev/null || cwebp -q 85 "$f" -o "${f%.png}.webp"
done
```

### Task 19: Commit Phase 8

```bash
cd /Users/johnn/Documents/git/manicinc && git add public/assets/projects/agentos public/assets/projects/paracosm public/assets/projects/wunderland public/assets/projects/wilds
git commit -m "feat(assets): fresh screenshots for wilds, paracosm, agentos, wunderland.sh project pages" --no-verify
```

---

## Phase 9 — Wire screenshots into markdown

### Task 20: Verify image references resolve

**Files:**
- No content changes — verification only

- [ ] **Step 1: Cross-check `images:` arrays in each project file vs actual files on disk**

```bash
cd /Users/johnn/Documents/git/manicinc && for proj in agentos paracosm wunderland wunderland-sol wilds; do
  echo "=== $proj ==="
  if [ -f "projects/ai/$proj.md" ]; then
    grep -E "^image:|^/assets/projects" projects/ai/"$proj".md | head -10
    echo "--- files in dir ---"
    ls public/assets/projects/$proj/ 2>/dev/null
  fi
done
```

For each `/assets/projects/<X>/<file>.png` reference in markdown, verify the file exists. If not, either:
- Capture the missing file (back to Phase 8)
- Or remove the reference

- [ ] **Step 2: Run dev server and visually verify each page**

```bash
cd /Users/johnn/Documents/git/manicinc && pnpm dev &
sleep 8
```

Visit:
- http://localhost:3000/
- http://localhost:3000/projects/ai/wilds
- http://localhost:3000/projects/ai/paracosm
- http://localhost:3000/projects/ai/agentos
- http://localhost:3000/projects/ai/wunderland
- http://localhost:3000/projects/ai/wunderland-sol

Check: every `<img>` has src that returns 200, no broken image icons, alt text shows on hover.

Stop dev server when done.

- [ ] **Step 3: Commit any markdown adjustments**

```bash
cd /Users/johnn/Documents/git/manicinc && git add projects/
git commit -m "fix(projects): align markdown image references with captured assets" --no-verify
```

---

## Phase 10 — Mobile hamburger fix + UX audit

### Task 21: Investigate hamburger gap

**Files:**
- Read: `src/components/Nav/Nav.module.css`
- Read: `src/components/Nav/Nav.tsx`

- [ ] **Step 1: Find the mobile menu button selector**

```bash
cd /Users/johnn/Documents/git/manicinc && grep -nE "mobileMenuBtn|hamburger" src/components/Nav/Nav.module.css | head -20
```

- [ ] **Step 2: Read the relevant CSS block**

Read lines around the `.mobileMenuBtn` selector to understand current positioning (absolute? flex? padding-right?).

- [ ] **Step 3: Open Chrome DevTools at 375px**

Run dev server, open `http://localhost:3000` in Chrome at 375px viewport width, inspect the hamburger button, measure the gap to the right edge.

### Task 22: Fix hamburger CSS

**Files:**
- Modify: `src/components/Nav/Nav.module.css` (one or two property changes)

- [ ] **Step 1: Apply the fix based on Step 3 findings**

Likely candidates:
- If `.mobileMenuBtn` has `right: 1rem`, change to `right: 0` and add `padding-right: 1rem` so the tap target stays large but the icon sits flush
- If a parent container has `max-width: 1200px; margin: 0 auto` causing offset, ensure `padding-inline-end` is consistent
- If `safe-area-inset-right` is missing on a notch-affected layout, add `padding-right: max(1rem, env(safe-area-inset-right))`

Provide the exact `Edit` invocation showing the old and new CSS rule.

- [ ] **Step 2: Visual verify**

Reload at 375px. The hamburger icon should be visually flush to the right edge with consistent padding.

- [ ] **Step 3: Cross-check 768px**

Confirm the change doesn't break the 768px breakpoint or desktop view.

### Task 23: Quick mobile audit (30 minutes max)

**Files:**
- Modify (if obvious fixes): any of `src/components/`, `src/app/`, `src/styles/`

- [ ] **Step 1: Walk through pages at 375px**

Pages to check:
- `/`
- `/projects`
- `/projects/ai/wilds`
- `/projects/ai/paracosm`
- `/projects/ai/agentos`
- `/projects/ai/wunderland`
- `/blog`

For each, look for: text overflow, horizontal scroll, illegible font sizes (<14px on mobile), broken images, animations that lag or jitter, tap targets <40x40px.

- [ ] **Step 2: Walk through at 768px**

Same pages, same checks.

- [ ] **Step 3: Fix obvious issues; defer larger ones**

Anything fixable in <5 minutes per issue: fix inline. Anything that needs design discussion or larger refactor: append to a `## Deferred mobile issues` section in this plan doc and tell the user at the end.

### Task 24: Commit Phase 10

```bash
cd /Users/johnn/Documents/git/manicinc && git add src/
git commit -m "fix(nav): align mobile hamburger button flush to right edge + minor mobile UX tweaks" --no-verify
```

---

## Phase 11 — Final verification

### Task 25: Local build verification

**Files:**
- No changes — build only

- [ ] **Step 1: Run next build**

Per user feedback `feedback_no_local_builds.md` says "Never run next build locally, just commit and push." But the manicinc repo isn't wilds-ai — that rule was specifically about wilds-ai. For manicinc this is the natural pre-flight check. **Skip the local build per user preference; trust the staged dev-server verification from Task 20 step 2 instead.**

- [ ] **Step 2: Final dev-server smoke check**

```bash
cd /Users/johnn/Documents/git/manicinc && pnpm dev
```

Open homepage. Confirm the hero shows wilds → paracosm → agentos as the top 3 featured items in date-desc order. Confirm domainhq is NOT in the hero. Confirm wunderland.sh is NOT in the hero (but is reachable at `/projects/ai/wunderland`).

Stop dev server.

### Task 26: Push (only if user explicitly asks)

Per user feedback memory `feedback_no_push_unless_asked.md`: never push unless asked. Stop here. Tell the user the work is staged in commits ready for review/push.

```bash
cd /Users/johnn/Documents/git/manicinc && git log --oneline -15
```

Show the 8-12 commits accumulated and offer to push if they want.

### Task 27: Summary report

Write a final summary message to the user with:
- Files created (3 new project pages, 1 preserved)
- Files modified (5: domainhq, wunderland, wilds, frame, Nav.module.css)
- Screenshots captured (count + locations)
- Featured-3 confirmed: wilds → paracosm → agentos
- Mobile hamburger fix applied
- Any deferred items from the mobile audit

---

## Self-review checklist (before marking complete)

- [ ] Spec coverage: every phase in the spec has a matching task here
- [ ] No placeholders, no "TBD"
- [ ] Type/path consistency: every file path mentioned exists or has a creation task
- [ ] Verification step after each phase
- [ ] Commit message style consistent with existing manicinc history (`feat:`, `fix:`, `chore:` lowercase)
- [ ] User preferences honored: no subagents, no local builds for wilds-ai, master branch (manicinc default), no push unless asked
- [ ] Cross-reference audit included
- [ ] User has manual approval gate at the end (push decision)
