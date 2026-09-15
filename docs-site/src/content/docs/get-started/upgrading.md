---
title: Upgrading
description: What moving between versions costs you, how to read the changelog for the parts that break, and the step that is not npm install.
---

## Below `1.0.0`, read the changelog first

A minor version below `1.0.0` may break things (see [Versioning](/get-started/versioning/)). Before you upgrade, open the [changelog](/get-started/changelog/) and read the **Removed** section of every version you are skipping. A removed export is a compile error; a renamed prop value is a silent visual change.

## Pin it if a break would cost you

```bash
npm install @theproductiveschedule/horizon-design-system@0.1.0 --save-exact
```

## The step that is not `npm install`

The package ships two stylesheets. After an upgrade, make sure both are still imported once at the root of your app, tokens first:

```tsx
import '@theproductiveschedule/horizon-design-system/tokens.css';
import '@theproductiveschedule/horizon-design-system/styles.css';
```

Token values can change between versions because they come from Figma. A component that looks different after an upgrade with no code change is usually a token that moved: compare the component's *Tokens it needs* table on this site with the previous version.

## After you upgrade

- Run your type check. A removed prop or a narrowed union type fails there first.
- Open the pages you use in both themes, `data-theme="light"` and `data-theme="dark"`.

## Version by version

### `0.1.0`

The first release: `Button`, `Card`, their prop types, `tokens.css` and `styles.css`. There is nothing to upgrade from.
