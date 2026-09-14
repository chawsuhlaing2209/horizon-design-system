# Horizon Design System

React components for Horizon, built from the Horizon Figma library and styled entirely by design tokens. Published on npm as `@theproductiveschedule/horizon-design-system`.

- **Docs:** https://horizon-docs-alpha.vercel.app
- **Storybook:** https://horizon-design-system-delta.vercel.app
- **npm:** https://www.npmjs.com/package/@theproductiveschedule/horizon-design-system

## Install

```bash
npm install @theproductiveschedule/horizon-design-system
```

React 19 is a peer dependency. Install `react` and `react-dom` `^19.0.0` alongside the package if your app does not already have them.

## Usage

Import the tokens and the component styles once, at the root of your app, then use the components.

```tsx
import '@theproductiveschedule/horizon-design-system/tokens.css';
import '@theproductiveschedule/horizon-design-system/styles.css';
import { Button, Card } from '@theproductiveschedule/horizon-design-system';

export function Example() {
  return (
    <Card
      layout={{ orientation: 'vertical', hasSlot: true }}
      text={{ title: 'Casa do Bairro', locationInfo: 'Alfama, Lisbon' }}
      slot={<Button variant="outlined">View details</Button>}
    />
  );
}
```

The package ships ESM and CommonJS builds with TypeScript types. Both builds start with `"use client"`, so the components can be imported from React Server Component frameworks.

### Dark theme

Light values sit on `:root`. Set `data-theme="dark"` on an ancestor, usually `<html>`, to switch to the dark values:

```html
<html data-theme="dark">
```

## Components

| Component | What it is |
|---|---|
| `Button` | An action, `filled` or `outlined`, with `enable`, `hover`, `focused` and `disabled` states. |
| `Card` | A content card composed of an image, text and an optional slot, laid out `vertical` or `horizontal`. |

Each component has a page on the docs site with its design, props, usage guidance, examples and changelog.

## Develop

This repo uses npm.

| Job | Command |
|---|---|
| Install | `npm install` |
| Build tokens | `npm run build:tokens` |
| Run Storybook | `npm run storybook` |
| Test | `npm test` |
| Type check | `npm run lint` |
| Build the npm package | `npm run build:package` |

How components are built here — tokens, naming, states and roles — is in [`CLAUDE.md`](CLAUDE.md). The stack and every command are in [`tools.md`](tools.md).

## Contributing

- Component work happens on its own branch and is merged into `staging` by pull request.
- `main` accepts pull requests from `staging` only.
- npm releases publish from `main` only, through `npm run release:publish`.
- The docs site lives on the `astro` branch, which deploys it. It never merges into `main`.

## Help

- Open an issue: https://github.com/chawsuhlaing2209/horizon-design-system/issues
- Browse every component and state in Storybook: https://horizon-design-system-delta.vercel.app

## License

ISC, as declared in `package.json`.
