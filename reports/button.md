# QA: Button regression pass before the npm release

| | |
|---|---|
| Run | Regression re-test on 2026-09-14, before the npm release. This replaces the earlier run against `...-6s22ezf3m-...` / `b5f15b9`, which is still in git history. |
| Build under test | Deployed staging Storybook, read from the registry's `Staging Storybook` cell on Button's Components row (`recxAh3Dd401nLLVr`). The base `appTH3itfUmsuyeUm` is named `[Class Demo] Horizon DS`, which matches `baseName` in `.claude/registry.local.json`. |
| URL | `https://horizon-design-system-hfz7ywk7s-chawsuhlaing2209s-projects.vercel.app/?path=/docs/components-button--docs` (the same URL the coordinator gave) |
| Commit | `9253042`, the merge of #46 |
| What changed since the last pass | `button.tsx`: doc comments only. `git diff b5f15b9 9253042` shows only JSDoc lines, and the render path is identical. `button.css`: no diff. `button.stories.tsx`: two new stories, `InForm` and `InCard`. `tokens/`, `.storybook/` and `package.json`: no diff. |
| Registry `Development` | `Completed` before and after this run. `Production Storybook` is set, so the formula ranks it above the staging rollup. |
| Design reference | Figma file `r1CpQEYecqROS0oIOMlqAx`, component set `26:70`, read live with `get_metadata`, `get_variable_defs` on all eight symbols, and `get_screenshot` |
| Surface | Claude in Chrome, real Chrome, real CDN fonts |
| Local checkout | `intent/release-0.1.0` at `4a89ebc`. Its `src/components/button/` tree is identical to `9253042`. It was used only for the source comparison and the unit suite, never as the build under test. |

The expected matrix came from the Figma node, not from `button.stories.tsx`.

---

## 0 · Fonts loaded, checked before any width was read

"Sign in" was measured on a canvas in three families:

| Family | Width |
|---|---|
| `500 14px Inter` (declared) | 45.05px |
| `500 14px sans-serif` | 42.81px |
| `500 14px QaBogusFamilyXyz` | 40.07px |

The three widths differ, and `document.fonts` lists Inter as loaded (`500`, `100 900`). Inter is really rendering.

## 1 · Is the deployed build the 9253042 build?

- **Stories.** The deployed `index.json` lists exactly these Button stories: `filled-enable`, `filled-hover`, `filled-focused`, `filled-disabled`, the four outlined equivalents, `matrix`, `playground`, `in-form` and `in-card`. That is the story file at `9253042`, including the two new stories.
- **CSS.** The served `.hds-button` stylesheet has 13 rules, counting the reduced-motion media query. They match `src/components/button/button.css` rule for rule. None contains a hex value.
- **Docs.** The docs page renders all 12 story blocks and 21 `.hds-button` elements (1 primary, 8 stories, 8 in Matrix, 1 Playground, 2 InForm, 1 InCard). No error text appears and the console logs nothing.

## 2 · The expected matrix, from Figma

`get_metadata` on 26:70 returns the same eight symbols and dimensions as the last run. The Figma render is **byte-identical** to `reports/button/figma-26-70-component-set.png` (checked with `cmp`), so that file was not replaced. `get_variable_defs` on each symbol gives the same bindings as before:

| # | Node | variant / state | Frame | Fill | Stroke | Label |
|---|---|---|---|---|---|---|
| 1 | 26:71 | filled / enable | 94×44 | `color/bg/primary` #1547d5 | none | `color/text/inverse` #fff |
| 2 | 26:73 | filled / hover | 94×44 | `color/bg/primary/hovered` #1840b1 | none | `color/text/inverse` |
| 3 | 26:82 | filled / focused | 94×44 | `color/bg/primary/pressed` #13338f | none | `color/text/inverse` |
| 4 | 26:87 | filled / disabled | 94×44 | `color/bg/primary/disabled` #d7dee7 | none | `color/text/disabled` #b9c7d6 |
| 5 | 26:98 | outlined / enable | 94×46 | none | `color/border/primary` #1547d5 | `color/text/link` #1547d5 |
| 6 | 26:100 | outlined / hover | 94×46 | none | `color/border/primary/hover` #1840b1 | `color/text/link/hovered` #1840b1 |
| 7 | 26:102 | outlined / focused | 94×46 | none | `color/border/primary/focused` #13338f | `color/text/link` |
| 8 | 26:104 | outlined / disabled | 94×46 | none | `color/border/disabled` #eaeff4 | `color/text/disabled` |

