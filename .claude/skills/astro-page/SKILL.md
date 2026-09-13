---
name: astro-page
description: Build one component's page in the Astro Starlight docs site from its intent file, source, stories, and built tokens — a header and five tabs (Design, Code, Usage, Examples, Changelog) — deploy it, confirm the live page, and only then write Astro Link to the registry.
---

# Build a component's docs page

The docs site is **Astro Starlight** (`tools.md`). This skill writes one Starlight
page and uses Starlight's own components for its structure. It never adds a
theme, plugin, or UI library to make a page look different.

## When to use this
Use this when a component needs its documentation page created or brought up to
date. It makes one page for one component. Do not use it to design the docs
site, or to document several components at once.

**Every section on the page has one source.** If the source is missing, that
section is left out and the page says so. A section filled from somewhere else,
or from memory, is invented.

**Writing `Astro Link` is DevOps's column** (`registry`). Anyone may draft the
page in steps 1–4. Steps 5–7 — deploy, verify, write the link — are done by
DevOps, or the draft is handed to DevOps at step 4.

## Inputs
One component, and from one pinned commit:

| Input | Where it is |
|---|---|
| Intent file | `src/components/<name>/<name>.intent.json` |
| Source | `src/components/<name>/`, its composed subcomponents, `src/index.ts`, `dist/index.d.ts` |
| Stories | `src/components/<name>/*.stories.tsx`, and the deployed Storybook's `index.json` |
| Built tokens | `dist/tokens.css`, from `npm run build:package` |

## Steps

### 1 · Find the site, pin the commit
`tools.md` names the framework — Astro Starlight — and, under Paths, the site's
folder and production URL. **It says the site is not created yet.** Until a human
records the folder and URL there, stop here and report it. Do not scaffold a
Starlight site, and do not guess a folder or URL from another repo.

The page goes in `<folder>/src/content/docs/components/<name>.mdx`, Starlight's
content collection. If the site already keeps component pages somewhere else,
the existing pages win, and the path in `tools.md` is wrong — report that.

Pin the commit: the tip of `origin/main` by default, full SHA recorded. Read
every input from a worktree at that SHA and run `npm run build:package` there.

**Check:** the folder and URL came from `tools.md`, and there is one SHA.

### 2 · Take stock of the sources
Before you write anything, list which sources exist:

| Part of the page | Source | Missing when |
|---|---|---|
| Header · status | The registry's `Development`, read now | The component has no row |
| Header · name + one line | Figma documentation frame on `💠 <Name>`: title `Title goes here`, line `Component description goes here`, verbatim | No page or no frame |
| Header · Storybook link | `Production Storybook` in the registry, deep-linked to the component's docs entry in that Storybook's `index.json` | Cell empty |
| Header · Figma link | The node URL at the top of the story file | No URL there |
| Header · Source link | `https://github.com/chawsuhlaing2209/horizon-design-system/tree/<SHA>/src/components/<name>` | — |
| **Design** | The component (Figma component set: screenshot, variant properties) + tokens (`var(--…)` in its CSS, with values from `dist/tokens.css`) | No component set, or no tokens resolved |
| **Code** | Types: the component's exported props in `dist/index.d.ts` | Not exported from `src/index.ts` |
| **Usage** | Intent file | No intent file, or a field in it is empty |
| **Examples** | Stories, as listed in the deployed Storybook's `index.json` | No stories, or no deployed Storybook |
| **Changelog** | Commit history | — |

The header status comes from the board. The Figma frame's status labels
("Development Completed") are typed by a person, and the board is the record. If
the two disagree, use the board and put the disagreement in the report.

**Check:** every row is marked present or missing before any page content exists.

### 3 · Build each tab from its source only

**Design ← component + tokens.**
- A `get_screenshot` of the component set node, saved into the site's assets.
- The variant properties and their values, as Figma names them.
- A token table: each token the component's CSS uses, followed through its
  subcomponents, with `--hds-*` private properties left out. Give each token's
  `:root` value and its `[data-theme="dark"]` value from `dist/tokens.css`.
- The dark block lists only colours that change. Where a token has no dark
  entry, write "same as light". That is how the build works, not a gap.

**Code ← types.**
- The import lines: the package `name` and the `./styles.css` and `./tokens.css`
  exports from `package.json`.
- One props table per exported props type, with prop, type, required or optional,
  and the doc comment verbatim.
- No defaults column. Defaults are not in the types, so they are not a source for
  this tab.
- A component that is not exported gets no Code tab body: "Not part of the
  public API."

**Usage ← intent.** One sub-section per field that has content, in this order:
`use_when`, `dont_use_when` (each with its `alternative`, where there is one),
`best_practice`, `variant_intent`, `placement`, `pairs_with`, `a11y`.

