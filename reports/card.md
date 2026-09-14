# QA: Card, re-test after the Figma change of 2026-09-13

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
| `8:1135` **hover** | **`color/bg/secondary/hovered` (#f1f4f7)** | same |

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

### F1 · The favourite button has no hover state (light and dark), **Fail**

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
