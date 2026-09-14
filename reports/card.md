# QA: Card, re-test after the Figma change of 2026-09-13

This file holds three runs on 2026-09-14:

- **Run 3 (below, first):** full regression re-test on staging `9253042`, before the npm release.
- **Run 2:** re-test of the F1 repair on staging `5a692e1`.
- **Run 1:** the full re-test on `b5f15b9` that raised F1. It is left as written, with notes where Run 2 changes something.

---

# Run 3: regression re-test on `9253042`, before the npm release

| | |
|---|---|
| Run | Full regression re-test on 2026-09-14 after commits `d095822` and `76f2a37`. Every existing row was re-measured in light and dark, and the three new stories were added. The run was cut off once by an API usage limit and resumed. No row had been written before the cut-off, and all 38 rows were re-read before writing. |
| Build under test | Deployed staging Storybook from the `Staging Storybook` cell on Card's Components row (`rec1y6kyai6F3FVWv`). I read the cell myself in base `appTH3itfUmsuyeUm`, which is named `[Class Demo] Horizon DS` and matches `baseName` in `.claude/registry.local.json`. |
| URL | `https://horizon-design-system-hfz7ywk7s-chawsuhlaing2209s-projects.vercel.app/?path=/docs/components-card--docs` |
| Is this `9253042`? | Yes. The deployed stylesheet has `.hds-card-layout__slot { min-height: 48px }`, `.hds-card-image__favorite` at `top: 7px; right: 7px`, no radius on `.hds-icon-container`, and cardText `font: var(--title-md)` etc. with no fallback stack. The story index lists 20 Card stories, including `image-empty`, `in-results-grid` and `in-list-with-button`. |
| Registry `Commit` | **Still `5a692e1`**, not `9253042`. That cell belongs to the Engineer, so I did not write it. See observation O1. |
| Registry `Development` | **Before:** `Completed` (38 rows, all Passed). **After:** `Completed` (44 rows, all Passed, 100%). `Production Storybook` is set, so the formula stays at precedence 5. |
| Design reference | Figma file `r1CpQEYecqROS0oIOMlqAx`, read live: `get_metadata` on `34:317`, `8:1251`, `8:1249`, `8:1250`, `8:1186`, `8:1184`, `12:1343`, `8:778`, and `get_design_context` on `34:317`, `8:1251`, `8:1186`, `8:778`. |
| Surface | Claude in Chrome, the real Vercel bundle, fonts from the CDN. No local Storybook was started and no git operation was run. |

The expected matrix comes from Figma. Where the product owner decided differently, the decision is named in the case and I measured against it.

## R3.0 · Fonts

| Check | Result |
|---|---|
| `16px Inter` vs `16px QaBogusFamilyXyz` | 227.25 vs 196.875 (`sans-serif` 216.11, `serif` 196.875) |
| `24px "Material Symbols Outlined"` measuring `favorite` vs bogus | 24 vs 74.625 |
| `document.fonts` status `loaded` | Inter 500, Inter 600, Inter 100–900, Material Symbols Outlined 100–700 |
| Computed `font-family` on every cardText node | `Inter`, with no fallback (light and dark) |

The fonts loaded, so the sizes below are real.

## R3.1 · What changed in Figma since Run 1

| Node | Run 1 | Now |
|---|---|---|
| `8:1249` cardLayout vertical | 269 × 371.75, Slot `8:1314` 46 | **269 × 373.75, Slot `8:1314` 48** at y 325.75 |
| `8:1250` cardLayout horizontal | 269 × 172, Slot `8:1315` 46 | unchanged: **still 46** |
| iconButton icon | Icon Container `8:895`, radius `border/radius/4` | **Icon `108:477`** (library `favorite`), 24 × 24, radius 0 |
| iconButton position in `8:1186` | top 8, right 7.5 | unchanged: **still right 7.5** in all four variants |
| `12:1343` | 298.25, `8:770` 48 with no rows | unchanged |
| `color/text/accent` on Rating Score | `#f0932b` light | unchanged (gap 7) |

Renders saved today: `reports/card/figma-34-317-card-set-9253042.png`, `reports/card/figma-8-1251-cardLayout-set-9253042.png`, `reports/card/figma-8-1186-cardImage-set-9253042.png`.

## R3.2 · Results

Method:

- Geometry and computed styles for every story were read from `iframe.html?id=…&viewMode=story`, once plain and once with `&globals=theme:dark`.
- Pointer and keyboard states were driven with real Claude in Chrome input.
- The automation tab reports `visibilityState: hidden`, which freezes CSS transitions. The first hover reads were stale because of this. All pointer reads were then re-taken with transitions disabled by an injected test style. The component was not changed.

`level2` below means `rgba(27,39,51,.06) 0 2px 4px 0, rgba(27,39,51,.1) 0 4px 8px 0`.

### Card

| Case | Theme | Saw | Result | Row |
|---|---|---|---|---|
| state=enable | light | 227 × 298.25, bg rgb(255,255,255), r 12, p 12/16, shadow none, layout gap 12, photo loaded | **Pass** | `recPkzD0DiT6dfqo2` |
| state=enable | dark | 227 × 298.25, bg rgb(27,39,51) | **Pass** | `reckWADjP56XXUmy8` |
| state=hover | light | pinned `level2`. Real pointer: over the title the card raises and overlay 0; over the image it raises and overlay 0.2; off, none | **Pass** | `recQfAZfxyT19rS2W` |
| state=hover | dark | `--elevation-level2` is the same as light, so no visible lift | **Pass (human waiver, gap 11, re-measured)** | `recRKWuTGZeXeI8Ce` |
| 12:1343 as placed | light / dark | 227 × 250.25, overlay 0.2, text 68, meta 0 | **Pass** / **Pass** on the gap 9 decision | `recPFNpA76432oysU` / `recYgLks4BD343ZIT` |
| Long content | light / dark | 227 × 338.25, text 195 × 156, scrollWidth 227 = clientWidth | **Pass** / **Pass** | `recoyeS31iIhl20eI` / `recM32QHS23rru6dI` |
| **New:** InResultsGrid | light / dark | 3 × 227 columns, gap 16, padding 24; each card 227 × 298.25; photos loaded; no error display, no console messages | **Pass** / **Pass** | `recCNB467vYHYAm1Z` / `rec3jibtoKPBDDCK9` |
| **New:** InListWithButton | light / dark | 2 horizontal cards 301 wide: 198 and 222 tall (second title wraps), layout 269, slot 128.5 × 48, Button "Book" 46 tall inside the slot, no overflow, no errors | **Pass** / **Pass** | `recOMiSsg98sFpvqG` / `rec3ygS0hD1AOxllO` |

### cardLayout

