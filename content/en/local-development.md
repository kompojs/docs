---
title: Local Development
description: How to develop and test Kompo packages locally across multiple repositories.
---

# Local Development

Kompo is split across multiple repositories. When working on features that span repos (e.g. a CLI change that depends on a new blueprint), you need a way to link them locally. This guide explains the recommended approaches.

## Repository Layout

We recommend cloning all repos side-by-side in one parent directory:

```
kompojs/               # Parent directory (not a repo itself)
├── kompo/              # @kompo/cli, @kompo/kit, @kompo/config, @kompo/core
├── agents/             # @kompo/ai (proxy, RAG, Ollama integration)
├── blueprints/         # @kompo/blueprints, @kompo/blueprints-nextjs, etc.
├── create-kompo/       # create-kompo, @kompojs/create-kompo
├── workbench/          # @kompo/workbench
└── docs/               # Documentation (VitePress)
```

```bash
mkdir kompojs && cd kompojs
git clone https://github.com/kompojs/kompo.git
git clone https://github.com/kompojs/agents.git
git clone https://github.com/kompojs/blueprints.git
git clone https://github.com/kompojs/create-kompo.git
git clone https://github.com/kompojs/workbench.git
git clone https://github.com/kompojs/docs.git
```

## Linking Strategy: `file:` Protocol

The recommended way to link packages across repos during local development is the **`file:` protocol** in `package.json`. This is what the Kompo repos already use.

### Why `file:` over `pnpm link`?

| Approach | Pros | Cons |
|:--|:--|:--|
| **`file:` protocol** | Declarative, reproducible, PM agnostic for end users, persists across installs | Relative path must match your directory layout |
| `pnpm link` | No package.json changes needed | Global symlinks can conflict, doesn't persist, easy to forget |
| `pnpm link --dir` | Targeted linking | Must re-run after every `pnpm install` |

**`file:` is the winner** because:
- It's **declarative** — anyone cloning the repos with the same layout gets it working
- It **survives `pnpm install`** — no manual re-linking needed
- It works identically with **pnpm, npm, yarn, and bun** (package manager agnostic for end users)
- It resolves the actual package directory (including its `elements/`, `starters/`, etc.)

### How it works

In `kompo/packages/cli/package.json`:

```json
{
  "dependencies": {
    "@kompo/ai": "link:../../../agents/packages/ai",
    "@kompo/blueprints": "file:../../../blueprints/packages/blueprints",
    "@kompo/config": "file:../../config",
    "@kompo/kit": "file:../../kit"
  }
}
```

The path `../../../blueprints/packages/blueprints` is relative to the file's location:

```
kompo/packages/cli/package.json
  → ../           = kompo/packages/
  → ../../        = kompo/
  → ../../../     = kompojs/        (parent directory)
  → ../../../blueprints/packages/blueprints  ✓
```

::: tip
- **Within a single monorepo** (like packages inside `kompo/`): use `workspace:*`
- **Between different repositories** (like `kompo/` → `blueprints/`): use `file:` with a relative path
- **For published packages**: `file:` becomes regular version ranges (e.g. `^0.1.3`) during publishing
:::

## Setting Up Local Development

### 1. Install each repo

```bash
cd kompo && pnpm install
cd ../agents && pnpm install
cd ../blueprints && pnpm install
cd ../create-kompo && pnpm install
cd ../workbench && pnpm install
```

**Note**: For local development, all inter-repo dependencies use `file:` protocol instead of `workspace:*`. This ensures the CLI works with any package manager (pnpm, npm, yarn, bun) when users install Kompo in their projects.

### 2. Use the Development Setup Script (Recommended)

The Kompo monorepo includes an automated setup script that handles switching between development and production modes:

```bash
# Switch to development mode (uses local file references)
pnpm dev:setup

# Switch to production mode (uses published versions)
pnpm prod:setup

# Check current mode
pnpm dev:status
```

#### What the script does:
- **Development Mode**: Updates `packages/core/package.json` to use `file:../../../blueprints/...` references
- **Production Mode**: Updates to use published versions (e.g., `0.1.3-beta.6`)
- **Repository Check**: Verifies all Kompo repos are present in the parent directory
- **Auto Install**: Runs `pnpm install` after switching modes

