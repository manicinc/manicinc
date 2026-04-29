---
title: Paracosm — Counterfactual World Simulations for AI Agents
description: Same seed, different actor, different world. Structured counterfactual simulations with HEXACO personality, deterministic kernel, runtime tool forging in V8 sandbox, and replayable run artifacts. Apache-2.0 npm package built on AgentOS.
date: 2026-04-08
category: ai
tags: [ai, world-models, counterfactual-simulation, llm-agents, hexaco, paracosm, agentos, simulation, digital-twin, featured]
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
technologies: [TypeScript, AgentOS, "V8 Isolate", OpenAI, Anthropic, "Node.js 20+", Bun]
languages: [TypeScript]
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---

<div class="paracosm-hero">
  <h1 class="paracosm-hero__title" aria-label="from prompt to world model to forked futures">from prompt to world model to forked futures.</h1>
  <p class="paracosm-hero__subtitle">
    structured counterfactual simulations for ai agents. same seed, different actor, different world.
  </p>
  <a class="paracosm-hero__cta" href="https://paracosm.agentos.sh" target="_blank" rel="noopener">
    explore paracosm →
  </a>
</div>

<style>
  .paracosm-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .paracosm-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, #14110e 0%, #e06530 35%, #e8b44a 70%, #4ca8a8 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  @media (prefers-color-scheme: dark) {
    .paracosm-hero__title {
      background: linear-gradient(120deg, #f8f4eb 0%, #e8b44a 35%, #e06530 70%, #4ca8a8 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }
  .paracosm-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 60ch;
  }
  @media (prefers-color-scheme: light) {
    .paracosm-hero__subtitle { color: #2a2a2a; }
  }
  .paracosm-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(232,180,74,0.18), rgba(76,168,168,0.08)),
      linear-gradient(90deg, rgba(224,101,48,0.35), rgba(76,168,168,0.35));
    border: 1px solid rgba(232,180,74,0.35);
    backdrop-filter: blur(6px);
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .paracosm-hero__cta::before {
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
  .paracosm-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(232,180,74,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(76,168,168,0.2), rgba(232,180,74,0.12)),
      linear-gradient(90deg, rgba(224,101,48,0.5), rgba(76,168,168,0.5));
    box-shadow: 0 10px 32px rgba(232,180,74,0.25), 0 2px 8px rgba(76,168,168,0.2);
  }
  .paracosm-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .paracosm-hero__cta {
      color: #0f0f0f;
      border-color: rgba(224,101,48,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
  }
</style>

## Same seed. Different actor. Different world.

[Paracosm](https://paracosm.agentos.sh) is a structured counterfactual world simulator for AI agents. Start from a prompt, brief, URL, or hand-written scenario draft. The compiler grounds it into a typed `ScenarioPackage` — a JSON contract with five state bags, labels, departments, metrics, setup defaults, and generated hooks. An actor with a [HEXACO](https://en.wikipedia.org/wiki/HEXACO_model_of_personality_structure) personality profile runs that world. A deterministic kernel drives state, time, and randomness. An LLM generates events, specialist analyses, and the actor's decisions. Specialists can forge new computational tools at runtime inside a V8 sandbox; an LLM judge approves each forge before it enters the decision pipeline. Personality traits drift. One turn ends, the next begins.

The product is the structural contrast: two runs against an identical seed and compiled world contract produce measurably divergent trajectories when you swap one variable — the actor's personality. The kernel side is reproducible. The divergence comes from the LLM stages reading HEXACO profiles and deciding differently.

```bash
npm install paracosm
```

![Paracosm landing page — counterfactual world simulation for AI agents with HEXACO personality and deterministic kernel](/assets/projects/paracosm/paracosm-landing.png)

## Why structured world models, not generative pixels

Paracosm aligns with the **structured world model** definition from [Xing 2025](https://arxiv.org/abs/2507.05169) and the [ACM Computing Surveys 2025 world-model survey](https://dl.acm.org/doi/full/10.1145/3746449): a simulator for *actionable possibilities*, not a video generator. It is also a **counterfactual world simulation model** in the sense of [Kirfel et al. 2025](https://link.springer.com/article/10.1007/s43681-025-00718-4): a substrate for replaying an event with one variable changed and surfacing the effect. The closest LLM-world-model implementation anchor is [Yang et al. 2026](https://openreview.net/forum?id=XmYCERErcD), which evaluates LLM-based world models through policy verification, action proposal, and policy planning.

Paracosm takes the safe product version of that idea: externalize the world into schema, citations, tools, snapshots, and seeded transitions, then let the LLM reason over that structure.

## Not these things

- **Not a generative visual world model.** Sora, [Genie 3](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/), and World Labs Marble produce pixels or 3D scenes. Paracosm produces a typed `RunArtifact`: metrics, decisions, specialist notes, citations, forged tool summaries.
- **Not a JEPA-style predictive-representation model.** [Yann LeCun's AMI Labs](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/) trains neural representations from sensor streams. Paracosm composes a deterministic kernel with an LLM reasoner; no training pipeline.
- **Not a multi-agent orchestration framework.** [LangGraph](https://langchain-ai.github.io/langgraph/), [AutoGen](https://microsoft.github.io/autogen/), [CrewAI](https://www.crewai.com), [OpenAI Agents SDK](https://platform.openai.com/docs/guides/agents-sdk), and [Google ADK](https://google.github.io/adk-docs/) build agentic workflows that execute real tasks. Paracosm is a simulation; nothing leaves the run.
- **Not a swarm intelligence simulator.** MiroFish and OASIS simulate thousands to a million emergent agents for aggregate prediction. Paracosm is top-down (one actor decides), runs ~100 agents by design, and outputs a deterministic trajectory plus divergence across actors.
- **Not a generative-agents library.** [Stanford Generative Agents (Smallville)](https://reverie.herokuapp.com/arXiv_Demo/) and [Google DeepMind Concordia](https://github.com/google-deepmind/concordia) build emergent social simulacra in open-ended sandboxes. Paracosm ships a deterministic turn loop, personality drift, runtime tool forging, and a universal result schema.

Actors can be colony commanders, CEOs, generals, ship captains, department heads, AI systems, governing councils, or any entity that receives information, evaluates options, and makes choices that shape the world. The simulation does not care what they represent. It cares how they decide.

## The world contract

JSON is the contract, not the product boundary. Today, `compileScenario()` accepts a scenario JSON draft and grounds it with `seedText` or `seedUrl`. The next API layer is a one-call prompt/document wrapper that asks an LLM to propose that same JSON contract, validates it, then compiles and runs it — without ever bypassing the schema, the kernel, or the artifact.

```json
{
  "id": "submarine-habitat",
  "labels": { "name": "Deep Ocean Habitat", "populationNoun": "crew", "settlementNoun": "habitat" },
  "departments": ["Life Support", "Science", "Security", "Logistics"],
  "metrics": { "morale": 70, "resources": 60, "stress": 30 },
  "setup": { "turnLength": "1 week" }
}
```

The dashboard's Quickstart tab compiles this brief into a running sim within a minute. A curated library of 10 HEXACO archetypes ships at `paracosm/leader-presets` for programmatic `runBatch` sweeps or swap-actor controls in downstream UIs.

## Counterfactual fork() — the structural product

```typescript
import { WorldModel } from 'paracosm/world-model';

const wm = await WorldModel.fromJson(worldJson);

// Run the trunk with per-turn snapshots captured.
const trunk = await wm.simulate(visionaryActor, {
  maxTurns: 6, seed: 42, captureSnapshots: true,
});

// Branch at turn 3 with a different actor — no recompute of turns 1-3;
// the forked kernel resumes from the captured state.
const branch = await (await wm.forkFromArtifact(trunk, 3)).simulate(
  pragmatistActor,
  { maxTurns: 6, seed: 42 },
);

console.log(branch.metadata.forkedFrom);  // { parentRunId, atTurn: 3 }
```

The kernel round-trips through `JSON.stringify`, so snapshots persist to disk for replay or audit. In the dashboard, every UI-initiated run captures snapshots; the Reports tab shows a `↳ Fork at Turn N` button on each completed turn.

## Replay any run for audit

```typescript
const replay = await wm.replay(storedArtifact);
console.log(replay.matches);     // true when kernel produces byte-equal output
console.log(replay.divergence);  // first-mismatch JSON pointer when matches=false
```

Replay is free — LLM stages are not invoked. Use it for regression testing (replay golden artifacts in CI) or forensic comparison (find the first kernel-state divergence between two paracosm versions).

## Personality drift

Actor personality drifts as the simulation progresses. A high-Conscientiousness CEO who weathers a crisis grows steadier. A low-Agreeableness general who suffers betrayal grows colder. Drift modulates HEXACO traits within bounded ranges so the actor stays coherent across long runs while reflecting accumulated experience. The drift function is deterministic given the seed, so the *path* is reproducible even though the LLM-generated decisions are not.

## Runtime tool forging

Specialists inside a Paracosm run can forge new computational tools at runtime — a custom risk calculator, a domain-specific cost model, a new metric aggregator. Each forged tool runs inside a V8 sandbox isolate; an LLM judge approves the spec before the tool enters the decision pipeline. The forged tool joins the specialist's permanent toolkit for the remainder of the run, and a summary appears in the `RunArtifact` for downstream analysis.

## How Paracosm compares to other simulators

| System | Schema-typed world | Deterministic kernel | Counterfactual fork | Output |
|--------|---------------------|----------------------|----------------------|--------|
| **Paracosm** | Yes, `ScenarioPackage` JSON | Yes, seeded kernel | Yes, `WorldModel.fork()` | Typed `RunArtifact` |
| Sora / Genie 3 / Marble | No | No | No | Pixels or 3D scenes |
| JEPA-family | No | Trained representations | No | Latent vectors |
| LangGraph / AutoGen / CrewAI | Workflow nodes | No | No | Tool execution traces |
| Stanford Generative Agents | Emergent town | No | No | Emergent dialogue |
| OASIS / MiroFish | No | Stochastic | No | Aggregate stats |

The combination of typed contracts, deterministic kernel, fork-and-compare, and structured `RunArtifact` makes Paracosm the substrate for repeatable counterfactual analysis — where Generative Agents are the substrate for emergent social phenomena.

## Quickstart — prompt to running simulation

```typescript
import { WorldModel } from 'paracosm/world-model';

const wm = await WorldModel.fromPrompt({
  seedText: 'Q3 board brief: the company must decide between aggressive expansion and capital preservation.',
  domainHint: 'corporate strategic decision',
});

const { actors, artifacts } = await wm.quickstart({ actorCount: 3 });
artifacts.forEach((a, i) => console.log(actors[i].name, a.fingerprint));
```

The dashboard's Quickstart tab takes a paste, PDF, or URL and returns three streaming-live actors with per-card Download JSON, Copy shareable link, and Fork-in-Branches actions.

## Powered by AgentOS

Paracosm is built on [AgentOS](/projects/ai/agentos), the open-source TypeScript runtime for autonomous AI agents. AgentOS provides the GMI substrate, HEXACO personality vectors, eight-mechanism cognitive memory, multi-agent orchestration, and the V8 sandbox primitives that runtime tool forging depends on. If you want to build your own simulation stack on the same foundations, start with AgentOS.

## Frequently Asked Questions

### What is Paracosm?

Paracosm is an open-source TypeScript library for structured counterfactual world simulations. It compiles a scenario into a typed JSON contract, runs it with HEXACO-personality actors and a deterministic kernel, and produces a `RunArtifact` you can fork, replay, and audit. It is published on npm as `paracosm` under the Apache-2.0 license.

### How is Paracosm different from Sora or Genie 3?

Sora and [Genie 3](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/) generate pixel video or 3D scenes. Paracosm generates structured decisions, metrics, and citations — a `RunArtifact` you can compare across forks, query by department, and replay byte-equal in CI. Different category of world model, different output shape.

### What is a counterfactual world simulation?

A simulation that replays the same scenario with one variable changed — typically the actor's personality, the seed, or an injected event — and surfaces how the world's trajectory diverges as a result. See [Kirfel et al. 2025](https://link.springer.com/article/10.1007/s43681-025-00718-4) for the academic framing. Paracosm operationalizes this through `WorldModel.fork()`.

### What is the actor in a Paracosm simulation?

The actor is the entity that receives information, evaluates options, and makes choices. Actors can be colony commanders, CEOs, generals, ship captains, department heads, AI systems, or any decision-making entity. Each actor carries a HEXACO personality vector that shapes how the LLM reasons through their decisions.

### Can I run Paracosm without Wilds.ai?

Yes. Paracosm is a standalone npm package — `npm install paracosm`. It depends on [AgentOS](/projects/ai/agentos), but neither requires the Wilds.ai application. You can build your own dashboards, batch runners, or analysis tools on top of the library.

### Is Paracosm open-source?

Yes. Paracosm is Apache-2.0 licensed with the source on [GitHub](https://github.com/framersai/paracosm). The dashboard at [paracosm.agentos.sh](https://paracosm.agentos.sh) is also open and free to use for the public preview.

### What does runtime tool forging mean?

Specialists inside a simulation can synthesize new computational tools as the run progresses — a custom calculator, a domain-specific aggregator. Each forged tool runs inside a V8 isolate; an LLM judge approves the spec before the tool joins the pipeline. The forged tool persists for the rest of the run and appears in the `RunArtifact`.

### How do I read the simulation output?

Every run produces a typed `RunArtifact` containing per-turn snapshots, the actor's decisions, specialist analyses with citations, forged tool summaries, and a final fingerprint. Use `wm.replay(artifact)` to deterministically replay it, or `wm.forkFromArtifact(artifact, turn)` to branch at a specific turn with a different actor or seed.

## Get started

[Paracosm](https://paracosm.agentos.sh) ships as pure ESM with subpath exports (`paracosm/world-model`, `paracosm/compiler`, `paracosm/digital-twin`, `paracosm/leader-presets`). Node 20+, Bun 1.x, or any TypeScript runner with ESM support resolves them out of the box.

[Try the live demo →](https://paracosm.agentos.sh/sim) | [Read the docs →](https://paracosm.agentos.sh/docs) | [Browse on GitHub →](https://github.com/framersai/paracosm) | [Install from npm →](https://www.npmjs.com/package/paracosm)
