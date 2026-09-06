# 🔍 QA — Button

| | |
|---|---|
| Build under test | Deployed staging Storybook, read from the registry's `Staging Storybook` cell (`fldOuJpSivewZrGyt`, record `recxAh3Dd401nLLVr`) |
| URL | `https://horizon-design-system-2yyki2x6m-chawsuhlaing2209s-projects.vercel.app` |
| Registry `Development` | `Ready for Testing` |
| Design reference | Figma `26:70`, file `r1CpQEYecqROS0oIOMlqAx` — read live over the Figma MCP |
| Surface | Claude in Chrome (real Chrome, real Vercel SSO session, real CDN fonts) |
| Deployed CSS vs repo source | Identical — the 13 `.hds-button` rules in the served bundle match `src/components/button/button.css` rule for rule and in order |

The expected matrix below was built from `get_metadata` and `get_design_context` on
the eight Figma symbols. It was **not** derived from `button.stories.tsx`.

---

## Font check — done before any width was reported

`document.fonts.check()` is not trusted. The label string was measured on a canvas in
three families:

| Family used to measure "Sign in" | Width |
|---|---|
| The declared family (`Inter`, 500, 14px) | 45.05px |
| `Inter, sans-serif` | 45.05px |
| Generic `sans-serif` | 42.81px |
| A deliberately bogus family | 59.00px |

Three distinct numbers, and `Inter 500` reports `loaded` in `document.fonts`. **Inter is
genuinely rendering**, so the widths below are measurements of the component, not of a
missing font.

---

## The expected matrix, from Figma

| # | Node | variant / state | Size | Background | Border | Text |
|---|---|---|---|---|---|---|
| 1 | 26:71 | filled / enable | 94×44 | `color-bg-primary` | none | `color-text-inverse` |
| 2 | 26:73 | filled / hover | 94×44 | `color-bg-primary-hovered` | none | `color-text-inverse` |
| 3 | 26:82 | filled / pressed | 94×44 | `color-bg-primary-pressed` | none | `color-text-inverse` |
| 4 | 26:87 | filled / disabled | 94×44 | `color-bg-primary-disabled` | none | `color-text-disabled` |
| 5 | 26:98 | outlined / enable | 94×46 | none | 1px, style `color/border/primary` | `color-text-link` |
| 6 | 26:100 | outlined / hover | 94×46 | none | 1px, style `color/border/primary/hover` | `color-text-link` |
| 7 | 26:102 | outlined / pressed | 94×46 | none | 1px, style `color/border/primary/focused` | `color-text-link` |
| 8 | 26:104 | outlined / disabled | 94×46 | none | 1px, var `color-border-disabled` | `color-text-disabled` |

Shared by all eight: radius `border-radius-control` (12), padding `spacing-padding-sm`
(12) × `spacing-padding-lg` (24), gap `spacing-gap-xs` (8), type `label/lg`
(Inter Medium 14/20, tracking 0.1).

### Reconciliation against the stories

Eight Figma rows, eight pinned stories, each named for its node. **No missing case and
no orphan story.** `Matrix` and `Playground` are review aggregates of the same eight
rows, not undocumented variants.

---

## Results — light theme

Every number is a computed style or a `getBoundingClientRect` read from the deployed
build. Nothing here was eyeballed.

| # | variant / state | Size | Background | Border | Text | Radius | Padding | Gap | Type | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | filled / enable | 93.76×44 | `rgb(21,71,213)` ✓ `color-bg-primary` | 0 ✓ | white ✓ `color-text-inverse` | 12 ✓ | 12/24 ✓ | 8 ✓ | Inter 500 14/20, 0.1px ✓ | **Pass** |
| 2 | filled / hover | 93.76×44 | `rgb(24,64,177)` ✓ `color-bg-primary-hovered` | 0 ✓ | white ✓ | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |
| 3 | filled / pressed | 93.76×44 | `rgb(19,51,143)` ✓ `color-bg-primary-pressed` | 0 ✓ | white ✓ | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |
| 4 | filled / disabled | 93.76×44 | `rgb(215,222,231)` ✓ `color-bg-primary-disabled` | 0 ✓ | `rgb(185,199,214)` ✓ `color-text-disabled` | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |
| 5 | outlined / enable | 95.76×46 | transparent ✓ | 1px solid `rgb(21,71,213)` ✓ `color-border-primary` | `rgb(21,71,213)` ✓ `color-text-link` | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |
| 6 | outlined / hover | 95.76×46 | transparent ✓ | 1px solid `rgb(24,64,177)` ✓ `color-border-primary-hover` | unchanged ✓ | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |
| 7 | outlined / pressed | 95.76×46 | transparent ✓ | 1px solid `rgb(19,51,143)` ✓ `color-border-primary-focused` | unchanged ✓ | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |
| 8 | outlined / disabled | 95.76×46 | transparent ✓ | 1px solid `rgb(234,239,244)` ✓ `color-border-disabled` | `rgb(185,199,214)` ✓ `color-text-disabled` | 12 ✓ | 12/24 ✓ | 8 ✓ | ✓ | **Pass** |

