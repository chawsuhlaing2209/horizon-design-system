# QA · Card · local Storybook

- **Component:** `src/components/card/` (+ `cardContainer/`, `cardLayout/`, `cardImage/`, `cardText/`, `iconContainer/`)
- **Figma parent:** `12:1343` — file `r1CpQEYecqROS0oIOMlqAx`
- **Subcomponent sets:** `cardContainer 8:804`, `cardLayout 8:1251`, `cardImage 8:1186`, `cardText 8:778`
- **Built at:** `http://localhost:6006`, fresh tab
- **Expected matrix source:** `get_metadata` / `get_design_context` / `get_variable_defs` on the nodes above. Nothing in the matrix came from the story file.
- **Tested by:** QA agent. Nothing under `src/` was modified.

---

## 0 · Font check (done before any width was reported)

Canvas double-measure, declared family vs a deliberately bogus family, inside the story iframe:

| Face | Declared family | Bogus family | Verdict |
|---|---|---|---|
| Inter — `500 16px Inter`, string `Casa do Bairro` | 112.18px | 95.98px | **loaded** |
| Material Symbols Outlined — `24px`, ligature `favorite` | 24.00px | 74.63px | **loaded** (ligature collapsed to one 24px glyph) |

Both faces resolve from the Google Fonts CDN via `.storybook/fonts.css`. Every width below is trustworthy.

---

## 1 · Figma matrix reconciled against the stories

| Figma row | Node | Story | Reconciliation |
|---|---|---|---|
| cardContainer `state=enable` | 8:800 | `state = enable` | matched |
| cardContainer `state=hover` | 8:805 | `state = hover` | matched |
| cardLayout `orientation=vertical` | 8:1249 | `orientation = vertical` | matched |
| cardLayout `orientation=horizontal` | 8:1250 | `orientation = horizontal` | matched |
| cardLayout `hasSlot=true` | 8:1315 | `hasSlot = true` | matched |
| cardLayout `hasSlot=false` | — | default args | matched |
| cardImage `state=idle, ratio=3:2` | 8:1184 | `ratio = 3:2` / `imageState = idle` | matched |
| cardImage `state=idle, ratio=1:1` | 8:1187 | `ratio = 1:1` | matched |
| cardImage `state=hover, ratio=3:2` | 8:1185 | `imageState = hover` | matched |
| cardImage `state=hover, ratio=1:1` | 8:1196 | **none** | **missing case — finding 5** |
| cardImage `overlayAction` true / false | — | default / `overlayAction = false` | matched |
| cardText `metadata` true / false | 8:770 | default / `metadata = false` | matched |
| cardText `review` true / false | 8:771 | default / `review = false` | matched |
| cardText `price` true / false | 8:774 | default / `price = false` | matched |
| Parent instance | 12:1343 | `Figma node 12:1343` | matched |

**Stories with no Figma row** (reported, not dropped):

| Story | Judgement |
|---|---|
| `Favourite toggle (interactive)` | Legitimate — exercises behaviour. `favorited=false` has no design (design-gaps §5). Not dead. |
| `Long content` | Legitimate robustness story, no Figma equivalent expected. Not dead. |

---

## 2 · The matrix — one row per case

Every number came from `getBoundingClientRect` / `getComputedStyle` in the running story.

### cardContainer · 8:804

| # | Case | Expected (Figma) | Measured | Result |
|---|---|---|---|---|
| 1 | `state=enable` — box | 227 × 296.25 | 227 × 296.25 | Pass |
| 2 | `state=enable` — padding | `spacing/padding/sm` 12 / `md` 16 | `12px 16px` | Pass |
| 3 | `state=enable` — radius | `border/radius/control` 12px | `12px` | Pass |
| 4 | `state=enable` — surface | `color/bg/surfacePrimary` #ffffff | `rgb(255,255,255)` | Pass |
| 5 | `state=enable` — shadow | none | `none` | Pass |
| 6 | `state=hover` — box | 227 × 296.25 | 227 × 296.25 | Pass |
| 7 | `state=hover` — elevation | elevation/level2 | `--elevation-level2` exactly | Pass |
| 8 | `state=hover` driven by a real pointer | shadow on pointer-over | `:hover` true, shadow present | Pass |
| 9 | `overflow` | `overflow-clip` | `hidden` | Pass |

### cardLayout · 8:1251