Copy the entries verbatim, and do not smooth, merge, or reorder them.
`variant_intent` values that are `null` are left out and named in the notice. An
empty field is not rendered; the notice names it instead.

**Examples ← stories.** One example per story in the Storybook's `index.json`
under this component, in index order:
- The story name.
- An embedded `iframe.html?id=<id>&viewMode=story` from `Production Storybook`.
- A link out to the story.

Do not write JSX for an example. Card's stories map flat controls through a
render function, and a snippet rebuilt from that would be code nobody wrote.

**Changelog ← commit history.** From the worktree:
`git log --date=short --format='%H%x09%ad%x09%s' -- src/components/<name> <each composed subcomponent>`,
newest first. Each row has the date, the short SHA linked to its commit, and the
subject verbatim. Mark each release tag (`v*`) that contains a commit. Do not
summarise the subjects into prose.

**When a source is missing,** the tab stays in its place in the order. It holds
one notice naming what is missing and where it would come from:

> Placement and pairs with — not documented. `card.intent.json` has empty
> `placement` and `pairs_with`: no story shows Card in a product layout or
> beside another component.

**Check:** every sentence on the page can be traced to a row of step 2.

### 4 · Write the page
One `.mdx` file at `<folder>/src/content/docs/components/<name>.mdx`. If the site
already has a component page, match its structure.

- **Frontmatter:** `title` is the component name (Starlight renders it as the
  page's `<h1>`). `description` is the one line from Figma, verbatim, or left out
  if it is missing.
- **Header,** above the tabs: the status as a Starlight `<Badge>` carrying the
  registry's `Development` text, then the three links. A link whose source is
  missing is left out, and a notice says so.
- **Tabs:** `<Tabs>` with five `<TabItem>`s, labels exactly `Design`, `Code`,
  `Usage`, `Examples`, `Changelog`, in that order. Import `Tabs`, `TabItem` and
  `Badge` from `@astrojs/starlight/components`. Do not write a tab component of
  your own.

Build the site locally with its own build command, recorded in `tools.md` once the
site exists. It must build with no errors and no broken internal links.

Commit the page and its assets on `docs/<name>` and open a PR into `staging`.

**Check:** the site builds, and the built HTML for this page has five tab labels
in order.

### 5 · Deploy
Through the docs site's own production pipeline, from `main`. DevOps only.

### 6 · Verify the live page — before anything touches the board
Fetch the live page URL, not the deploy log:

```
curl -sSL -o page.html -w '%{http_code} %{url_effective}\n' <page URL>
```

All of these must hold:
- The status is `200`, and the final URL is on the production docs domain.
  A `401` or `403` from deployment protection is a failure, not an obstacle.
- The page's `<h1>` is the component's name.
- There are exactly five `role="tab"` elements, labelled `Design`, `Code`,
  `Usage`, `Examples`, `Changelog`, in that order.
- There are five `role="tabpanel"` sections, each with content — either real
  content or its missing-source notice. An empty panel fails. Starlight puts
  every panel in the HTML and marks all but the first `hidden`, so check what
  each panel contains in the fetched HTML, not whether it is visible.
- Every header link on the page returns `200`.

**If any check fails, write nothing to the registry.** Report which check failed
and what the page returned.

### 7 · Write `Astro Link`
Write the exact URL you verified — the deep link to this page, not the site root
and not a preview URL. Read it back.

```
📘 Astro page · card  @ <short SHA>
page      <live URL>  → 200, 5 tabs, 5 panels
sections left out
  - <tab or header part>: <missing source>
Astro Link → written, read back
```

If blocked:
```
📘 Astro page · card · blocked
<which step, what failed — e.g. live page 401, Changelog panel empty>
Astro Link → not written
Try: <one next step>
```

## References
- The intent file and what its fields mean: `.claude/skills/component-intent/SKILL.md`
- Who writes `Astro Link`, and the board's flags: `.claude/skills/registry/SKILL.md`
- DevOps's rules for evidence columns: `.claude/agents/devops.md`
- The public surface and built output: `src/index.ts`, `dist/`
- Stack facts, including where the docs site lives: `tools.md`

## Self-check
- [ ] The docs site is Astro Starlight, and its folder and URL came from `tools.md`, not from a guess
- [ ] Every input was read at one pinned SHA
- [ ] Every part of the page traces to its one source; nothing was filled from elsewhere
- [ ] Missing sources are left out and named on the page and in the report
- [ ] Usage entries are verbatim from the intent file
- [ ] Examples come from the Storybook index, with no hand-written JSX
- [ ] Changelog subjects are verbatim commit subjects
- [ ] The header status is the registry's `Development`, not the Figma label
- [ ] The live URL returned 200 and holds all five tabs, in order, each non-empty
- [ ] `Astro Link` was written only after that, is the verified URL, and was read back
- [ ] If verification failed, nothing was written