Every symbol shares radius `border/radius/control` (12), padding `spacing/padding/sm` (12) × `spacing/padding/lg` (24), gap `spacing/gap/xs` (8) and text style `label/lg` (Inter Medium 14/20, tracking 0.1). There is no size property, so `Size` = `null` on every row.

Dark expectations come from the committed token export. `build/tokens/css/tokens-dark.css` was generated from `tokens/`, which has no diff since `b5f15b9`. The Figma connection only answers in light mode.

### Reconciliation against the stories

The eight Figma rows map to eight pinned stories, so **no case is missing**. `Matrix` and `Playground` are review views of the same rows. `InForm` and `InCard` are new **usage examples**, not variants. They have no Figma node, so each is checked against the per-button nodes it uses (26:71 and 26:98) and for rendering without errors.

---

## 3 · Results, light theme

Every value is a computed style or `getBoundingClientRect` read from the deployed build. Each pinned story was loaded and measured on its own, and again inside `Matrix`. The two readings agree exactly.

| # | variant / state | Size | Background | Border | Label | Radius | Padding | Gap | Type | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | filled / enable | 93.76×44 | `rgb(21,71,213)` | 0 | `rgb(255,255,255)` | 12 | 12/24 | 8 | Inter 500 14/20 0.1px | **Pass** |
| 2 | filled / hover | 93.76×44 | `rgb(24,64,177)` | 0 | white | 12 | 12/24 | 8 | ✓ | **Pass** |
| 3 | filled / focused | 93.76×44 | `rgb(19,51,143)` | 0 | white | 12 | 12/24 | 8 | ✓ | **Pass** |
| 4 | filled / disabled | 93.76×44 | `rgb(215,222,231)` | 0 | `rgb(185,199,214)` | 12 | 12/24 | 8 | ✓ | **Pass** |
| 5 | outlined / enable | 93.76×46 | transparent | 1px `rgb(21,71,213)` | `rgb(21,71,213)` | 12 | 12/23 | 8 | ✓ | **Pass** |
| 6 | outlined / hover | 93.76×46 | transparent | 1px `rgb(24,64,177)` | `rgb(24,64,177)` | 12 | 12/23 | 8 | ✓ | **Pass** |
| 7 | outlined / focused | 93.76×46 | transparent | 1px `rgb(19,51,143)` | `rgb(21,71,213)` | 12 | 12/23 | 8 | ✓ | **Pass** |
| 8 | outlined / disabled | 93.76×46 | transparent | 1px `rgb(234,239,244)` | `rgb(185,199,214)` | 12 | 12/23 | 8 | ✓ | **Pass** |

These were also checked on all eight: `box-shadow: none`, `opacity: 1`, `outline-style: none`, `type="button"`, `data-node-id="26:70"`, and native `disabled` on the two disabled rows only. The width is −0.24px from the node on every row, the same as the last run. That is text rasterisation, not a component difference.

## 4 · Results, dark theme (`globals=theme:dark`, Matrix)