| # | Case | Expected (Figma) | Measured | Result |
|---|---|---|---|---|
| 10 | `orientation=vertical` — layout box | 195 × 272.25 | 195 × 272.25 | Pass |
| 11 | `orientation=vertical` — stacking + gap | column, 10px | `flex` / `column` / `gap 10px` | Pass (10px logged, §3) |
| 12 | `orientation=horizontal` — layout box | 269 × 172 | 269 × 172 | Pass |
| 13 | `orientation=horizontal` — card box | 301 × 196 | 301 × 196 | Pass |
| 14 | `orientation=horizontal` — column split | image 130.5 / text 128.5 | grid `129.5px 129.5px` | Pass with note — Note A |
| 15 | `orientation=horizontal` — slot in text column | Slot 8:1315 nested | `__slot` inside `__body` | Pass |
| 16 | `hasSlot=true` — reserve | 46px, 10px above | `min-height 46px`, gap 10px | Pass (46px logged) |
| 17 | `hasSlot=true` — vertical total | 146.25 + 10 + 116 + 10 + 46 | layout 328.25, card 352.25 | Pass |
| 18 | `hasSlot=false` | slot absent | not rendered | Pass |

### cardImage · 8:1186

| # | Case | Expected (Figma) | Measured | Result |
|---|---|---|---|---|
| 19 | `ratio=3:2` — geometry | aspect 256/192 = 4:3; 195 × 146.25 | `aspect-ratio 4/3`, 195 × 146.25 | Pass (misnamed in Figma, §1) |
| 20 | `ratio=1:1` — geometry | 1:1 | 195 × 195, card 227 × 345 | Pass |
| 21 | border | 1px, `color/border/default` #eaeff4 | `1px` / `rgb(234,239,244)` | Pass |
| 22 | radius | `border/radius/8` = 8px | `8px` | Pass (core binding logged, §2) |
| 23 | `state=idle` — overlay hidden | overlay off | `opacity 0` | Pass |
| 24 | `state=hover` — overlay shown | overlay on | `opacity 1` | Pass |
| 25 | `state=hover` — overlay colour | resolves to `rgba(27,39,51,0.11)` | `rgba(27,39,51,0.55)` | **Fail — finding 2** |
| 26 | overlay geometry | `inset -1px`, radius 8, z 2 | matches | Pass |
| 27 | `state` prop honoured under real hover | container and image state independent | pointer on text → overlay 1 while `data-state="idle"` | **Fail — finding 4** |
| 28 | `state=hover, ratio=1:1` (8:1196) | 1:1 with overlay on | no story | **Fail — finding 5** |
| 29 | favourite button — box | 40 × 40 | 40 × 40 (`--size-control-md`) | Pass |
| 30 | favourite button — position | `top 7px`, `right 6.5px`, z 3 | matches | Pass (raw offsets logged, §3) |
| 31 | favourite button — fill, radius | #ffffff, `border/radius/full` | `rgb(255,255,255)`, `999px` | Pass |
| 32 | favourite button — padding / gap | 8px / 4px | `padding 8px`, `gap 4px` | Pass (core bindings logged, §2) |
| 33 | heart glyph | Material Symbols `favorite`, FILL 1, 24px | `24px`, `"FILL" 1`, 24 × 24 | Pass |
| 34 | heart colour, favourited | `color/icon/negative` #a5261d | `rgb(165,38,29)` | Pass |
| 35 | heart colour, unfavourited | no design | `--color-icon-subtle` | Gap, not a defect (§5) |
| 36 | `overlayAction=false` | no button | absent, card still 227 × 296.25 | Pass |
| 37 | empty photo fallback | transparent placeholder | `--color-bg-surface-secondary` | Pass (§6) |

### cardText · 8:778

