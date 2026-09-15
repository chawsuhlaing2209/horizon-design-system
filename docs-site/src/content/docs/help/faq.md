---
title: FAQ
description: The questions Horizon actually raises, answered with what is true in 0.1.0.
---

## Using it

### Can I use it without React?

No. `Button` and `Card` are React components, and `react` and `react-dom` `^19.0.0` are peer dependencies. `tokens.css` works on its own, though: the custom properties are plain CSS.

### Everything renders as unstyled boxes.

`styles.css` is not loaded. Import `@theproductiveschedule/horizon-design-system/styles.css` once at the root of the app. See [Installing Horizon in code](/developing/introduction/).

### The shapes are right but the colours are missing.

`tokens.css` is not loaded, or it is loaded after `styles.css` in a way your bundler reorders. Import it first.

### The type looks like the browser default, and the heart says "favorite".

The Inter and Material Symbols faces did not load. `styles.css` imports them from Google Fonts; a Content Security Policy that blocks `fonts.googleapis.com` or `fonts.gstatic.com` stops them silently.

### It is correct in light and wrong in dark.

Check that `data-theme="dark"` is on an ancestor of the component, not on a sibling. Light inside a dark ancestor is not supported in `0.1.0`; see [Theming](/styling/theming/).

### Why doesn't `Button` navigate?

It renders a native `<button>` with `type="button"` and no `href`. For navigation, use a link.

### Can I pass `className` to `Card`?

No. `Button` accepts `className`; `Card` is configured through `state`, `layout`, `image`, `text` and `slot`.

## The design side

### Is it accessible?

Each component page's *Usage* tab lists its accessibility facts, each linked to the test or line that proves it. It also says what is not covered: `Button`'s focus state changes colour but draws no focus ring, and Enter and Space activation relies on the native `<button>` and has not been confirmed by a person. Both are recorded in `docs/design-gaps.md`.

### Why does the Design tab ask me to sign in?

The Figma file is shared with the team only. The *Open the node in Figma* link under the frame works for anyone with access.

### Can I just change a colour?

Change it in Figma and re-export the tokens. A colour changed in code is replaced by the next export. See [Designing with Horizon](/designing/introduction/).

### Why is the state called `enable` and not `enabled`?

Because Figma calls it `enable`, and prop values match the design file exactly. The product owner kept the name; the decision is in `docs/naming-conflicts.md`.
