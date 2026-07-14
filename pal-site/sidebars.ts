import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  rostrSidebar: [
    {
      type: 'doc',
      id: 'quick-start',
      label: 'Quick Start',
    },
    {
      type: 'doc',
      id: 'rostr-architecture',
      label: 'ROSTR Architecture',
    },
    {
      type: 'category',
      label: 'PAL — Prompt Abstraction Layer',
      collapsed: false,
      items: [
        'pal-whitepaper',
        'pal-five-stages',
        'pal-implementation',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'ragdal-knowledge',
        'npao-orchestrator',
        'rostr-hub',
      ],
    },
    {
      type: 'doc',
      id: 'deploy',
      label: 'One-Click Deploy',
    },
  ],
};

export default sidebars;
