---
title: Frame.dev — AI Development Framework
description: Open-source AI orchestration runtime powering AgentOS and OpenStrand. Built by Framers AI for the next generation of AI-powered development tools.
date: 2025-11-09
category: ai
tags: [ai, oss, agentos, openstrand, orchestration, developer-tools]
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
    value: "2"
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

# Frame.dev — AI Development Framework

## Building the Future of AI-Powered Development

Frame.dev represents our vision for the future of software development: AI-native tools that understand context, anticipate needs, and accelerate creation. Through our open-source projects—[AgentOS](https://agentos.sh) and [OpenStrand](https://openstrand.ai)—we're building the infrastructure for a new generation of AI-powered development experiences.

> "The best interface is no interface. The best code is the code that writes itself." — Frame.dev Philosophy

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
