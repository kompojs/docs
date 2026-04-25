import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './content',
  base: '/docs/',
  title: 'Kompo',
  description: 'Build Web3 apps faster and professionally with hexagonal architecture',
  ignoreDeadLinks: true,
  cleanUrls: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      md.use(groupIconMdPlugin)
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
      }),
    ],
    // Explicitly load these languages for types highlighting
    languages: ['js', 'jsx', 'ts', 'tsx']
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Google Fonts – preconnect for performance
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@500&display=swap' }],
  ],
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cloudflare: 'logos:cloudflare-workers-icon',
        },
      }),
    ],
    server: {
      allowedHosts: true,
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      link: '/fr/',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Introduction', link: '/fr/intro' },
          { text: 'Démarrage rapide', link: '/fr/quick-start' },
          { text: 'CLI', link: '/fr/cli/overview' },
          { text: 'Templates', link: '/fr/templates/overview' },
        ],
        sidebar: [
          {
            text: 'Démarrage',
            collapsed: true,
            items: [
              { text: 'Introduction', link: '/fr/intro' },
              { text: 'Démarrage Rapide', link: '/fr/quick-start' },
              { text: 'Votre Premier Domaine', link: '/fr/your-first-domain' },
              { text: 'Structure du Projet', link: '/fr/project-structure' },
            ],
          },
          {
            text: 'CLI',
            collapsed: true,
            items: [
              { text: 'Vue d\'ensemble', link: '/fr/cli/overview' },
              {
                text: 'Commandes',
                items: [
                  { text: 'kompo add app', link: '/fr/cli/commands/add-app' },
                  { text: 'kompo add', link: '/fr/cli/commands/add' },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/kompo_logo.webp',
    nav: [
      { text: 'Docs', link: '/en/docs/' },
      { text: 'Examples', link: '/en/examples/' },
      { text: 'Discussions', link: 'https://github.com/orgs/kompojs/discussions' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/en/intro' },
          { text: 'Quick Start', link: '/en/quick-start' },
          { text: 'Your First Domain', link: '/en/your-first-domain' },
          { text: 'Project Structure', link: '/en/project-structure' },
          { text: 'Developer Experience', link: '/en/developer-experience' },
        ],
      },
      {
        text: 'Understanding Kompo',
        collapsed: true,
        items: [
          { text: 'Architecture', link: '/en/understand/architecture' },
          { text: 'Domain', link: '/en/understand/domain' },
          { text: 'Ports & Adapters', link: '/en/understand/ports-adapters' },
          { text: 'Composition', link: '/en/understand/composition' },
          { text: 'Blueprints', link: '/en/understand/blueprints' },
          { text: 'Terminology', link: '/en/understand/terminology' },
          { text: 'Package Management', link: '/en/understand/package-management' },
          { text: 'Environment Variables', link: '/en/understand/environment-variables' },
        ],
      },
      {
        text: 'CLI',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/en/cli/overview' },
          { text: 'Usage', link: '/en/cli/usage' },
          { text: 'Workflow', link: '/en/cli/workflow' },
          { text: 'Config', link: '/en/cli/config' },
          {
            text: 'Commands',
            items: [
              { text: 'kompo add app', link: '/en/cli/commands/add-app' },
              { text: 'kompo add', link: '/en/cli/commands/add' },
              { text: 'kompo generate', link: '/en/cli/commands/generate' },
            ],
          },
        ],
      },
      {
        text: 'Templates',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/en/templates/overview' },
          { text: 'NFT Marketplace', link: '/en/templates/nft-marketplace' },
          { text: 'DAO Governance', link: '/en/templates/dao-governance' },
          { text: 'Token Detection', link: '/en/templates/token-detection' },
          { text: 'Create Custom Template', link: '/en/templates/create-custom' },
        ],
      },
      {
        text: 'Build',
        collapsed: true,
        items: [{ text: 'Build Overview', link: '/en/build/overview' }],
      },
      {
        text: 'Deploy',
        collapsed: true,
        items: [
          { text: 'Deploy Overview', link: '/en/deploy/overview' },
          { text: 'Platforms', link: '/en/deploy/platforms' },
          { text: 'Cloudflare Pages', link: '/en/deploy/cloudflare-pages' },
          { text: 'Environment Variables', link: '/en/deploy/env-vars' },
          { text: 'Checklist', link: '/en/deploy/checklist' },
        ],
      },
      {
        text: 'Workbench',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/en/workbench/overview' },
          { text: 'Architecture Graph', link: '/en/workbench/architecture-graph' },
          { text: 'Stack Inspector', link: '/en/workbench/stack-inspector' },
          { text: 'Dependency Viewer', link: '/en/workbench/dependency-viewer' },
        ],
      },
      {
        text: 'Kompo AI',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/en/ai/overview' },
          { text: 'Setup Guide', link: '/en/ai/setup' },
          { text: 'IDE Integration', link: '/en/ai/ide-integration' },
          { text: 'Workbench AI Tabs', link: '/en/ai/workbench' },
          { text: 'Contributing', link: '/en/ai/contributing' },
        ],
      },
      {
        text: 'Extensibility',
        collapsed: true,
        items: [{ text: 'Extensibility', link: '/en/extensibility' }],
      },
      {
        text: 'Contributing',
        collapsed: true,
        items: [
          { text: 'How to Contribute', link: '/en/contributing' },
          { text: 'Local Development', link: '/en/local-development' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kompojs' },
      { icon: 'x', link: 'https://x.com/kompojs' },
      { icon: 'discord', link: 'https://discord.gg/kompojs' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/kompo.dev' },
    ],
    outline: {
      level: [2, 3],
    },
    editLink: {
      pattern: 'https://github.com/kompojs/docs/edit/main/content/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2026 Kompo Dev contributors.',
    },
  },
})