Also swept across all eight: `box-shadow: none`, `opacity: 1`, all four corner radii
12px. The Figma nodes carry no effects. **Pass.**

## Results — dark theme (`globals=theme:dark`)

Each rendered value was checked against `tokens/semantic-color.dark.tokens.json`
resolved through `core.value.tokens.json`, rather than against a single
`get_variable_defs` read.

| # | variant / state | Rendered | Resolves to | Result |
|---|---|---|---|---|
| 9 | filled / enable | bg `rgb(59,130,246)`, text `rgb(18,24,31)` | `blue-400` / `neutral-950` | **Pass** |
| 10 | filled / hover | bg `rgb(95,163,219)` | `blue-300` | **Pass** |
| 11 | filled / pressed | bg `rgb(46,124,196)` | `blue-500` | **Pass** |
| 12 | filled / disabled | bg `rgb(58,69,83)`, text `rgb(90,107,126)` | `neutral-800` / `neutral-700` | **Pass** |
| 13 | outlined / enable | border + text `rgb(59,130,246)` | `blue-400` | **Pass** |
| 14 | outlined / hover | border `rgb(95,163,219)` | `blue-300` | **Pass** |
| 15 | outlined / pressed | border `rgb(127,168,238)` | `blue-200` | **Pass** |
| 16 | outlined / disabled | border `rgb(58,69,83)`, text `rgb(90,107,126)` | `neutral-800` / `neutral-700` | **Pass** |

Geometry is identical in dark (93.76×44 / 95.76×46). No value is hardcoded to a light
mode colour.

## Results — behaviour, driven not just rendered

| # | Case | How it was driven | Observed | Result |
|---|---|---|---|---|
| 17 | Real `:hover`, filled | Trusted pointer move onto the element, then a forced repaint | `:hover` matches; background becomes `rgb(24,64,177)` — agrees with the pinned story and 26:73 | **Pass** |
| 18 | Real `:hover`, outlined | Same | Border becomes `rgb(24,64,177)`; text and background unchanged — agrees with 26:100 | **Pass** |
| 19 | Real `:active`, filled | Genuine mousedown from a trusted pointer | `:active` matches during the press; the `:active` declaration is grouped with `[data-state='pressed']`, which renders `rgb(19,51,143)` | **Pass** (see caveat below) |
| 20 | Keyboard focus | Real `Tab` keypress | Lands on the button; `:focus-visible` true; `outline: 2px solid rgb(21,71,213)`, offset 1px, from `border-width-focused` / `color-border-focused` / `border-width-default` | **Pass** |
| 21 | **Enter activates** | Real `Enter` keypress on the focused button | `click` fired once, `event.detail === 0` — a genuine keyboard activation, not a synthesised mouse click | **Pass** |
| 22 | **Space activates** | Real `Space` keypress | `click` fired once, `event.detail === 0` | **Pass** |
| 23 | Disabled does not fire onClick — filled | Two trusted mouse clicks on the element | Zero `click` events on the button *and* zero at `document` — the event does not escape | **Pass** |
| 24 | Disabled does not fire onClick — outlined | Trusted mouse click | Zero `click` events | **Pass** |
| 25 | Disabled is out of the tab order | Real `Tab` presses | Focus never lands on it; a subsequent `Enter` fires nothing | **Pass** |
| 26 | Disabled is genuinely inert | — | `button.disabled === true`, `cursor: default` | **Pass** |
| 27 | Semantics | — | Renders a real `<button type="button">` with accessible name "Sign in" | **Pass** |

Cases 21 and 22 were the two previously recorded as unverifiable. **They are now
verified in real Chrome and both pass.**

**Caveat on case 19.** `:active` was confirmed to engage under a genuine mousedown, but
the harness cannot hold the pointer down across a repaint, so the settled pressed colour
under a held pointer could not be sampled directly — the 120ms `background-color`
transition means the value read at mousedown is still mid-flight. The pressed colour
itself is verified three other ways: the pinned `pressed` stories (rows 3 and 7), a
freshly injected element carrying `[data-state='pressed']`, and the rule grouping in the
served CSS. I am recording what was and was not driven rather than claiming more.

