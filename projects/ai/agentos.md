---
title: AgentOS — Open-Source TypeScript AI Agent Runtime
description: Open-source cognitive runtime for autonomous AI agents. HEXACO personality, 8-mechanism cognitive memory, 16 LLM providers with auto-fallback, 6 multi-agent strategies, runtime tool forging. Apache-2.0. The engine behind Wilds.ai and Wunderland.sh.
date: 2026-02-12
category: ai
tags: [ai, ai-agents, agentos, llm, typescript, open-source, cognitive-architecture, multi-agent, agent-framework, hexaco, featured]
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
    value: "16 with Auto-Fallback"
  - label: "Cognitive Memory"
    value: "8 Neuroscience-Backed"
  - label: "Vector Backends"
    value: "7 (RAG + GraphRAG)"
  - label: "Tests Passing"
    value: "3,866+"
technologies: [TypeScript, "Node.js 20+", OpenAI, Anthropic, Gemini, Groq, Ollama, OpenRouter, Cohere, ElevenLabs, Deepgram, Qdrant, Neo4j, pgvector]
languages: [TypeScript, JavaScript]
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---

<div class="agentos-hero">
  <h1 class="agentos-hero__title" aria-label="the cognitive runtime for ai agents">the cognitive runtime for ai agents.</h1>
  <p class="agentos-hero__subtitle">
    open-source typescript framework for autonomous agents with personality, cognitive memory, and emergent tool forging.
  </p>
  <a class="agentos-hero__cta" href="https://agentos.sh" target="_blank" rel="noopener">
    explore agentos.sh →
  </a>
</div>