| Case | Theme | Saw | Result | Row |
|---|---|---|---|---|
| vertical, hasSlot=false | light / dark | flex column, gap 12, 195 × 274.25, text at 158.25 | **Pass** / **Pass** | `rec2H5ftc2XFYyLGr` / `rec5K6pYPU0e8boHd` |
| vertical, hasSlot=true | light / dark | At 195 wide: slot 195 × **48**, card 358.25. **At the node's 269:** layout 269 × 373.75, image 201.75, text 100 at 213.75, slot 48 at 325.75. Exact against the new `8:1249`. | **Pass** / **Pass** | `recLoAXbMvU9miOR2` / `recO8NTJm4DwMtJya` |
| horizontal, hasSlot=true | light / dark | grid 128.5 / 128.5, gap 12; layout 269 × **174**; body gap 10; slot 128.5 × **48** at y 126 | **Pass** / **Pass**, measured against the product owner's 48 (Figma `8:1315` still 46, 172) | `recruJ0K6kqgODxAC` / `reccHjcAahTTrHUit` |

### cardImage and the favourite button

| Case | Theme | Saw | Result | Row |
|---|---|---|---|---|
| ratio=4:3, idle | light / dark | 195 × 146.25, aspect 4/3, border rgb(234,239,244) / rgb(58,69,83), r 12; photo `<img>` 193 × 144.25 inside the border | **Pass** / **Pass** | `recxBwxGQ0aixdQAv` / `recisNldJMxTS7P8O` |
| ratio=1:1, idle | light / dark | 195 × 195, card 347 | **Pass** / **Pass** | `recxvC0teYOg6Ya5w` / `recH73iwIstwR85ZL` |
| **New:** image = empty | light / dark | no `<img>`; `photo--empty` 193 × 144.25 in rgb(247,249,251) / rgb(58,69,83) = `--color-bg-surface-secondary` | **Pass** / **Pass** | `rec2JjWcAsLJsOf51` / `reczCK9rid2IXW9Vs` |
| state=idle pinned | light / dark | overlay 0; pointer on image: overlay 0; pointer on button: overlay 0, button hover (rgb(241,244,247) / rgb(58,69,83) + `level2`) | **Pass** / **Pass** | `recjvt7lKEh0s8bDG` / `rec3n4Hh5TUekjpAy` |
| state=hover, 4:3 | light / dark | overlay 0.2, gradient .55 → 0, r 8, inset −1; button on top (`elementFromPoint`); pointer on button: overlay stays 0.2 | **Pass** / **Pass** | `rect81QIt3jfFldaY` / `recdoLaNDFR1xuX1d` |
| state=hover, 1:1 | light / dark | 195 × 195, overlay 0.2 | **Pass** / **Pass** | `rec3pKutD0LviH0gC` / `recB9VN48Qpz46MBi` |
| overlayAction=false | light / dark | 0 buttons, card 227 × 298.25 | **Pass** / **Pass** | `recTDUgkULc0RgiLJ` / `rec1sHqIvuIu99lxq` |
| Favourite: idle look, toggle, focus | light | 40 × 40, r 999, p 8, gap 4. **Top 8.000, right 8.000** from the image's outer edge. **`.hds-icon-container` radius 0px**, 24 × 24. Clicks false→true→false, FILL 0→1→0, rgb(138,148,166)↔rgb(165,38,29). Tab: `:focus-visible`, 2px rgb(21,71,213) at 1px. Enter false→true and Space true→false, one click each. | **Pass** | `recCweuBWV1GRuDJa` |
| Favourite: same | dark | bg rgb(27,39,51), 8 / 8, radius 0. Click → rgb(224,43,43) FILL 1 → rgb(185,199,214) FILL 0. Ring 2px rgb(59,130,246). Space false→true, Enter true→false. | **Pass** | `recI1Q9tGZ2ZpvssA` |
| iconButton state=hover | light | rgb(241,244,247) + `level2` on favourite-toggle (pressed and unpressed), image-state-idle and image-state-hover; off the button: white, none | **Pass** | `recrT754NpeLNHUz4` |
| iconButton state=hover | dark | rgb(58,69,83) + `level2` (light value, gap 11) | **Pass** | `recc7rjrjF5ZL3S57` |

### cardText

| Case | Theme | Saw | Result | Row |
|---|---|---|---|---|
| all on | light | `--title-md` = `500 16px/24px Inter` etc. Title 16/500/24 0.15 rgb(27,39,51); location 12/400/16 0.4 rgb(90,107,126), 32 tall; rating 14/600/20 0.1 rgb(156,96,28); price 16/600/24 0.5; gaps 8/4/4; block 116 | **Pass** (gap 7 noted) | `recGLVLkhOY3pETkv` |
| all on | dark | rgb(255,255,255) / rgb(215,222,231) / rating rgb(240,147,43); block 116 | **Pass** | `recXp0k2lsuUHBGhq` |
| metadata=false | light / dark | text 60, card 242.25 | **Pass** / **Pass** | `recoG8aYaMjb4eKmn` / `recYq075WcOqAtYDm` |
| review=false | light / dark | meta 24, text 92, card 274.25 | **Pass** / **Pass** | `rectPrdzUuFbrE8wh` / `recM93O3MB3s6tmkS` |
| price=false | light / dark | meta 20, text 88, card 270.25 | **Pass** / **Pass** | `reccgmXgsWSxAvi5Z` / `recM5vbPlm6Jg1SdP` |

### What the change list claimed, confirmed on the deployed build

| Claim | Confirmed |
|---|---|
| cardText `font:` uses the type tokens alone (Inter) | Yes. No `system-ui, sans-serif` in the served CSS; computed family `Inter`. Sizes and wrapping unchanged. |
| Favourite at `top: 7px; right: 7px` lands 8 / 8 from the outer edge | Yes: 8.000 / 8.000 by `getBoundingClientRect`, in every story with the button, light and dark. |
| Slot `min-height: 48px` | Yes, both orientations. It matches Figma vertical exactly; horizontal is 2px taller than Figma by decision. |
| iconContainer has no radius | Yes, `0px`. |
| Stories default to a stand-in image; `ImageEmpty` keeps the fallback | Yes. Every other story loads the data-URI photo (naturalWidth 256), and `image-empty` renders `--color-bg-surface-secondary`. |
| New `InResultsGrid`, `InListWithButton` render without errors | Yes. There is no Storybook error display, and the console listener attached before navigation logged nothing in light or dark. |
| Doc comments only in card.tsx, cardLayout.tsx, cardImage.tsx | Yes. `git diff 5a692e1 9253042` in those files touches only comments. Read locally; the checkout was not the build under test. |

## R3.3 · Findings

**No engineering defects.** All 44 cases pass on `9253042`.

Observations. None of them fails a row.

- **O1 · Registry `Commit` is stale.** Card's `Commit` cell still links `5a692e1`, but the staging link points at the `9253042` build. It belongs to the Engineer, and the PM verifies it. QA did not write it.
- **O2 · Stale node id in code.** `src/components/iconContainer/iconContainer.tsx` still stamps `data-node-id="8:895"`, and `iconContainer.css` line 1 names `8:895`. That node no longer exists; the icon is now `108:477`. This affects documentation and traceability only.
- **O3 · No font fallback.** The type tokens carry `Inter` with no generic family. If the Google Fonts request fails, Card text renders in the browser's default serif. This was the product owner's choice. If a fallback is wanted, it belongs in the type tokens, not the component.
- **O4 · Favourited by default.** `InResultsGrid` shows every result already favourited, because `defaultFavorited` is `true` in `cardImage.tsx`. That default is not new, but the grid makes it visible.

