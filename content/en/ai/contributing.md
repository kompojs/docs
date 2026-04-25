---
title: Contributing to Kompo AI
description: How to contribute to the Kompo AI agent — local development, SDK, proxy, RAG pipeline, and skills.
---

# Contributing to Kompo AI

Kompo AI lives in the [kompojs/agents](https://github.com/kompojs/agents) repository. This guide explains how to set up the repo locally, understand the architecture, and contribute improvements.

## Repository Structure

```
agents/
├── packages/
│   └── ai/              → @kompo/ai (npm package)
│       ├── src/
│       │   ├── index.ts         → Public API exports
│       │   ├── config.ts        → User config (~/.kompo/)
│       │   ├── licence.ts       → Licence validation
│       │   ├── quota.ts         → Token quota management
│       │   ├── ollama/
│       │   │   ├── client.ts    → Ollama HTTP client
│       │   │   └── models.ts    → Model management (create/pull/list)
│       │   ├── proxy/
│       │   │   └── server.ts    → OpenAI-compatible proxy server
│       │   └── rag/
│       │       ├── upstash.ts   → Cloud vector search (Upstash)
│       │       ├── local-index.ts → Local project/skills indexer
│       │       └── chunker.ts   → Markdown/code chunking
│       ├── tsup.config.ts       → Build configuration
│       └── package.json
├── models/
│   ├── Modelfile            → Default (qwen2.5-coder:14b)
│   ├── Modelfile.light      → Light (qwen2.5-coder:7b)
│   └── Modelfile.heavy      → Heavy (qwen2.5-coder:32b)
├── scripts/
│   └── index-docs.ts        → Documentation indexing script
├── turbo.json
├── pnpm-workspace.yaml
└── package.json              → Root: kompo-agents (private)
```

## Local Development Setup

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10.0.0
- **Ollama** installed and running ([ollama.com](https://ollama.com))

### 1. Clone the repository

```bash
# Clone inside your kompojs workspace (alongside kompo/, workbench/, etc.)
cd kompojs
git clone https://github.com/kompojs/agents.git
cd agents
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Build

```bash
pnpm build
```

This builds `@kompo/ai` via [tsup](https://tsup.egoist.dev/) producing:
- `dist/index.js` — Main SDK exports
- `dist/proxy/server.js` — Proxy server entry point

### 4. Development mode

```bash
pnpm dev
```

This runs tsup in watch mode — rebuilds on every file change.

### 5. Set up the Ollama model

```bash
ollama pull qwen2.5-coder:14b
ollama create kompo-ai -f models/Modelfile
```

## Linking with the CLI

The Kompo CLI (`@kompo/cli` in the [kompo](https://github.com/kompojs/kompo) repo) imports `@kompo/ai` for the `kompo ai`, `kompo ai:serve`, `kompo ai:setup`, and `kompo ai:status` commands.

For local development, the CLI uses a `link:` reference:

```json
// kompo/packages/cli/package.json
{
  "dependencies": {
    "@kompo/ai": "link:../../../agents/packages/ai"
  }
}
```

This means your local changes to `agents/packages/ai/` are immediately available to the CLI after building. The expected directory layout is:

```
kompojs/
├── kompo/        → CLI that imports @kompo/ai
├── agents/       → @kompo/ai source
├── workbench/    → Workbench (AI/Skills/Account tabs)
└── ...
```

### Testing CLI commands with local changes

```bash
# 1. Build the SDK after your changes
cd agents && pnpm build

# 2. Run CLI commands from the kompo repo
cd ../kompo
pnpm --filter @kompo/cli kompo ai:status
pnpm --filter @kompo/cli kompo ai:serve
pnpm --filter @kompo/cli kompo ai
```

## Architecture Deep Dive

### Proxy Server (`src/proxy/server.ts`)

The proxy is the central piece. It creates an HTTP server on port 11435 that:

1. **`GET /health`** — Returns proxy status, Ollama connection, model info, and quota
2. **`POST /v1/chat/completions`** — Main endpoint:
   - Validates licence and quota
   - Extracts the last user message
   - Queries both Upstash Vector (docs) and local vector index (project code) in parallel
   - Injects RAG context as a system message
   - Forwards to Ollama and streams the response back
   - Counts tokens and updates quota
3. **`GET /v1/models`** — Lists available models

### RAG Pipeline (`src/rag/`)

Two-layer retrieval:

- **`upstash.ts`** — Queries the cloud Upstash Vector index for Kompo documentation. Uses BGE-M3 embeddings. Results are filtered by score (> 0.5).
- **`local-index.ts`** — Indexes project files and skills locally in `~/.kompo/vector-index/`. Uses `nomic-embed-text` via Ollama for embeddings. Cosine similarity search with threshold > 0.3.
- **`chunker.ts`** — Splits markdown and code files into chunks suitable for embedding.

### Ollama Client (`src/ollama/`)

- **`client.ts`** — Low-level HTTP client for Ollama's API (generate, chat, embeddings, status)
- **`models.ts`** — Model lifecycle management (pull, create from Modelfile, list, check existence)

### Quota & Licence (`src/quota.ts`, `src/licence.ts`)

- Licence validation against the Kompo platform API
- Token counting and quota enforcement (daily + monthly limits)
- Local caching of quota state in `~/.kompo/`

## What to Contribute

### Improve RAG Quality

The RAG pipeline is the most impactful area:

- **Better chunking** — Improve `chunker.ts` to handle more file types, smarter boundaries
- **Reranking** — Add a reranker step after initial retrieval to improve relevance
- **Hybrid search** — Combine vector similarity with keyword matching
- **Prompt engineering** — Improve how RAG context is formatted in the system prompt

### Add Model Support

Currently Kompo AI uses Qwen 2.5 Coder. You can:

- Add new Modelfiles for other code-focused models
- Benchmark different models for Kompo-specific tasks
- Improve system prompts for specific use cases

### Build Skills

Skills are one of the most impactful contributions:

```bash
# Create a new skill package
mkdir packages/skill-my-domain
cd packages/skill-my-domain
npm init -y --scope=@kompo --name=@kompo/skill-my-domain
```

A skill package contains markdown files and code examples that get indexed and used as RAG context. See [Skills System](/en/ai/overview#skills-system) for details.

### Proxy Improvements

- **Request logging** — Add opt-in request/response logging for debugging
- **Caching** — Cache common responses to reduce Ollama load
- **Multiple models** — Support routing to different models based on task type
- **MCP support** — Add Model Context Protocol integration

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck
```

## Documentation Indexing

The `scripts/index-docs.ts` script indexes Kompo documentation into Upstash Vector. To run it:

```bash
# Set Upstash credentials
export UPSTASH_VECTOR_REST_URL=...
export UPSTASH_VECTOR_REST_TOKEN=...

# Run the indexer (requires docs/ repo cloned alongside agents/)
tsx scripts/index-docs.ts
```

This reads all `.md` files from `docs/content/en/`, chunks them, and upserts to Upstash Vector.

## Pull Request Guidelines

1. **Fork** the repository and create a feature branch
2. **Build** passes: `pnpm build`
3. **Tests** pass: `pnpm test`
4. **Types** check: `pnpm typecheck`
5. Write a clear PR description explaining the change
6. For RAG improvements, include before/after examples showing improved output

## Related Repositories

| Repository | Relationship |
|:--|:--|
| [kompojs/kompo](https://github.com/kompojs/kompo) | CLI commands that import `@kompo/ai` |
| [kompojs/workbench](https://github.com/kompojs/workbench) | AI/Skills/Account tabs in the workbench UI |
| [kompojs/docs](https://github.com/kompojs/docs) | Documentation indexed into Upstash Vector |
| [kompojs/platform](https://github.com/kompojs/platform) | Licence validation and quota API |