| # | Case | Expected (Figma) | Measured | Result |
|---|---|---|---|---|
| 38 | block gap | `spacing/gap/xs` 8px | `8px` | Pass |
| 39 | heading / meta inner gap | `spacing/gap/2xs` 4px | `4px` | Pass |
| 40 | row gap | 4px | `4px` | Pass |
| 41 | Title 8:768 | title/md, tracking 0.15, text/primary | `500 16px/24px Inter`, `0.15px`, `rgb(27,39,51)` | Pass |
| 42 | Location Info 8:769 | body/sm, tracking 0.4, text/secondary | `400 12px/16px Inter`, `0.4px`, `rgb(90,107,126)` | Pass |
| 43 | Rating Score 8:772 | label/lg/bold, tracking 0.1, text/accent | matches | Pass (contrast gap §7) |
| 44 | Review Count 8:773 | body/sm, text/secondary | matches | Pass |
| 45 | Price Amount 8:775 | body/lg/bold, tracking 0.5, text/primary | matches | Pass |
| 46 | Price Info 8:776 | body/sm, text/secondary | matches | Pass |
| 47 | `metadata=false` | 8:770 not rendered | absent, card 240.25 | Pass |
| 48 | `review=false` | 8:771 absent, price remains | meta 24 tall, card 272.25 | Pass |
| 49 | `price=false` | 8:774 absent, review remains | meta 20 tall, card 268.25 | Pass |
| 50 | `metadata` nowrap | `whitespace-nowrap` | `nowrap`, no overflow at 129.5px | Pass |
| 51 | long strings | word-break, no overflow | scrollWidth − clientWidth = 0 | Pass |

### Parent instance · 12:1343

| # | Case | Expected (Figma) | Measured | Result |
|---|---|---|---|---|
| 52 | story box | 227 × 296.25 | 227 × **248.25** | **Fail — finding 1** |
| 53 | vertical geometry chain | 146.25 + 10 + 116 = 272.25 | 146.25 + 10 + **68** = 224.25 | **Fail — finding 1** |

### Behaviour and states (driven, not rendered)

| # | Case | Expected | Measured | Result |
|---|---|---|---|---|
| 54 | Favourite — click fires handler | handler runs | 1 click event | Pass |
| 55 | Favourite — pressed state updates | `aria-pressed` flips, colour changes | stays `"false"`, colour unchanged | **Fail — finding 3** |
| 56 | Focus — real `Tab` press | `:focus-visible` ring | `2px solid rgb(29,78,216)`, offset `1px` | Pass |
| 57 | Focus — not on mouse click | no ring on pointer activation | focused, `outline-style: none` | Pass |
| 58 | Hover — pinned vs real pointer, container | agree | both give elevation/level2 | Pass |
| 59 | Hover — pinned vs real pointer, image | agree | disagree | **Fail — finding 4** |
| 60–62 | Disabled / Loading / Pressed | — | no design, not built | Gap, not a defect (§4) |

### Theme

| # | Case | Expected | Measured | Result |
|---|---|---|---|---|
| 63 | Light | light token set | card #ffffff, title #1b2733, border #eaeff4, heart #a5261d | Pass |
| 64 | Dark | dark token set, nothing hard-coded leaks | card `rgb(27,39,51)`, title `rgb(255,255,255)`, location `rgb(215,222,231)`, border `rgb(58,69,83)`, heart `rgb(224,43,43)`; layout identical | Pass — Note B |

### Tokens

| # | Case | Expected | Measured | Result |
|---|---|---|---|---|
| 65 | No raw hex | none | none | Pass |
| 66 | No raw font family / size / weight | none | only `var(--size-icon-lg)`; `system-ui, sans-serif` is a fallback stack, not a design value | Pass |
| 67 | Raw px | only the three logged gaps | 10px gap, 7px/6.5px offset, 46px slot — each commented | Pass (§3) |
| 68 | `--color-bg-overlay` token value | Figma `#1b27338c` (0.55) | `rgba(27,39,51,0.55)` in both modes | Pass — token is right; finding 2 is about application |

---

## 3 · Findings

### Finding 1 — the card is 48px shorter than the node it is named after

```
Card · Figma node 12:1343 · vertical, review=false, price=false
Expected  card 227 × 296.25; cardText 116 tall, with the metadata container
          (8:770) holding its 48px height while both rows are hidden
Saw       card 227 × 248.25; cardText 68 tall, metadata container 0 tall
Where     src/components/cardText/cardText.tsx line 44 — `{metadata && (...)}`
          renders the container, but nothing gives it a height when both
          `review` and `price` are false
          src/components/cardText/cardText.css `.hds-card-text__meta` has no
          min-height
```

In the node, `I8:1257;8:1233;8:770` is emitted as `h-[48px]` and empty. Every other size on this story matches the node to the pixel, so the whole 48px error sits in this one box. The same code renders 227 × 296.25 correctly when `review` and `price` are on (case 6), so the parent geometry is right; only the both-off case drifts.

**Blocked on design.** The standalone `cardText` node (8:778) does *not* fix that container's height — it is auto in the component and 48px only in this instance. That could be an intentional reserve or a fixed-height override left on the instance. Needs a one-line answer: does the metadata block reserve 48px when empty, or should the card shrink? Do not guess.