| # | variant / state | Rendered | Expected in dark | Result |
|---|---|---|---|---|
| 9 | filled / enable | bg `rgb(59,130,246)`, label `rgb(18,24,31)`, 93.76×44 | `blue-400` / `neutral-950` | **Pass** |
| 10 | filled / hover | bg `rgb(95,163,219)` | `blue-300` | **Pass** |
| 11 | filled / focused | bg `rgb(46,124,196)` | `blue-500` | **Pass** |
| 12 | filled / disabled | bg `rgb(58,69,83)`, label `rgb(90,107,126)` | `neutral-800` / `neutral-700` | **Pass** |
| 13 | outlined / enable | border and label `rgb(59,130,246)`, 93.76×46 | `blue-400` | **Pass** |
| 14 | outlined / hover | border and label `rgb(95,163,219)` | `blue-300` | **Pass** |
| 15 | outlined / focused | border `rgb(127,168,238)`, label `rgb(59,130,246)` | `blue-200` / `blue-400` | **Pass** |
| 16 | outlined / disabled | border `rgb(58,69,83)`, label `rgb(90,107,126)` | `neutral-800` / `neutral-700` | **Pass** |

Geometry in dark matches light.

---

## 5 · Behaviour, driven rather than just rendered

| # | Case | How it was driven | Observed | Result |
|---|---|---|---|---|
| 17 | Real hover, filled (light) | Trusted pointer move on unpinned `Playground` | `:hover` true, `:focus-visible` false, bg `rgb(24,64,177)`, outline none | **Pass** |
| 18 | Real hover, outlined (light) | Same, `args=variant:outlined` | border **and** label `rgb(24,64,177)` | **Pass** |
| 19 | Keyboard focus, filled (light) | Click on empty page, then a trusted `Tab` | active, `:focus-visible` true, bg `rgb(19,51,143)`, outline none, no shadow | **Pass** |
| 20 | Keyboard focus, outlined (light) | Same | `:focus-visible` true, border `rgb(19,51,143)`, label `rgb(21,71,213)`, outline none | **Pass** |
| 21 | Real hover, outlined (dark) | Trusted pointer move | border and label `rgb(95,163,219)` | **Pass** |
| 22 | Keyboard focus, outlined (dark) | Trusted `Tab` | border `rgb(127,168,238)`, label `rgb(59,130,246)`, outline none | **Pass** |
| 23 | Mouse click, enabled | One trusted click | 1 click event (`isTrusted`, `detail 1`). Focused, but `:focus-visible` is false, so the focused variant does not render; hover tokens show instead. `BUTTON`, `type=button`, name "Sign in". | **Pass** |
| 24 | Disabled, filled | Two trusted clicks, real hover, trusted `Tab` | 0 clicks on the button and 0 in a document capture listener. `:hover` true, but bg stays `rgb(215,222,231)`. `cursor: default`. `Tab` does not focus it (`activeElement` stays `BODY`). | **Pass** |
| 25 | Disabled, outlined | Trusted click, real hover, trusted `Tab` | 0 clicks. Border stays `rgb(234,239,244)` and label `rgb(185,199,214)`. `Tab` does not focus it. | **Pass** |
| 26 | `className` API | `updateStoryArgs` on `Playground`, then reset | `'checkout-cta u-mt-lg'` gives `hds-button checkout-cta u-mt-lg`. `''` gives `hds-button`. A consumer's `data-variant`, `data-state`, `data-node-id` and `disabled` are ignored. `state=disabled` with `disabled=false` stays disabled. | **Pass** |
| — | Enter / Space activation | Not driven this run | Design gap 9 is still open for a human. There is no row and it is not passed. | **Untested** |

## 6 · New stories

| # | Story | Checked | Observed | Result |
|---|---|---|---|---|
| 27 | `InForm` | Renders; tokens on both buttons; submit and cancel behaviour; keyboard focus; console | No error overlay (`sb-show-main`), no console messages. **Sign in**: `type=submit`, bg `rgb(21,71,213)`, white label, padding 12/24. **Cancel**: `type=button`, 1px `rgb(21,71,213)` stroke and label, padding 12/23. The buttons are 8px apart (`spacing-gap-xs`). Trusted click on Cancel: 1 click, **0 submits**. Trusted click on Sign in: **1 submit**, and the story stays mounted. `Tab` to Sign in gives bg `rgb(19,51,143)`; next `Tab` to Cancel gives border `rgb(19,51,143)`. Every story token used (`--label-lg`, `--body-md`, `--spacing-gap-2xs`, `--spacing-padding-xs`, `--color-text-primary`) exists in `tokens.css`. | **Pass** (see D) |
| 28 | `InCard` | Renders; button tokens inside the Card slot; containment; hover; console | No error overlay, no console messages. One `.hds-button`, "View details", `outlined/enable`, `type=button`, inside `.hds-card-layout__slot`, and not overflowing the card. 130.58×46 (hug width), border 1px `rgb(21,71,213)`, label `rgb(21,71,213)`, transparent, padding 12/23, radius 12, Inter 500 14/20 0.1px. Real hover moves border and label to `rgb(24,64,177)`. | **Pass** |