---

## Findings

**None.** No case in the matrix failed.

One methodological warning for whoever tests this next, so the next run does not file a
false positive:

> A trusted pointer move sets `:hover` such that `Element.matches(':hover')` returns
> `true`, but the style is not recomputed until something forces a paint. Reading
> `getComputedStyle` alone — even 800ms later — returns the pre-hover value and makes a
> perfectly correct hover state look broken. Take a screenshot between the move and the
> read. I hit this on both variants before catching it.

---

## The known items in `docs/design-gaps.md` — confirm or dispute

**1. No `state=focused` node; the ring colour is indistinguishable from the border. Confirmed, and worse than recorded.**
`get_metadata` on 26:70 returns eight symbols and no focused variant. In the served
build `--color-border-focused` and `--color-border-primary` both resolve to
`rgb(21,71,213)`, and `outlineColor === borderTopColor` is `true`. The token file shows
why: `color-border-focused` aliases `{color-bg-primary}` and `color-border-primary`
aliases `{color-blue-600}` — the same primitive. **This also holds in dark**, where both
land on `blue-400`, so the collision is not light-mode-only. On the outlined variant the
result is a 1px border and a 2px ring of the identical hue separated by a 1px gap,
reading as one thick double outline (see the focus screenshot). Still a design gap, not
an engineering defect — the engineer used the two tokens the system names for the job
and flagged it. It needs a designed focus state.

**2. Outlined pressed binds to a style named `color/border/primary/focused`. Confirmed.**
`get_design_context` on 26:102 returns `border-[var(--color\/border\/primary\/focused,#13338f)]`.
The token carrying the *pressed* stroke is named `focused`. The build mirrors it verbatim
with a comment at `button.css:75-78`. Correct call — renaming it in code would break the
match to the design.

**3. Three of the four outlined strokes are styles, not variables. Confirmed exactly.**

| Node | Binding | Kind |
|---|---|---|
| 26:98 enable | `--color\/border\/primary` | style |
| 26:100 hover | `--color\/border\/primary\/hover` | style |
| 26:102 pressed | `--color\/border\/primary\/focused` | style |
| 26:104 disabled | `--horizon-semantic-color-border-disabled` | **variable** |

26:104 is already a variable, as recorded. The other three should be rebound.

**4. No size property, no loading state, no icon property. Confirmed.**
The set publishes exactly two properties, `variant` and `state`. There is no size axis to
test, so no size row is missing from the matrix — the matrix is 8 cases because the design
is 8 cases. The `gap-xs` token is present and correct in all eight rendered states but is
currently inert, since no node ships an icon for it to separate.

**5. Outlined hover moves only the 1px stroke colour. Confirmed by measurement.**
Under a real pointer hover, the border goes `rgb(21,71,213)` → `rgb(24,64,177)` while
text stays `rgb(21,71,213)` and the background stays transparent. That matches 26:100
exactly. Worth flagging to design as a usability point rather than a defect: a 1px
stroke shifting by one step of blue is a very quiet hover affordance, and it is the only
feedback the outlined button gives.

**6. Filled 44px, outlined 46px, and the "2px too wide" reconsideration. I agree — outlined is not too wide. My own reading of the evidence follows.**

I re-derived this from the node rather than accepting the note, and I reach the same
conclusion by a slightly narrower path.

What the node actually says:

| | Frame | Label x | Label w | Label y | Label h |
|---|---|---|---|---|---|
| 26:71 filled | 94×44 | 24 | 46 | 12 | 20 |
| 26:98 outlined | 94×46 | 24 | 46 | 13 | 20 |

- Filled: `24 + 46 + 24 = 94` and `12 + 20 + 12 = 44`. Filled's 94 **is** its hug width,
  to the pixel. Nothing is overridden.
- Outlined vertical: the label starts at y=13, not 12. Padding is `spacing-padding-lg`'s
  sibling `spacing-padding-sm` = 12, so the extra 1 is the stroke. `1 + 12 + 20 + 12 + 1
  = 46`. **The stroke is counted inside the layout box.** This is the evidence, and I
  agree it is the only evidence.
- **One correction to the note:** the label's *horizontal* position is not additional
  evidence either way. `x=24` in a 94-wide frame with a 46-wide label is simply centring
  — `(94−46)/2 = 24` — and it comes out at 24 for filled and outlined alike. Only the
  vertical axis discriminates.