### Finding 2 — the hover overlay is roughly five times too dark

```
Card · cardImage · state=hover · both ratios · both themes
Expected  overlay top stop resolves to rgba(27, 39, 51, 0.11) — the node's own
          value for Overlay 8:1182, in both 8:1185 and the parent
Saw       linear-gradient(rgba(27, 39, 51, 0.55) 0%, rgba(0, 0, 0, 0) 100%)
Where     src/components/cardImage/cardImage.css line 59
Token     --color-bg-overlay
```

The token is correct and was not misread: `get_variable_defs` returns `color/bg/overlay = #1b27338c` (α 0.55), and all three generated CSS files carry 0.55 — in **both** modes, so this is not the mode caveat.

What the code missed is that the node applies that variable through a stop whose own opacity is ~20% (0.55 × 0.2 = 0.11). Figma's codegen for both 8:1185 and 12:1343 resolves to `rgba(27,39,51,0.11)`, and the reference render is a barely-there wash, not a heavy slate scrim.

`--color-bg-overlay` is documented as *"Scrim behind modals and drawers"*; a card image tint is a different job. **Blocked on design** — either a multiplier on this one use or a new token carrying the image-tint alpha.

Aside, no action: the design's end stop is `rgba(27,39,51,0)` and the code writes `transparent`. Browsers interpolate with premultiplied alpha, so they render identically.

### Finding 3 — the favourite button never toggles, and its story says it does

```
Card · Favourite toggle (interactive) · favorited=false
Expected  activating the button flips its pressed state — the story is named
          "(interactive)" and its doc comment reads "click or keyboard toggles it"
Saw       click handler fires once; aria-pressed stays "false"; colour stays
          rgb(138,148,166). Repeated activation changes nothing perceivable
Where     src/components/cardImage/cardImage.tsx lines 58-60 — `favorited` is a
          controlled prop with no internal state, and
          src/components/card/card.stories.tsx `FavouriteToggle` supplies no
          state to control it (`onFavoriteToggle: () => {}`)
Prop      favorited / onFavoriteToggle
```

CLAUDE.md: *"A component's props are its documented API. Undocumented behaviour is a bug."* The docs page promises a working toggle and demonstrates one that cannot toggle. A screen-reader user is told `aria-pressed="false"` forever after saving.

### Finding 4 — hovering the card overrides `cardImage.state`

```
Card · imageState = idle · real pointer over the card's TEXT area
Expected  cardContainer.state and cardImage.state are independent — node
          12:1343 is itself a card at rest whose image is hovered, and
          docs/naming-conflicts.md records them as "independently settable"
Saw       pointer over the text (image not hovered): overlay opacity 1 anyway,
          while the element still carries data-state="idle"
Where     src/components/cardImage/cardImage.css line 66
          `.hds-card:hover .hds-card-image__overlay { opacity: 1 }`
Prop      image.state
```

The ancestor rule wins over the prop, so `state='idle'` cannot be held while a pointer is anywhere on the card. The container's own hover rule is correct and should stay — this is only about the image overlay reaching across the subcomponent boundary.

The design gives no combined "card hovered" render: variant 8:805 is an empty surface with no cardImage in it. The one node showing both states shows them set independently, so the prop should win until a designed row says otherwise.

### Finding 5 — one Figma variant has no story

```
Card · cardImage · state=hover, ratio=1:1
Expected  a story, per CLAUDE.md "Every variant and every state has a story"
Saw       no story covers this combination. `ratio = 1:1` pins imageState to
          idle; `imageState = hover` pins ratio to 3:2
Where     src/components/card/card.stories.tsx — 8:1184, 8:1187 and 8:1185 are
          covered; node 8:1196 is uncovered
```

`cardImage` publishes a 2 × 2 variant matrix, not two independent axes. The gap matters more than usual because the overlay is absolutely positioned with `inset: -1px` and a fixed 8px radius against a square rather than a 4:3 box — exactly the combination nothing currently renders.

---

## 4 · Notes recorded but deliberately not spent as findings

**Note A — horizontal column split, 1px.** Figma gives image 130.5 and text 128.5; the component gives both 129.5 via `grid-template-columns: 1fr 1fr`. Outer numbers match the node exactly (269 × 172); the 2px asymmetry in Figma is the image's 1px stroke landing on a flex basis. Per the skill's rule on borders that do not change the box, this is a faithful translation.

