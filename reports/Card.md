# 🔍 QA — Card

| | |
|---|---|
| Build under test | Deployed staging Storybook, read from the registry's `Staging Storybook` cell (`fldOuJpSivewZrGyt`, record `rec1y6kyai6F3FVWv`) |
| URL | `https://horizon-design-system-ev1k2psuq-chawsuhlaing2209s-projects.vercel.app` |
| Registry `Development` before this run | `Ready for Testing` |
| Design reference | Figma `12:1343` + subcomponents `8:804`, `8:1251`, `8:1186`, `8:778`, file `r1CpQEYecqROS0oIOMlqAx` — read live over the Figma MCP |
| Surface | Claude in Chrome — real Chrome, the real Vercel bundle, real CDN fonts |
| Cases | 34 (17 cases × light and dark) |
| Result | **31 Passed · 3 Failed** |

No local Storybook was started. Every measurement below comes from the deployed
bundle at the URL above, via `getBoundingClientRect` and `getComputedStyle` in a real
browser.

The expected matrix was built from `get_metadata` and `get_variable_defs` on the five
Figma nodes. It was **not** derived from `card.stories.tsx`.

---

## Font check — done before any width or size was reported

| Family used to measure `Horizon Design System 12345` at 16px | Width |
|---|---|
| `Inter` | 227.25px |
| A deliberately bogus family | 196.875px |
| `serif` | 196.875px |

Two distinct numbers, and `document.fonts` lists `Inter 100 900` and
`Material Symbols Outlined 100 700` as **loaded**. Inter and the icon font are genuinely
rendering, so every type size and every box measurement below is the component, not a
fallback.

The icon glyph was checked structurally too: the heart is an inner
`span.material-symbols-outlined` at `24px` with a real `font-variation-settings`, nested
inside `span.hds-icon-container`. The outer span computes to Arial/13.33px, which is
inherited button default and carries no glyph — worth knowing so nobody reads the outer
span and reports a missing icon font.

---

## The expected matrix, from Figma

`get_metadata` on the four subcomponent sets:

| Set | Node | Published values |
|---|---|---|
| cardContainer | `8:804` | `state` = enable (`8:800`) \| hover (`8:805`) |
| cardLayout | `8:1251` | `orientation` = vertical (`8:1249`) \| horizontal (`8:1250`), plus `hasSlot` |
| cardImage | `8:1186` | `state` = idle \| hover × `ratio` = 3:2 \| 1:1 → `8:1184`, `8:1187`, `8:1185`, `8:1196`; plus `overlayAction` |
| cardText | `8:778` | booleans `metadata`, `review`, `price` |

Instance geometry the build has to hit (`12:1343`):

```
Card            227    × 296.25
  cardItems     195    × 272.25   at 16, 12
    cardImage   195    × 146.25   (4:3)
    cardText    195    × 116      at y 156.25
    Slot        269    × 46       hidden — hasSlot=false on the instance
```

Token bindings returned by `get_variable_defs` on `12:1343` and `8:778`:

`color/bg/surfacePrimary` #ffffff · `border/radius/control` 12 · `spacing/padding/sm` 12 ·
`spacing/padding/md` 16 · `spacing/gap/xs` 8 · `spacing/gap/2xs` 4 ·
`border-width-default` 1 · `color/border/default` #eaeff4 · `color/bg/secondary` #ffffff ·
`color/icon/negative` #a5261d · `border-radius-full` 999 · `color/bg/overlay` #1b27338c ·
`color/text/primary` #1b2733 · `color/text/secondary` #5a6b7e ·
`color/text/accent` **#f0932b** · `title/md` Inter Medium 16/24/0.15 ·
`body/sm` Inter Regular 12/16/0.4 · `label/lg/bold` Inter Semi Bold 14/20/0.1 ·
`body/lg/bold` Inter Semi Bold 16/24/0.5 · `elevation/level2` (on `8:805`)
#1B27330F 0,2,4 + #1B27331A 0,4,8

