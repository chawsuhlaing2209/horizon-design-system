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

**Carried over into Figma — not yet done.** `tokens/` is the committed Figma
export. This change was made in code, so the next re-export will overwrite it
unless the same primitive and alias are added to the Figma variable collection.
That is a design task, not an engineering one.

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
