---
title: React
description: Where the stylesheets go in Vite, Next.js and Webpack, how to switch themes at runtime, and what the components let you override.
---

## Vite

Import the stylesheets in the entry file, before the app renders:

```tsx
// src/main.tsx
import '@theproductiveschedule/horizon-design-system/tokens.css';
import '@theproductiveschedule/horizon-design-system/styles.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

## Webpack and Create React App

The same imports in the entry file work with any bundler that handles CSS imports (`css-loader` and `style-loader`, or `mini-css-extract-plugin`). The package's `sideEffects` field names `**/*.css`, so tree-shaking never drops the stylesheets.

## Next.js (App Router)

Import the stylesheets in the root layout, and set the theme attribute on `<html>`:

```tsx
// app/layout.tsx
import '@theproductiveschedule/horizon-design-system/tokens.css';
import '@theproductiveschedule/horizon-design-system/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

Both builds begin with `"use client"`, so you can render `Button` and `Card` from a server component page; they hydrate as client components.

## Server rendering

The components render the same markup on the server and the client. `Card`'s favourite button keeps its own pressed state when you do not pass `favorited`, so its first render uses `defaultFavorited`.

## Switching themes at runtime

The theme is an attribute, so switching is one line:

```tsx
document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
```

To avoid a flash of the wrong theme, set the attribute before first paint: on the server, or in an inline script in `<head>`.

## Overriding

- `Button` accepts `className`. It is merged after `hds-button`, never in place of it, and every other native `<button>` attribute passes through.
- `Card` accepts no `className`. Its configuration goes through `state`, `layout`, `image`, `text` and `slot`.

Change a value through its token in Figma, not by overriding a component's CSS: an override survives the next token export only by accident.

## Composition

`Card`'s `slot` renders any content when `layout.hasSlot` is true, including a `Button`:

```tsx
<Card
  layout={{ orientation: 'vertical', hasSlot: true }}
  text={{ title: 'Casa do Bairro', locationInfo: 'Alfama, Lisbon' }}
  slot={<Button variant="outlined">View details</Button>}
/>
```