And, mixed in among them as bare core paths rather than `var(--horizon-semantic-*)`:
`border/radius/8`, `border/radius/4`, `spacing/8`, `spacing/sm`, `spacing/4`.

### Reconciliation against the stories

Five Figma property axes, sixteen pinned stories, plus `--long-content` as a resilience
case that has no node. Every published variant value has a story; no story invents a
variant the node does not publish. `--docs` and `--figma-node` are reference pages, not
variants.

---

## The matrix — passes and failures

Light and dark are separate rows because `Expected Results` carries the token
resolution and the two themes resolve to different primitives — the same split Button's
run used.

| # | Subcomponent | Case | Light | Dark |
|---|---|---|---|---|
| 1 | cardContainer | `state=enable` | ✅ | ✅ |
| 2 | cardContainer | `state=hover` | ✅ | ❌ **F2** |
| 3 | cardLayout | `orientation=vertical` | ✅ | ✅ |
| 4 | cardLayout | `orientation=horizontal` | ❌ **F1** | ❌ **F1** |
| 5 | cardLayout | `hasSlot=true` | ✅ | ✅ |
| 6 | cardImage | `ratio=3:2` | ✅ | ✅ |
| 7 | cardImage | `ratio=1:1` | ✅ | ✅ |
| 8 | cardImage | `state=idle` | ✅ | ✅ |
| 9 | cardImage | `state=hover, ratio=3:2` | ✅ | ✅ |
| 10 | cardImage | `state=hover, ratio=1:1` | ✅ | ✅ |
| 11 | cardImage | `overlayAction=false` | ✅ | ✅ |
| 12 | cardImage | favourite button, pressed / unpressed / focus | ✅ | ✅ |
| 13 | cardText | baseline type and colour | ✅ | ✅ |
| 14 | cardText | `metadata=false` | ✅ | ✅ |
| 15 | cardText | `review=false` | ✅ | ✅ |
| 16 | cardText | `price=false` | ✅ | ✅ |
| 17 | Card | long content | ✅ | ✅ |

Measured geometry, every case, light and dark identical:

| Case | Card | Layout | Image |
|---|---|---|---|
| default | 227 × 296.25 | 195 × 272.25 | 195 × 146.25 (4:3) |
| `ratio=1:1` | 227 × 345 | 195 × 321 | 195 × 195 (1:1) |
| `hasSlot` | 227 × 352.25 | 195 × 328.25 | 195 × 146.25 |
| `horizontal` | 301 × 196 | 269 × 172 | 129.5 × 97.13 (4:3) |
| `metadata=false` | 227 × 240.25 | 195 × 216.25 | 195 × 146.25 |
| `review=false` | 227 × 296.25 | 195 × 272.25 | 195 × 146.25 |
| `price=false` | 227 × 296.25 | 195 × 272.25 | 195 × 146.25 |
| long content | 227 × 336.25 | 195 × 312.25 | 195 × 146.25 |

`227 × 296.25`, `195 × 272.25` and `195 × 146.25` are the instance's own numbers to the
hundredth. The vertical card matches `12:1343` exactly.

---

## Findings

### F1 · `cardLayout · orientation=horizontal` — the row is split evenly, the node splits it unevenly

```
Card · cardLayout · orientation=horizontal · light and dark
Expected  node 8:1250, 269 wide: cardImage 8:1213 is 130.5 at x=0,
          text column 8:1318 is 128.5 at x=140.5, gap 10
Saw       grid-template-columns: 1fr 1fr → 129.5px / 129.5px
Where     src/components/cardLayout/cardLayout.css line 30
Evidence  reports/card/figma-cardLayout-horizontal-8-1250.png
```

The layout box itself (269 × 172) and the image's 4:3 ratio are both correct. Only the
split is off, by one pixel each way.

