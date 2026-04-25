---
title: Contributing
description: How to contribute to Kompo — code, blueprints, documentation, and more.
---

# Contributing to Kompo

Kompo is an open-source project and we welcome contributions of all kinds — code, blueprints, documentation, bug reports, and feature ideas.

## Project Structure

Kompo is split across multiple repositories under the [kompojs](https://github.com/kompojs) GitHub organization:

| Repository | What it contains | Key packages |
|:--|:--|:--|
| [kompojs/kompo](https://github.com/kompojs/kompo) | CLI, runtime, configuration | `@kompo/cli`, `@kompo/kit`, `@kompo/config`, `@kompo/core` |
| [kompojs/agents](https://github.com/kompojs/agents) | AI agent, proxy, RAG pipeline | `@kompo/ai` |
| [kompojs/blueprints](https://github.com/kompojs/blueprints) | Templates, starters, adapters | `@kompo/blueprints`, `@kompo/blueprints-nextjs`, etc. |
| [kompojs/create-kompo](https://github.com/kompojs/create-kompo) | Project scaffolder | `create-kompo`, `@kompojs/create-kompo` |
| [kompojs/workbench](https://github.com/kompojs/workbench) | Visual architecture explorer | `@kompo/workbench` |
| [kompojs/docs](https://github.com/kompojs/docs) | Documentation (this site) | VitePress |

## Getting Started

### 1. Fork and clone

```bash
# Example: contributing to the core
git clone https://github.com/<your-username>/core.git
cd core
```

### 2. Install dependencies

All repositories use **pnpm** as the package manager:

```bash
pnpm install
```

### 3. Build

```bash
pnpm build
```

### 4. Create a branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bugfix
```

### 5. Set up Development Mode

For local development across multiple repositories, use the development setup script:

```bash
# Switch to development mode (uses local file references)
pnpm dev:setup

# Switch to production mode (uses published versions)
pnpm prod:setup

# Check current mode
pnpm dev:status
```

The script automatically:
- Updates package.json to use local file references for blueprint packages
- Checks that all Kompo repositories are present
- Runs `pnpm install` to link everything

### 6. Make your changes

- Write tests for new functionality
- Run `pnpm test` to verify
- Run `pnpm typecheck` (or `tsc --noEmit`) to check types

### 7. Submit a Pull Request

Push your branch and open a PR against the `main` branch. Include:

- A clear description of the change
- Related issue numbers (if any)
- Screenshots for UI changes

## Contributing Blueprints

Blueprints are one of the most impactful contributions you can make. Here's how:

### Add a new framework

1. Fork [kompojs/blueprints](https://github.com/kompojs/blueprints)
2. Create a new package under `packages/`:
   ```
   packages/blueprints-sveltekit/
     kompo.blueprint.json
     package.json
     elements/
       apps/sveltekit/
         framework/
           files/         # .eta template files
           catalog.json   # npm dependencies
     starters/
       sveltekit/
         tailwind/
           blank/
             starter.json
   ```
3. Add the `kompo.blueprint.json` manifest:
   ```json
   {
     "$schema": "https://kompojs.dev/schemas/kompo.blueprint.json",
     "kompo": "1.0",
     "name": "@kompo/blueprints-sveltekit",
     "type": "framework",
     "framework": "sveltekit",
     "paths": {
       "elements": "elements/",
       "starters": "starters/"
     }
   }
   ```
4. Submit a PR

### Add a new adapter

Adapters live in `@kompo/blueprints` (the core package):

```
packages/blueprints/elements/libs/adapters/<port>/providers/<engine>/
  files/           # Template files
  catalog.json     # Dependencies
```

### Add a new starter

Starters are recipes that combine framework + design system:

```json
{
  "id": "nextjs.chakra.blank",
  "name": "Blank Next.js + Chakra UI",
  "description": "Minimal Next.js application with Chakra UI",
  "steps": [
    {
      "command": "add",
      "type": "app",
      "name": "web",
      "driver": "nextjs",
      "designSystem": "chakra"
    }
  ]
}
```

Place it in `starters/<framework>/<design-system>/blank/starter.json`.

### Community blueprint packages

You can also publish your own blueprint package independently:

```bash
# Create your package
mkdir my-kompo-blueprints && cd my-kompo-blueprints
npm init -y

# Add kompo.blueprint.json, elements/, starters/
# Then publish
npm publish
```

Users install it with:

```bash
pnpm add -D @acme/kompo-blueprints-sveltekit
```

The CLI auto-discovers any installed package with a `kompo.blueprint.json`.

## Contributing to the CLI

The CLI source is in [kompojs/kompo](https://github.com/kompojs/kompo) under `packages/cli/`.

### Running the CLI in dev mode

**From the kompo repo**:
```bash
cd kompo
pnpm --filter @kompo/cli kompo <command>
```

**From external projects** (testing with different package managers):

**Option A: Add a script to your test project** (recommended)
```json
{
  "scripts": {
    "kompo": "tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"
  }
}
```
Then run: `bun kompo <command>`, `npm run kompo <command>`, etc.

**Option B: Direct execution**
```bash
# Test with bun
bunx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>

# Test with npm
npm exec tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>

# Test with yarn
yarn dlx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>
```

::: tip Development vs Published
- **Development**: Use Option A or B above to run from source
- **After publishing**: Simple commands like `bunx kompo <command>` will work for end users
:::

### Package Manager Agnostic Testing

The CLI works with any package manager:
- **All workspaces**: Uses `kompo.catalog.json` as the sole source of truth
- **Never modifies workspace files** (no `pnpm-workspace.yaml` changes)
- **Package manager agnostic**: Same behavior for pnpm, bun, npm, yarn

Test in any existing monorepo regardless of the package manager!

### Adding a new command

1. Create `src/commands/my-command.ts`
2. Register it in `src/bin/kompo.ts`
3. Add tests

### Adding a doctor check

Create a file in `src/commands/doctor/checks/`:

```typescript
import type { DoctorCheck, DoctorCheckContext, DoctorCheckResult } from '../doctor.check'
import { registerDoctorCheck } from '../doctor.registry'

export const myCheck: DoctorCheck = {
  id: 'my-check',
  description: 'Checking something important',
  async run(ctx: DoctorCheckContext): Promise<DoctorCheckResult[]> {
    // Your check logic
    return [{ status: 'ok' }]
  },
}

registerDoctorCheck(myCheck)
```

Then import it in `src/commands/doctor.command.ts`.

## Contributing Documentation

The documentation lives in [kompojs/docs](https://github.com/kompojs/docs) and uses [VitePress](https://vitepress.dev/).

```bash
cd docs
pnpm install
pnpm dev
```

Documentation pages are Markdown files in `content/en/`. The sidebar is configured in `.vitepress/config.ts`.

## Code Style

- **TypeScript** for all source code
- **ESLint** + **Biome** for formatting
- No trailing semicolons in template files
- Kebab-case for file names
- PascalCase for types and interfaces

## Community

- [GitHub Discussions](https://github.com/orgs/kompojs/discussions) — Questions, ideas, RFC
- [Discord](https://discord.gg/RcXGwnyEgZ) — Real-time chat
- [Twitter/X](https://x.com/kompojs) — Updates and announcements

## License

All Kompo repositories are licensed under [MIT](https://opensource.org/licenses/MIT).