**Note B — dark theme has no Figma reference.** Every token resolves to its dark value and layout is identical. For design, not the engineer: `--color-bg-secondary` resolves to `rgb(27,39,51)` in dark — the same colour as the card surface — so the favourite pill has almost no separation from a dark photo. No dark render exists to compare against.

**Known gaps re-confirmed as still reproducing** (already in `docs/design-gaps.md`, not re-litigated): `ratio=3:2` renders 4:3; the 10px gap, 7px/6.5px offset and 46px slot are still raw; icon-button and image radius still bound to core tokens; pressed/focus/disabled/loading have no design; the unfavourited heart is still the placeholder; the rating score still uses `--color-text-accent`.

---

## 5 · Screenshots

| File | What it is |
|---|---|
| `reports/card/figma-cardImage-hover-3x2.png` | Figma render of `cardImage state=hover, ratio=3:2` (8:1185) — evidence for finding 2 |
| `reports/card/figma-cardContainer-hover.png` | Figma render of `cardContainer state=hover` (8:805) — evidence for finding 4 |

**Per-state renders of the built component were not saved.** The repo has no headless capture (no Playwright or Puppeteer), and the browser tool returns images into the session rather than to a file. States were captured and inspected live but could not be written beside this report. Every visual claim above is backed by a measured computed value, not by an image.

---

## 6 · Engineer's resolution (appended after the QA run above)

QA's findings are left untouched above; this section records what was done about
findings 3, 4 and 5. Findings 1 and 2 are unchanged and still blocked on design.

| Finding | Status | Change |
|---|---|---|
| 1 — card 48px shorter than node 12:1343 | **Fixed** | metadata block reserves the space its two rows occupy, composed from their tokens. Assumption recorded in design-gaps §9. |
| 2 — hover overlay ~5× too dark | **Fixed** | the stop's 20% opacity is carried on the layer, so the token resolves to 0.11 as the node does. New gap logged in design-gaps §8. |
| 3 — favourite button never toggles | **Fixed** | `cardImage` now supports the standard controlled/uncontrolled pairing; the story holds real state. |
| 4 — card hover overrides `cardImage.state` | **Fixed** | overlay rule rescoped to the image; a pinned `state` now beats the pointer. |
| 5 — node 8:1196 had no story | **Fixed** | `imageState = hover, ratio = 1:1` added. |

### Finding 3 — fix

`src/components/cardImage/cardImage.tsx` — `favorited` was controlled-only with
no internal state, so a consumer (or story) that supplied no state left the
button reporting `aria-pressed="false"` for ever. It now follows the standard
React pairing: controlled when `favorited` is supplied, otherwise self-managing
from `defaultFavorited`. The glyph's `FILL` axis follows the pressed state too,
so the change is visible and not colour-only.

`src/components/card/card.stories.tsx` — Storybook args are not state. The render
is now a small component holding the pressed state and re-syncing when the
control changes, so the control still drives it *and* clicking toggles.

Verified with a real pointer click in a fronted tab: `aria-pressed` false → true,
colour `rgb(138,148,166)` → `rgb(165,38,29)` (`--color-icon-negative`), glyph
`FILL 0` → `FILL 1`, and back again on a second click.

**Not verified: keyboard activation.** The automation tool delivers `keydown` and
`keyup` to the focused button but with an empty `e.key`, so the browser never
treats them as Enter/Space activation and synthesises no click. The control is a
native `<button type="button">` whose handler is on `onClick`, which platform
keyboard activation triggers, and focus-visible is confirmed working
(`2px solid rgb(29,78,216)`, `--color-border-focused`). But this run could not
drive it, and it is recorded as unverified rather than passed.

### Finding 4 — fix

`src/components/cardImage/cardImage.css` — the rule was `.hds-card:hover
.hds-card-image__overlay`, an ancestor selector that tinted the image whenever
the pointer was anywhere on the card, and beat the prop.

`state` now has no default. The component renders `data-state="auto"` when it is
omitted, and the CSS reads:

```css
.hds-card-image[data-state='hover'] .hds-card-image__overlay,
.hds-card-image[data-state='auto']:hover .hds-card-image__overlay { opacity: 1; }
```

So a pinned `idle` or `hover` always wins over the pointer — QA's requirement —
while an unpinned image still responds to a real hover over *itself*.
`cardContainer` keeps its own hover rule, which was correct.

`auto` is not a Figma value; it is the internal name for "no variant pinned",
which in the API is simply omitting `state`. The story control offers all three.

