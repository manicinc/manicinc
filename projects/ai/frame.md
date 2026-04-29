---
title: Frame.dev — AI Development Framework
description: Open-source AI orchestration runtime powering AgentOS and OpenStrand. Built by Framers AI for the next generation of AI-powered development tools.
date: 2025-11-09
category: ai
tags: [ai, oss, agentos, openstrand, orchestration, developer-tools, wunderland, rabbithole]
link: https://frame.dev
github: https://github.com/framersai
image: /assets/projects/framers/frame-logo-transparent.png
images: [
  /assets/projects/framers/frame-logo-no-subtitle.svg,
  /assets/projects/framers/agentos-logo.png
]
featured: false
draft: false
stats:
  - label: "Projects Powered"
    value: "3"
  - label: "Runtime Package"
    value: "@framers/agentos"
  - label: "Architecture"
    value: "TypeScript + Monorepo"
  - label: "License"
    value: "Apache-2.0"
team:
  - name: "Framers AI"
    role: "Core Development"
    link: "https://github.com/framersai"
  - name: "Manic Agency"
    role: "Strategic Partner"
    link: "https://manic.agency"
---

<div class="frame-hero">
  <img
    src="/assets/projects/framers/frame-logo-no-subtitle.svg"
    alt="Frame.dev logo"
    class="frame-hero__logo"
    decoding="async"
    loading="eager"
  />
  <h1 class="frame-hero__title" aria-label="we are the framers">we are the framers</h1>
  <p class="frame-hero__subtitle">
    denoising the web and making ai agency emergent, adaptive, and permanent.
  </p>
  <a class="frame-hero__cta" href="https://frame.dev" target="_blank" rel="noopener">
    explore frame.dev →
  </a>
</div>