Only the Button inside `InCard` was tested. The Card itself was not.

## 7 · Tokens and code

- The served `.hds-button` CSS has no hex, no raw px for any design value and no font name. The only literals are `border: 0`, the 120ms transitions, `box-sizing`, `outline: none` and the `calc()` operator.
- `button.tsx` at `9253042`: the diff from `b5f15b9` is JSDoc text only.
- `npx vitest run src/components/button`: **27/27 passed** on the local checkout, which is tree-identical to `9253042` for this folder. This is supporting evidence only.

---

## Findings

**None against engineering.** No case failed.

## Design gaps and observations

For a designer or a human reviewer. None of these is logged against the engineer, and none was closed by QA.

| Item | Status on this build |
|---|---|
| A · Focus shows only as a small one-step colour change, with no ring (1.52:1 light, **1.19:1** dark filled) | Still reproduces |
| Gap 4 · No size, loading or icon property | Still true |
| Gap 6 · Filled is 44 tall and outlined is 46 (the height half, waived for release) | Still true. It is now visible in a shipped example, see D. |
| Gap 7 · In dark, focus darkens filled but lightens outlined | Still reproduces |
| Gap 8 · Disabled filled label about 1.27:1 light, 1.78:1 dark | Still true. WCAG exempts disabled controls. |
| Gap 9 · Enter / Space unverified | Still open. Not driven this run. |
| B · The outlined inline inset is 23, and no token names it | Faithful to the node, as before |
| C · `color-border-disabled` and `color-bg-primary-disabled` are both `neutral-800` in dark | Still reproduces |

**D. New: `InForm` hides the filled/outlined height difference by stretching the filled button.** In the action row, **Sign in renders 93.76×46, not the node's 94×44.** The row `<div>` is a flex container with the default `align-items` (`stretch`), so the 44px filled button grows to the 46px outlined button's height. The component is not at fault. It is `inline-flex` and hugs, exactly as the node does. But this is the first shipped example to put the two variants side by side, and it will be copied:

- With `stretch` (as shipped), both buttons are 46 tall. Filled is 2px taller than its Figma node, with the extra space split above and below the label.
- With `align-items: center`, filled stays 44 and sits 1px inside outlined at the top and bottom, which is the misalignment gap 6 describes.

A designer should decide whether filled and outlined share one height. Until then, the example quietly shows one answer to that question. This is logged on the InForm row's `Suggestion for Improvement`.

**E. Minor, stories only.** `InForm` sets `maxWidth: '360px'` and `InCard` sets `width: '280px'` as raw px on wrapper elements. The email field in `InForm` is an unstyled native `<input>`, because no Input component exists. These are not component files, so they are recorded here only.

---

## Screenshots

| File | What it is |
|---|---|
| `reports/button/figma-26-70-component-set.png` | Figma render of 26:70. The re-capture on this run was byte-identical, so the file is unchanged. |

I captured the deployed build in Chrome for real hover (filled light, outlined light, outlined dark), the `InForm` row and the `InCard` story. **I could not write these captures to disk.** The Chrome tool accepted `save_to_disk` but returned no file path, which is the same limit as the last run. So the `Attachment` column is empty on every row, and the measured computed values are the evidence for every row.

---

## Registry: `Staging Testing`

28 rows are linked to Button, all `Passed`. After the writes, the component row shows 28 tests, 28 passed, 0 failed, `Synchronization %` 100%, and `Development` **`Completed`** (unchanged).

