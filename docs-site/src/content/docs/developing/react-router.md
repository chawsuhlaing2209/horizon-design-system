---
title: React Router
description: Where the stylesheets and the theme attribute go in a React Router framework-mode app.
---

## The stylesheets

In framework mode, import the stylesheets in `app/root.tsx`, so every route gets them:

```tsx
// app/root.tsx
import '@theproductiveschedule/horizon-design-system/tokens.css';
import '@theproductiveschedule/horizon-design-system/styles.css';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

## Picking a theme on the server

Set `data-theme` on `<html>` in `Layout` from something the server knows — a cookie holding the reader's choice — so the first paint is already in the right theme. Switching later is one attribute change on `document.documentElement`.

## SPA mode and data mode

Import the stylesheets in the file that creates the router, before it renders. Set `data-theme` on `<html>` in `index.html`.

## What the components will not do for you

- They do not navigate. `Button` renders a native `<button>` with `type="button"`; wrap a link in your router's `<Link>` instead.
- They do not pick a theme. The attribute is yours to set.