Design follow-ups. These are Figma changes, not engineering work.

1. `8:1315` (horizontal slot) still reads 46. Set it to 48 to match the decision.
2. The iconButton in `8:1184`, `8:1185`, `8:1187`, `8:1196` still sits 7.5 from the right. Move it to 8.
3. `12:1343` still sizes `8:770` at 48 with no rows (gap 9). The three questions from Run 1 §4 are still open.
4. `color/text/accent` is still `#f0932b` in light (gap 7).
5. `elevation/level2` has no dark variant (gap 11).
6. In dark, `--color-border-default` = `--color-bg-surface-secondary`, so the `image = empty` frame has no visible edge.

Waived gaps, re-checked in source at `9253042`:

| Gap | What is in the CSS |
|---|---|
| 2 · core tokens | `--border-radius-4` (overlay), `--spacing-1` / `--spacing-2` (favourite). `--border-radius-2` is gone. |
| 3 · raw values | `gap: 10px` (horizontal column), `min-height: 48px` (slot), `top: 7px; right: 7px` (favourite) |
| 8 · overlay strength | `--hds-card-image-overlay-strength: 0.2` |
| other literals | `120ms` transitions only. No hex values, and no raw font values. |

## R3.4 · Harness notes (not component behaviour)

- The Vercel preview injects a `vercel-live-feedback` toolbar. It takes a Tab stop, so in dark it took up to three Tabs to reach the favourite button. The button is still the card's only focusable element.
- Some coordinate clicks were never delivered to the page: no `pointerdown` reached `document`. They were re-driven on the element ref, and a later coordinate click also worked. Every toggle reported above has a matching trusted `click` event.
- Keys were browser-level events from Claude in Chrome. This is not a manual keyboard pass and not an assistive-technology test.

## R3.5 · Screenshots

- **Saved:** the three Figma renders listed in R3.1.
- **Not saved:** the browser captures. I captured the deployed build in Chrome for image = empty (light), the favourite unpressed and pressed with hover, keyboard focus in light and dark, image-state-hover with hover, dark state=hover, InResultsGrid in light and dark, and InListWithButton in light and dark. As in Runs 1 and 2, `save_to_disk` returned no path. The computed values above are the evidence.
- **Attachments:** no attachment was added or removed. Existing attachments on the older rows were left in place.

## R3.6 · Registry writes

Staging Testing: **38 rows updated in place, 6 created.** Every row is `Passed`.

- **Updated:** all 38 rows listed in R3.2.
  - Expected Results were re-baselined from today's Figma, or from the named product-owner decision.
  - Saw values are from `9253042`.
  - Context names the build and the method.
  - Waiver text on `recRKWuTGZeXeI8Ce` is kept verbatim, and the approval history on `recrT754NpeLNHUz4` and `recc7rjrjF5ZL3S57` is kept.
- **Created:**
  - `rec2JjWcAsLJsOf51`, `reczCK9rid2IXW9Vs`: image = empty
  - `recCNB467vYHYAm1Z`, `rec3jibtoKPBDDCK9`: InResultsGrid
  - `recOMiSsg98sFpvqG`, `rec3ygS0hD1AOxllO`: InListWithButton
  - All six are linked to Card through `Composed In`, with `Size` `null` and `State` `idle`. No option was created.
- `Development` was not written.

Card's row after the writes: `Total Staging Tests` 44, `Staging Passed Count` 44, `Synchronization %` 100%, `Staging Testing Results Summary` Passed, **`Development` `Completed`**.

## R3.7 · Verdict (Run 3)

**All 44 cases pass on the deployed `9253042` staging build, in light and dark.** The four CSS changes behave as described. The stand-in image and the three new stories render without errors. Nothing regressed.

- **Engineering:** nothing to fix. O1 and O2 are housekeeping.
- **Design:** the six Figma follow-ups in R3.3.
- **Next step:** a human reads this run before the release goes ahead. No verdict here is final.

---

# Run 2: re-test after the favourite-hover repair

