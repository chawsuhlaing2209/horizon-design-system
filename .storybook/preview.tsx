// The product artefacts, exactly as build-tokens.js ships them. Importing the
// real CSS means the docs break when the build breaks, which is the point.
import '../build/tokens/css/tokens.css';
import '../build/tokens/css/tokens-dark.css';
// Generated light block, so a light panel nested inside a dark page renders
// light. See writeLightThemeBlock() in build-token-data.js.
import '../build/tokens/css/docs-theme-light.css';
import './docs.css';
// CLAUDE.md: install required font and load properly from Google Font CDN.
import './fonts.css';

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Semantic colour mode',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'light' },

  decorators: [
    // Custom properties inherit, so setting the attribute on a wrapper is
    // enough to re-declare the dark values for everything inside it.
    (Story, context) => (
      <div className="docs-root" data-theme={context.globals.theme}>
        <Story />
      </div>
    ),
  ],

  parameters: {
    layout: 'fullscreen',
    // The token-docs pages have no props, so controls and actions are off by
    // default. Component stories re-enable both at their own meta level.
    controls: { disable: true },
    actions: { disable: true },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Overview', 'Colour', 'Spacing', 'Sizing', 'Type scale', 'Typography', 'Elevation'],
          'Components',
        ],
      },
    },
  },
};

export default preview;
