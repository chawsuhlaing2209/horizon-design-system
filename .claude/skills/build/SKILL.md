---
name: build-component
description: Build one design system component from one Figma node, in five checked stages — schema, tokens, implement, check, deploy.
---

# Build a component

## When to use this
Use this when you are turning one Figma component into one coded component in
`src/components/`, or fixing one after a QA report. Do not use it for building a
whole screen, or for anything that spans more than one node.

## Steps

### 1 · Schema — read the design
Pull the node through the Figma connection. Write down the **variant matrix**:
every variant property, every size, every state in the component set. That list
drives the props, the stories, and the QA pass.

**Check:** every property in the design has a prop or a token binding written down.
Nothing is "I'll work it out when I write it."

### 2 · Tokens — resolve, don't choose
For each visual property, find the semantic token that carries that meaning in
`build/tokens/css/tokens.css`. Never a raw value. Never a core token directly —
the scale steps in that file (`--spacing-1`, `--border-radius-4`, `--size-10`,
`--color-blue-600`) are the core layer, and a component that reaches for one has
skipped the semantic token that should sit in front of it (`--spacing-gap-2xs`,
`--border-radius-control`, `--color-action-primary`).

That file is generated. Read it, never edit it.

A property the design leaves unbound, or binds to a core token, is a design gap.
Report it and build the rest. If a human decides the value must ship as it is,
mirror the design, put `/* DESIGN GAP: … */` on that line, and record the exact
value in `docs/design-gaps.md`. The release review accepts a raw value or core
token only when a waiver there quotes it exactly.

**Check:** every value resolves to a semantic token, and the unbound ones are raised
rather than invented.

### 3 · Implement — structure and behaviour
Create `src/components/<name>/<name>.tsx` and `<name>.css` (camelCase, per
`CLAUDE.md`). Prop names match the Figma property names exactly. Every CSS value
uses `var(--token-name)`. Font values come from the type tokens alone: no fallback
stack appended.

Give each variant prop a doc comment that names every value and what it is for,
one sentence per value (`` `filled` is the high-emphasis button, for … ``). The
intent file copies these sentences verbatim, and a value with none fails release
check 5.

Wire it into the package: import its CSS from `src/styles.css`, and, if it is
public, export it and its prop types from `src/index.ts`.

Layout is translated, not eyeballed: auto-layout becomes flex or grid carrying its
direction and alignment, gap and padding come from their spacing tokens.

Interactions actually work. Disabled, hover, focus, loading — behaviour, not just a
class that changes colour.

**Check:** `npm run lint` passes.

### 4 · Check — render it and compare
Write `<name>.stories.tsx`, one story per row of your matrix. **Record the Figma
component-set node URL at the top of that file** — QA tests against the node, not
against your story file, and cannot start without it.

Add **in-context stories** too: at least one that places the component in a
product layout (a form, a grid of results, a list, another component's slot), and
one that renders it beside another design-system component. The intent file's
`placement` and `pairs_with` come only from these, and release check 1 fails
without them. Wrapper widths in a story file may be px; the component may not.

Then run
`npm run storybook` and **look at it**: the sidebar lists your stories, the canvas
draws them, the console is clean, every state clicks through.

Then compare each story against the Figma node: spacing, colour, size, radius, states.

**Check:** every matrix row matches its node, or the difference is reported.

This stage is your **self-check**, and local Storybook is the right place for it.
It is not the handoff, and it is not QA. Do not hand anything to QA from here.

### 5 · Deploy — staging, then the registry, in that order
Only once stage 4 is fully green. Never before, and never partly.

1. Merge the component branch into `staging` by PR. Never into `main`.
2. Vercel deploys that merge commit by itself; do not deploy by hand. Find it and
   wait for it:
   `gh api "repos/<owner>/<repo>/deployments?sha=<merge SHA>"` → the deployment
   whose environment is the Storybook project's `Preview`, then its `statuses`
   until `state` is `success`. Use that status's `environment_url`.
3. **Open the deployed URL yourself and see the component render.** A link to a
   build you have not looked at is a lie in a cell.
4. Write `<environment_url>/?path=/docs/components-<name>--docs` into the
   registry's `Staging Storybook` column, plus `Commit` and a `GitHub Commits` row.
   Every later staging deploy that changes the component gets the new URL: QA
   tests only the build the cell names.

Writing `Staging Storybook` flips `Development` to `Ready for Testing`, which is
what wakes QA. **That cell is the entire handoff** — QA starts from the link in
the registry, in Claude in Chrome, and tests that deployed build and nothing
else. QA refuses when the cell is empty, so a component you did not deploy is a
component nobody tests.

**Check:** the staging URL is deployed, opened, seen to render, and written to
`Staging Storybook`.

## References
- The token source: `build/tokens/css/tokens.css` (generated, read-only)
- The good examples to copy: `src/components/button/` (an atom) and `src/components/card/` (composed from subcomponents), camelCase per `CLAUDE.md`
- Recorded gaps and waivers: `docs/design-gaps.md`; naming decisions: `docs/naming-conflicts.md`
- Naming and conventions: `CLAUDE.md`
- Commands and stack: `tools.md`

## Self-check
- [ ] Prop names match the Figma property names exactly
- [ ] Every visual value is a semantic `var(--token)`, with no raw hex, px, or font names — except a human-decided value marked `DESIGN GAP` and quoted in `docs/design-gaps.md`
- [ ] Every row of the matrix has a story, plus an in-context story and a pairing story
- [ ] Every variant prop's doc comment names each value and what it is for
- [ ] The CSS is imported by `src/styles.css`, and a public component is exported from `src/index.ts`
- [ ] The Figma node URL is recorded at the top of the story file
- [ ] Storybook renders every story with no console errors
- [ ] `npm run lint` passes
- [ ] The staging build is deployed, and I opened it myself before recording it
- [ ] `Staging Storybook` holds that URL — the handoff is the cell, not a message
- [ ] Anything the design left unbound is reported, not guessed
