// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Horizon Design System documentation. One page per component under
// src/content/docs/components/, written by the astro-page skill.
export default defineConfig({
  integrations: [
    starlight({
      title: 'Horizon Design System',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/chawsuhlaing2209/horizon-design-system' },
      ],
      sidebar: [
        { label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
      ],
    }),
  ],
});
