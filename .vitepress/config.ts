import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
      { text: 'Docs', link: '/docs/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Discussions', link: 'https://github.com/orgs/kompojs/discussions' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/intro' },
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Your First Domain', link: '/your-first-domain' },
          { text: 'Project Structure', link: '/project-structure' },
          { text: 'Developer Experience', link: '/developer-experience' },
        ],
      },
      {
        text: 'Understanding Kompo',
        collapsed: true,
        items: [
          { text: 'Architecture', link: '/understand/architecture' },
          { text: 'Domain', link: '/understand/domain' },
          { text: 'Ports & Adapters', link: '/understand/ports-adapters' },
          { text: 'Composition', link: '/understand/composition' },
          { text: 'Blueprints', link: '/understand/blueprints' },
          { text: 'Terminology', link: '/understand/terminology' },
          { text: 'Package Management', link: '/understand/package-management' },
          { text: 'Environment Variables', link: '/understand/environment-variables' },
        ],
      },
      {
        text: 'CLI',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/cli/overview' },
          { text: 'Usage', link: '/cli/usage' },
          { text: 'Workflow', link: '/cli/workflow' },
          { text: 'Config', link: '/cli/config' },
          {
            text: 'Commands',
            items: [
              { text: 'kompo add app', link: '/cli/commands/add-app' },
              { text: 'kompo add', link: '/cli/commands/add' },
              { text: 'kompo generate', link: '/cli/commands/generate' },
            ],
          },
        ],
      },
      {
        text: 'Templates',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/templates/overview' },
          { text: 'NFT Marketplace', link: '/templates/nft-marketplace' },
          { text: 'DAO Governance', link: '/templates/dao-governance' },
          { text: 'Token Detection', link: '/templates/token-detection' },
          { text: 'Create Custom Template', link: '/templates/create-custom' },
        ],
      },
      {
        text: 'Build',
        collapsed: true,
        items: [{ text: 'Build Overview', link: '/build/overview' }],
      },
      {
        text: 'Deploy',
        collapsed: true,
        items: [
          { text: 'Deploy Overview', link: '/deploy/overview' },
          { text: 'Platforms', link: '/deploy/platforms' },
          { text: 'Cloudflare Pages', link: '/deploy/cloudflare-pages' },
          { text: 'Environment Variables', link: '/deploy/env-vars' },
          { text: 'Checklist', link: '/deploy/checklist' },
        ],
      },
      {
        text: 'Workbench',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/workbench/overview' },
          { text: 'Architecture Graph', link: '/workbench/architecture-graph' },
          { text: 'Stack Inspector', link: '/workbench/stack-inspector' },
          { text: 'Dependency Viewer', link: '/workbench/dependency-viewer' },
        ],
      },
      {
        text: 'Extensibility',
        collapsed: true,
        items: [{ text: 'Extensibility', link: '/extensibility' }],
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
      pattern: 'https://github.com/kompo-dev/kompo/edit/main/packages/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2026 Kompo Dev contributors.',
    },
  },
})
