---
title: Report a bug
description: Where to file a bug, what makes a report actionable, and what is already recorded and is not a bug.
---

## Where to file

Open an issue on GitHub: [chawsuhlaing2209/horizon-design-system/issues](https://github.com/chawsuhlaing2209/horizon-design-system/issues).

## Check it is not already recorded

These are known and recorded in `docs/design-gaps.md`, so they are not bugs. The [roadmap](/get-started/roadmap/) lists every open one:

- A value that Figma never bound, listed on the component's *Design* tab under *What Figma never bound*.
- Design gaps shipped under a waiver, such as `Button`'s low-contrast disabled label and `Card`'s hover shadow in dark.
- Prop values spelled as Figma spells them, such as `state="enable"`.

## What makes a report actionable

- **The version.** `npm ls @theproductiveschedule/horizon-design-system`.
- **The component and its props.** The exact JSX, or a link to the Storybook story that shows it.
- **The theme.** `light` or `dark`.
- **What you expected, and what you saw.** Name the token or the prop if you can: "the border uses `--color-border-bold` but the design says `--color-border-default`" can be fixed without a question; "the colour looks off" cannot.
- **The browser and version,** for anything about rendering, focus or keyboard.

A reproduction in the [production Storybook](https://horizon-design-system-delta.vercel.app) is the fastest to act on, because it rules out your app's CSS.

## Where the fix will actually land

A bug in code goes to the engineer, is merged into `staging`, re-tested by QA on the staging build, and ships in the next release. A bug in the design goes back to Figma first. Either way it appears in the [changelog](/get-started/changelog/) when it ships.
