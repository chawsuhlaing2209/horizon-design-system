# Design gaps

CLAUDE.md: *"A token that exists in one mode and not another is a design gap;
report it rather than filling it in"* and *"Inventing a token that does not
exist. Report the gap instead and stop."*

Every gap below was left as the design has it and reported here. None was
invented, and none was substituted with a near-enough token that would have
changed the rendering.

---

## Card — Figma node 12:1343

### 1. `ratio=3:2` renders 4:3

`cardImage` (8:1186) publishes `ratio` with values `3:2` and `1:1`. The `3:2`
variant is 363.5 × 272.625 and its image frame is 256 × 192 — both 4:3, not 3:2.

Built to the geometry (4:3), because the node is the reference. **The variant
name is wrong in Figma and should be renamed to `4:3`.**

### 2. Values bound to core tokens instead of semantic ones

CLAUDE.md: *"Components use semantic tokens only."* These properties are bound in
Figma to the core layer, so honouring the design and honouring the rule are in
conflict. The design's binding was mirrored and flagged rather than silently
promoted to a semantic token that would change the value.

| Property | Figma binding | Value | Semantic token that should front it |
|---|---|---|---|
| `cardImage` radius | `border/radius/8` | 8px | none exists — `--border-radius-surface` is 12px |
| `iconButton` padding-x | `spacing/8` | 8px | `--spacing-padding-xs` |
| `iconButton` padding-y | `spacing/sm` | 8px | `--spacing-padding-xs` |
| `iconButton` gap | `spacing/4` | 4px | `--spacing-gap-2xs` |
| `Icon Container` radius | `border/radius/4` | 4px | none exists |

**Needed:** a semantic radius carrying 8px, and the icon-button insets rebound to
the existing semantic spacing tokens.

### 3. Values with no token at all

| Property | Value | Note |
|---|---|---|
| `cardLayout` gap | 10px | off the 4px scale; no token can carry it |
| `iconButton` offset | `top: 7px`, `right: 6.5px` | raw, sub-pixel |
| `Slot` reserve | 46px | off the 4px scale |

**Needed:** either move these onto the scale (8px or 12px gap, 8px offset, 48px
slot) or add tokens for them. Until then they are raw values in `card.css`, each
marked in a comment.

### 4. Interaction states missing from the design

CLAUDE.md: *"Every component covers every interaction state the product uses:
default, hover, pressed, focus, disabled, loading, error, as applicable."*

The node defines only two:

| State | In Figma | Built |
|---|---|---|
| default | yes (`state=enable`) | yes |
| hover | yes (`state=hover`) | yes |
| focus | **no** | focus ring on the favourite button only, from `--color-border-focused` / `--border-width-focused` |
| pressed | **no** | not built |
| disabled | **no** | not built |
| loading | **no** | not built |
| error | **no** | not applicable to a card |

**Needed:** designs for pressed, focus and disabled, at minimum for the card
surface and the favourite button. The focus treatment currently in the code is
the system's generic focus ring, not a designed state — it is there because
shipping a keyboard-operable button with no visible focus is an accessibility
failure, but it needs a design decision.

### 5. The unfavourited heart has no design

`favorite` (8:1107) appears only in its filled, negative-coloured form. There is
no design for the button before it is pressed.

Currently rendered with `--color-icon-subtle`. **This is a placeholder and needs
a design decision.**

**Corrected after QA disputed the wording.** This entry used to propose "an
outlined heart rather than a recoloured filled one" as the likely fix, which
understated what shipped: the build already renders it outlined *and*
recoloured — `font-variation-settings: "FILL" 0` on the unpressed state, with
FILL flipping 0↔1 on toggle. So the open question is not whether to outline it;
it is whether this outlined, subtle-coloured heart is the design. Still a
decision, but a narrower one than the entry claimed.

### 6. The photo is an empty placeholder

`Slide Image` (8:1150) is a transparent 256 × 256 placeholder in Figma — there is
no image asset to export. The component takes an `image` src; with none supplied
it renders a quiet `--color-bg-surface-secondary` surface.

