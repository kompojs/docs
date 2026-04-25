---
title: Kompo AI Overview
description: Privacy-first, IDE-agnostic AI agent for Kompo — local inference via Ollama with RAG and Skills.
---

# Kompo AI

Kompo AI is a **domain-specialized LLM agent** for TypeScript code generation with the Kompo framework. It understands hexagonal architecture, ports & adapters, and Web3 patterns — and runs entirely on your machine.

## Key Features

- **IDE-agnostic** — Works in Cursor, Windsurf, VSCode + Continue, Gravity, or any IDE that supports custom LLM endpoints
- **Privacy-first** — All inference runs locally via [Ollama](https://ollama.com). Your prompts and code never leave your machine
- **RAG-enhanced** — Automatically retrieves relevant Kompo documentation and project context for every query
- **Skills system** — Extend with domain-specific knowledge packages (`@kompo/skill-*`)
- **Local management** — Manage your plan, quota, and skills via the [Kompo Workbench](/en/workbench/overview)

## How It Works

```
Your IDE (Cursor, Windsurf, VSCode...)
  │
  ▼
Kompo AI Proxy (localhost:11435)        ← OpenAI-compatible API
  │ 1. Check quota (daily + monthly)
  │ 2. Enrich with RAG context
  │ 3. Forward to Ollama
  │ 4. Count tokens
  ▼
Ollama (localhost:11434)                ← Local LLM inference
  └── kompo-ai model (qwen2.5-coder)
```

The **Kompo AI Proxy** is a lightweight local server that sits between your IDE and Ollama. It provides an OpenAI-compatible API (`/v1/chat/completions`) so any tool that speaks the OpenAI protocol can use it. Under the hood, the proxy:

1. **Validates your licence** and checks daily/monthly token quotas
2. **Injects RAG context** — relevant Kompo documentation and project-specific code snippets
3. **Forwards the enriched prompt** to Ollama for local inference
4. **Counts tokens** used for quota tracking (only the count is synced — never your prompts)

## Model Tiers

Kompo AI is powered by [Qwen 2.5 Coder](https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct) with a custom system prompt optimized for Kompo development.

| Tier | Base Model | VRAM | Context | Best For |
|------|-----------|------|---------|----------|
| **Light** | `qwen2.5-coder:7b` | ~5 GB | 8K | Low-resource machines (8 GB RAM) |
| **Default** | `qwen2.5-coder:14b` | ~9 GB | 16K | Recommended for most developers |
| **Heavy** | `qwen2.5-coder:32b` | ~20 GB | 32K | High-quality output (24 GB+ RAM) |

## RAG Pipeline

Kompo AI uses a two-layer Retrieval-Augmented Generation pipeline:

### Cloud: Kompo Documentation

Public Kompo documentation is indexed in [Upstash Vector](https://upstash.com/vector) using BGE-M3 embeddings. When you ask a question, the proxy queries this index to find relevant documentation chunks and injects them into the prompt.

### Local: Project Code & Skills

Your project code and installed skills are indexed **locally** in `~/.kompo/vector-index/` using `nomic-embed-text` embeddings via Ollama. This means:

- Your code never leaves your machine
- Context is specific to your current project
- Skills add domain knowledge without cloud dependencies

## Skills System

Skills are npm packages (`@kompo/skill-*`) that provide domain-specific knowledge to Kompo AI. They contain documentation, patterns, and examples that get indexed locally and injected as RAG context.

Example skills:
- `@kompo/skill-erc20` — ERC-20 token patterns, transfer logic, approval flows
- `@kompo/skill-nft` — ERC-721/1155 minting, metadata, marketplace integration
- `@kompo/skill-defi` — DeFi primitives: AMM, lending, staking patterns

Skills are managed through the [Workbench Skills tab](/en/ai/workbench) or the CLI.

## Pricing

Kompo AI uses a hybrid pricing model — subscription tiers with daily rate limits and optional overage:

| Plan | Monthly Tokens | Daily Limit | Price |
|------|---------------|-------------|-------|
| **Starter** | 100K | 10K | Free |
| **Builder** | 1M | 80K | $9/mo |
| **Pro** | 5M | 300K | $19/mo |
| **Team** | 15M/seat | 800K/seat | $39/seat/mo |

::: tip Privacy Guarantee
Your prompts and code **never leave your machine**. Only token counts are synced to the Kompo platform for quota tracking.
:::

## Next Steps

- [Setup Guide](/en/ai/setup) — Install Ollama, configure the model, and start the proxy
- [IDE Integration](/en/ai/ide-integration) — Connect your IDE to Kompo AI
- [Workbench AI Tabs](/en/ai/workbench) — Manage AI, skills, and account from the workbench
- [Contributing](/en/ai/contributing) — Help improve Kompo AI
