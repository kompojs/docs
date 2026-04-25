---
title: IDE Integration
description: Connect your IDE to Kompo AI — works with Cursor, Windsurf, VSCode + Continue, and more.
---

# IDE Integration

Kompo AI exposes an **OpenAI-compatible API** on `localhost:11435`. Any IDE or tool that supports custom LLM endpoints can use it.

## Connection Details

| Setting | Value |
|---------|-------|
| **Endpoint** | `http://localhost:11435` |
| **API Base** | `http://localhost:11435/v1` |
| **Model name** | `kompo-ai` |
| **API Key** | Not required (leave empty or use any string) |

::: tip
Make sure the proxy is running before connecting your IDE:
```bash
kompo ai:serve
```
:::

## Cursor

1. Open **Settings** → **Models**
2. Click **Add Model**
3. Set:
   - **Model Name**: `kompo-ai`
   - **API Base URL**: `http://localhost:11435/v1`
   - **API Key**: `kompo` (any non-empty string)
4. Select `kompo-ai` as your active model

## Windsurf

1. Open **Settings** → **AI Provider**
2. Select **Custom OpenAI-Compatible**
3. Set:
   - **Base URL**: `http://localhost:11435/v1`
   - **Model**: `kompo-ai`
   - **API Key**: `kompo`
4. Save and start using Kompo AI in the chat panel

## VSCode + Continue

[Continue](https://continue.dev) is an open-source AI code assistant for VSCode.

1. Install the **Continue** extension
2. Open Continue config (`~/.continue/config.json`)
3. Add Kompo AI as a model:

```json
{
  "models": [
    {
      "title": "Kompo AI",
      "provider": "openai",
      "model": "kompo-ai",
      "apiBase": "http://localhost:11435/v1",
      "apiKey": "kompo"
    }
  ]
}
```

4. Select **Kompo AI** from the model dropdown in the Continue panel

## JetBrains IDEs (IntelliJ, WebStorm, etc.)

With the [Continue for JetBrains](https://plugins.jetbrains.com/plugin/22707-continue) plugin:

1. Install the **Continue** plugin from the JetBrains Marketplace
2. Configure as above using the same `config.json`

## Neovim

With [avante.nvim](https://github.com/yetone/avante.nvim) or [codecompanion.nvim](https://github.com/olimorris/codecompanion.nvim):

```lua
-- avante.nvim example
require("avante").setup({
  provider = "openai",
  openai = {
    endpoint = "http://localhost:11435/v1",
    model = "kompo-ai",
    api_key = "kompo",
  },
})
```

## Any OpenAI-Compatible Client

Kompo AI works with any tool that supports custom OpenAI endpoints. The proxy implements:

- `GET /health` — Proxy status, model info, quota
- `POST /v1/chat/completions` — Chat completions (streaming and non-streaming)
- `GET /v1/models` — List available models

### cURL Example

```bash
curl http://localhost:11435/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kompo-ai",
    "messages": [
      {"role": "user", "content": "Generate a Kompo entity for a Wallet"}
    ],
    "stream": false
  }'
```

### Python (openai SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11435/v1",
    api_key="kompo",
)

response = client.chat.completions.create(
    model="kompo-ai",
    messages=[{"role": "user", "content": "Generate a Kompo entity for a Wallet"}],
)

print(response.choices[0].message.content)
```

## What Gets Injected

When you send a message through any IDE, the proxy automatically:

1. **Retrieves documentation** — Finds relevant Kompo docs via Upstash Vector
2. **Retrieves project context** — Finds relevant code from your local project index
3. **Injects a system prompt** — Adds Kompo-specific instructions and the retrieved context
4. **Forwards to Ollama** — Sends the enriched prompt for local inference

You don't need to configure anything — RAG injection happens transparently for every request.

## Next Steps

- [Setup Guide](/en/ai/setup) — Install and configure Kompo AI
- [Workbench AI Tabs](/en/ai/workbench) — Manage AI from the workbench UI
