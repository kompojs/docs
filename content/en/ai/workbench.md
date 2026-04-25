---
title: Workbench AI Tabs
description: Manage Kompo AI, skills, and your account directly from the Kompo Workbench.
---

# Workbench AI Tabs

The [Kompo Workbench](/en/workbench/overview) includes three dedicated tabs for managing Kompo AI — no SaaS dashboard required.

## AI Tab

The **AI** tab provides a built-in chat interface to interact with Kompo AI directly from the workbench.

### Features

- **Live chat** with streaming responses — same quality as the CLI or IDE integration
- **Status indicators** — shows proxy status, Ollama connection, and active model at a glance
- **Quota display** — live daily and monthly token usage
- **Offline detection** — clear instructions to start the proxy if it's not running

### How it works

The AI tab connects to the same local proxy (`localhost:11435`) that your IDE uses. When you type a message, it sends a streaming request to `/v1/chat/completions` and renders the response in real-time.

::: tip
The proxy must be running for the AI tab to work:
```bash
kompo ai:serve
```
:::

## Skills Tab

The **Skills** tab lets you browse, install, and manage domain-specific knowledge packages.

### Features

- **Search** across all available skills
- **Installed section** — skills currently active in your project
- **Available section** — skills you can install
- **One-click install/remove** — manage skills without the command line

### What are skills?

Skills are npm packages (`@kompo/skill-*`) that provide domain-specific knowledge to Kompo AI. When installed, they are indexed locally and their content is injected as RAG context when relevant to your queries.

Available skills include:

| Skill | Description |
|-------|-------------|
| `@kompo/skill-erc20` | ERC-20 token patterns, transfer logic, approval flows |
| `@kompo/skill-nft` | ERC-721/1155 minting, metadata, marketplace integration |
| `@kompo/skill-defi` | DeFi primitives: AMM, lending, staking patterns |
| `@kompo/skill-dao` | DAO governance: proposals, voting, treasury management |
| `@kompo/skill-wagmi` | wagmi hooks, wallet connection, chain switching |

## Account Tab

The **Account** tab displays your plan, quota usage, and billing information.

### Features

- **Plan card** — current plan name, price, and upgrade button
- **Usage bars** — visual monthly and daily token consumption with color-coded thresholds (green/yellow/red)
- **Info cards** — privacy policy, overage rules, and documentation links
- **Offline state** — prompts you to start the proxy if it's not running

### Quota thresholds

| Usage | Color | Meaning |
|-------|-------|---------|
| < 70% | Green | Normal usage |
| 70–89% | Yellow | Approaching limit |
| ≥ 90% | Red | Near or at limit |

## Opening the Workbench

The workbench is available in two modes:

**In-app** — When your dev server is running, press `Ctrl+K` (or `Cmd+K` on macOS) to open the workbench panel at the bottom of your browser.

**Standalone** — Run the workbench as a standalone app:

```bash
kompo workbench
```

This starts the workbench on `http://localhost:9100`.

## Next Steps

- [Setup Guide](/en/ai/setup) — Install and configure Kompo AI
- [IDE Integration](/en/ai/ide-integration) — Connect your IDE to Kompo AI
- [Contributing](/en/ai/contributing) — Help improve Kompo AI
