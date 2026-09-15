---
title: Installing Horizon in code
description: Install the package, load the two stylesheets in order, set a theme, and render the first component.
---

## Install

```bash
npm install @theproductiveschedule/horizon-design-system
```

React 19 is a peer dependency. If your app does not already have them:

```bash
npm install react@^19 react-dom@^19
```

## Load the stylesheets

Import both, once, at the root of the app. Tokens first, because the component styles read them:

```tsx
import '@theproductiveschedule/horizon-design-system/tokens.css';
import '@theproductiveschedule/horizon-design-system/styles.css';
```

| Stylesheet | What it holds |
|---|---|
| `tokens.css` | Every token as a CSS custom property: light values on `:root`, dark values on `[data-theme="dark"]` |
| `styles.css` | Every component's CSS, plus `@import`s for the **Inter** and **Material Symbols Outlined** faces from Google Fonts |

### The fonts come from Google Fonts

`styles.css` loads Inter and Material Symbols from `fonts.googleapis.com`. If your app sends a Content Security Policy, allow `https://fonts.googleapis.com` in `style-src` and `https://fonts.gstatic.com` in `font-src`. Without them the text falls back to a system face, every width changes, and Card's favourite heart renders as the word `favorite`.

## Set a theme

Light is the default. Put `data-theme="dark"` on an ancestor, usually `<html>`:

```html
<html data-theme="dark">
```

See [Theming](/styling/theming/) for what a theme changes.

## Render something

```tsx
import { Button } from '@theproductiveschedule/horizon-design-system';

export function Example() {
  return <Button variant="filled">Sign in</Button>;
}
```

## What you can import

Everything public comes from the package root. Anything not listed here is internal.

| Export | Kind |
|---|---|
| `Button` | component |
| `ButtonProps`, `ButtonVariant`, `ButtonState` | types |
| `Card` | component |
| `CardProps`, `CardState` | types |
| `CardLayoutProps`, `CardLayoutOrientation` | types, for `Card`'s `layout` prop |
| `CardImageProps`, `CardImageRatio`, `CardImageState` | types, for `Card`'s `image` prop |
| `CardTextProps` | type, for `Card`'s `text` prop |
| `./tokens.css`, `./styles.css` | stylesheets |

### ESM and CommonJS

The package ships both, with types for each. `import` resolves `dist/index.js`, `require` resolves `dist/index.cjs`. Both begin with `"use client"`, so a React Server Components framework treats the components as client components.

## Check it actually worked

- The button renders with a blue fill and Inter type. Unstyled boxes mean `styles.css` is not loaded; the right shape in the wrong colours means `tokens.css` is not.
- In devtools, `getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary')` returns a colour.

## What this version does not promise

Below `1.0.0` a minor version may remove or rename a prop. Pin the version if that would cost you, and read [Versioning](/get-started/versioning/).