#### Repository Structure Required:
```
kompojs/
├── kompo/           # Core monorepo (where you run the script)
├── agents/          # AI agent, proxy, RAG pipeline
├── blueprints/      # Blueprint packages
├── create-kompo/    # CLI scaffolder
├── workbench/       # DevTools workbench
├── docs/            # Documentation
└── platform/        # Platform backend
```

## Package Manager Agnostic Behavior

The Kompo CLI is **package manager agnostic** and works seamlessly with:

- **pnpm** (used for Kompo development)
- **bun** (including bun workspaces)
- **npm** (including npm workspaces)
- **yarn** (including yarn workspaces)

### How it works

1. **Workspace detection**: The CLI automatically detects your workspace type:
   - `pnpm-workspace.yaml` → pnpm workspace
   - `package.json#workspaces` + lockfile → npm/yarn/bun workspace

2. **Package manager detection**: Identifies your PM from lockfiles:
   - `pnpm-lock.yaml` → pnpm
   - `bun.lock`/`bun.lockb` → bun
   - `yarn.lock` → yarn
   - `package-lock.json` → npm

3. **Catalog management**: 
   - **All workspaces**: Uses `kompo.catalog.json` as the sole source of truth
   - **Never modifies workspace files** (no `pnpm-workspace.yaml` changes)
   - **Package manager agnostic**: Same behavior for pnpm, bun, npm, yarn

This means you can use Kompo in any existing monorepo regardless of the package manager!

### 2. Build blueprints first

The core CLI depends on blueprints, so build them first:

```bash
cd blueprints
pnpm build
```

### 3. Run the CLI in dev mode

From the kompo repo, run the CLI directly via `tsx` (no build required):

```bash
cd kompo
pnpm --filter @kompo/cli kompo add app
```

This uses the `kompo` script in `packages/cli/package.json`:

```json
{
  "scripts": {
    "kompo": "tsx src/bin/kompo.ts"
  }
}
```

### 4. Running the CLI from external projects

**Option A: Add a script to your test project** (recommended)

Add this to your test project's `package.json`:

```json
{
  "scripts": {
    "kompo": "tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"
  }
}
```

Then run with any package manager:
```bash
bun kompo <command>
npm run kompo <command>
yarn kompo <command>
pnpm kompo <command>
```

**Option B: Direct execution**

```bash
# From any project with any package manager
bunx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>
npm exec tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>
yarn dlx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>
pnpm dlx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts <command>
```

::: tip Development vs Published
- **Development**: Use Option A or B above to run from source
- **After publishing**: Simple commands like `bunx kompo <command>` will work
:::

### 5. Test against a real monorepo

For the most realistic testing, use an actual monorepo rather than a minimal test project. This simulates how users will actually use Kompo in production.

#### Recommended: Direct CLI Execution

The simplest and most effective approach is to run the CLI directly from source:

```bash
# Clone the official monorepo samples repository
git clone https://github.com/kompojs/monorepo-samples.git /tmp/monorepo-samples
cd /tmp/monorepo-samples

# Choose a package manager to test with
cd bun  # or pnpm, npm, yarn

# Install dependencies
bun install  # or pnpm install, npm install, yarn install

# Add a kompo script to package.json for convenience
npm pkg set scripts.kompo="bunx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"

# Now you can use the short command
bun kompo --version
bun kompo init --yes
bun kompo add app --template nextjs.tailwind.blank --yes
```

This approach:
- ✅ **No package installation needed** - Just run CLI from source
- ✅ **Works with any package manager** - bunx, npx, yarn dlx, pnpm dlx
- ✅ **Uses local blueprints automatically** - Via file: links in CLI's package.json
- ✅ **Immediate feedback** - Changes are reflected instantly
- ✅ **No workspace dependency issues** - Bypasses installation complexity

#### Complete Testing Workflow

The workflow is similar across all package managers - just use the appropriate commands:

##### Bun (Recommended for testing)
```bash
# 1. Clone and set up sample monorepo
git clone https://github.com/kompojs/monorepo-samples.git /tmp/monorepo-samples
cd /tmp/monorepo-samples/bun
bun install

# 2. Add kompo script for convenience
npm pkg set scripts.kompo="bunx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"

# 3. Test Kompo commands
bun kompo --version
bun kompo init --yes
bun kompo add app --template nextjs.tailwind.blank --yes

# 4. Test the generated app
cd apps/your-app-name
bun run dev
```