<style>
  .frame-hero {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 1rem;
    padding: 2.75rem 1rem 3rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }
  .frame-hero__logo {
    width: clamp(180px, 42vw, 380px);
    height: auto;
    opacity: 0.95;
  }
  @media (prefers-color-scheme: dark) {
    .frame-hero__logo {
      filter: brightness(0) invert(1) drop-shadow(0 0 24px rgba(255,255,255,0.15));
      opacity: 1;
    }
  }
  .frame-hero__title {
    text-transform: lowercase;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(1.9rem, 4.8vw, 3.2rem);
    line-height: 1.05;
    margin: 0.35rem 0 0.25rem;
    background: linear-gradient(120deg, var(--accent-vibrant, #8a5cff) 0%, var(--accent-cool, #00d4ff) 50%, var(--accent-primary, #19ffa6) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .frame-hero__subtitle {
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-secondary, rgba(255,255,255,0.78));
    margin: 0.25rem 0 0.9rem;
    max-width: 56ch;
  }
  @media (prefers-color-scheme: light) {
    .frame-hero__subtitle { color: #2a2a2a; }
  }
  .frame-hero__cta {
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
      radial-gradient(120% 120% at 0% 0%, rgba(138,92,255,0.18), rgba(0,212,255,0.08)),
      linear-gradient(90deg, rgba(138,92,255,0.35), rgba(0,212,255,0.35));
    border: 1px solid rgba(138,92,255,0.35);
    backdrop-filter: blur(6px);
    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease,
      background .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    will-change: transform;
  }
  .frame-hero__cta::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(120deg, rgba(138,92,255,0.9), rgba(0,212,255,0.9), rgba(25,255,166,0.9));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: .6;
    transition: opacity .25s ease;
    z-index: -1;
  }
  .frame-hero__cta:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(138,92,255,0.7);
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(25,255,166,0.2), rgba(0,212,255,0.12)),
      linear-gradient(90deg, rgba(138,92,255,0.5), rgba(0,212,255,0.5));
    box-shadow: 0 10px 32px rgba(0,212,255,0.25), 0 2px 8px rgba(25,255,166,0.2);
  }
  .frame-hero__cta:active { transform: translateY(0) scale(0.99); }
  @media (prefers-color-scheme: light) {
    .frame-hero__cta {
      color: #0f0f0f;
      border-color: rgba(138,92,255,0.25);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .frame-hero__cta:hover {
      box-shadow: 0 10px 28px rgba(0,0,0,0.12);
    }
  }
</style>

## The Frame.dev Ecosystem

Our projects work together to create a complete AI development platform:



### 🧠 [AgentOS (agentos.sh)](https://agentos.sh)
**The Brain Behind Our AI Systems**

AgentOS is our modular orchestration runtime that powers intelligent AI applications, handling:

- **Conversation Management** — Stateful, multi-turn interactions
- **Memory & Retrieval** — RAG pipelines and context windows
- **Tool Orchestration** — Permission-aware tool execution
- **Streaming Architecture** — Real-time response handling
- **Guardrails & Safety** — Built-in protective policies

```typescript
import { AgentOS } from '@framers/agentos';

const agent = new AgentOS();
await agent.initialize(config);

for await (const chunk of agent.processRequest(input)) {
  // Handle streaming responses
}
```

[Explore AgentOS Documentation →](https://agentos.sh/docs)

### 📚 [OpenStrand (openstrand.ai)](https://openstrand.ai)
**Collaborative Knowledge Architecture**

OpenStrand revolutionizes how teams organize and connect information. Built on the Zettelkasten method with modern collaborative features:

- **Recursive Strands** — Infinitely nestable knowledge structures
- **Collaborative Slip-Box** — Team-based knowledge management
- **AI-Enhanced Discovery** — Automatic linking and insights
- **Offline-First** — Works everywhere, syncs when connected
- **Version Control** — Git-like branching for knowledge

[Discover OpenStrand →](https://openstrand.ai)

### 🪨 [Quarry.space (quarry.space)](https://quarry.space)
**AI-Native Personal Knowledge Management**

[Quarry](/projects/ai/quarry) is the consumer PKM built on Frame.dev infrastructure. It brings enterprise-grade AI capabilities to individual knowledge workers:

- **Zettelkasten Architecture** — Atomic notes with bi-directional links
- **Semantic Search** — WebGPU-accelerated embeddings for instant retrieval
- **FSRS Flashcards** — Spaced repetition that actually works
- **Knowledge Graphs** — Visualize connections you never knew existed
- **Multi-Platform** — Web, Desktop (Electron), Mobile (Capacitor)

[Explore Quarry.space →](https://quarry.space)

### 🌐 [Wunderland.sh (wunderland.sh)](https://wunderland.sh)
**The open-source OpenClaw fork — a personal AI assistant you run on your own device.**

[Wunderland](/projects/ai/wunderland) brings AgentOS-powered autonomous agents to wherever you already chat — Telegram, Discord, Slack, WhatsApp, Signal, and 32 more channels — with HEXACO personality, eight-mechanism cognitive memory, and dual-LLM prompt-injection defense.

- **Local-First** — runs on your hardware, MIT licensed, npm install -g wunderland
- **37 Messaging Channels** — same identity, every app you already use
- **5-Tier Security** — Pre-LLM classifier, Dual-LLM auditor, HMAC verification, configurable paranoia

[Explore Wunderland.sh →](https://wunderland.sh) | [GitHub →](https://github.com/jddunn/wunderland)

> For the standalone Solana social-network hackathon project, see [Wunderland Sol](/projects/ai/wunderland-sol).

### 🐇 [RabbitHole (rabbithole.inc)](https://rabbithole.inc)
**Control Plane for Autonomous Agents**

[RabbitHole](/projects/ai/rabbithole) is the dashboard for building and deploying Wunderbots — the agents that populate the Wunderland network.

- **Voice-to-Config** — Create agents by describing them
- **Credential Vault** — Encrypted, self-hosted by default
- **Multi-Channel** — Slack, Discord, Telegram, WhatsApp

[Explore RabbitHole →](https://rabbithole.inc)

## Technical Architecture

### Unified TypeScript Stack

All Frame.dev projects share a consistent, modern architecture:

```
frame.dev/
├── apps/
│   ├── agentos.sh/             # Next.js marketing site
│   └── openstrand-app/         # React knowledge management UI
├── packages/
│   ├── @framers/agentos/       # Core orchestration runtime
│   ├── @openstrand/sdk/        # Shared types & utilities
│   └── @framers/tools/         # Common tool implementations
└── backend/
    ├── openstrand-teams/       # Fastify collaboration backend
    └── shared/                 # Cross-cutting concerns
```

### Key Technologies

- **Language**: TypeScript throughout (strict mode)
- **Frontend**: Vue 3, React 18, Next.js 14
- **Backend**: Express, Fastify, Prisma
- **AI/ML**: OpenAI, Anthropic, local models
- **Database**: PostgreSQL, PGlite (embedded)
- **Infrastructure**: Docker, Kubernetes-ready

## Open Source Philosophy

### Why We Build in the Open

1. **Transparency** — Users should understand how their AI tools work
2. **Collaboration** — The best ideas come from diverse perspectives
3. **Innovation** — Open ecosystems move faster than closed ones
4. **Trust** — Auditable code builds confidence in AI systems

### Contribution Model

We follow a "Core + Community" model:

- **Core Team** maintains architectural vision and quality standards
- **Community** contributes features, fixes, and integrations
- **Partners** like [Manic Agency](https://manic.agency) provide strategic development

## Integration Examples

### Using AgentOS in Your Project

```typescript
import { AgentOS, AgentOSConfig } from '@framers/agentos';
import { OpenAIProvider } from '@framers/agentos/providers';

const config: AgentOSConfig = {
  providers: [new OpenAIProvider(apiKey)],
  tools: ['code-writer', 'terminal', 'file-system'],
  memoryStrategy: 'hierarchical',
  streamingEnabled: true
};

const agent = new AgentOS();
await agent.initialize(config);

// Process natural language requests
const response = await agent.processRequest({
  text: "Refactor this function to use async/await",
  context: { file: 'utils.js', selection: [10, 25] }
});
```

### Building Custom Tools

```typescript
import { ITool, ToolResult } from '@framers/agentos';

export class CustomAnalyzerTool implements ITool {
  name = 'custom-analyzer';
  description = 'Analyzes code patterns and suggests improvements';
  
  async execute(params: any): Promise<ToolResult> {
    // Your tool logic here
    return {
      success: true,
      data: analysisResults,
      artifacts: [{
        filename: 'analysis.md',
        mimeType: 'text/markdown',
        data: reportContent
      }]
    };
  }
}
```

## Performance & Scale

### Benchmarks

- **Response Time**: < 100ms for tool invocations
- **Streaming Latency**: < 50ms per chunk
- **Memory Efficiency**: 50MB base, scales with context
- **Concurrent Sessions**: 1000+ per instance

### Production Ready

- **Error Recovery**: Automatic retry with exponential backoff
- **Rate Limiting**: Built-in protection against abuse
- **Observability**: OpenTelemetry instrumentation
- **Security**: OWASP-compliant, regular audits

## Roadmap & Vision

### Q4 2025
- [ ] AgentOS plugin marketplace
- [ ] OpenStrand team collaboration features
- [ ] Frame IDE preview release

### 2026 Vision
- **Ambient Development** — Code that understands and evolves with you
- **AI Pair Programming** — True collaborative AI that learns your style
- **Knowledge-Driven Architecture** — Systems that document themselves
- **Voice-First Everything** — Natural language as the primary interface

## Get Started

### For Developers

```bash
# Install AgentOS
npm install @framers/agentos

# Try OpenStrand locally
npx create-openstrand-app my-knowledge-base
```

### For Teams

- **AgentOS Enterprise** — [Contact sales](mailto:enterprise@frame.dev)
- **OpenStrand Teams** — [Request early access](https://openstrand.ai/teams)

## Community & Support

### Join the Movement

- **GitHub**: [github.com/framersai](https://github.com/framersai)
- **Discord**: [frame.dev/discord](https://frame.dev/discord)
- **Twitter**: [@framersai](https://twitter.com/framersai)
- **Blog**: Explore our updates in the thinkpieces section

### Resources

- [AgentOS Documentation](https://agentos.sh/docs)
- [OpenStrand Tutorials](https://openstrand.ai/learn)
- [API Reference](https://frame.dev/api)

## Built by Framers AI × Manic Agency

Frame.dev is developed by [Framers AI](https://github.com/framersai) in collaboration with [Manic Agency](https://manic.agency). Together, we're pushing the boundaries of what's possible when AI meets software development.

### Why This Matters

We believe the future of software development isn't about replacing developers—it's about amplifying their capabilities. Frame.dev provides the tools to think faster, build smarter, and create experiences that weren't possible before.

---

*Ready to revolutionize how you build? [Get started with Frame.dev →](https://frame.dev)*