Not a defect, recorded so nobody hunts for a missing asset.

---

### 7. HALF RESOLVED — `--color-text-accent` failed contrast as text

The rating score (8:772) used `--color-text-accent`, which aliased
`color-orange-500` (#f0932b). On the light surface that is **2.36:1**, where
WCAG AA requires 4.5:1 for text at that size. Storybook's a11y addon flagged it
as a Serious `color-contrast` violation.

**Still only half resolved, and now guarded in code.** QA re-checked this on the
staging build: the built tokens are correct (light `#9c601c` = 5.12:1, dark
`#f0932b` = 6.44:1), but `get_variable_defs` on both 8:778 and 12:1343 **still
returns `#f0932b` for light mode**. The Figma variable was never updated — only
the built token was. This entry already records that a re-export silently
reverted this fix once; nothing had been done to stop it happening a third time.

`src/test/tokenContrast.test.ts` now fails the suite if
`--color-text-accent` drops below 4.5:1 on the card surface in either mode, or
if it points back at `orange-500`. That is a net, not a fix.

**Needed in Figma:** add `color-orange-700` and repoint the light-mode
`color/text/accent` alias at it, so the design file stops disagreeing with the
shipped token.

**Fixed at the token, not in the component.** The component already referenced
`var(--color-text-accent)`, so nothing in `cardText` changed — which is the point
of a semantic layer. The role was broken for every consumer, not just this card.

What changed in `tokens/`:

| Token | Before | After |
|---|---|---|
| `color-orange-700` (new primitive) | — | `#9c601c` |
| `color-text-accent` — light | `{color-orange-500}` #f0932b, 2.36:1 | `{color-orange-700}` #9c601c, **5.12:1** |
| `color-text-accent` — dark | `{color-orange-500}` #f0932b, 6.44:1 | unchanged — already passing |
| `color-icon-accent` — both | `{color-orange-500}` | unchanged |

Three things worth knowing about the shape of this fix:

- **It was only broken in light mode.** On the dark surface #f0932b is 6.44:1 and
  passes comfortably, so only the light mode file was repointed. That is what
  per-mode token files are for.
- **`color-icon-accent` was deliberately left alone.** It is the decorative
  rating star; non-text decoration is not held to the 4.5:1 text threshold, and
  darkening it would have dulled the design for no accessibility gain.
- **`color-amber-700` (#8a5a00) was rejected**, despite already existing and
  clearing AA at 5.93:1. It is documented as the *warning* colour. A 4.7-star
  rating is not a warning, and borrowing a semantic role because the value
  happens to fit is how a token system rots.

`color-orange-700` is derived from orange-500 along the same hue (31.9 vs 31.7),
so it still reads as the same accent rather than as brown.

Every text role on the card now passes AA in both themes; the a11y addon reports
**0 violations, 11 passes**, down from 1 Serious.

**Carried over into Figma — not done, and already proven to bite.** `tokens/` is
the committed Figma export. This change was made in code, so a re-export
overwrites it unless the same primitive and alias exist in the Figma variable
collection.

That is not hypothetical: the fix was reverted exactly this way once. A Figma
re-export landed between the fix and its PR, removed `color-orange-700`, and
put `color-text-accent` back to `{color-orange-500}` — reopening the violation.
It has been re-applied on top of that export.

**Until the primitive and the light-mode alias exist in Figma, every re-export
will silently reintroduce a WCAG AA failure.** Adding them in Figma is the only
durable fix; the code-side change is a stopgap.

### 8. The image tint has no strength token

`cardImage`'s overlay (8:1182) paints `--color-bg-overlay` through a gradient
stop whose own opacity is 20%, so the node resolves to `rgba(27,39,51,0.11)`.
The component reproduces that by applying the token unchanged and carrying the
stop's opacity on the layer: `0.55 x 0.2 = 0.11`.

The `0.2` has no token behind it. It is held in one place, in
`cardImage.css` as `--hds-card-image-overlay-strength`.

**Needed:** either a colour role for the image tint (`color.bg.imageTint`), or a
token for the strength. `--color-bg-overlay` should not be repurposed — it is
documented as *"Scrim behind modals and drawers"*, and an image tint is a
different job at a different strength.

### 9. Assumption recorded: the metadata block reserves its own height

Instance 12:1343 keeps the metadata container (8:770) at 48px with both its rows
hidden, while the standalone `cardText` component (8:778) leaves that height on
auto. Nobody could say whether the instance's fixed height is intentional or a
leftover override.

**Built to the node**: the block reserves the space its two rows occupy whenever
`metadata` is true, so every card with metadata is the same height regardless of
which rows have data. The reserve is composed from the rows' own tokens
(`--lineheight-label-lg` + `--spacing-gap-2xs` + `--lineheight-body-lg` = 48px),
not written as a literal, so it follows the type scale.

**Consequence to confirm:** `review=false` and `price=false` cards are now 296.25
tall rather than 272.25 and 268.25. Cards line up in a grid; a card with only a
price carries blank space under it.

**Needed:** a yes or no on whether that reserve is wanted. If not, drop the
`min-height` from `.hds-card-text__meta` and the card will shrink to its content.

---

### 10. Horizontal orientation: the node contradicts itself

Found by QA on staging, and failed there — the two horizontal rows are 2 of the
3 failures on the board.

`cardLayout` (8:1251) in horizontal splits its 269px row **unevenly**: cardImage
8:1213 measures 130.5 and the text column 8:1318 measures 128.5. The build
renders them equal, 129.5 / 129.5, via `grid-template-columns: 1fr 1fr`.

The node disagrees with itself, which is why this is a gap and not a patch:

- **Its declared layout says equal.** Both 8:1213 and 8:1318 are `layoutGrow: 1`
  / `layoutSizingHorizontal: FILL`, which is an instruction to share the row
  evenly.
- **Its rendered geometry says uneven.** 130.5 / 128.5.

**CORRECTED 2026-09-12 — the cause is not the stroke.** This entry previously
said cardImage carried a 1px stroke aligned outside. Read directly from the
file, all four cardImage variants (8:1184, 8:1187, 8:1185, 8:1196) already have
`strokeAlign: "INSIDE"` at weight 1, and so does the instance 8:1213. There is
no outside stroke to correct, and the remedy this entry recommended was a no-op.

The actual cause is an **aspect-ratio lock fighting the fill**:

| Property of instance 8:1213 | Value |
|---|---|
| `layoutSizingVertical` | `FIXED` |
| height | 97.875 |
| `targetAspectRatio` | `{x: 256, y: 192}` = 4:3 |

The image's height is fixed, so the aspect lock derives its width from that
height rather than from its share of the row: 97.875 x 4/3 = **130.5 exactly**.
The text column takes the remainder, 128.5. The `layoutGrow: 1` on both children
never gets to decide anything.

This also ties gap 10 to **gap 1** above: the lock is 4:3 on a variant published
as `ratio=3:2`, with the component property literally set to `"3:2"`. One wrong
aspect ratio produces both defects.

**Needed — a design decision, and the two options do not agree:**

1. **Rename the variant to `4:3`** (what gap 1 recommends). Keeps the geometry,
   fixes the name, and **leaves both QA rows failing**, because 130.5 / 128.5 is
   unchanged.
2. **Make the split even.** Let the width come from the fill share rather than
   from the fixed height, so the node renders 129.5 / 129.5, matches its own
   `layoutGrow: 1`, and matches the build with no code change. This changes the
   image's rendered proportions in the horizontal card.

Option 1 is honest about what the design currently is. Option 2 is what closes
the two failing rows. Picking 1 means accepting that Card cannot pass on these
two cases without a separate decision to change the code instead.

### 11. `elevation/level2` has no dark variant, so hover disappears in dark

Found by QA on staging, and failed there — the third of the 3 failures.

`cardContainer` `state=hover` raises the card on `--elevation-level2`. That token
emits the **same value in both modes**: `#1b27330f` and `#1b27331a`.

In dark that shadow colour, `#1b2733`, is *exactly* `--color-bg-surface-primary`.
The card is therefore casting a shadow in its own surface colour, over a
`#12181f` backdrop, and the composite difference works out at roughly 2/255 —
about 0.6%. QA confirmed by eye at 2x zoom that dark `enable` and dark `hover`
are indistinguishable.

The component applies the token correctly. There is nothing to fix in the CSS,
and no dark node to build against — the failure is recorded on observable
grounds, not against a design.

**CORRECTED 2026-09-12 — this cannot be fixed as an effect style.** Read from
the file, `elevation/level2` is `remote: true`: it lives in the **1. Horizon
Tokens** library, not in the Card file. Both of its drop shadows carry
`boundVariables: {}` — the colours are hardcoded, not bound to anything.

More fundamentally, **Figma effect styles have no modes.** There is no dark slot
on an effect style to fill in, which is exactly why `tokens/effects.styles.tokens.json`
emits one flat value per level with no mode dimension at all, for all five
levels rather than just level 2.

**Needed:** in the **1. Horizon Tokens** file, bind the two shadow colours of
`elevation/level2` to a colour **variable** that carries light and dark modes —
variables have modes, effect styles do not. Then the single style resolves per
theme and the export gains the mode dimension for free.

A dark shadow generally needs to be darker and more opaque than its light
counterpart, not the same value re-emitted, because it is no longer sitting on
white. The current value is worse than merely unadjusted: `#1b2733` is *exactly*
`--color-bg-surface-primary` in dark, so the card casts a shadow in its own
surface colour.

This affects levels 1 through 5, not only level 2. Level 2 is simply the one a
component happened to use in dark and fail on.

---

## Button — Figma node 26:70

The set publishes `variant` (filled | outlined) x `state` (enable | hover |
pressed | disabled) = 8 nodes. All eight were built and all eight match. The
gaps below are about what the set does **not** publish.

### 1. There is no `focused` variant

The set has no `state=focused` node, so there is no design for what a Horizon
button looks like under keyboard focus. A button that cannot be seen when
focused fails WCAG 2.4.7, so this could not simply be skipped.

Built from the two tokens the system already names for exactly this job —
`--color-border-focused` ("Keyboard focus ring") and `--border-width-focused`
("Focus ring thickness") — applied as a `2px` outline at `1px` offset on
`:focus-visible`. **Nothing was invented**: both tokens exist and both say what
they are for.

**QA raised a consequence worth the designer seeing.** `--color-border-focused`
and `--color-border-primary` are the *same value*, `#1547d5`. So on the outlined
variant the ring sits 1px outside an identically-coloured 1px stroke and reads
as nothing more than a thicker border — the focused and resting states are
barely distinguishable. On filled it is clear. This is not a build defect; it is
what happens when a ring has no node to be reviewed against.

**Needed:** a `state=focused` variant in the set, so the ring is reviewed rather
than inferred — and specifically a decision about the outlined case, where the
current tokens make focus nearly invisible. Until it exists, the ring is
unverified against a design.

### 2. The pressed stroke is bound to a token named `focused`

The outlined pressed node (26:102) binds its stroke to the style
`color/border/primary/focused` — `#13338f`. So the token that carries the
**pressed** border is the one named **focused**.

Mirrored verbatim (`--color-border-primary-focused`) rather than swapped for a
better-named token, because swapping would have stopped matching the design.

**Needed:** either rename the style to `color/border/primary/pressed`, or
confirm that pressed and focused are deliberately the same value. Right now the
name and the usage disagree, and a reader of the CSS cannot tell which is
intended. Also logged in `docs/naming-conflicts.md`.

### 3. The outlined strokes are styles, not variables

`color/border/primary`, `color/border/primary/hover` and
`color/border/primary/focused` come back from the Figma connection as raw style
paths, while every other value on the node comes back as a
`var(--horizon-semantic-*)` variable. The matching semantic tokens do exist in
the built set (`--color-border-primary`, `--color-border-primary-hover`,
`--color-border-primary-focused`), so the build is correct — but the design file
is binding these three through styles rather than variables.

Confirmed by QA, with one correction: **26:104 (outlined disabled) is already
a variable** — it returns `--horizon-semantic-color-border-disabled`. It is the
other three that are styles.

**Needed:** rebind those three strokes to the variables, so the outlined variant
stays in sync when the primary blue moves. As it stands, a change to the
variable would silently miss the outlined button.

### 4. No `size` property, no `loading` state, no icon slot

CLAUDE.md asks that a component cover *"every interaction state the product
uses: default, hover, pressed, focus, disabled, loading, error, as applicable."*
The set publishes no `size`, no `loading` and no `error`, so none was built —
they are not applicable until they are designed.

Two related observations:

- The auto-layout carries an 8px gap (`--spacing-gap-xs`), which only does
  anything when the label sits beside something. Nothing else is in the node.
  The gap is implemented and the label is `children`, so an icon composes
  correctly, but **there is no `icon` property in the design** and none was
  invented as a prop.
- The label "Sign in" sits on the node as sample content, not as a text
  property, so there is no design-named prop for it. It is `children`.

### 5. Observation: outlined hover changes only the 1px stroke

Across outlined enable, hover and pressed, the label stays
`--color-text-link` (#1547d5) and only the stroke colour moves — #1547d5 to
#1840b1 to #13338f. Faithful to the design and built that way, but it means the
entire hover affordance on the outlined button is a one-pixel border shifting by
a small amount of blue. Worth a designer's second look; not a build defect.

### 6. The outlined stroke is aligned outside, and the frame hides it

Corrected after QA disputed the first version of this entry, which claimed the
node makes outlined *"2px taller and 2px wider."* The node does not say that
about width, and the correction matters.

What the four symbols actually report:

| | width | height | label x | label y |
|---|---|---|---|---|
| 26:71 filled | 94 | 44 | 24 | **12** |
| 26:98 outlined | 94 | 46 | 24 | **13** |

Read the two axes separately, because they are not both free:

- **Height hugs.** 12 + 20 + 12 = 44 for filled; 13 + 20 + 13 = 46 for outlined.
  The label's y moves from 12 to 13 — one pixel per edge, on the axis that is
  free to grow. **This is the evidence**: the stroke is aligned outside (or
  centre), so Figma grows the hug dimension to contain it.
- **Width is pinned.** All eight symbols report `x="21" width="94"` inside a
  136px frame — a fixed width, identical for filled and outlined. A fixed
  dimension cannot grow, so the stroke overflows it silently and the number
  stays 94 whatever the alignment. **Width is therefore not evidence about
  stroke alignment at all**, and the label's x staying at 24 is a consequence of
  the same pinning.

So the component's intrinsic outlined box is **96 x 46**, and the 94 is a
layout override on the demo frame. That is what is built.

**Needed — a designer's decision, not an engineer's.** Filled and outlined
currently do not share a box, so a filled and an outlined button side by side in
a row will not align: 94 x 44 against 96 x 46. If they are meant to line up, set
the outlined stroke to **inside** in Figma; the node will then report 94 x 46
with the label back at y=12, and the code follows with `box-sizing: border-box`
in one line. Until that call is made, the code matches the node as the node
currently stands and this misalignment is real.

### 7. Dark mode presses in opposite directions

Found by QA. In light mode both variants darken under press. In dark mode they
do not:

| | hover | pressed |
|---|---|---|
| filled | `#5fa3db` | `#2e7cc4` — darker |
| outlined | `#5fa3db` | `#7fa8ee` — lighter |

Per CLAUDE.md a value that behaves one way in one mode and another way in
another is a design gap to report rather than fill in. Built as the tokens
resolve; nothing was adjusted.

**Needed:** confirmation that outlined is meant to lighten on press in dark mode
while filled darkens, or a correction to the dark token set.

**Not verifiable here:** the Figma connection serves light-mode values for this
set, so there is no dark node to compare any of this against.

### 9. Coverage gap: Enter / Space activation is unverified by anyone

Raised by QA. No one has actually confirmed that the button activates on Enter
or Space. The automation harness cannot deliver a trusted keypress — QA proved
this with a control: a bare native `<button>` injected into the same page also
recorded zero clicks from an Enter. jsdom does not synthesise activation
clicks either, so the unit suite cannot cover it.

`button.test.tsx` now asserts the three things that would break native
activation if they were wrong — it is a real `<button>` and not a `div` with a
role, it is in the tab order with no hand-rolled `tabIndex`, and it neither
intercepts `keydown` nor calls `preventDefault`. Activation itself is the
platform's, and structurally nothing is in its way.

**Needed:** one manual keyboard pass by a human before release, or a real
browser-driver test. Not a defect — an untested path.

### 8. Observation: the disabled filled label is effectively illegible

`#b9c7d6` on `#d7dee7` is about **1.27:1**. Both values come straight from node
26:87, so this is faithful and not a build defect, and axe passes it because
disabled controls are exempt from WCAG 1.4.3. Flagged because a label at 1.27:1
cannot really be read.

---

## Token contrast

### Open: several semantic text tokens fail WCAG AA

Not a Card gap — a token-set gap, found while building the contrast guard for
gap 7. Measured against `--color-bg-surface-primary` in each mode from the
generated CSS (white in light, `#1b2733` in dark). WCAG AA is 4.5:1 for normal
text.

| Token | Light | Dark |
|---|---|---|
| `--color-text-warning` | 5.93 | **2.56** |
| `--color-text-negative` | 7.25 | **3.29** |
| `--color-text-positive` | **4.38** | **3.47** |
| `--color-text-link` | 7.26 | **4.12** |
| `--color-text-subtle` | **3.06** | 8.81 |
| `--color-text-subtlest` | **1.72** | 4.20 |

`--color-text-disabled` is excluded: WCAG exempts disabled controls.

The dark column is the serious half. **`--color-text-warning` at 2.56:1 and
`--color-text-negative` at 3.29:1 are the tokens a product reaches for when it
has to tell someone something has gone wrong** — precisely the message that must
not be hard to read. Every one of these is a *text* token, so there is no
reading in which 3:1 is the applicable bar.

Several are near misses that a small darkening in light or lightening in dark
would fix, exactly as `orange-500` → `orange-700` fixed the accent. The pattern
is the same: a colour picked as a decorative hue, then reused as text.

**Not asserted in the test suite, deliberately.** `src/test/tokenContrast.test.ts`
guards only `--color-text-accent`, because that decision was already made twice
and lost once. These have not been ruled on by anyone, and CLAUDE.md says a gap
is reported rather than filled in — failing the suite on them would block the
repo on someone else's open question, and picking replacement values would be
inventing tokens.

**Needed:** a designer's pass over the dark palette for text roles, and a
decision on whether AA is the bar the system holds itself to. Once that is
settled, the guard test is one line per pair to extend.

---

## Token build

### Fixed: `Semi Bold` is now emitted as `600`

`--title-md-bold`, `--body-lg-bold`, `--label-lg-bold` and the rest previously
emitted as `Semi Bold 16px/24px Inter`, which is not a valid CSS `font`
shorthand — `Semi Bold` is not a weight keyword — so those tokens could not be
used as `font:` at all.

Cause: the weight map in the Style Dictionary preprocessor keyed on `SemiBold`,
but Figma exports the name with a space. Fixed in
`style-dictionary.config.js` by adding `'Semi Bold': 600`. All six `*-bold`
typography tokens now emit numeric weights and are used directly by the
component.

The remaining build warning — *"Unknown CSS Font Shorthand properties found for
21 tokens"* — is expected and benign: it reports that `letterSpacing` cannot be
carried in a `font` shorthand, which is true of CSS. The component applies
`letter-spacing` from the matching `--tracking-*` token alongside `font:`.
