import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ROSTR + PAL',
  tagline: 'The Billion-Dollar Agent Operating System',
  favicon: 'img/favicon.svg',

  url: 'https://rostr-deploy.vercel.app',
  baseUrl: '/',

  organizationName: 'patdim',
  projectName: 'rostr',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ROSTR',
      logo: {
        alt: 'ROSTR',
        src: 'img/favicon.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'rostrSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/diamitani/rostr-platform',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'PAL White Paper', to: '/docs/pal-whitepaper'},
            {label: 'ROSTR Architecture', to: '/docs/rostr-architecture'},
            {label: 'Quick Start', to: '/docs/quick-start'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/diamitani/rostr-platform'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Deploy', to: '/'},
          ],
        },
      ],
      copyright: `ROSTR v2.0 · Patrick Diamitani · July 2026 · MIT License`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
    },
    metadata: [
      {name: 'description', content: 'ROSTR — Runtime, Orchestration, State, Tools, Reference. The billion-dollar agent operating system with PAL prompt compilation.'},
      {name: 'og:title', content: 'ROSTR + PAL — The Billion-Dollar Agent OS'},
      {name: 'og:description', content: 'ROSTR framework with PAL compiler, RAG DAL knowledge engine, NPAO orchestrator, and Rostr Hub.'},
    ],
  } satisfies Preset.ThemeConfig,

  themes: [],
};

export default config;
