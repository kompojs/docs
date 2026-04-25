# Deploy docs to Cloudflare Pages

This project is set up to deploy the VitePress docs to [Cloudflare Pages](https://pages.cloudflare.com/).

## One-time setup

1. **Install dependencies** (includes Wrangler for CLI deploy):
   ```bash
   pnpm install
   ```

2. **Log in to Cloudflare** (for CLI deploy):
   ```bash
   pnpm dlx wrangler login
   ```

3. **Create a Pages project** (if you don't have one yet):
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** (for Git deploy) or skip and use **Direct Upload** (CLI).

## Option A: Deploy from your machine (CLI)

Build and upload the static output:

```bash
pnpm deploy
```

This runs `vitepress build` then `wrangler pages deploy .vitepress/dist --project-name=kompo-docs`.

**Use a different project name:** set the name in `package.json` in the `deploy` script, or run manually:

```bash
pnpm build
pnpm dlx wrangler pages deploy .vitepress/dist --project-name=YOUR_PROJECT_NAME
```

## Option B: Deploy from Git (CI)

With Git connected, **Cloudflare runs your build and then uploads the output itself**. Do **not** use `pnpm deploy` as the build command — that runs Wrangler and needs an API token, which causes authentication errors in the build.

1. In **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, connect this repo.
2. Configure the build:
   - **Framework preset:** None (or Vite)
   - **Build command:** `pnpm build` (or `pnpm install && pnpm build`)
   - **Build output directory:** `.vitepress/dist`
   - **Root directory:** leave empty if the docs app is the repo root; set to `docs` (or the folder that contains `package.json`) if the repo is a monorepo.
3. **Environment variables (optional):** add `PNPM_VERSION` if you need a specific pnpm version in the Pages build image.
4. Save; every push to the selected branch will trigger a deploy.

**If you see "Authentication error [code: 10000]":** your build command is likely `pnpm deploy`. Change it to `pnpm build` and set the build output directory to `.vitepress/dist`. Cloudflare will deploy that folder automatically; no Wrangler or API token is used in the Git build.

## Build output

- **Build command:** `vitepress build` (via `pnpm build`)
- **Output directory:** `.vitepress/dist`

Your site will be available at `https://<project-name>.pages.dev` (or your custom domain after you add it in the Pages project).