Verified with a real pointer in a fronted tab:

| Scenario | Card hovered | Image hovered | `data-state` | Overlay |
|---|---|---|---|---|
| pointer on the card TEXT | true (elevation/level2 correctly applied) | false | `idle` | **0** — was 1 before the fix |
| pointer on the IMAGE, pinned `idle` | true | true | `idle` | **0** — prop wins |
| pointer on the IMAGE, unpinned | true | true | `auto` | **1** |

### Finding 5 — fix

`imageState = hover, ratio = 1:1` added, covering node 8:1196. Measured: image
195 × 195, aspect 1.0, `data-state="hover"`, overlay opacity 1, radius 8px, and
the overlay covering the full 195 × 195 border box — i.e. the `inset: -1px` bleed
resolves correctly against a square, which is the case that previously rendered
nowhere.

### Regression tests

`src/components/card/card.test.tsx` grew from 18 to 25 cases. The suite
previously asserted only that `onFavoriteToggle` fired, which passed against a
button whose pressed state never changed — that is why finding 3 escaped. Added:

- uncontrolled toggling actually flips `aria-pressed` both ways
- a controlled value is honoured and the DOM does **not** self-update
- the glyph `FILL` axis follows the pressed state
- `data-state` is `auto` when unpinned and pinned when supplied
- container and image `state` stay independent

### Gates after the fixes

`npm run lint` clean · `npm test` 25/25 · 17 card stories · console clean in a
fresh tab.

### Measurement caveat worth recording

Opacity and box-shadow transitions do not advance in a throttled **background**
browser tab, so `getComputedStyle` returns the start value and a correct hover
state reads as a failure. Two readings in this session were wrong for that reason
before being re-taken in a fronted tab. Measure transitioned properties in a
fronted tab, or neutralise the transition first.

---

## 7 · Findings 1 and 2 — fixes (appended after the above)

Both were held open as design decisions. The decision was taken to build to the
node; what was assumed is written down rather than buried.

### Finding 1 — fix

`src/components/cardText/cardText.css` — `.hds-card-text__meta` now carries:

```css
min-height: calc(
  var(--lineheight-label-lg) + var(--spacing-gap-2xs) + var(--lineheight-body-lg)
);
```

48px is not a magic number: it is exactly the space the two rows occupy — review
row 20, gap 4, price row 24. Composing it from those tokens keeps the reserve
correct if the type scale moves, and keeps the rule out of the raw-values list.

| Story | Before | After | Node |
|---|---|---|---|
| `Figma node 12:1343` (review + price off) | 227 × 248.25 | **227 × 296.25** | 227 × 296.25 |
| `state = enable` (all rows) | 227 × 296.25 | 227 × 296.25 | 227 × 296.25 |
| `review = false` | 227 × 272.25 | **227 × 296.25** | no node reference |
| `price = false` | 227 × 268.25 | **227 × 296.25** | no node reference |
| `metadata = false` | 227 × 240.25 | 227 × 240.25 | no reserve — block is gone |

**This changes two cases QA passed** (48 and 49): single-row cards are now the
full height. That is the deliberate consequence — every card with metadata is
the same height, so cards align in a grid. If that is not wanted, drop the
`min-height` and they shrink to content. Logged as design-gaps §9.

### Finding 2 — fix

`src/components/cardImage/cardImage.css` — the token is applied unchanged and
the stop's own 20% opacity is carried on the layer:

```css
--hds-card-image-overlay-strength: 0.2;   /* the stop opacity from node 8:1182 */
/* ...on the shown state: */
opacity: var(--hds-card-image-overlay-strength);
```

Measured in a fronted tab, `imageState = hover`:

| | Value |
|---|---|
| gradient top stop | `rgba(27, 39, 51, 0.55)` — `--color-bg-overlay`, unchanged |
| layer opacity | `0.2` |
| effective top alpha | **0.11** |
| node resolves to | **0.11** |

`--color-bg-overlay` was not edited and not repurposed. The remaining unbound
value is the `0.2` itself, now in one named place and logged as design-gaps §8.

### Gates after these fixes

`npm run lint` clean · `npm test` **27/27** · 17 card stories · console clean in a
fresh tab.

Two tests added for finding 1's precondition — jsdom does no layout, so the
`min-height` itself cannot be asserted there; what is asserted is that the
container survives in the tree with both rows hidden, and disappears entirely
when `metadata` is false.