This is the same phenomenon as `docs/design-gaps.md` Button #6: `cardImage` carries a
1px stroke aligned outside or centre, so Figma grows its hug width by 1px and the
sibling column loses 1px. The build normalised the tracks deliberately — the reasoning
is in a CSS comment — but that reasoning lives **only** in the comment. It is not in
`docs/design-gaps.md`, so nothing in the design record says the node and the code
disagree here.

**Needed — a decision, not a patch.** Either set the `cardImage` stroke to **inside** in
Figma (the node then reports 129.5 / 129.5 and the current code is already right), or
accept 130.5 / 128.5 and change the grid. Either way it belongs in
`docs/design-gaps.md` rather than a comment.

### F2 · `cardContainer · state=hover` in dark mode does nothing

```
Card · cardContainer · state=hover · dark
Expected  a distinguishable raised state — node 8:805 binds elevation/level2
Saw       --elevation-level2 resolves to the SAME value in dark as in light:
          #1b27330f 0 2px 4px, #1b27331a 0 4px 8px
Where     the token set, not the component — cardContainer.css line 25
          applies var(--elevation-level2) correctly
```

The shadow colour `#1b2733` is *exactly* `--color-bg-surface-primary` in dark, painted
over a `#12181f` backdrop. Composite at the strongest stop:

```
0.10 × (27,39,51) + 0.90 × (18,24,31) = (18.9, 25.5, 33.0)   vs (18, 24, 31)
```

A delta of about two parts in 255 — roughly 0.6%, below any perceptual threshold. The
same arithmetic in light gives a delta of about 21, which is why light hover reads
clearly. Confirmed visually: `--state-enable` and `--state-hover` rendered side by side
in dark at 2× zoom are indistinguishable.

**Marked Failed on observable grounds, not on the node.** There is no dark node to
compare against — `elevation/level2` is a single Figma effect style with no mode
variants — so this is not a case of the build getting a value wrong. It is a case of a
published interaction state producing no observable change in a theme the system ships.
A consumer shipping dark mode gets a card with no hover affordance at all.

**Needed:** a dark mode on `elevation/level2` (a lighter or higher-alpha shadow, or a
surface/border lift instead of a shadow), or an explicit decision that dark cards raise
by some other means, with a node to review it against. This is a designer's call —
**it should not be patched in the component.**

### F3 · Not a failure, but the most urgent thing in this report — the `--color-text-accent` fix is still one re-export from being lost

`docs/design-gaps.md` #7 records this as RESOLVED. On the deployed build it *is* still
resolved:

| | Rating score renders | On surface | Contrast | AA |
|---|---|---|---|---|
| Light | `#9c601c` | `#ffffff` | **5.12:1** | pass |
| Dark | `#f0932b` | `#1b2733` | **6.44:1** | pass |

But `get_variable_defs` on `8:778` and on `12:1343` still returns
`--horizon-semantic-color-text-accent` = **`#f0932b`**. The Figma variable has not been
updated. On the light surface that value is 2.36:1 — the original Serious violation.

The gap doc already says this was reverted exactly this way once: a re-export landed,
removed `color-orange-700`, and put the alias back. **That has not been prevented. It is
still true today.** The next `tokens/` re-export silently reintroduces a WCAG AA failure
on every consumer of `--color-text-accent`, not just this card.

Recorded as **Passed**, deliberately: the component references `--color-text-accent`
correctly, and the divergence is entirely inside the token layer. Failing it would send
an engineer to revert an accessibility fix. Add `color-orange-700` (`#9c601c`) as a
primitive and repoint the light-mode `color-text-accent` alias **in Figma**.

---

## The nine known gaps — confirmed or disputed

