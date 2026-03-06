# Deploy docs to Cloudflare Pages

This project is set up to deploy the VitePress docs to [Cloudflare Pages](https://pages.cloudflare.com/).

## One-time setup

1. **Install dependencies** (includes Wrangler for CLI deploy):
   ```bash
   bun install
   ```

2. **Log in to Cloudflare** (for CLI deploy):
   ```bash
   bunx wrangler login
   ```

3. **Create a Pages project** (if you don't have one yet):
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** (for Git deploy) or skip and use **Direct Upload** (CLI).

## Option A: Deploy from your machine (CLI)

Build and upload the static output:

```bash
bun run deploy
```

This runs `vitepress build` then `wrangler pages deploy .vitepress/dist --project-name=kompo-docs`.

**Use a different project name:** set the name in `package.json` in the `deploy` script, or run manually:

```bash
bun run build
bunx wrangler pages deploy .vitepress/dist --project-name=YOUR_PROJECT_NAME
```

## Option B: Deploy from Git (CI)

1. In **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, connect this repo.
2. Configure the build:
   - **Framework preset:** None (or Vite if you prefer; build command and output dir override it)
   - **Build command:** `bun run build` (or `bun install && bun run build` if you want install in the same step)
   - **Build output directory:** `.vitepress/dist`
   - **Root directory:** leave empty if the docs app is the repo root; set to `docs` (or the folder that contains `package.json`) if the repo is a monorepo.
3. **Environment variables (optional):** add `BUN_VERSION` or use the default Bun in the Pages build image.
4. Save; every push to the selected branch will trigger a deploy.

## Build output

- **Build command:** `vitepress build` (via `bun run build`)
- **Output directory:** `.vitepress/dist`

Your site will be available at `https://<project-name>.pages.dev` (or your custom domain after you add it in the Pages project).
