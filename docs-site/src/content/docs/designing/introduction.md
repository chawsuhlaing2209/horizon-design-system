---
title: Designing with Horizon
description: The Figma file, the themes and modes you design against, the naming rule that ties design to code, and how tokens get from Figma into the package.
---

## The file

Every Horizon component starts in one Figma file, **2. Horizon Component** (`r1CpQEYecqROS0oIOMlqAx`). It is shared with the team only, so the Figma frames on this site ask anyone outside it to sign in.

Each component has its own page, named with a diamond: **💠 Button**, **💠 Card**, **💠 Icon Button**, **💠 Input Field**. A component page holds the component set and a documentation frame with a **Usage** region: *Use a …*, *Do not use a …* and *Best Practice* columns. Those lines are copied word for word into the component's intent file, and from there into the *Usage* tab on this site. Change the words in Figma, and the site follows on the next build.

## Themes and modes

| Collection | Modes | What the package ships |
|---|---|---|
| Semantic colour | light, dark | Both. Light on `:root`, dark on `[data-theme="dark"]` |
| Semantic space | web, mobile, back-office | Web in the CSS package; mobile goes to the iOS and Android builds |
| Type | web, mobile, back-office | Web in the CSS package; mobile goes to the iOS and Android builds |

Design against **light** and **dark** for every component: both reach users.

## Naming is a contract, not a preference

From the system's rules (`CLAUDE.md`):

> Prop names match the Figma property names exactly. If Figma says `size`, the prop is `size`.

So a property name in Figma is an API decision. `variant="filled"`, `state="enable"` and `orientation="horizontal"` are spelled exactly as the design file spells them. Where a name could not be kept, the conflict is recorded in `docs/naming-conflicts.md`.

Token names follow category, then property, then role: `color.action.primary`, `spacing.md`, `radius.sm`.

## Tokens only

> Tokens are the only source of visual values. Every colour, space, radius, and font value in a component references a token.

Components use **semantic** tokens only. A property bound to a core token (a scale step like `spacing/8`) or left unbound in Figma is a **design gap**: the engineer reports it rather than guessing, and a person decides. Each component page lists those values under *What Figma never bound*.

## Exporting tokens

1. Export the variables with the **Design Tokens** plugin into the repo's `tokens/` folder.
2. The token sync branches, builds, and summarises the change in design terms: *"brand blue got darker, `#2E6FF2` → `#1F4FBF`"*. More than 20 changed tokens stops for your review.
3. It opens a pull request into `staging`. A person merges it.

Nobody edits a token value in code. A wrong value is fixed in Figma and re-exported.

## What design owns

- The **Figma** link and the **Design** sign-off on each component's registry row. A component is not built until Design reads `Done`.
- Decisions on design gaps. Each decision is recorded in `docs/design-gaps.md` as `RESOLVED` or `WAIVED FOR RELEASE`.
- The Usage region's words, which become the component's guidance on this site.

## Known limits of the current release

The [roadmap](/get-started/roadmap/) lists every open design gap, including the ones shipped under a waiver.
