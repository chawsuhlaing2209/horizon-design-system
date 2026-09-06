import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Token docs live in stories/; components live beside their source in src/.
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