| # | Gap | Verdict |
|---|---|---|
| 1 | `ratio=3:2` renders 4:3 | **Confirmed.** `8:1184` is 363.5 × 272.625 = 4:3; the instance is 195 × 146.25 = 4:3. `8:1187` (`1:1`) is a true 363.5 × 363.5, so only the one name is wrong. Rename the variant value in Figma. |
| 2 | Values bound to core tokens | **Confirmed at the source.** `get_variable_defs` on `12:1343` returns `border/radius/8`, `border/radius/4`, `spacing/8`, `spacing/sm`, `spacing/4` as bare core paths while everything else comes back as `var(--horizon-semantic-*)`. Rendered: image radius 8px, button padding 8px, icon radius 4px. |
| 3 | Values with no token | **Confirmed.** Layout gap 10px (node: 140.5 − 130.5 = 10), favourite offset `top 7px / right 6.5px`, slot reserve 46px (node `8:1314` / `8:1315` are both 46). All three render exactly as the node has them. |
| 4 | Missing interaction states | **Confirmed.** The node publishes `enable` and `hover` only. Nothing renders for pressed, disabled or loading. The only focus treatment is the generic ring on the favourite button — 2px `--color-border-focused` at 1px offset, `#1547d5` light and `#3b82f6` dark. Undesigned, as the gap says. |
| 5 | Unfavourited heart has no design | **Confirmed, with a correction.** It is a placeholder using `--color-icon-subtle` and still needs a design decision. But the gap entry says the placeholder is *"a recoloured filled one"* and proposes an outlined heart as the likely remedy — the build **already renders it outlined**, `font-variation-settings: "FILL" 0`, as well as recoloured. The entry understates what shipped; the proposed remedy is half done. |
| 6 | The photo is an empty placeholder | **Confirmed.** With no `image` the component renders `.hds-card-image__photo--empty` on `--color-bg-surface-secondary`. Not a defect. |
| 7 | `--color-text-accent` contrast RESOLVED | **Confirmed held in the build — and confirmed still unfixed in Figma.** See F3. |
| 8 | Image tint has no strength token | **Confirmed.** Overlay opacity `0.2` on a `--color-bg-overlay` gradient = 0.55 × 0.2 = 0.11 effective, exactly the node's `rgba(27,39,51,0.11)`. The `0.2` is held as `--hds-card-image-overlay-strength` with no token behind it. |
| 9 | Metadata block reserves its own height | **Confirmed, and the stated consequence measured.** `review=false` → 296.25. `price=false` → 296.25. Both hold the 48px reserve rather than shrinking to 272.25 / 268.25. `metadata=false` correctly drops the reserve entirely → 240.25. Still needs a yes or no from the designer. |

---

## Two earlier findings re-checked, both still fixed

**The image overlay no longer follows an ancestor hover.** With transitions disabled and
a paint forced between each trusted pointer move and each `getComputedStyle` read:

| Pointer | `.hds-card` box-shadow | `.hds-card-image` `:hover` | Overlay opacity |
|---|---|---|---|
| off the card | `none` | false | 0 |
| over the image | `elevation-level2` | true | **0.2** |
| over the text | `elevation-level2` | false | **0** |
| off the card again | `none` | false | 0 |

Hovering the text raises the card and leaves the image untinted, which is the correct
separation. The regression has not returned.

**The favourite button really toggles.** Driven with real trusted clicks, not by
changing the arg:

```
aria-pressed  false → true → false        (light)
aria-pressed  true  → false               (dark)
glyph         FILL 0 ↔ FILL 1
colour        --color-icon-subtle ↔ --color-icon-negative
              light  #8a94a6 ↔ #a5261d
              dark   #b9c7d6 ↔ #e02b2b
focus         outline 2px solid --color-border-focused, offset 1px
```

---

## Three dark-mode token collisions worth a designer's eye

None is a build defect — the component references the right token in every case — but
all three are places where two roles resolve to the same value in dark and something
stops being visible.

| Roles | Dark value | What disappears |
|---|---|---|
| `--elevation-level2` shadow vs `--color-bg-surface-primary` | both `#1b2733` | the whole hover state — **F2** |
| `--color-border-default` vs `--color-bg-surface-secondary` | both `#3a4553` | the image frame, on a card with no photo |
| `--color-bg-secondary` vs `--color-bg-surface-primary` | both `#1b2733` | the favourite pill, if it is ever placed outside the image |

