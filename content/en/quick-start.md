---
title: Quick Start
description: Start building your application in 5 minutes with Kompo.
---

## Introduction

Kompo is designed to be flexible: **create a new project** from scratch or **add Kompo to an existing monorepo**.

## Option 1: Create a New Project

::: code-group

```bash [pnpm]
pnpm create kompo@latest my-app
```

```bash [npm]
npm create kompo@latest my-app
```

```bash [yarn]
yarn create kompo my-app
```

```bash [bun]
bun create kompo my-app
```

:::

The scaffolder will:
1. Create a monorepo structure (`apps/`, `libs/`, `packages/`)
2. Install `@kompo/core` and dependencies
3. Run `kompo add app` interactively

### With a template

Skip prompts by specifying a template:

```bash
pnpm create kompo@latest my-app --template nextjs.tailwind.blank
```

## Option 2: Add to an Existing Monorepo

Already have a Turborepo, Nx, or pnpm workspace? Install Kompo directly:

::: code-group

```bash [pnpm]
pnpm add -D @kompo/core
pnpm kompo init
```

```bash [npm]
npm install -D @kompo/core
npx kompo init
```

```bash [yarn]
yarn add -D @kompo/core
yarn kompo init
```

```bash [bun]
bun add -d @kompo/core
bunx kompo init
```

:::

Then add your first application:

```bash
kompo add app
```

## Choose your Path

### Use a Starter (Recommended)

Launch a complete application with best practices built-in:

```bash
kompo add app --template nextjs.shadcn.blank
```

### Build from Scratch

**1. Add an app**

```bash
kompo add app my-app
```

**2. Add a Domain**

```bash
kompo add domain nft
```

**3. Add an Adapter**

```bash
kompo add adapter
```

**4. Wire it all up**

```bash
kompo wire nft
```

## Launch

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app in action!

## Next Steps

- [Understand the Architecture](/en/understand/architecture)
- [Master the CLI](/en/cli/overview)
- [Explore Templates](/en/templates/overview)
- [Contributing](/en/contributing)
