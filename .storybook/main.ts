import { readFileSync } from 'node:fs';
import type { StorybookConfig } from '@storybook/react-vite';

// Production ships only components the registry has cleared. Vercel sets
// VERCEL_ENV itself; STORYBOOK_TARGET is the manual override so the same build
// can be reproduced locally. Anything else — a local build, a staging preview,
// the dev server — builds every component, because that is what QA tests.
const isProduction =
  process.env.VERCEL_ENV === 'production' ||
  process.env.STORYBOOK_TARGET === 'production';

const cleared: string[] = JSON.parse(
  readFileSync(new URL('./production-components.json', import.meta.url), 'utf8'),
).components;

if (isProduction && cleared.length === 0) {
  throw new Error(
    'production-components.json is empty: refusing to build a production Storybook with no cleared components.',
  );
}

const componentStories = isProduction
  ? cleared.map((name) => `../src/components/${name}/**/*.stories.@(js|jsx|ts|tsx)`)
  : ['../src/**/*.stories.@(js|jsx|ts|tsx)'];

if (isProduction) {
  console.log(`Storybook: production build, ${cleared.length} cleared component(s): ${cleared.join(', ')}`);
}

const config: StorybookConfig = {
  // Token docs live in stories/; components live beside their source in src/.
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    ...componentStories,
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