- Applying the same stroke-in-layout treatment horizontally gives `1 + 24 + 46 + 24 + 1
  = 96`. Figma reports 94. So the outlined symbols' own numbers are **mutually
  inconsistent**: a 94px frame cannot simultaneously hold `spacing-padding-lg` (24) on
  each side, a 1px stroke in the layout box, and a 46px label. Something has to give, and
  what gives is the padding — at width 94 the label is centred with only 24px to the
  frame edge, leaving no room at all for the stroke.
- That inconsistency exists on the horizontal axis only, which is exactly the axis that
  is pinned. **Width 94 on the outlined symbols is a fixed-width override that pinches
  the design's own padding token; it is not a considered 94.**

So the correct intrinsic outlined size is **96×46**, and the build's 95.76×46 honours it:
`1 + 24 + 45.76 + 24 + 1`. The −0.24px is Inter's rasterisation of "Sign in" (45.76
rendered vs 46 in Figma) and it appears **identically on filled** (93.76 vs 94) — the
same delta on every row, which the test skill correctly says is the renderer, not the
component.

**The earlier "2px too wide" finding was wrong and should stay withdrawn.** The
outstanding action is design-side, not engineering: set the outlined symbols to hug
width so Figma reports 96×46 and stops contradicting its own padding token.

---

## Observations — not matrix failures

**a. `className` is part of the public type but is silently discarded.**
`ButtonProps` is `… & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'children'>`,
so `className` is in the documented API. In `button.tsx` the JSX spreads `{...rest}`
first and then writes `className="hds-button"`, so a consumer-supplied class is
overwritten and lost. CLAUDE.md: *"A component's props are its documented API.
Undocumented behaviour is a bug."* Either merge the incoming class or `Omit` `className`
from the type. Read from source — no story exercises it, so this was not reproduced
through the deployed build, and I am listing it as an observation rather than a matrix
failure because no Figma row depends on it.

**b. Disabled text contrast is low in both modes.**
Light: `rgb(185,199,214)` on `rgb(215,222,231)` ≈ 1.5:1. Dark: `rgb(90,107,126)` on
`rgb(58,69,83)` ≈ 1.9:1. WCAG exempts disabled controls, and both values come straight
from the design, so this is not a defect. Recording it because it is a design decision
someone may want to revisit rather than a thing to fix in the component.

**c. `color-border-disabled` and `color-bg-primary-disabled` collapse onto the same
primitive in dark.** Both alias `neutral-800`, so the outlined disabled stroke in dark is
the same colour as the filled disabled fill. They are distinct in light
(`neutral-200` vs `neutral-300`). A token-mode question for design, not a component fault
— the component references the right two token names.

**d. Tokens are clean.** The served CSS for `.hds-button` contains no raw hex, no raw px
for any design value, and no font name. Every design value is a `var(--…)` onto a
semantic token. The only literals are `border: 0`, the two 120ms transition durations,
and `box-sizing` — none of which is a design value.

---

## Screenshots

| File | What it is |
|---|---|
| `reports/Button/figma-26-70-component-set.png` | The Figma render of node 26:70, all eight symbols, for side-by-side comparison |

Live captures of each state — the eight pinned stories, the light and dark matrix, the
outlined focus ring, and the hovered filled and outlined buttons — were taken against
the deployed build during this run and are in the session transcript. The Chrome
harness in this environment did not return a disk path for saved captures, so they could
not be written next to this report. The measured computed values in the tables above are
the primary evidence and are stronger than an image for every row.

---

## Verdict

**All 27 cases pass.** Eight variant/state rows measured against the Figma node in light,
the same eight in dark, and eleven behavioural cases driven with real input in real
Chrome against the deployed staging build.

Nothing goes back to the engineer. The two previously unverifiable cases — Enter and
Space activation — now pass. The one previously reported visual defect, outlined being
"2px too wide", I re-derived independently and **dispute**: the build is right and the
node's pinned width is the thing that is wrong.

What remains open is design work, not engineering work:

1. A designed `state=focused` node — the current ring is the same colour as the border it
   surrounds, in both modes.
2. Rebind the three outlined strokes from styles to variables (26:98, 26:100, 26:102).
3. Rename the style behind outlined pressed, currently `color/border/primary/focused`.
4. Set the outlined symbols to hug width so Figma reports 96×46 instead of a pinned 94
   that contradicts its own padding token.

Plus one small engineering item that is not a Figma mismatch: observation (a), the
discarded `className`.

*No status was set and nothing was marked resolved. This verdict is not final until a
human reads it.*