| | |
|---|---|
| Run | Re-test on 2026-09-14, after repair `21140e1` (merged in PR #34 as `5a692e1`). Scope: the two F1 rows, plus every Card case the repair can reach. |
| Build under test | Deployed staging Storybook from the `Staging Storybook` cell on Card's Components row (`rec1y6kyai6F3FVWv`). I read the cell myself, in base `appTH3itfUmsuyeUm` = `[Class Demo] Horizon DS`, which matches `baseName` in `.claude/registry.local.json`. I identified the cell as `Staging Storybook` from the `Development` formula (precedence 7). |
| URL | `https://horizon-design-system-bvjwd078e-chawsuhlaing2209s-projects.vercel.app/?path=/docs/components-card--docs` (it was `6s22ezf3m` in Run 1) |
| Registry `Commit` | `5a692e1` |
| Registry `Development` | **Before:** `To be fixed`. **After:** `Fixed`. |
| Is this the repaired build? | Yes. The deployed stylesheet has `.hds-card-image__favorite:hover { background: var(--color-bg-secondary-hovered); box-shadow: var(--elevation-level2); }`. The story index is unchanged from Run 1 (18 Card entries). |
| What changed | `git diff --stat b5f15b9 origin/staging` shows one source file, `src/components/cardImage/cardImage.css` (+8), plus `reports/`. The local checkout (`6027b2a` on `fix/card-favourite-hover`) has no `src` diff against `origin/staging`. |
| Local checks | `npm test -- src/components/card`: 28/28 pass. The checkout was used only for that and to read source. It was never the build under test. |
| Design reference | Figma file `r1CpQEYecqROS0oIOMlqAx`, read with read-only `use_figma` and `get_screenshot`. `8:1134` is a `COMPONENT_SET` named `iconButton` on page `💠 Icon Button` (34:804), with one property, `state` = idle \| hover. `8:1135` is `state=hover`. |
| Surface | Claude in Chrome, the real Vercel bundle. No local Storybook was started. |

## R2.0 · Fonts

| Check | Result |
|---|---|
| `16px Inter` vs `16px QaBogusFamilyXyz` | 227.25 vs 196.875 |
| `24px "Material Symbols Outlined"` measuring `favorite` vs bogus | 24 vs 74.625 |
| `document.fonts` status `loaded` | Inter 500, Inter 600, Inter 100–900, Material Symbols Outlined 100–700 |

The fonts loaded, so the sizes below are real.

## R2.1 · The design, re-read from Figma

| Property | `8:1133` state=idle | `8:1135` state=hover |
|---|---|---|
| Fill | `color/bg/secondary` #ffffff | **`color/bg/secondary/hovered` #f1f4f7** |
| Effects | none | **effect style `elevation/level2`:** DROP_SHADOW #1b27330f (0,2) r4 s0 + DROP_SHADOW #1b27331a (0,4) r8 s0 |
| Size, radius | 40 × 40, `border/radius/full` | same |
| Padding, gap | `spacing/8` and `spacing/sm` (8), `spacing/4` (4) | same |
| Icon | Icon Container radius `border/radius/4`, vector `color/icon/negative` #a5261d | same |

**Correction to Run 1.** Run 1's F1 named the fill only, and its §2 table said the hover variant was otherwise "same". That was incomplete: `8:1135` also carries `elevation/level2`, and the idle variant has no effect. The Engineer's repair includes the shadow. Run 2 measured both.

In dark, the fill resolves to #3a4553 (from `tokens/semantic-color.dark.tokens.json`, because the library variable cannot be resolved per mode through the plugin API). `elevation/level2` has no dark variant (gap 11).

Render: `reports/card/figma-8-1135-iconButton-hover.png`.

## R2.2 · Results

Method, for every read below:

- The pointer was a real Claude in Chrome hover.
- The button's `transition-duration` is `0s`, so its reads are never taken mid-transition.
- Overlay and card-shadow reads waited out their 120ms transition. One card-shadow read was taken mid-transition and then re-read settled.
- Dark was loaded with `&globals=theme:dark`, and `data-theme=dark` was confirmed.

`elevation/level2` in the table means `rgba(27,39,51,.06) 0 2px 4px 0, rgba(27,39,51,.1) 0 4px 8px 0`.

| Case | Theme | Saw | Result | Row |
|---|---|---|---|---|
| **iconButton state=hover** (favourite) | light | `:hover` true. bg rgb(241,244,247) = `--color-bg-secondary-hovered`, box-shadow `elevation/level2`, 40 × 40, radius 999, padding 8. Same result when unpressed, when pressed, when focus-visible (ring kept), and inside pinned `image-state-idle` and `image-state-hover`. Pointer on the image off the button, or off the card: rgb(255,255,255), shadow none. | **Fixed (To re-test)**: repair confirmed | `recrT754NpeLNHUz4` |
| **iconButton state=hover** (favourite) | dark | bg rgb(58,69,83) = `--color-bg-secondary-hovered`, box-shadow `elevation/level2` (the light value, see gap 11). Same across pressed, focus and pinned stories. Off: rgb(27,39,51), shadow none. | **Fixed (To re-test)**: fill and token confirmed; dark shadow visibility is gap 11 | `recc7rjrjF5ZL3S57` |
| Favourite idle, pressed/unpressed, focus | light | Pointer off: rgb(255,255,255), shadow none, 8 / 7.5 from the image edge. Click false→true, FILL 0→1, rgb(138,148,166)→rgb(165,38,29). Tab: `:focus-visible`, 2px solid rgb(21,71,213) at 1px, bg stays idle. Space true→false, Enter false→true. Hover does not leak into focus-only or image-only states. | **Passed** | `recCweuBWV1GRuDJa` |
| Favourite idle, pressed/unpressed, focus | dark | Pointer off: rgb(27,39,51), shadow none. Click → rgb(224,43,43), FILL 1. Tab: ring 2px rgb(59,130,246), bg stays idle. Space → rgb(185,199,214), FILL 0. No hover leak. | **Passed** | `recI1Q9tGZ2ZpvssA` |
| cardImage state=idle (pinned), button present | light | overlay 0. Pointer on the image: overlay 0, button idle. Pointer on the button: overlay 0, button hover. | **Passed** | `recjvt7lKEh0s8bDG` |
| cardImage state=idle (pinned), button present | dark | overlay 0, border rgb(58,69,83). Pointer on the image: overlay 0, button idle. Pointer on the button: overlay 0, button rgb(58,69,83) + shadow. | **Passed** | `rec3n4Hh5TUekjpAy` |
| cardImage state=hover 4:3, button present | light | overlay 0.2, gradient rgba(27,39,51,.55)→0, radius 8. Button z-index 3 and idle with the pointer off. Pointer on the button: `elementFromPoint` is the button, overlay stays 0.2, button hover. | **Passed** | `rect81QIt3jfFldaY` |
| cardImage state=hover 4:3, button present | dark | overlay 0.2, radius 8. Pointer on the button: overlay 0.2, button rgb(58,69,83) + shadow. | **Passed** | `recdoLaNDFR1xuX1d` |
| overlayAction=false | light | 0 favourite elements, 0 buttons, image 195 × 146.25, card 227 × 298.25 | **Passed** | `recTDUgkULc0RgiLJ` |
| overlayAction=false | dark | 0 buttons, border rgb(58,69,83), card 227 × 298.25 | **Passed** | `rec1sHqIvuIu99lxq` |

Observations, not findings:

- **Card hover still works.** With the pointer on the favourite button, the card also reads `:hover` and carries its own `elevation/level2`. The card's hover and the button's hover now show together.
- **Clipping.** The button sits inside `.hds-card-image` (`overflow: hidden`), 7.5px from the right edge, so the outer fringe of the 8px-blur shadow is clipped there. The Figma cardImage frame clips its content the same way. The shadow's alpha at that distance is near zero.
- **Dark shadow.** The hover shadow is #1b2733-based on a dark surface and is practically invisible. On dark, the hover reads through the fill change alone. This is gap 11, a design gap. The gap 11 waiver was granted for the Card hover row only, and QA does not extend it to the favourite row. The row is `Fixed (To re-test)` on the fill and the token reference, and the gap is written in its Context.

## R2.3 · Cases not re-run in Run 2, relying on Run 1 (`b5f15b9`)

The repair adds one `:hover` rule scoped to `.hds-card-image__favorite`. It cannot reach the cases below. Their rows were not changed and still carry Run 1's measurements on build `6s22ezf3m`.

| Rows | Cases |
|---|---|
| `recPkzD0DiT6dfqo2`, `reckWADjP56XXUmy8`, `recQfAZfxyT19rS2W`, `recRKWuTGZeXeI8Ce` (gap 11 waiver, kept as is and not re-measured), `recoyeS31iIhl20eI`, `recM32QHS23rru6dI`, `recPFNpA76432oysU`, `recYgLks4BD343ZIT` | Card state, 12:1343 as placed, long content |
| `rec2H5ftc2XFYyLGr`, `rec5K6pYPU0e8boHd`, `recruJ0K6kqgODxAC`, `reccHjcAahTTrHUit`, `recLoAXbMvU9miOR2`, `recO8NTJm4DwMtJya` | cardLayout |
| `recxBwxGQ0aixdQAv`, `recisNldJMxTS7P8O`, `recxvC0teYOg6Ya5w`, `recH73iwIstwR85ZL`, `rec3pKutD0LviH0gC`, `recB9VN48Qpz46MBi` | cardImage ratio rows and hover 1:1. The button is present in these, but they measure frame geometry and overlay, which the rule does not touch. The button's own hover was measured in the pinned idle and hover 4:3 stories above. |
| `recGLVLkhOY3pETkv`, `recXp0k2lsuUHBGhq`, `recoG8aYaMjb4eKmn`, `recYq075WcOqAtYDm`, `rectPrdzUuFbrE8wh`, `recM93O3MB3s6tmkS`, `reccgmXgsWSxAvi5Z`, `recM5vbPlm6Jg1SdP` | cardText |

## R2.4 · Screenshots

- **Saved:** `reports/card/figma-8-1135-iconButton-hover.png`, the Figma render of the hover variant (56 × 56).
- **Not saved:** the browser captures. I captured the deployed build in Chrome for light idle, light hover (unpressed and pressed), light focus+hover, and dark hover. As in Run 1, `save_to_disk` returned no path, so none of these reached disk. The computed values above are the evidence.
- **Attachments:** the two F1 rows keep their existing attachment, the 8:1134 set render.

## R2.5 · Registry writes

Staging Testing, **10 rows updated in place, 0 created.**

- `recrT754NpeLNHUz4`, `recc7rjrjF5ZL3S57`: `Failed` → **`Fixed (To re-test)`**. Expected, Suggestion and Context were rewritten for this build, and Expected now names the effect style.
- Stayed **`Passed`**, with Expected and Context re-measured on `bvjwd078e`: `recCweuBWV1GRuDJa`, `recI1Q9tGZ2ZpvssA`, `recjvt7lKEh0s8bDG`, `rec3n4Hh5TUekjpAy`, `rect81QIt3jfFldaY`, `recdoLaNDFR1xuX1d`, `recTDUgkULc0RgiLJ`, `rec1sHqIvuIu99lxq`.
- `Size` and `State` are unchanged, and no option was created. `Composed In` is unchanged, so `[Staging] Test Records` still links the same 38 rows. `Development` was not written.

Card's row after the writes:

| Field | Value |
|---|---|
| `Staging Testing Results Summary` | Passed, Fixed (To re-test) |
| `Total Staging Tests` | 38 |
| `Staging Passed Count` | 36 |
| `Synchronization %` | 94.74% |
| **`Development`** | **`Fixed`** |

`Synchronization %` did not move, because it counts `Passed` rows only and the two repaired rows are `Fixed (To re-test)`.

## R2.6 · Verdict (Run 2)

**The F1 repair is confirmed on the deployed staging build.** In light and dark, the favourite button now takes `--color-bg-secondary-hovered` and `--elevation-level2` under a real pointer, matching `8:1135`. Nothing the repair can reach regressed: idle, pressed/unpressed, focus-visible, keyboard activation, the pinned image states and overlayAction=false.

- **Engineering:** nothing left to fix from this run.
- **Design, still open:** gap 11, since the hover shadow has no dark value. The other design questions and waived gaps are listed in Run 1 §4.
- **Next step:** a human reads the two `Fixed (To re-test)` rows. QA does not mark its own finding closed, and no verdict here is final.

## Run 2 · outcome

**Approval.** On 2026-09-14 the designer read `recrT754NpeLNHUz4` and `recc7rjrjF5ZL3S57` and approved them as Passed. The coordinator relayed the approval, and QA did not see the designer's message directly.

**What QA wrote.** Nothing was re-tested and no other row was touched.

- Both rows: `Testing Results` set from `Fixed (To re-test)` to **`Passed`**.
- Both rows: one line appended to `Context`, "2026-09-14: repair re-tested on 5a692e1 and confirmed; set Passed on the designer's approval." Existing Context was kept, including the gap 11 dark-shadow note on `recc7rjrjF5ZL3S57`.
- Read back: both rows show `Passed` and are linked to Card.

**Board state now** (Card `rec1y6kyai6F3FVWv`):

| Field | Value |
|---|---|
| `Staging Testing Results Summary` | Passed |
| `Total Staging Tests` | 38 |
| `Staging Passed Count` | 38 |
| `Synchronization %` | 100% |
| **`Development`** | **`Completed`** |

**Why `Completed` and not `To be deployed`.** With no failing and no re-test rows left, the formula falls through to precedence 5. `Production Storybook` was already set by an earlier promotion, so `Completed` wins. The production build comes from that earlier promotion and does not contain `5a692e1`. The board therefore reads `Completed` while the favourite-hover repair exists only on staging. Promotion is for DevOps and a human. QA did not write `Development`.

**Still open, for design:** gap 11. `elevation/level2` has no dark variant.

---

# Run 1: full re-test on `b5f15b9`

| | |
|---|---|
| Run | Re-test on 2026-09-14. This file replaces the earlier Card runs, which tested the pre-#32 build (cardContainer, `ratio=3:2`, 10px layout gap, 48px metadata reserve). Those runs are still in git history. |
| Build under test | Deployed staging Storybook, read from the `Staging Storybook` cell on Card's Components row (`rec1y6kyai6F3FVWv`). Base `[Class Demo] Horizon DS`, checked against `baseName` in `.claude/registry.local.json`. |
| URL | `https://horizon-design-system-6s22ezf3m-chawsuhlaing2209s-projects.vercel.app/?path=/docs/components-card--docs` |
| Registry `Commit` | `b5f15b9`, which contains the #32 squash `fbf19cf` |
| Registry `Development` | **Before:** `Completed`. `Production Storybook` is set, so the new staging link did not show as `Ready for Testing`, and this run was requested directly. **After:** `To be fixed`. A `Failed` row outranks `Completed`. |
| Design reference | Figma file `r1CpQEYecqROS0oIOMlqAx`. I found the sets by walking the file, not by trusting IDs from the repo: page `💠 Card` (7:701) holds **Card** `34:317`, **cardLayout** `8:1251`, **cardImage** `8:1186` and **cardText** `8:778` (a component with boolean properties, not a set). The favourite button inside cardImage is an instance of **iconButton** `8:1134` on page `💠 Icon Button` (34:804). I read them live with read-only `use_figma` scripts and `get_screenshot`. |
| Surface | Claude in Chrome, real Chrome, the real Vercel bundle, fonts from the CDN. No local Storybook was started. |
| Local checkout | `66c8e2a`. `git diff b5f15b9 -- src` is empty. I used it only to read source and to run `npm test -- src/components/card`: 28/28 pass. It was never the build under test. |

The expected matrix below comes from the Figma nodes, not from `card.stories.tsx`.

---

## 0 · Fonts loaded, checked before any width was read

I measured `Horizon Design System 12345` on a canvas:

| Family | Width |
|---|---|
| `16px Inter` | 227.25 |
| `16px sans-serif` | 216.11 |
| `16px QaBogusFamilyXyz` | 196.875 |
| `24px "Material Symbols Outlined"` measuring `favorite` | 24 (a single glyph) |
| `24px QaBogusFamilyXyz` measuring `favorite` | 74.63 |

`document.fonts` lists Inter 500, Inter 600, Inter 100–900 and Material Symbols Outlined 100–700 as `loaded`. Every size below comes from the component, not from a fallback font.

## 1 · Is the deployed build the #32 build?

- The deployed story index lists `figma-node`, `state-enable`, `state-hover`, `orientation-vertical`, `orientation-horizontal`, `has-slot`, `ratio-4-x-3`, `ratio-1-x-1`, `image-state-idle`, `image-state-hover`, `image-state-hover-ratio-1-x-1`, `overlay-action-off`, `metadata-off`, `review-off`, `price-off`, `favourite-toggle` and `long-content`. None of them is a cardContainer story, and there is no `3-x-2`.
- The served CSS matches the #32 source rule for rule:
  - `.hds-card` has padding and radius `--border-radius-control`.
  - `.hds-card:hover, [data-state=hover]` uses `--elevation-level2`.
  - `.hds-card-layout` and `__body` use `gap: var(--spacing-gap-sm)`, and horizontal `__body` uses `gap: 10px`.
  - `.hds-card-image` has radius `--border-radius-control`.
  - `.hds-card-text__meta` has no `min-height`.
- **This is the #32 build.**

---

## 2 · The expected matrix, from Figma

### Card `34:317`: `state` = enable | hover

| Variant | Frame | Bindings |
|---|---|---|
| `12:1343` state=enable | 227 × 298.25, vertical, hug height | fill `color/bg/surface/primary`, radius `border/radius/control` (12), padding `spacing/padding/sm` (12) × `spacing/padding/md` (16), no effect |
| `34:318` state=hover | 227 × 298.25 | same, plus effect style `elevation/level2` = `#1B27330F (0,2) r4` + `#1B27331A (0,4) r8` |

Both variants nest `cardItems` (195 wide) → `cardLayout` vertical, `hasSlot=false`, gap `spacing/gap/sm` (12). That holds `cardImage` state=**hover** ratio=4:3 (195 × 146.25) and `cardText` metadata=true, **review=false, price=false** (195 × 116). The 116 is heading 60 + gap 8 + container `8:770` at **48 with no visible rows**, although `8:770` is set to HUG.

### cardLayout `8:1251`: `orientation` = horizontal | vertical, `hasSlot` (default true), `Slot`

| Variant | Frame | Children |
|---|---|---|
| `8:1249` vertical | 269 × 371.75, gap `spacing/gap/sm` (12) | cardImage 269 × 201.75 · cardText 100 at y 213.75 · Slot `8:1314` 46 at y 325.75 |
| `8:1250` horizontal | 269 × 172, gap `spacing/gap/sm` (12) | cardImage `8:1213` 128.5 × 96.375 at x 0 · column `8:1318` 128.5 at x 140.5, itemSpacing **10 raw** · cardText 116 · Slot `8:1315` 46 at y 126 |

### cardImage `8:1186`: `state` = idle | hover × `ratio` = 4:3 | 1:1, `overlayAction` (default true)

| Variant | Frame | Notes |
|---|---|---|
| `8:1184` idle, 4:3 | 363.5 × 272.625 | frame radius `border/radius/control` (12), clips; inner Slide Image radius `border/radius/8`, 1px INSIDE stroke `color/border/default` |
| `8:1187` idle, 1:1 | 363.5 × 363.5 | same |
| `8:1185` hover, 4:3 | 363.5 × 272.625 | + Overlay `8:1182`: radius 8, gradient `color/bg/overlay` 0.55 → 0, fill opacity 20% |
| `8:1196` hover, 1:1 | 363.5 × 363.5 | + Overlay `8:1203` |

In every variant the favourite button is an iconButton instance (state=idle), absolute, constrained right/top, **8 from the top and 7.5 from the right**.

### iconButton `8:1134`: `state` = idle | hover

| Variant | Fill | Shared |
|---|---|---|
| `8:1133` idle | `color/bg/secondary` (#ffffff) | 40 × 40 (min 40), radius `border/radius/full`, padding `spacing/8`/`spacing/sm` (8), gap `spacing/4` (4); Icon Container radius `border/radius/4` holding `favorite`, vector `color/icon/negative` |
| `8:1135` **hover** | **`color/bg/secondary/hovered` (#f1f4f7)** | same, **plus effect style `elevation/level2`** (missed in Run 1, added by Run 2) |

### cardText `8:778`: booleans `metadata`, `review`, `price` (all default true)

- Block gap `spacing/gap/xs` (8).
- Heading `8:767`, gap `spacing/gap/2xs` (4):
  - Title: `title/md`, `color/text/primary`.
  - Location: `body/sm`, `color/text/secondary`.
- Metadata `8:770`, HUG, gap 4:
  - Rating row `8:771`: Rating Score `label/lg/bold` in `color/text/accent`, Review Count `body/sm`.
  - Price row `8:774`: Price Amount `body/lg/bold` in `color/text/primary`, Price Info `body/sm`.

**Dark mode.** The variables live in a library, so the plugin API cannot resolve them per mode. I took the dark expectations from `tokens/semantic-color.dark.tokens.json`, which is the committed Figma export. Every light value read from Figma matches the light token file, with one exception: the known gap 7 on `color/text/accent`.

### Reconciliation against the stories

| Figma case | Story | |
|---|---|---|
| Card enable / hover | `state-enable`, `state-hover` | ✓ |
| Card 12:1343 as placed | `figma-node` | ✓ |
| cardLayout vertical / hasSlot / horizontal | `orientation-vertical`, `has-slot`, `orientation-horizontal` | ✓ |
| cardImage idle 4:3, idle 1:1, hover 4:3, hover 1:1 | `ratio-4-x-3`, `ratio-1-x-1`, `image-state-idle`, `image-state-hover`, `image-state-hover-ratio-1-x-1` | ✓ (`image-state-idle` pins idle on 4:3) |
| cardImage overlayAction=false | `overlay-action-off` | ✓ |
| cardText metadata / review / price off | `metadata-off`, `review-off`, `price-off` | ✓ |
| **iconButton state=hover** | **none** | **Missing case.** No story, and nothing in the build renders it. See F1. |
| n/a | `favourite-toggle`, `long-content` | Behaviour and resilience views, not Figma variants. Kept and tested. |

---

## 3 · Results

Every value is a computed style or a `getBoundingClientRect` read from the deployed build. Each story was loaded as `iframe.html?id=…&viewMode=story`, once plain and once with `&globals=theme:dark`. I confirmed `data-theme=dark` and `--color-bg-surface-primary` = `#1b2733` at the card before reading dark values.

### 3.1 Card

| Case | Theme | Saw | Result |
|---|---|---|---|
| state=enable | light | `<article>` 227 × 298.25, bg rgb(255,255,255), radius 12, padding 12/16, shadow none, layout gap 12 | **Pass** |
| state=enable | dark | 227 × 298.25, bg rgb(27,39,51), same geometry | **Pass** |
| state=hover | light | pinned: shadow `rgba(27,39,51,.06) 0 2px 4px, rgba(27,39,51,.1) 0 4px 8px`. Real pointer over the text: card raises, image overlay stays 0. Over the image: raises, overlay 0.2. Off: none. | **Pass** |
| state=hover | dark | shadow value identical to light; `#1b2733` shadow on a `#12181f` backdrop, composite delta ≈ (1,2,2)/255; zoomed enable and a real hover are indistinguishable | **Pass (waived, not measured)** · gap 11 |
| 12:1343 as placed | light | 227 × **250.25**; image data-state=hover, overlay 0.2; heading 60, empty metadata 0 tall, 8px gap kept → text 68 | **Pass** on the gap 9 decision · see §4 |
| 12:1343 as placed | dark | 227 × 250.25, bg rgb(27,39,51), same | **Pass** on the gap 9 decision |
| Long content | light | 227 × 338.25, text 195 × 156 (title 48, location 48), scrollWidth 227 = clientWidth | **Pass** |
| Long content | dark | same | **Pass** |

### 3.2 cardLayout

| Case | Theme | Saw | Result |
|---|---|---|---|
| vertical, hasSlot=false | light / dark | flex column, gap 12, layout 195 × 274.25, image 195 × 146.25, text starts at 158.25 | **Pass** / **Pass** |
| vertical, hasSlot=true | light / dark | at 195: body gap 12, slot 195 × 46, layout 332.25 = 146.25+12+116+12+46. **At the node's 269** (wrapper widened for measurement): layout 269 × 371.75, image 201.75, text 100, slot at y 325.75, exact | **Pass** / **Pass** |
| horizontal, hasSlot=true | light / dark | grid `128.5px 128.5px`, gap 12; layout 269 × 172; image 128.5 × 96.38 at 0; body at 140.5, gap 10; text 116; slot 46 at y 126. Delta 0.00 | **Pass** / **Pass** |

### 3.3 cardImage and the favourite button

| Case | Theme | Saw | Result |
|---|---|---|---|
| ratio=4:3, idle | light | aspect 4/3, 195 × 146.25, border 1px rgb(234,239,244), radius 12, overflow hidden | **Pass** |
| ratio=4:3, idle | dark | border rgb(58,69,83), radius 12. The border equals surface-secondary, so it is invisible on the empty placeholder (observation) | **Pass** |
| ratio=1:1, idle | light / dark | aspect 1/1, 195 × 195, card 227 × 347 | **Pass** / **Pass** |
| state=idle pinned | light | overlay 0; a real pointer over the image does not raise it | **Pass** |
| state=idle pinned | dark | overlay 0 | **Pass** |
| state=hover, 4:3 | light | overlay opacity 0.2 over `linear-gradient(rgba(27,39,51,.55), transparent)` = 0.11; radius 8; inset −1px covers the border. Unpinned, a real pointer over the image → 0.2; over the text → 0 | **Pass** |
| state=hover, 4:3 | dark | overlay 0.2; a real pointer over the image → 0.2 | **Pass** |
| state=hover, 1:1 | light / dark | 195 × 195, overlay 0.2 | **Pass** / **Pass** |
| overlayAction=false | light / dark | no favourite element, zero buttons in the card | **Pass** / **Pass** |
| Favourite, idle look, toggle, focus | light | 40 × 40, radius 999, bg rgb(255,255,255), padding 8, gap 4, top 8 / right 7.5 from the image edge, icon container radius 4, Material Symbols 24px. Real clicks: aria-pressed false→true→false, FILL 0→1→0, rgb(138,148,166)→rgb(165,38,29). Tab → `:focus-visible`, outline 2px solid rgb(21,71,213) at 1px. Enter and Space each → one click (isTrusted, detail 0), toggles | **Pass** |
| Favourite, same | dark | bg rgb(27,39,51); pressed rgb(224,43,43) FILL 1; unpressed rgb(185,199,214); ring 2px rgb(59,130,246); Space toggles | **Pass** |
| **Favourite, iconButton state=hover** | **light** | real pointer on the button: **bg stays rgb(255,255,255)**, expected `#f1f4f7` | **Fail** · F1 |
| **Favourite, iconButton state=hover** | **dark** | real pointer on the button: **bg stays rgb(27,39,51)**, expected `#3a4553` | **Fail** · F1 |

### 3.4 cardText

| Case | Theme | Saw | Result |
|---|---|---|---|
| all on | light | title Inter 16/500/24, 0.15px, rgb(27,39,51) · location 12/400/16, 0.4px, rgb(90,107,126), 32 tall · rating 14/600/20, 0.1px, **rgb(156,96,28)** · review count 12/400 rgb(90,107,126) · price 16/600/24, 0.5px, rgb(27,39,51) · gaps 8/4/4 · heading 60, metadata 48 (min-height auto), block 116 | **Pass** · gap 7 noted |
| all on | dark | rgb(255,255,255) / rgb(215,222,231) / rating rgb(240,147,43) / price rgb(255,255,255); block 116 | **Pass** |
| metadata=false | light / dark | metadata absent, text 60, card 242.25 | **Pass** / **Pass** |
| review=false | light / dark | metadata **24** (hugs the price row), text 92, card 274.25 | **Pass** / **Pass** |
| price=false | light / dark | metadata **20** (hugs the rating row), text 88, card 270.25 | **Pass** / **Pass** |

---

## 4 · Findings

### F1 · The favourite button has no hover state (light and dark), **Fail** on `b5f15b9`

> **Run 2 update.** Repaired in `21140e1` and confirmed on `5a692e1`. The rows are now `Fixed (To re-test)`, and closing them is for a human. The expected state was incomplete here: `8:1135` also uses `elevation/level2`, and the repair applies it.

```
Card / cardImage · iconButton state=hover · light and dark
Expected  background uses --color-bg-secondary-hovered   (iconButton 8:1135: color/bg/secondary/hovered, #f1f4f7 light / #3a4553 dark)
Saw       background stays --color-bg-secondary          (rgb(255,255,255) light / rgb(27,39,51) dark) under a real pointer
Where     src/components/cardImage/cardImage.css, the .hds-card-image__favorite block has no :hover rule
```

- **Evidence.** Figma: `reports/card/figma-8-1134-iconButton-set.png` shows idle above and hover below. Build: with a real pointer on the button (`:hover` confirmed on `.hds-icon` inside it, transitions disabled, a frame forced before the read), the computed `background-color` does not change. Of the deployed stylesheet's rules for `.hds-card-image__favorite`, only `[aria-pressed='false']` and `:focus-visible` are state rules.
- **Suggested fix.** `.hds-card-image__favorite:hover { background: var(--color-bg-secondary-hovered); }`. The token exists in both modes.
- **Related, for engineer and designer.** Figma treats iconButton as its own component set on its own page. The code has no iconButton component, and cardImage re-implements its styles inline. CLAUDE.md's subcomponents method would build and import it, and that is where both states would live.
- **Why it was missed before.** Earlier runs tested the button at its idle look only and never compared it against the iconButton set.

### Design questions, not engineering defects (rows Passed)

1. **Card 12:1343 as placed is 48px shorter in the build (250.25 against 298.25).** Figma sizes metadata container `8:770` at 48 with no visible rows, although it is set to HUG. The product owner decided on 2026-09-13 that there is no reserve (gap 9, RESOLVED). The build follows that decision, and the rows are Passed on it. Still open:
   - (a) Reset the instance in Figma so the node agrees with the decision.
   - (b) With `metadata=true, review=false, price=false`, the build renders an empty metadata element and keeps the 8px gap above it (text 68 rather than 60). Decide whether metadata with no rows should collapse completely.
   - (c) The `figma-node` story claims to reproduce 12:1343 "exactly". It is 48px shorter, and its description should say why.
2. **Both Card variants place cardImage at `state=hover`.** In the Figma set, even `state=enable` shows the image tint. The build keeps the two `state` properties independent (the card's hover does not tint the image, and the image is pointer-driven unless pinned), which matches the property model. A consumer can pin `image.state='hover'` to reproduce the placed instance. Confirm whether the tinted image in the enable variant is intended or a leftover sample.
3. **The image stroke.** Figma draws the 1px stroke on the inner rectangle at radius 8 (core `border/radius/8`), inside a frame that clips at 12, so the stroke is cut at the corners. The build draws a continuous border on the 12px frame. The silhouette is the same. If the continuous edge is the intent, set the inner radius to `border/radius/control` in Figma.
4. **Dark observations carried forward.**
   - `--color-border-default` equals `--color-bg-surface-secondary` (#3a4553), so the image border vanishes on the placeholder.
   - `--color-bg-secondary` equals the card surface (#1b2733), so the favourite pill only reads over a photo.
   - The F1 hover colour #3a4553 is also that same border and surface-secondary value.

### Waived gaps, re-measured and still open

| Gap | Re-measured on this build | Row |
|---|---|---|
| 11 · `elevation/level2` has no dark variant | Unchanged. The dark shadow is identical to light and is painted in the surface colour, so hover is invisible in dark. The waiver text is kept verbatim in Context, and the row stays `Passed` only because of that human waiver. QA did not grant it. | `recRKWuTGZeXeI8Ce` |
| 3 · raw values | Horizontal text column `gap: 10px`, slot `min-height: 46px`, favourite `top: 7px; right: 6.5px`. All three are still raw, as instructed. | `recruJ0K6kqgODxAC`, `recLoAXbMvU9miOR2`, `recCweuBWV1GRuDJa` |
| 2 · core tokens | `--spacing-1`, `--spacing-2` (favourite), `--border-radius-2` (icon container), `--border-radius-4` (overlay radius) | `recCweuBWV1GRuDJa`, `rect81QIt3jfFldaY` |
| 4 · undesigned focus / pressed / disabled | Generic focus ring only | `recCweuBWV1GRuDJa` |
| 5 · unfavourited heart | Outlined, `--color-icon-subtle` | `recCweuBWV1GRuDJa` |
| 7 · accent in Figma | The build renders #9c601c (correct). The Figma Rating Score fill is still #f0932b in light. | `recGLVLkhOY3pETkv` |
| 8 · overlay strength | `--hds-card-image-overlay-strength: 0.2` | `rect81QIt3jfFldaY` |

What the change list said, confirmed on the deployed build:

- cardContainer is gone. Card renders its own `<article>` and takes `state`.
- `ratio` is `4:3 | 1:1`.
- Metadata hugs its rows.
- The layout gap is `--spacing-gap-sm` in both orientations and between text and slot in vertical.
- The image frame radius is `--border-radius-control`.

### Token check (step 6)

- `card.css` has no raw colour, space, radius or font value. The one literal is the `120ms` transition.
- `cardLayout.css` contains `10px` and `46px`, both waived under gap 3.
- `cardImage.css` contains `7px` / `6.5px` (gap 3), `0.2` (gap 8), and core `--spacing-1`, `--spacing-2`, `--border-radius-4` (gap 2).
- `iconContainer.css` uses core `--border-radius-2` (gap 2).
- `cardText.css` is clean.
- No hex values.

---

## 5 · Keyboard activation: what automation can and cannot say

- **Tab.** Tab from the page lands on the favourite button, `:focus-visible` is true, and the ring renders: 2px `--color-border-focused` at a 1px offset, in light and dark. The next Tab leaves the story, so the card surface is not a tab stop. The button is the only focusable element.
- **Enter and Space.** Each press dispatched exactly one `click` (`isTrusted: true`, `detail: 0`, meaning keyboard-originated) and toggled `aria-pressed`: Enter in light, Space in light and dark.
- **What that does not prove.** Claude in Chrome delivers these as browser-level input events that Chrome marks trusted. This shows the native `<button>` activates from keyboard events in this browser. It is **not** a manual keyboard pass by a person, and it is **not** an assistive-technology test. No row claims more than that. The observation sits in the Context of `recCweuBWV1GRuDJa` and `recI1Q9tGZ2ZpvssA`.

## 6 · Screenshots

Saved beside this report, all Figma renders from `get_screenshot`, read live on 2026-09-14:

| File | Node |
|---|---|
| `reports/card/figma-34-317-card-set.png` | Card set: enable and hover |
| `reports/card/figma-8-1134-iconButton-set.png` | iconButton set: idle and **hover** (F1 expected) |
| `reports/card/figma-8-1186-cardImage-set.png` | cardImage: 4 variants |
| `reports/card/figma-8-1251-cardLayout-set.png` | cardLayout: horizontal and vertical |
| `reports/card/figma-8-778-cardText.png` | cardText |

**I could not write the browser captures to disk.** I captured the deployed build in Chrome for every interactive state:

- light and dark enable
- real card hover
- real image hover
- real favourite hover (the F1 evidence)
- pressed and unpressed
- keyboard focus in light and dark

The Chrome tool's `save_to_disk` returned no file path, and nothing new appeared on disk. macOS `screencapture` is refused ("could not create image from display"). I did not try to get around either. The computed values above are the primary evidence for every row.

The two F1 rows and the two 12:1343 rows carry the matching Figma render in `Attachment`. The other rows have no attachment.

Older files in `reports/card/` (`figma-cardContainer-hover.png`, `figma-cardImage-hover-3x2.png`, `figma-cardLayout-horizontal-8-1250.png`, `report.md`, `release-review-5e52483.md`) are from earlier runs, show nodes or values that no longer exist, and were left untouched.

---

## 7 · Registry writes

`Staging Testing`: **38 rows linked to Card. 36 `Passed`, 2 `Failed`.**

- **34 existing rows updated in place.** They had been measured on the previous build, and several described things that no longer exist: cardContainer, `ratio=3:2`, the 10px gap, the 48px reserve. Leaving them would have kept stale passes in the rollup. Each was re-measured on this deployment, its Expected re-baselined from today's Figma, and its Context says so.
  - The four former cardContainer rows now record Card `state` and `Component/Sub Component` = `Card`.
  - The waived row `recRKWuTGZeXeI8Ce` keeps its waiver text verbatim, and its `Passed` stays on that waiver.
- **4 new rows:**
  - iconButton hover in light and dark (`Failed`)
  - Card 12:1343 as placed in light and dark (`Passed`)
- **No row for Enter/Space as a verified activation.** See §5.
- `Size` is `null` on every row, because no set publishes a size property. `State` uses existing options only:
  - `idle` stands in for `enable` and for variant-only rows.
  - `hovered` for hover.
  - `selected` + `focus` for the pressed and focused favourite, because there is no `pressed` option.
  - No option was created.
- `Composed In` → Card on the new rows, which adds them to Card's `[Staging] Test Records`. `Development` was not written.

After the writes, Card's row reads:

- `Staging Testing Results Summary` = Passed, Failed
- `Total Staging Tests` = 38
- `Staging Passed Count` = 36
- `Synchronization %` = 94.74%
- **`Development` = `To be fixed`**

The passed count differing from the total also answers registry Flag 4: `Staging Passed Count` does filter to passes.

## 8 · Verdict

**Back to the engineer.** 36 of 38 cases pass on the deployed #32 build. Everything the 2026-09-13 restructure changed is correct.

One thing must be fixed:

- **F1:** the favourite button's hover state (`iconButton` `8:1135`, `--color-bg-secondary-hovered`) is not implemented, in light or dark.

The design questions in §4 and the waived gaps are for the designer and product owner, not the engineer. None of this is final until a human reads it.
