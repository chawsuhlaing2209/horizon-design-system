---
title: Request a feature
description: How to ask for a component, a variant or a token, and what evidence turns a request into work.
---

## Where to ask

Open an issue on GitHub: [chawsuhlaing2209/horizon-design-system/issues](https://github.com/chawsuhlaing2209/horizon-design-system/issues).

## The one thing worth attaching

**A Figma node.** Every Horizon component is built from one Figma component set, and nothing is built without one. A request that links to a design is ready to schedule; a request without one starts in design.

## What to write

- What you are trying to build, and where the current components fall short.
- The screen or flow it is for, with a screenshot or a Figma link.
- Whether an existing component with a new variant would do. A variant is cheaper than a component.

## Kinds of request, and where each one goes

| Request | Starts in |
|---|---|
| A new component | Figma: a component set on its own `💠` page, with a Usage region |
| A new variant, state or size | Figma: the property on the existing component set |
| A new token or a changed value | Figma: the variable, then a token export |
| A new prop that is not in the design | Figma first, because prop names match Figma property names |
| A docs change | This site is generated from the repo; the fix is in the source it names |

## Things already known to be missing

`docs/design-gaps.md` records these, and the [roadmap](/get-started/roadmap/) lists them:

- `Button` has no `size` property, no `loading` state and no icon slot.
- `Card` has no designed pressed, focus or disabled state, and its unfavourited heart has no design.

## What will get declined

- A raw colour, px or font value inside a component. Every value is a token.
- A copy of a component's styles instead of importing the component.
- A dependency added to solve something the existing stack already solves.
