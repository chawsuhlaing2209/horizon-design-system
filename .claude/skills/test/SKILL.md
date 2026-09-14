---
name: test-component
description: Test a built component against its Figma node, read live over the Figma MCP connection, and report every variant, size, and state as a pass or a finding.
---

# Test a component

## When to use this
Use this when a component has been built or fixed and needs verifying before a
human reviews it. Do not use it to test a component you built yourself in this
same session.

You need the Figma node the component was built from. It is in the build report
and at the top of the component's story file. If you cannot find it, ask — do
not test against the story file alone. A component compared only to its own code
proves nothing: it agrees with itself by construction.

## Steps

### 1 · Read the design — the Figma node is the truth
Pull the node over the Figma MCP connection before you look at the component:

| Tool | What it gives you | Use it for |
|---|---|---|
| `get_metadata` | every variant name, and each one's exact width and height | the matrix, and the geometry to measure against |
| `get_design_context` | reference code with token bindings, plus a screenshot | which token each property should carry |
| `get_variable_defs` | the Figma variable → value map | confirming a binding when the code output is ambiguous |
| `get_screenshot` | a render of the node | the visual comparison |

`get_metadata` on the component-set node is the highest-value call: it names
every variant and hands you the real pixel dimensions, which is the matrix and
the measurement baseline in one call.

**Check:** you have a list of expected cases that came from Figma, not from the code.

### 2 · Read the story file — the code's claim
List every variant, size, and state the stories cover.

Now reconcile the two lists. A row in Figma with no story is a **missing case** and
is itself a finding. A story with no row in Figma is either dead or undocumented —
report it, do not quietly drop it.

**Check:** the two lists are reconciled, and every difference is written down.

### 3 · Load the component and measure — do not eyeball
Open the **deployed staging Storybook** named in the registry's `Staging Storybook`
cell, in Claude in Chrome. Never a local Storybook: it is a different bundle with
different font loading, so a result from it says nothing about what shipped. Open
each story at `<staging origin>/iframe.html?id=<story-id>&viewMode=story`.

Collect every value a case needs in one script per story, not one call per
property.

Read the numbers out of the browser rather than judging them by eye. Computed
style against the Figma dimension is a fact; "looks about right" is not. For each
case, compare against the node: width and height, padding, gap, radius,
background, colour, border, shadow, opacity, and font.

**Before you trust a single width, confirm the design system's fonts actually
loaded.** `document.fonts.check()` lies — it returns true for a font that is
merely fallible. Measure the string on a canvas in the declared family and again
in a deliberately bogus family name; identical widths mean the font is missing and
every width you are about to report is wrong for that reason alone, not because
the component is wrong.

**Check:** every number in your report came from a measurement, not an impression.

### 4 · Exercise the states, do not just look at them
A state that only changes colour has not been tested. Confirm behaviour:

- **Disabled** — the click handler does not fire, and the control is genuinely inert
- **Loading** — non-interactive, and announced (`aria-busy` or equivalent)
- **Focus** — press Tab. A programmatic `.focus()` does not trigger `:focus-visible`,
  so a ring that only appears in the pinned story is not proof the real one works
- **Hover** — the pinned story and a real pointer hover agree

**Check:** each interactive state was driven, not just rendered.

### 5 · Capture the visual states
Screenshot each state, including hover, disabled, and loading. Save them to
`reports/<name>/`, lowercase. Where a case fails, capture the Figma render beside it.
If the browser tool cannot write screenshots to disk, record that once in the report
and rely on the measurements; do not retry.

### 6 · Check the tokens
Confirm no raw hex, px, or font value appears in the component or its CSS. The
token names live in `build/tokens/css/tokens.css` — that file is generated, so
read it, never edit it.

A value the design left unbound is a design gap, not an engineering defect.
Report it as a gap and say so; do not log it against the engineer.

### 7 · Write the rows and the report
One `Staging Testing` row per case, updated in place when the case already has one;
read the component's existing rows first. Every row ends the run as `Passed` or
`Failed`, never `Fixed (To re-test)`.

The report is `reports/<name>.md`, lowercase. For each failure: what failed, where,
and the specific token or prop that looks wrong. A recorded design decision (a
`RESOLVED` or `WAIVED FOR RELEASE` entry in `docs/design-gaps.md`) is the expected
result for that property; cite it rather than failing the case.

## Judgement — what is and is not a defect
Do not burn a finding on these:

- **Sub-pixel width drift.** Figma and the browser rasterise text differently. A
  consistent ~1px difference across every row is the renderer, not the component.
  The same delta on *every* case points at something systemic; a delta on *one*
  case is a real finding.
- **A colour that disagrees with `get_variable_defs`.** That tool answers in the
  mode the Figma file is currently open in, which may not be the default. Check
  the value against the other modes before calling it wrong.
- **A border that does not change the box.** A Figma stroke set to inside does not
  add to the frame size; an inset ring in CSS is a faithful translation, not a bug.

## References
- The component under test: `src/components/<name>/`
- Recorded design decisions and waivers: `docs/design-gaps.md`
- The generated tokens: `build/tokens/css/tokens.css` (read-only, never hand-edited)
- Commands and stack: `tools.md`
- What a component must satisfy: `CLAUDE.md`

## Self-check
- [ ] The expected matrix came from the Figma node, not from the story file
- [ ] Fonts were confirmed loaded before any width was reported
- [ ] Every variant and state was measured, not eyeballed
- [ ] Disabled, loading, and focus were driven, not just rendered
- [ ] Every failure has a screenshot and names a specific fix
- [ ] Design gaps are reported as gaps, not as engineering defects
- [ ] The report says pass or fail per case, with no summary judgement
- [ ] Every number came from the deployed staging build, never a local server
- [ ] Existing rows were updated in place, and none ends the run as `Fixed (To re-test)`
- [ ] You changed nothing in `src/components/`