##### pnpm
```bash
# 1. Clone and set up sample monorepo
git clone https://github.com/kompojs/kompo-samples.git /tmp/kompo-samples
cd /tmp/kompo-samples/pnpm

# 2. Install dependencies
pnpm install

# 3. Add kompo script for convenience
npm pkg set scripts.kompo="pnpm dlx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"

# 4. Test Kompo commands
pnpm kompo --version
pnpm kompo init --yes
pnpm kompo add app --template nextjs.tailwind.blank --yes

# 5. Test the generated app
cd apps/your-app-name
pnpm dev
```

##### npm
```bash
# 1. Clone and set up sample monorepo
git clone https://github.com/kompojs/kompo-samples.git /tmp/kompo-samples
cd /tmp/kompo-samples/npm

# 2. Install dependencies
npm install

# 3. Add kompo script for convenience
npm pkg set scripts.kompo="npx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"

# 4. Test Kompo commands
npm run kompo --version
npm run kompo init --yes
npm run kompo add app --template nextjs.tailwind.blank --yes

# 5. Test the generated app
cd apps/your-app-name
npm run dev
```

##### Yarn
```bash
# 1. Clone and set up sample monorepo
git clone https://github.com/kompojs/kompo-samples.git /tmp/kompo-samples
cd /tmp/kompo-samples/yarn

# 2. Install dependencies
yarn install

# 3. Add kompo script for convenience
npm pkg set scripts.kompo="yarn dlx tsx /path/to/kompojs/kompo/packages/cli/src/bin/kompo.ts"

# 4. Test Kompo commands
yarn kompo --version
yarn kompo init --yes
yarn kompo add app --template nextjs.tailwind.blank --yes

# 5. Test the generated app
cd apps/your-app-name
yarn dev
```

##### Key Differences by Package Manager

| Package Manager | Exec Command | Package Install | Dev Script |
|----------------|--------------|----------------|------------|
| **Bun** | `bunx tsx` | `bun add -D` | `bun run` |
| **pnpm** | `pnpm dlx tsx` | `pnpm add -D` | `pnpm` |
| **npm** | `npx tsx` | `npm install --save-dev` | `npm run` |
| **Yarn** | `yarn dlx tsx` | `yarn add --dev` | `yarn` |

#### Optional: Dev Mode Script

We've included a `dev-link.sh` script for specific use cases where you need to test the CLI as an installed dependency:

```bash
# For testing create-kompo or installed package scenarios
./dev-link.sh /tmp/bun-sample
```

This is only needed for:
- Testing `create-kompo` which installs CLI from npm
- Integration tests requiring installed packages
- Testing package resolution behavior

For most development, stick with the direct execution approach above.

#### Monorepo Samples

We now provide official sample monorepos for all package managers at:
- **Repository**: `https://github.com/kompojs/monorepo-samples`
- **Structure**: `bun/`, `pnpm/`, `npm/`, `yarn/` directories
- **Contents**: Minimal monorepos with shared packages (no existing apps)
- **Packages**: Use realistic naming (`my-utils`, `my-ui`)

These samples include:
- ✅ **Minimal monorepo structure** - just shared packages
- ✅ **Package manager specific configurations** (lockfiles, scripts)  
- ✅ **Realistic package names** - not Kompo-branded
- ✅ **Ready for Kompo testing** - clean slate for adding Kompo apps

Perfect for testing how Kompo integrates into existing monorepos!

Use these samples for testing Kompo CLI behavior across different package managers and workspace configurations.

#### Resetting Package Links

To test against published packages instead of local versions:

```bash
# Remove all file: links and install from registry
cd /tmp/bun-sample
rm package-lock.json pnpm-lock.yaml yarn.lock bun.lock bun.lockb 2>/dev/null || true

# Install fresh from registry
bun install  # or pnpm install, npm install, yarn install

# Re-link local packages if needed
/path/to/kompojs/dev-link.sh .
```

## Cross-Repo Development Scenarios

### Scenario 1: Changing a blueprint template

You're editing a `.eta` template file in `blueprints/` and want to see the effect in the CLI.