---

## Screenshots

Figma reference renders are in `reports/card/`:

- `figma-cardLayout-horizontal-8-1250.png` — the paired evidence for **F1**
- `figma-cardContainer-hover.png`
- `figma-cardImage-hover-3x2.png`

Live renders were captured in the browser during the run — light and dark
`state-enable`/`state-hover` at 2× zoom for F2, and the favourite button pressed and
unpressed. The harness could not persist them to disk, so they are not filed here. Every
claim in this report is backed by a computed value or a node measurement rather than by
an image, which is the stronger record in any case.

---

## Registry

34 rows written to `Staging Testing`, every one linked to `rec1y6kyai6F3FVWv` through
`Composed In`. Passes as well as failures.

| Cell | After this run |
|---|---|
| `Development` | **To be fixed** (formula — not written by hand) |
| `Total Staging Tests` | 34 |
| `Staging Passed Count` | 31 |
| `Synchronization %` | 91.18% |
| `Staging Testing Results Summary` | Passed, Failed |

**One registry anomaly to hand to the PM, not a Card issue.** `Staging Passed Tests`
(`fldlUuOcmKdDULk5q`) reads **0** while `Staging Passed Count` reads 31 and
`Synchronization %` correctly computes 91.18%. Its own field description says it
*"Counts only test rows marked Passed. Feeds Synchronization %."* Either it is lagging or
its rollup condition is wrong. Left untouched — QA does not repair the base.

### Vocabulary substitutions — recorded, nothing invented

`State` and `Size` are fixed option lists and **no option was created**.

| Needed | Logged as | Why |
|---|---|---|
| `state=enable` | `idle` | No `enable` option. Same substitution Button's run used. |
| `state=hover` | `hovered` | Exact match in the list. |
| favourite `aria-pressed=true` | `selected` | No `pressed` option. |
| no size property | `null` | The `null` option exists and is the honest value — the Card set publishes no `size`. |

`orientation`, `ratio`, `hasSlot`, `overlayAction`, `metadata`, `review` and `price` are
variant properties rather than states, so they are carried verbatim in `Variants`, which
is free text and loses nothing.

**Missing option to report:** the `State` list has no `enable` and no `pressed`. Both are
real values in this system — `enable` is published by two Figma sets and `pressed` is a
published Button variant — and both are currently being recorded under near-enough
names. Adding them is a schema change and belongs to whoever owns the base.

---

## Verdict

**Back to the engineer.** 31 of 34 cases pass, and the component's fidelity to
`12:1343` is otherwise exact to the hundredth of a pixel across every variant.

Two things must be decided before this ships:

1. **F1** — the horizontal split disagrees with the node by 1px each way. Most likely
   fixed in Figma by setting the `cardImage` stroke to inside; whatever is decided
   belongs in `docs/design-gaps.md`.
2. **F2** — `state=hover` is invisible in dark. Needs a dark `elevation/level2`, or an
   explicit decision that dark cards raise some other way.

And one thing is more urgent than either, though it is recorded as a pass:

3. **F3** — the `--color-text-accent` accessibility fix exists only in `tokens/` and not
   in the Figma variable collection. It has already been silently reverted once by a
   re-export. Until `color-orange-700` and the light-mode alias exist in Figma, every
   re-export reopens a WCAG AA failure across the whole system.

No verdict here is final until a human reads it, and no finding above is marked
resolved by me.

---

## Re-test — 2026-09-12

Re-run against the same deployed staging build (`ev1k2psuq`), which was first
confirmed current: the build serves `--color-text-accent: #9c601c` in light and
`#f0932b` in dark, so it already carries the contrast fix and is not a stale
artifact from before the repairs.

Gates on the staging branch at this commit: `npm run lint` clean, `npm test`
**58/58**.

