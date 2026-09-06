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
