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
a design decision** — most likely an outlined heart rather than a recoloured
filled one.

### 6. The photo is an empty placeholder

`Slide Image` (8:1150) is a transparent 256 × 256 placeholder in Figma — there is
no image asset to export. The component takes an `image` src; with none supplied
it renders a quiet `--color-bg-surface-secondary` surface.

Not a defect, recorded so nobody hunts for a missing asset.

---

### 7. RESOLVED — `--color-text-accent` failed contrast as text

The rating score (8:772) used `--color-text-accent`, which aliased
`color-orange-500` (#f0932b). On the light surface that is **2.36:1**, where
WCAG AA requires 4.5:1 for text at that size. Storybook's a11y addon flagged it
as a Serious `color-contrast` violation.

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