1. Edit the template in `blueprints/packages/blueprints/elements/...`
2. **No build needed** — the `file:` link resolves to the source directory, and templates are read at runtime
3. Run the CLI from `kompo/` to test

### Scenario 2: Changing the blueprint resolver API

You're modifying `blueprints/packages/blueprints/src/resolver.ts`.

1. Edit the resolver in `blueprints/`
2. Rebuild blueprints: `cd blueprints && pnpm build`
3. The `file:` link in kompo now picks up the new build
4. Run the CLI from `kompo/` to test

### Scenario 3: Changing the CLI + blueprints together

1. Edit both repos
2. Rebuild blueprints: `cd blueprints && pnpm build`
3. Run the CLI via tsx (no build needed for CLI): `cd kompo && pnpm --filter @kompo/cli kompo <command>`

### Scenario 4: Testing create-kompo end-to-end

1. Build the scaffolder: `cd create-kompo && pnpm build`
2. Run it directly:
   ```bash
   node create-kompo/packages/create/dist/index.js /tmp/my-new-project --pm pnpm
   ```

::: warning
`create-kompo` installs `@kompo/cli` from **npm** by default. For local testing, use the CLI directly via `tsx` as shown in the test scenario above.
:::

### Scenario 5: Working on Kompo AI

You're improving the RAG pipeline, proxy server, or Ollama integration in `agents/`.

1. Edit source files in `agents/packages/ai/src/`
2. Rebuild the SDK: `cd agents && pnpm build`
3. Test via CLI commands:
   ```bash
   cd kompo
   pnpm --filter @kompo/cli kompo ai:status
   pnpm --filter @kompo/cli kompo ai:serve
   pnpm --filter @kompo/cli kompo ai
   ```
4. The `link:` reference in the CLI's `package.json` picks up the new build automatically

::: tip
You can also run `pnpm dev` in the `agents/` repo for watch mode — tsup rebuilds on every file change.
:::

### Scenario 6: Testing the workbench

```bash
cd workbench
pnpm dev    # Starts on http://localhost:9000
```

The workbench includes AI, Skills, and Account tabs that connect to the Kompo AI proxy. Make sure the proxy is running (`kompo ai:serve`) to test these tabs.

## Switching Between Local and Published Packages

### Automated Switching (Recommended)

Use the development setup script to switch between modes:

```bash
# Switch to development mode (uses local file references)
pnpm dev:setup

# Switch to production mode (uses published versions)
pnpm prod:setup

# Check current mode
pnpm dev:status
```

### Manual Switching

If you need to switch manually, edit `packages/core/package.json`:

```json
// For local development
"@kompo/blueprints": "file:../../../blueprints/packages/blueprints"

// For published packages
"@kompo/blueprints": "^0.1.3"
```

::: danger
Never commit `file:` paths that reference your personal directory layout. The `file:` links in the Kompo repos assume the standard sibling layout described above. If you use a different layout, adjust the paths locally but **do not commit them**.
:::

## Integration Test Script

The core repo includes a test script that verifies scaffolding works with all package managers:

```bash
cd kompo
bash test-scaffold.sh all     # Test all PMs for end-user compatibility
bash test-scaffold.sh pnpm    # Test pnpm only (recommended for development)
```

This creates isolated test directories under `/tmp/kompo-scaffold-tests/` and verifies that scaffolding works with all package managers (for end-user testing). For local development, use pnpm.

## Troubleshooting

### `file:` link not updating after changes

If you change blueprint source files and the CLI doesn't pick up the changes:

```bash
# Rebuild blueprints
cd blueprints && pnpm build

# Clear pnpm's cache for the linked package
cd kompo && pnpm install --force
```

### CLI can't find `@kompo/blueprints`

Make sure the relative path in `package.json` matches your directory layout. From `kompo/packages/cli/`:

```bash
ls ../../../blueprints/packages/blueprints/package.json
# Should exist
```

### Parent workspace interference

If the CLI resolves the wrong workspace root (e.g. finding a parent `pnpm-workspace.yaml`), test from an isolated directory like `/tmp/` instead of inside the `kompojs/` parent.

### TypeScript errors after changing blueprints

```bash
cd kompo
pnpm --filter @kompo/cli typecheck
```

If types are stale, rebuild blueprints first: `cd blueprints && pnpm build`.