### The six earlier findings — all still fixed

| Finding | Expected | Measured on staging | Result |
|---|---|---|---|
| 1 · card 48px short | `.hds-card` 227 × 296.25 | 227 × 296.25; chain 146.25 + 10 + 116 = 272.25 | Holds |
| 2 · overlay ~5× too dark | effective top alpha 0.11 | gradient stop `rgba(27,39,51,0.55)` × layer opacity `0.2` = **0.11** | Holds |
| 3 · favourite never toggles | `aria-pressed` flips, colour moves | `false` → `true` → `false`; `rgb(138,148,166)` → `rgb(165,38,29)` | Holds |
| 4 · card hover overrode `cardImage.state` | state pinned by prop, not ancestor | `data-state="hover"` set from the prop; rule is `.hds-card-image[data-state=…]`, not `.hds-card:hover` | Holds |
| 5 · `state=hover, ratio=1:1` had no story | story exists | `components-card--image-state-hover-ratio-1-x-1` served | Holds |
| contrast · `--color-text-accent` 2.36:1 | AA pass | `#9c601c` in light | Holds |

Finding 2 was initially mis-read this run as a regression: `backgroundColor`
returns `rgba(0,0,0,0)` because the tint is painted through `background-image`,
not `background-color`. Read from the gradient stop it resolves exactly as
designed. Recorded because the wrong probe, not the component, produced the
scare.

### The three failures — all three reproduce, none is a code defect

| Row | Case | Measured now | Why no fix was made |
|---|---|---|---|
| `recruJ0K6kqgODxAC` | horizontal split, light | `grid-template-columns: 129.5px 129.5px`; total 269, gap 10 both correct | Design gap 10 |
| `reccHjcAahTTrHUit` | horizontal split, dark | identical to light | Design gap 10 |
| `recRKWuTGZeXeI8Ce` | `cardContainer state=hover`, dark | `--elevation-level2` byte-identical in both modes: `0px 2px 4px 0px #1b27330f, 0px 4px 8px 0px #1b27331a`, and `--color-bg-surface-primary` in dark is `#1b2733` — the same colour | Design gap 11 |

Only the **split** differs on the first two; the row's total width (269) and gap
(10) match the node exactly. The node declares `layoutGrow: 1` / `FILL` on both
children — an instruction to share evenly — and only its *rendered* geometry is
uneven. The build follows the declared intent.

**Correction, same day, after reading the Figma file directly.** This report and
design gap 10 both attributed that to cardImage carrying a 1px stroke aligned
outside. That is false: all four cardImage variants and the instance 8:1213
already have `strokeAlign: "INSIDE"` at weight 1. The real cause is an
aspect-ratio lock — instance 8:1213 is `layoutSizingVertical: FIXED` at height
97.875 with `targetAspectRatio` 256:192 (4:3), so its width is derived as
97.875 x 4/3 = **130.5 exactly**, and the text column takes the remaining 128.5.
The fill share never gets to decide. The lock being 4:3 on a variant published
as `ratio=3:2` also makes this the same defect as gap 1.

Encoding the node's 130.5 / 128.5 would mean writing two raw px values into a
component file to reproduce a stroke artifact. `CLAUDE.md` lists raw px inside a
component as a failure to avoid, so that route is closed without a design
decision to open it.

On the third, the component applies `--elevation-level2` correctly and there is
no dark node to build against. `CLAUDE.md`: *a token that exists in one mode and
not another is a design gap; report it rather than filling it in.*

### Board

No row changed status. Nothing was repaired, so nothing earned
`Fixed (To re-test)` — 48 Passed · 3 Failed stands, and `Development` stays
`To be fixed`. Two designer decisions unblock it:

1. Set the cardImage stroke to **inside** in Figma (gap 10) — closes two rows,
   no code change.
2. Give `elevation/level2` a **dark-mode value** (gap 11) — closes the third.
