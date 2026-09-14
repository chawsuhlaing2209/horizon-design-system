# QA — Button · re-test after the Figma change of 2026-09-13

| | |
|---|---|
| Run | Re-test on 2026-09-14. This file replaces the two earlier runs, which tested the pre-#32 build (pressed state, generic focus ring). Those runs are still in git history at `b5f15b9`. |
| Build under test | Deployed staging Storybook, read from the registry's `Staging Storybook` cell on Button's Components row (`recxAh3Dd401nLLVr`), base `[Class Demo] Horizon DS` (confirmed against `baseName` in `.claude/registry.local.json`) |
| URL | `https://horizon-design-system-6s22ezf3m-chawsuhlaing2209s-projects.vercel.app/?path=/docs/components-button--docs` |
| Registry `Commit` | `b5f15b9` (merge of #33, on top of the #32 squash `fbf19cf`) |
| Registry `Development` | `Completed` before and after this run. `Production Storybook` is set, so the staging link does not surface as `Ready for Testing`. This run was requested directly. |
| Design reference | Figma file `r1CpQEYecqROS0oIOMlqAx`. I found the set by walking the file rather than using the repo's IDs: page `💠 Button` (25:65), component set **`Button` (26:70)**, the only component set on that page. Read live through `use_figma` (read-only scripts) and `get_screenshot`. |
| Surface | Claude in Chrome, one fresh tab, real Chrome, real CDN fonts. Deployment protection is off. |
| Local checkout | Branch `intent/rewrite-2026-09-13` at `66c8e2a`. Its tree is identical to `b5f15b9` (`git diff --stat` is empty). It was used only for the source comparison and the unit suite, never as the build under test. |

The expected matrix below came from the Figma node. It did **not** come from `button.stories.tsx`.

---

## 0 · Fonts loaded, checked before any width was read

`document.fonts.check()` was not trusted. "Sign in" was measured on a canvas in three families:

| Family | Width |
|---|---|
| `500 14px Inter` (declared) | 45.05px |
| `500 14px sans-serif` | 42.81px |
| `500 14px QaBogusFamilyXyz` | 40.07px |

The three widths are different, and `document.fonts` reports `Inter 500: loaded`. Inter is really rendering, so the widths below come from the component and not from a fallback font.

## 1 · Is the deployed build the #32 build?

The CSS served for `.hds-button` was read from the running page's stylesheets. It has 12 rules plus the reduced-motion media query, and they match `src/components/button/button.css` rule for rule:

- `[data-variant='filled']:not(:disabled):focus-visible, [data-variant='filled'][data-state='focused']` → `--color-bg-primary-pressed`
- `[data-variant='outlined']:not(:disabled):hover, …[data-state='hover']` → `--color-border-primary-hover` **and** `--color-text-link-hovered`
- `[data-variant='outlined']:not(:disabled):focus-visible, …[data-state='focused']` → `--color-border-primary-focused`
- `[data-variant='outlined']` → `padding-inline: calc(var(--spacing-padding-lg) - var(--border-width-default))`
- `.hds-button:focus-visible { outline: none }`. No outline or ring rule is left.
- No selector mentions `pressed`.

The deployed story index lists exactly `filled-enable`, `filled-hover`, `filled-focused`, `filled-disabled`, the four outlined equivalents, `matrix` and `playground`. **This is the #32 build.**

---

## 2 · The expected matrix, from Figma

`componentPropertyDefinitions` on 26:70: `state` = `enable | hover | focused | disabled` (default `enable`), `variant` = `filled | outlined` (default `filled`). There is no size property, no pressed state, no loading state and no icon property.

| # | Node | variant / state | Frame | Fill | Stroke (1px, INSIDE, in layout) | Label |
|---|---|---|---|---|---|---|
| 1 | 26:71 | filled / enable | 94×44 | `color/bg/primary` | none | `color/text/inverse` |
| 2 | 26:73 | filled / hover | 94×44 | `color/bg/primary/hovered` | none | `color/text/inverse` |
| 3 | 26:82 | filled / focused | 94×44 | `color/bg/primary/pressed` | none | `color/text/inverse` |
| 4 | 26:87 | filled / disabled | 94×44 | `color/bg/primary/disabled` | none | `color/text/disabled` |
| 5 | 26:98 | outlined / enable | 94×46 | none | `color/border/primary` | `color/text/link` |
| 6 | 26:100 | outlined / hover | 94×46 | none | `color/border/primary/hover` | `color/text/link/hovered` |
| 7 | 26:102 | outlined / focused | 94×46 | none | `color/border/primary/focused` | `color/text/link` |
| 8 | 26:104 | outlined / disabled | 94×46 | none | `color/border/disabled` | `color/text/disabled` |

All eight share these values: fixed width and hug height; radius `border/radius/control` (12); padding `spacing/padding/sm` (12) × `spacing/padding/lg` (24); gap `spacing/gap/xs` (8); text style `label/lg` (Inter Medium 14/20, tracking 0.1); no effects; opacity 1. Label box is 46×20 at x=24, y=12 on filled and y=13 on outlined. **All four outlined strokes are now bound to variables**, where the earlier runs found styles.

Geometry check: outlined is `1 + 12 + 20 + 12 + 1 = 46` tall. At the fixed 94 width, with a 46px label centred and a 1px inside stroke counted in layout, the inset beside the stroke is 23. The build writes that as `calc(spacing-padding-lg - border-width-default)`.

**Dark mode.** The variables come from a library and are not local, so the plugin API cannot resolve them per mode, and `get_variable_defs` answers in one mode only. I resolved dark expectations from `tokens/semantic-color.dark.tokens.json`, which is the committed Figma export, through `core.value.tokens.json`. I also checked every light value from Figma against `tokens/semantic-color.light.tokens.json`, and all of them match.

### Reconciliation against the stories

There are eight Figma rows and eight pinned stories, one per node. **No case is missing and no story is orphaned.** `Matrix` and `Playground` are review views of the same eight rows, not extra variants. The earlier `pressed` stories are gone from both the source and the deployed index.

---

## 3 · Results, light theme

Every value is a computed style or a `getBoundingClientRect` from the deployed build. I read each pinned story on its own and in `Matrix`, and the two agree.

| # | variant / state | Size | Background | Border | Label | Radius | Padding | Gap | Type | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | filled / enable | 93.76×44 | `rgb(21,71,213)` `color-bg-primary` | 0 | white `color-text-inverse` | 12 | 12/24 | 8 | Inter 500 14/20, 0.1px | **Pass** |
| 2 | filled / hover | 93.76×44 | `rgb(24,64,177)` `color-bg-primary-hovered` | 0 | white | 12 | 12/24 | 8 | ✓ | **Pass** |
| 3 | filled / focused | 93.76×44 | `rgb(19,51,143)` `color-bg-primary-pressed` | 0 | white | 12 | 12/24 | 8 | ✓ | **Pass** |
| 4 | filled / disabled | 93.76×44 | `rgb(215,222,231)` `color-bg-primary-disabled` | 0 | `rgb(185,199,214)` `color-text-disabled` | 12 | 12/24 | 8 | ✓ | **Pass** |
| 5 | outlined / enable | 93.76×46 | transparent | 1px `rgb(21,71,213)` `color-border-primary` | `rgb(21,71,213)` `color-text-link` | 12 | 12/23 + 1px border | 8 | ✓ | **Pass** |
| 6 | outlined / hover | 93.76×46 | transparent | 1px `rgb(24,64,177)` `color-border-primary-hover` | `rgb(24,64,177)` `color-text-link-hovered` | 12 | 12/23 | 8 | ✓ | **Pass** |
| 7 | outlined / focused | 93.76×46 | transparent | 1px `rgb(19,51,143)` `color-border-primary-focused` | `rgb(21,71,213)` `color-text-link` | 12 | 12/23 | 8 | ✓ | **Pass** |
| 8 | outlined / disabled | 93.76×46 | transparent | 1px `rgb(234,239,244)` `color-border-disabled` | `rgb(185,199,214)` `color-text-disabled` | 12 | 12/23 | 8 | ✓ | **Pass** |

Checked across all eight: `box-shadow: none`, `opacity: 1`, all four corner radii 12px, `outline-style: none`, and `type="button"`. `data-node-id="26:70"` is on every render.

**Width.** Filled and outlined both render 93.76 wide against the node's 94. The −0.24px gap is the same on all eight rows. It is how Inter rasterises "Sign in" (45.76 rendered against 46 in Figma), not a component difference. **The outlined width change in #32 is correct**: outlined now measures the node's 94 and no longer the previous 96.

## 4 · Results, dark theme (`globals=theme:dark`)

| # | variant / state | Rendered | Expected in dark | Result |
|---|---|---|---|---|
| 9 | filled / enable | bg `rgb(59,130,246)`, label `rgb(18,24,31)` | `blue-400` / `neutral-950` | **Pass** |
| 10 | filled / hover | bg `rgb(95,163,219)` | `blue-300` | **Pass** |
| 11 | filled / focused | bg `rgb(46,124,196)` | `blue-500` | **Pass** |
| 12 | filled / disabled | bg `rgb(58,69,83)`, label `rgb(90,107,126)` | `neutral-800` / `neutral-700` | **Pass** |
| 13 | outlined / enable | border and label `rgb(59,130,246)` | `blue-400` | **Pass** |
| 14 | outlined / hover | border and label `rgb(95,163,219)` | `blue-300` / `blue-300` | **Pass** |
| 15 | outlined / focused | border `rgb(127,168,238)`, label `rgb(59,130,246)` | `blue-200` / `blue-400` | **Pass** |
| 16 | outlined / disabled | border `rgb(58,69,83)`, label `rgb(90,107,126)` | `neutral-800` / `neutral-700` | **Pass** |

Geometry in dark is the same as in light. No colour is hardcoded to its light value.

---

## 5 · Behaviour, driven and not just rendered

| # | Case | How it was driven | Observed | Result |
|---|---|---|---|---|
| 17 | Real hover, filled (light) | Trusted pointer move on unpinned `Playground`, then a screenshot to force repaint, then a read | `:hover` true, bg `rgb(24,64,177)` `color-bg-primary-hovered` | **Pass** |
| 18 | Real hover, outlined (light) | Same, with `args=variant:outlined` | border **and label** `rgb(24,64,177)` (`color-border-primary-hover` / `color-text-link-hovered`) | **Pass** |
| 19 | Keyboard focus, filled (light) | Click on empty page, then a real `Tab` | Focus lands on the button, `:focus-visible` true, bg `rgb(19,51,143)` `color-bg-primary-pressed`, `outline-style: none`, no shadow | **Pass** |
| 20 | Keyboard focus, outlined (light) | Same | `:focus-visible` true, border `rgb(19,51,143)` `color-border-primary-focused`, label stays `color-text-link`, no outline | **Pass** |
| 21 | Real hover, outlined (dark) | Trusted pointer move | border and label `rgb(95,163,219)` `blue-300` | **Pass** |
| 22 | Keyboard focus, outlined (dark) | Real `Tab` | border `rgb(127,168,238)` `blue-200`, label `blue-400`, no outline | **Pass** |
| 23 | Mouse click, enabled | One trusted click | `click` fires once (`detail 1`). Button is focused but `:focus-visible` is **false**, so the focused variant does **not** render. Hover tokens show because the pointer is still over it. Real `<button type="button">`, name "Sign in". | **Pass** |
| 24 | Disabled, filled | Two trusted clicks, real hover, real `Tab` | 0 clicks on the button, 0 at `document`. `:hover` true but bg stays `color-bg-primary-disabled`. `cursor: default`. Tab skips it. | **Pass** |
| 25 | Disabled, outlined | Trusted click, real hover, real `Tab` | 0 clicks. Border and label stay on the disabled tokens. Tab skips it. | **Pass** |
| 26 | `className` API | Args pushed through Storybook's `updateStoryArgs` channel on `Playground` | `'checkout-cta u-mt-lg'` gives `hds-button checkout-cta u-mt-lg`. `''` gives exactly `hds-button`. Consumer `data-variant` / `data-state` / `data-node-id` / `disabled` are ignored, because props win. `state=disabled` with `disabled=false` stays disabled. | **Pass** |
| — | **Enter / Space activation** | See below | — | **Untested by automation, not passed** |

### Enter and Space, recorded as untested, with evidence that conflicts with design gap 9

Per the instruction for this run and `docs/design-gaps.md` gap 9, keyboard activation is **not** logged as a pass and **has no `Staging Testing` row**.

What I saw still has to be written down, because it contradicts gap 9's premise. In this session the Chrome harness **did** deliver activation:

- With `Playground` focused by a real `Tab`, one `Return` and one `space` each fired a `click` on the button with `isTrusted: true` and `detail: 0`, the signature of keyboard activation.
- A **control**, a bare native `<button>` I injected into the same page and focused, also received one `click` per key with `detail: 0`. Gap 9 recorded zero clicks for exactly this control.

So in this environment the harness appears to deliver trusted Enter and Space. A human should decide whether this counts as the browser-driver test gap 9 asks for, or whether a manual keyboard pass is still required. I have not closed gap 9.

---

## 6 · Tokens and code

- The served CSS for `.hds-button` has no raw hex, no raw px for any design value, and no font name. Every design value is a `var(--…)` pointing at a semantic token. The only literals are `border: 0`, the 120ms transition durations, `box-sizing`, `outline: none` and the `calc()` operator.
- `npx vitest run src/components/button`: **27/27 passed** on the local checkout (tree-identical to `b5f15b9`). This is supporting evidence only. The verdict rests on the deployed build.

---

## Findings

**None against engineering.** No case in the matrix failed.

## Design gaps, re-read against the live node

These are for a designer. None of them is logged against the engineer. Where an earlier gap no longer reproduces, I record that for a human to close. I have not closed it.

| Gap in `docs/design-gaps.md` | Status on 2026-09-14 |
|---|---|
| 1 · No focused variant | **No longer reproduces.** `state=focused` exists (26:82, 26:102) and keyboard focus renders it. The follow-up review is still needed, see A below. |
| 2 · Pressed stroke on a token named `focused` | **No longer applies.** The variant using `color/border/primary/focused` is now `state=focused`. |
| 3 · Outlined strokes are styles, not variables | **No longer reproduces.** All four outlined strokes return `boundVariables.color` for a variable. |
| 4 · No size, loading or icon | Still true. The set publishes `variant` × `state` only. |
| 5 · Outlined hover moves only the stroke | **No longer reproduces.** 26:100 also binds the label to `color/text/link/hovered`. |
| 6 · Outlined width | **No longer reproduces.** Node is 94×46 with an inside stroke and the build measures 93.76×46. The "96×46" in the old row text is out of date and has been rewritten. |
| 7 · Dark mode moves in opposite directions | **Still reproduces** for focus: filled goes to `blue-500` (darker), outlined goes to `blue-200` (lighter). |
| 8 · Disabled filled label illegible | Still true: about 1.27:1 in light, 1.78:1 in dark. WCAG exempts disabled controls. |
| 9 · Enter / Space unverified | Left open as instructed. See the conflicting evidence in §5. |

**A. The focused state is a very small visual change.** This is new to this build, because the ring is gone. With no ring, keyboard focus shows only as a one-step colour change:

| | enable → focused | Change contrast |
|---|---|---|
| filled, light | `#1547d5` → `#13338f` fill | 1.52:1 |
| outlined, light | `#1547d5` → `#13338f`, **1px stroke only** | 1.52:1 |
| filled, dark | `#3b82f6` → `#2e7cc4` fill | **1.19:1** |
| outlined, dark | `#3b82f6` → `#7fa8ee`, 1px stroke only | 1.53:1 |

Focus is visible, so WCAG 2.4.7 is met. But every row is far below the 3:1 change contrast in 2.4.13, and dark filled at 1.19:1 is close to invisible. The build does exactly what the node says, so this is a question for the designer: add a ring, or make the change stronger.

**B. Outlined inline inset is 23, and no token names it.** The fixed 94 width with a 1px inside stroke leaves 23px beside the stroke. The build writes it as `spacing-padding-lg − border-width-default`, which is a faithful translation using existing tokens. Recorded only so that nobody later "fixes" it to 24.

**C. `color-border-disabled` and `color-bg-primary-disabled` are both `neutral-800` in dark.** This still reproduces. It is a token-mode question.

---

## Screenshots

| File | What it is |
|---|---|
| `reports/button/figma-26-70-component-set.png` | Figma render of component set 26:70, re-captured on 2026-09-14 so it shows `focused` and not `pressed`, for side-by-side comparison |

I captured the deployed build in Chrome for every state: the light and dark matrix, real hover on filled and outlined, real keyboard focus on filled and outlined in light and dark, and hover on both disabled variants. **I could not write these captures to disk.** The Chrome harness returns images to the session but gives no file path, and the one route that would have moved the bytes through page JavaScript is blocked by the tool's base64 output filter. I did not try to get around that filter. For the same reason the `Attachment` column is empty on every row. The measured computed values above are the primary evidence for every row.

---

## Registry

`Staging Testing`: 26 rows linked to Button, all `Passed`.

- **17 existing rows updated in place.** They had been measured on the previous build. Leaving them as they were would have kept three `pressed` rows per theme counting towards the rollup for a state that no longer exists. Each row now describes the state Figma publishes today, was re-measured on this deployment, and says so in `Context`. The four former `pressed` rows now record `state=focused`, with `State` = `focus`.
- **9 new rows** for the behavioural cases 17–25.
- **No row for Enter/Space.** No `Testing Results` option means untested, and it must not be logged as passed.
- `Size` is `null` on every row, because the set has no size property. `State` uses existing options only: `idle` for `enable`, `hovered`, `focus` for `focused`, and `disabled`. No option was created.
- I did not write `Fixed (To re-test)`. Nothing had failed, so no repair was waiting to be confirmed, and that value would have made `Development` read `Fixed`.

`Development` after the writes: **`Completed`**, unchanged. The formula ranks `Production Storybook` above the staging rollup. I did not check whether the production Storybook at `horizon-design-system-delta.vercel.app` serves this build or the pre-#32 one. If it serves the old one, the board says `Completed` while production lags staging, and that is for DevOps and a human to look at.

## Verdict

**All 26 recorded cases pass** on the deployed staging build: 8 variant/state rows in light and 8 in dark measured against the Figma node, 9 behavioural cases driven with real pointer and keyboard input, and the `className` API case. Keyboard activation (Enter/Space) is **untested by automation** as instructed, although this session's harness did deliver it; see §5.

Nothing goes back to the engineer. The open items are design questions: A (very small focus change, worst in dark filled), gap 7 (dark focus goes in opposite directions), gap 4, gap 8, and a human decision on gap 9.

*No status was set and nothing was marked resolved. This verdict is not final until a human reads it.*
