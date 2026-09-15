---
title: Theming
description: What a Horizon theme changes, what it does not, how to scope one to part of a page, and why values change in Figma rather than in code.
---

## Switching

Light is the default. `data-theme="dark"` on any ancestor switches everything inside it:

```html
<html data-theme="dark">
```

Custom properties inherit, so the attribute can sit on `<html>` for the whole page or on one element for part of it.

## A theme changes colour, and nothing else

`tokens.css` has two blocks. `:root` declares every token. `[data-theme="dark"]` redeclares only the colour tokens that change between light and dark. Spacing, radius, size, type and elevation read the same in both themes.

The [Tokens](/core/tokens/) page shows every token's light and dark value side by side.

## Scoping a theme to part of a page

Dark inside a light page works: put `data-theme="dark"` on the element.

Light inside a dark page does not, in `0.1.0`: the package ships no `[data-theme="light"]` block, so an element marked light still inherits the dark values from its ancestor. Keep light sections outside a dark ancestor.

## Changing a value

Do not override a token in your app's CSS to restyle a component. Tokens come from Figma, and the next export replaces the value you worked around. A value that is wrong is fixed in Figma and re-exported, and the package follows.

A component's *What Figma never bound* list names the values that are not tokens at all. Those are recorded design decisions, not extension points.

## Contrast, stated rather than discovered

`docs/design-gaps.md` records every known contrast problem, and the [roadmap](/get-started/roadmap/) lists the ones still open:

- Several semantic text tokens fail WCAG AA contrast.
- `Button`'s disabled filled label is about 1.27:1. Disabled controls are exempt from WCAG 1.4.3, and the value is faithful to the design, but it is hard to read. Waived for release.
- `elevation/level2` has no dark variant, so `Card`'s hover shadow is invisible in dark. Waived for release.