<style>
  .agentos-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .agentos-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #e06530 0%, #e8b44a 50%, #4ca8a8 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .agentos-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 60ch;
  }
  @media (prefers-color-scheme: light) {
    .agentos-hero__subtitle { color: #2a2a2a; }
  }
  .agentos-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(224,101,48,0.18), rgba(232,180,74,0.08)),
      linear-gradient(90deg, rgba(224,101,48,0.35), rgba(76,168,168,0.35));
    border: 1px solid rgba(232,180,74,0.35);
    backdrop-filter: blur(6px);
    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease,
      background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .agentos-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(224,101,48,0.9), rgba(232,180,74,0.9), rgba(76,168,168,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .agentos-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(232,180,74,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(76,168,168,0.2), rgba(232,180,74,0.12)),
      linear-gradient(90deg, rgba(224,101,48,0.5), rgba(76,168,168,0.5));
    box-shadow: 0 10px 32px rgba(232,180,74,0.25), 0 2px 8px rgba(76,168,168,0.2);
  }
  .agentos-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .agentos-hero__cta {
      color: #0f0f0f;
      border-color: rgba(224,101,48,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
  }
</style>

## What is AgentOS?

[AgentOS](https://agentos.sh) is the open-source TypeScript runtime for autonomous AI agents. Each agent is a **Generalized Mind Instance (GMI)** with a HEXACO personality, eight neuroscience-backed memory mechanisms, runtime tool forging inside a V8 sandbox, and a classifier-driven memory pipeline that decides per-query whether to retrieve, which architecture to use, and which reader to dispatch.

AgentOS powers production agents on [Wilds.ai](/projects/ai/wilds), [Wunderland.sh](/projects/ai/wunderland), and [Paracosm](/projects/ai/paracosm). The package ships under the Apache-2.0 license with 3,866+ tests in CI, full TypeScript types, and zero vendor lock-in.

```bash
npm install @framers/agentos
```

![AgentOS landing page — open-source TypeScript runtime for autonomous AI agents with cognitive memory, HEXACO personality, and emergent tool forging](/assets/projects/agentos/agentos-landing.png)

## Cognitive Architecture, Not Just an Orchestrator

Most agent libraries are routing layers — they accept a prompt, pick a tool, return an answer. AgentOS treats the agent as a *mind* with persistent identity, memory, and behavioral adaptation across sessions.

### HEXACO Personality

Every GMI carries a [HEXACO-60](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure) personality vector: Honesty-Humility, Emotionality, eXtraversion, Agreeableness, Conscientiousness, Openness. The six traits modulate retrieval bias (a high-Openness agent surfaces more counterintuitive memories), response style (a high-Emotionality agent leans into sentiment), and tool selection (a high-Conscientiousness agent picks higher-fidelity tools). Personality is not a system prompt template — it shapes which memories get encoded, how they decay, and what the agent actually picks from the retrieval candidates.

### Eight-Mechanism Cognitive Memory

The memory engine implements eight neuroscience-backed processes: **reconsolidation** (memories rewrite when re-accessed), **retrieval-induced forgetting** (RIF), **involuntary recall** (proactive surfacing), **feeling-of-knowing** (FOK metacognition), **gist extraction** (compressed summaries), **schema encoding** (typed slots), **source decay** (provenance fades on the [Ebbinghaus forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve)), and **emotion regulation** (mood-tagged retrieval). The result is an agent that remembers what mattered, forgets what didn't, and can correct itself when memory and reality diverge.

### Classifier-Driven Memory Pipeline

The standout feature: a three-stage LLM-as-judge classifier pipeline that gates retrieval per query. Stage 1 decides whether memory is even needed. Stage 2 picks the retrieval architecture (canonical-hybrid, observational-memory-v10, observational-memory-v11). Stage 3 picks the reader tier (gpt-4o for hard categories, gpt-5-mini for easy ones). Stages 2 and 3 reuse the Stage 1 classification so the full pipeline costs **one classifier call per query**, not three.

Internal evaluation on [LongMemEval-S](https://arxiv.org/abs/2410.10813) Phase B at N=500 with 10k-resample bootstrap confidence intervals: **85.6% accuracy [82.4%, 88.6%] at $0.0090 per correct answer**. The same harness measures Mastra OM gpt-4o at 84.2% (matches their published number) and re-runs EmergenceMem Simple Fast at 80.6% (apples-to-apples in our harness; their published headline is 79.0%). AgentOS lands +5.0 percentage points over EmergenceMem at 6.5× lower cost-per-correct. Full reproducible run JSONs and methodology in the [agentos-bench repo](https://github.com/framersai/agentos-bench).

## Sixteen LLM Providers, Automatic Fallback

AgentOS ships native adapters for OpenAI, Anthropic, Gemini, Groq, Ollama, OpenRouter, Together, Mistral, xAI, Claude CLI, Gemini CLI, plus five image/video providers. When the primary returns HTTP 402/429/5xx, network fails, or auth breaks, `generateText` walks a canonical fallback chain using whichever API keys are present. No extra imports, no chain construction. Strict single-provider routing is one parameter away for billing isolation, capability auditing, or provider-pinned tests.

## Seven Vector Backends, Four Retrieval Strategies, GraphRAG

The RAG pipeline supports InMemory, SQL, HNSW, [Qdrant](https://qdrant.tech), [Neo4j](https://neo4j.com), [pgvector](https://github.com/pgvector/pgvector), and [Pinecone](https://www.pinecone.io). Four retrieval strategies (vanilla similarity, hybrid BM25 + dense, query rewriting, GraphRAG) cover the full spectrum from "small dataset on a laptop" to "production knowledge graph with citation paths."

## Multi-Agent Teams With Six Strategies

Six coordination strategies for multi-agent work: `sequential`, `parallel`, `debate`, `review-loop`, `hierarchical`, `graph`. Each agent has its own HEXACO profile, memory, and skill set; teams share memory through scoped channels with HITL approval gates. The orchestration runtime offers three authoring surfaces — `workflow()` for deterministic DAGs, `AgentGraph` for cycles and subgraphs, `mission()` for goal-driven adaptive planning — all compiling to the same graph runtime with persistent checkpointing.

## Five-Tier Guardrails

Security ships built in. Five tiers from `dangerous` (no guardrails) to `paranoid` (full pipeline + circuit breakers). Six guardrail packs cover PII redaction, ML-based classifiers, topicality enforcement, code-execution safety, grounding-against-context, and content policy. Prompt injection patterns are caught at the pre-LLM stage; outputs are signed with HMAC-SHA256 to maintain an intent-chain audit trail.

## How AgentOS Compares

| Framework | Cognitive memory | HEXACO personality | Multi-agent | Voice + telephony | License | Language |
|-----------|-----------------|---------------------|-------------|---------------------|---------|----------|
| **AgentOS** | 8 mechanisms + classifier pipeline | Yes, modulates retrieval and response | 6 strategies + shared memory | ElevenLabs, Deepgram, Twilio | Apache-2.0 | TypeScript |
| [LangGraph](https://langchain-ai.github.io/langgraph/) | Conversational buffer | No | Graph orchestration | Add-on | MIT | Python (TS port) |
| [AutoGen](https://microsoft.github.io/autogen/) | Buffer + summarization | No | Two-agent conversations | No | MIT | Python |
| [Mastra](https://mastra.ai) | Working + semantic memory | No | Workflow steps | TTS only | Apache-2.0 | TypeScript |
| [Vercel AI SDK](https://sdk.vercel.ai) | None | No | None | TTS only | Apache-2.0 | TypeScript |
| [CrewAI](https://www.crewai.com) | RAG only | No | Role-based crews | No | MIT | Python |

The core differentiation is the cognitive layer — personality + memory + classifier-driven retrieval — that other frameworks treat as out-of-scope.

## Quick Start — A Personality-Driven Agent in 10 Lines

```typescript
import { agent } from '@framers/agentos';

const research = agent({
  name: 'researcher',
  personality: { O: 0.9, C: 0.85 }, // high openness, high conscientiousness
  memory: { backend: 'pgvector', mechanisms: 'all' },
  guardrails: { tier: 'balanced' },
  providers: ['openai', 'anthropic'], // automatic fallback
});

const answer = await research.ask('Find the most-cited 2026 paper on cognitive AI agents.');
```

The agent has persistent memory across calls, falls back from OpenAI to Anthropic on errors, blocks prompt injection at the guardrail stage, and shapes retrieval by its high-Openness profile.

## The AgentOS Family on npm

| Package | What it provides |
|---------|------------------|
| [`@framers/agentos`](https://www.npmjs.com/package/@framers/agentos) | Core runtime — agents, providers, memory, RAG, orchestration, guardrails |
| [`@framers/agentos-extensions`](https://www.npmjs.com/package/@framers/agentos-extensions) | 100+ extensions and templates |
| [`@framers/agentos-skills`](https://www.npmjs.com/package/@framers/agentos-skills) | 88 curated SKILL.md definitions |
| [`paracosm`](https://www.npmjs.com/package/paracosm) | Counterfactual world simulator built on AgentOS |
| [`wunderland`](https://www.npmjs.com/package/wunderland) | OpenClaw-fork personal AI assistant built on AgentOS |

## Production Deployments

- **[Wilds.ai](/projects/ai/wilds)** — every NPC, narrator, and game master runs on AgentOS. HEXACO companions with mood drift, voice synthesis, and 12-genre game generation.
- **[Wunderland.sh](/projects/ai/wunderland)** — open-source OpenClaw fork distributing AgentOS as a personal AI assistant across 37 messaging channels.
- **[Paracosm](/projects/ai/paracosm)** — counterfactual world simulation; AgentOS provides the GMI substrate, HEXACO actors, and runtime tool forging.

## Frequently Asked Questions

### What is AgentOS?

AgentOS is an open-source TypeScript runtime for autonomous AI agents with cognitive memory, HEXACO personality, multi-agent orchestration, and a classifier-driven retrieval pipeline. It is published on npm as `@framers/agentos` under the Apache-2.0 license.

### Is AgentOS free and open-source?

Yes. AgentOS is Apache-2.0 licensed with the source on [GitHub](https://github.com/framersai/agentos). You can use it commercially without royalty, modify it, and self-host it. There are no paid tiers of the runtime itself — paid services like Wilds.ai are built on top of it.

### How does AgentOS differ from LangGraph?

LangGraph is a graph orchestration library — it routes prompts and tools through nodes. AgentOS is a cognitive runtime: agents have persistent HEXACO personalities, eight-mechanism memory with reconsolidation and forgetting curves, runtime tool forging, and a classifier pipeline that decides per query whether memory is even needed. Orchestration is one component of AgentOS, not the whole framework.

### What LLM providers does AgentOS support?

Sixteen native providers: OpenAI, Anthropic, Gemini, Groq, Ollama, OpenRouter, Together, Mistral, xAI, Claude CLI, Gemini CLI, plus five image and video providers. Automatic fallback chains kick in on retryable errors (HTTP 402/429/5xx, network failures). You can also opt out for strict single-provider routing.

### Does AgentOS work with voice?

Yes. The voice pipeline supports [ElevenLabs](https://elevenlabs.io), [Deepgram](https://deepgram.com), and OpenAI Whisper for STT/TTS, plus telephony adapters for Twilio, Telnyx, and Plivo. Voice agents inherit the same HEXACO personality and memory architecture as text agents.

### How does AgentOS handle agent memory?

Eight neuroscience-backed mechanisms run on top of seven supported vector backends. Memory is encoded with HEXACO-modulated salience, consolidates during sleep cycles, decays per the Ebbinghaus forgetting curve, and gets reconsolidated when re-accessed. A three-stage classifier pipeline gates retrieval per query — most queries skip retrieval entirely, the rest get the right architecture and reader for the question type.

### Can I use AgentOS without Wilds or Wunderland?

Yes. AgentOS is the underlying runtime; Wilds.ai and Wunderland.sh are products built on it. You can install `@framers/agentos` directly and build your own agents, teams, or runtimes. The package is provider-agnostic and self-hostable.

### How do I get started with AgentOS?

Run `npm install @framers/agentos`, set an API key for any supported provider, and call `agent()` or `generateText()`. The full quickstart is at [docs.agentos.sh](https://docs.agentos.sh). The example repository is at [github.com/framersai/agentos](https://github.com/framersai/agentos) — clone it for runnable code samples covering memory, multi-agent teams, RAG, and orchestration.

## Get Started

[AgentOS](https://agentos.sh) is the cognitive substrate behind every AI agent we ship. Install it, fork it, build on top of it.

[Read the docs at agentos.sh →](https://agentos.sh) | [Browse the source on GitHub →](https://github.com/framersai/agentos) | [Install from npm →](https://www.npmjs.com/package/@framers/agentos) | [Join the Discord →](https://wilds.ai/discord)
