# Naming conflicts

CLAUDE.md: *"Prop names match the Figma property names exactly. If we need a new
property name suggestion due to naming conflict with other tools and
dependencies. Report all the naming suggestion under `docs/`."*

This is the register of every place a Figma property name could not be used
verbatim, and what is proposed instead. Nothing here is settled — each row needs
a human decision.

---

## Card — `state` collides with itself

**Figma:** node 12:1343, subcomponents `cardContainer` (8:804) and `cardImage` (8:1186).

Two subcomponents of the same parent both publish a property called `state`:

| Subcomponent | Property | Values |
|---|---|---|
| `cardContainer` 8:804 | `state` | `enable`, `hover` |
| `cardImage` 8:1186 | `state` | `idle`, `hover` |

They mean different things. `cardContainer.state` raises the whole card on
elevation; `cardImage.state` fades a gradient over the photo. They are also
independently settable — the node has a card at rest whose image is hovered.

**Why it is a conflict:** the two names only collide if the card is built as one
flat component. Under the subcomponent method in CLAUDE.md they do not collide
at all — each name stays verbatim on its own component, and the parent addresses
them through the subcomponent it owns.

**Resolved — both names kept verbatim.** The subcomponent structure separates
them, so neither is renamed:

```tsx
<Card
  container={{ state: 'hover' }}   // cardContainer 8:804
  image={{ state: 'idle', ratio: '3:2' }}  // cardImage 8:1186
  layout={{ orientation: 'vertical', hasSlot: false }}
  text={{ metadata: true, review: true, price: true }}
/>
```

Each subcomponent is a component in its own right under `src/components/`, and
each carries its own Figma property names unchanged. No prop was renamed.

**One caveat, scoped to Storybook.** Storybook controls are a flat list, so
`src/components/card/card.stories.tsx` maps flat control names onto the nested
API, and there the image state is called `imageState`. That name exists only as
a control label in that one file — never in the component API, never in a type,
never in anything a consumer imports.

**Status:** resolved. No decision needed.

---

## Button — `state` names a token `focused` that carries `pressed`

Figma node 26:70. No prop was renamed; both Figma property names are kept
verbatim:

```tsx
<Button variant="outlined" state="pressed">Sign in</Button>
```

The conflict is in the **token** name, not the prop. The outlined pressed node
(26:102) binds its stroke to the style `color/border/primary/focused`, which
builds to `--color-border-primary-focused`. So `button.css` reads:

```css
.hds-button[data-variant='outlined']:not(:disabled):active { /* pressed */
  border-color: var(--color-border-primary-focused);
}
```

A reader who trusts the token name will conclude this is the focus ring. It is
not — the focus ring is `--color-border-focused`, a different token, applied on
`:focus-visible`. Two tokens whose names differ by one word carry two unrelated
states.

Mirrored rather than substituted, because substituting would have stopped
matching the design.

**Suggested rename:** `color/border/primary/focused` → `color/border/primary/pressed`
in Figma, which would build to `--color-border-primary-pressed` and put the name
back in step with the usage. Alternatively, confirm that pressed and focused are
deliberately one value and say so in the token description.

**Status:** open — needs a designer's decision. Also in `docs/design-gaps.md`.

---

## Button — `state="enable"` is not `"enabled"`

Figma spells the default state `enable`, not `enabled`. CLAUDE.md says prop
names match Figma exactly, so the prop value is `enable`. It reads slightly off
in English next to `disabled`.

Kept verbatim. **Suggested rename in Figma:** `enable` → `enabled`, at which
point the code follows.

**Status:** open — cosmetic, low priority.
