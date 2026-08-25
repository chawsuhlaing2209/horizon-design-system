// The product artefacts, exactly as build-tokens.js ships them. Importing the
// real CSS means the docs break when the build breaks, which is the point.
import '../build/css/tokens.css';
import '../build/css/tokens-dark.css';
// Generated light block, so a light panel nested inside a dark page renders
// light. See writeLightThemeBlock() in build-token-data.js.
import '../build/css/docs-theme-light.css';
import './docs.css';

/** @type {import('@storybook/html-vite').Preview} */
export default {
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
    (story, context) => {
      // Custom properties inherit, so setting the attribute on a wrapper is
      // enough to re-declare the dark values for everything inside it.
      const root = document.createElement('div');
      root.className = 'docs-root';
      root.setAttribute('data-theme', context.globals.theme);
      root.appendChild(story());
      return root;
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions: { disable: true },
    options: {
      storySort: {
        order: ['Foundations', ['Overview', 'Colour', 'Spacing', 'Sizing', 'Type scale', 'Typography', 'Elevation']],
      },
    },
  },
};
