---
title: Kompo AI Setup
description: Install Ollama, configure the Kompo AI model, and start the local proxy.
---

# Setup Guide

This guide walks you through setting up Kompo AI on your machine.

## Prerequisites

- **Node.js** ≥ 18
- **Kompo CLI** installed (`pnpm add -g @kompo/cli`)
- **Ollama** installed ([ollama.com](https://ollama.com))
- At least **8 GB of RAM** (16 GB+ recommended for the default model)

## Quick Setup

The interactive setup command handles everything:

```bash
kompo ai:setup
```

This will:

1. **Check Ollama** — Verify Ollama is installed and running
2. **Select model tier** — Choose Light (7b), Default (14b), or Heavy (32b) based on your hardware
3. **Pull the base model** — Download the Qwen 2.5 Coder model from Ollama
4. **Create the Kompo AI model** — Apply the custom Modelfile with Kompo-optimized system prompt and parameters
5. **Validate your licence** — Enter your licence key (get one at [kompo.dev](https://kompo.dev))
6. **Save configuration** — Store your licence locally in `~/.kompo/`

## Manual Setup

If you prefer to set things up manually:

### 1. Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve
```

### 2. Pull the base model

```bash
# Default tier (recommended)
ollama pull qwen2.5-coder:14b

# Light tier (low-resource)
ollama pull qwen2.5-coder:7b

# Heavy tier (high-quality)
ollama pull qwen2.5-coder:32b
```

### 3. Create the Kompo AI model

The Modelfiles are in the [agents](https://github.com/kompojs/agents) repository:

```bash
# Default
ollama create kompo-ai -f models/Modelfile

# Light
ollama create kompo-ai-light -f models/Modelfile.light

# Heavy
ollama create kompo-ai-heavy -f models/Modelfile.heavy
```

## Starting the Proxy

Start the Kompo AI proxy as a background daemon:

```bash
# Start
kompo ai:serve

# Check status
kompo ai:serve status

# Stop
kompo ai:serve stop
```

The proxy runs on `http://localhost:11435` and provides an OpenAI-compatible API.

## Using from the Terminal

Once the proxy is running, you can chat directly:

```bash
kompo ai
```

This opens an interactive REPL that maintains conversation history within the session.

## Checking Status

View your quota, plan, and proxy status:

```bash
kompo ai:status
```

## Verifying the Setup

```bash
# 1. Check Ollama is running
ollama list | grep kompo-ai

# 2. Check the proxy is healthy
curl http://localhost:11435/health

# 3. Send a test message
kompo ai
# > Generate a Kompo entity for a Wallet with balance and owner
```

## Troubleshooting

### Ollama not found

Make sure Ollama is installed and running:

```bash
ollama serve  # Start Ollama if not running
ollama list   # Should show available models
```

### Model pull fails

Check your internet connection and available disk space. The default model requires ~8 GB of disk space.

### Proxy won't start

Check if another process is using port 11435:

```bash
lsof -i :11435
```

### Out of quota

Check your current usage:

```bash
kompo ai:status
```

Upgrade your plan at [kompo.dev/pricing](https://kompo.dev/pricing) or wait for the daily limit to reset.

## Next Steps

- [IDE Integration](/en/ai/ide-integration) — Connect your favourite IDE
- [Kompo AI Overview](/en/ai/overview) — Learn about the architecture