**26 existing rows updated in place.** `Testing Results` was re-asserted as `Passed` and `Context` was rewritten to cite deployment `...-hfz7ywk7s-...` / commit `9253042` with this run's measurements. On two rows `Suggestion for Improvement` was also updated, because the disabled `Tab` observation changed wording (see rows 24 and 25).

| Row | Case | Record |
|---|---|---|
| 1 | filled / enable, light | `rechtyrY9njPrr1EB` |
| 2 | filled / hover, light | `recZQc9X18sjtlVjn` |
| 3 | filled / focused, light | `recXMSVTz9eVvE1fy` |
| 4 | filled / disabled, light | `recgq7fsSITJxtUW6` |
| 5 | outlined / enable, light | `recWxGrSKIKkOGEJ2` |
| 6 | outlined / hover, light | `rec21kPCdvkvcn5fb` |
| 7 | outlined / focused, light | `recppFoasYFWe2O2K` |
| 8 | outlined / disabled, light | `recbcDlycw6PLbVsa` |
| 9 | filled / enable, dark | `recBHJrtI7A2RCaPu` |
| 10 | filled / hover, dark | `reczgWMtDpw8xkkWg` |
| 11 | filled / focused, dark | `recbQiQYM7oRoMgnX` |
| 12 | filled / disabled, dark | `recV3sSjBplEcMx8K` |
| 13 | outlined / enable, dark | `recyExNg6huHR6MEB` |
| 14 | outlined / hover, dark | `rechdjPLyN4oLrqrl` |
| 15 | outlined / focused, dark | `recYBYuDatL1Yh4ts` |
| 16 | outlined / disabled, dark | `recLTFgWx9aoU038U` |
| 17 | real hover, filled, light | `recbnbuQtLpOQQi0L` |
| 18 | real hover, outlined, light | `rec2QAfuhKtfMau4H` |
| 19 | keyboard focus, filled, light | `rec1S0ZE5xS6uCqFe` |
| 20 | keyboard focus, outlined, light | `recgblPln41VfJF9n` |
| 21 | real hover, outlined, dark | `recaaDlK6am08KDAu` |
| 22 | keyboard focus, outlined, dark | `recT1cpEPUa4wD0NS` |
| 23 | mouse click, enabled | `recizly4eOukrFWvi` |
| 24 | disabled behaviour, filled | `recNln8pJcJnr14A7` |
| 25 | disabled behaviour, outlined | `recrsbpQw16Zt8n6V` |
| 26 | `className` API | `receoSIBoJucAx0fI` |

**2 new rows** for the new stories:

| Row | Case | Record |
|---|---|---|
| 27 | `InForm` | `recu5Ma3FZWRw25Ee` |
| 28 | `InCard` | `rec2xyjlCQWo23xip` |

- `Size` = `null` on every row. `State` uses existing options only: `idle` stands in for `enable`, plus `hovered`, `focus` and `disabled`. No option was created.
- There is no row for Enter/Space, because no `Testing Results` option means untested.
- I did not write `Fixed (To re-test)`. Nothing had failed and no repair was being confirmed, and that value would have made `Development` read `Fixed`.
- The run was interrupted by an API usage limit after the 26 updates and before the 2 creates. Before resuming, I re-read every linked row and searched the table for InForm and InCard. No duplicate existed, and each row was written once.

## Verdict

**All 28 recorded cases pass** on the deployed staging build at `9253042`:

- 16 variant/state rows (8 light, 8 dark), measured against Figma 26:70
- 9 behaviour cases driven with real pointer and keyboard input
- the `className` API case
- the two new stories, which render without errors and use the correct Button tokens

Enter/Space activation is untested, as before.

Nothing goes back to the engineer. The open items are design questions: D (new: the InForm row stretches filled to 46), A, gap 4, gap 6, gap 7, gap 8, C, and a human decision on gap 9.

*No status was set and nothing was marked resolved. This verdict is not final until a human reads it.*
