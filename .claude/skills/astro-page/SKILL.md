---
name: astro-page
description: Build the Astro Starlight docs site from the code repo — its nine sections (Home, Components, Tokens, Start designing, Start coding, Changelog, Roadmap, News, Help) and one page per cleared component with a header and five tabs (Design, Code, Usage, Examples, Changelog) — plus the site's README, commit it to the astro branch that Vercel deploys, confirm every live page, and only then write Astro Link to the registry.
---

# Build a component's docs page

The docs site is **Astro Starlight** (`tools.md`). This skill writes the site's
nine sections, its README, and one page per cleared component, using Starlight's
own components for structure. It never adds a theme, plugin, or UI library to make
a page look different.

## When to use this
Use this whenever the docs site is built: after a publish, when a component's
page needs creating or updating, or when any site section is out of date. **Every
run rebuilds all nine site sections and the site's README**, then one page per
component the board clears. A run that updates only a component page leaves the
Home, Components, Roadmap and News sections stale, so there is no such run.

It never adds a theme, plugin, or UI library, and it never designs the site: the
sections, their order and their sources are fixed below.

**Every section on the page has one source.** If the source is missing, that
section is left out and the page says so. A section filled from somewhere else,
or from memory, is invented.

**Run by the Doc Generator** (`.claude/agents/doc-generator.md`), which owns
`Astro Link` in the registry. It runs this skill for components reading
`Completed` or `Released` whose `Release Verdict` is `Cleared`.

## The site — nine sections, always

The sidebar holds exactly these nine entries, in this order. Each is generated
from the code repo and the board at the pinned commit, never written freehand.

| # | Sidebar label | File in `<folder>/src/content/docs/` | Source — and nothing else | Missing when |
|---|---|---|---|---|
| 1 | Home | `index.mdx` (`/`) | Root `README.md`: its first heading, first paragraph and install block, verbatim. `package.json` `name` and `version`. A list of the board's `Released` components, each linking to its page. | `README.md` missing: stop the run (see step 1) |
| 2 | Components | `components/index.mdx` plus one page per component | The board: every component reading `Completed` or `Released` with `Release Verdict = Cleared`, each with its `Development` badge, the Figma one-line description, and a link to its page. The per-component pages follow steps 2–4. | No component qualifies |
| 3 | Tokens | `tokens.mdx` | `dist/tokens.css` after `npm run build:package`: every custom property, grouped by the first segment of its name (`color`, `spacing`, `border`, `size`, type, `elevation`, …), with its `:root` value, its `[data-theme="dark"]` value or "same as light", and its `/** … */` description verbatim. Where `tokens/` separates core from semantic sets, keep that split and quote `CLAUDE.md`: components use semantic tokens only. | `dist/tokens.css` not built |
| 4 | Start designing | `start-designing.mdx` | The Figma file URL (`$figma.file` in the intent files). Each component's Figma page name and node, from its intent file. The `CLAUDE.md` sections *The system*, *Naming*, *Components*, *Typography* and *Icon*, quoted verbatim. The token pipeline line from `tools.md`. | No intent file names a Figma file |
| 5 | Start coding | `start-coding.mdx` | Root `README.md` install and usage sections, verbatim. `package.json` `exports` and `peerDependencies`. The export list of `src/index.ts`. The dark-theme selector as it appears in `dist/tokens.css`. | `README.md` has no usage section: notice, the rest still renders |
| 6 | Changelog | `changelog.mdx` | Root `CHANGELOG.md` if it exists, verbatim. Otherwise, per `v*` tag, newest first: the tag's date and `git log --format='%h%x09%ad%x09%s' --date=short <previous tag>..<tag>` subjects verbatim, each short SHA linked. Then an **Unreleased** list: commits on `origin/main` since the last tag. | No tag and no `CHANGELOG.md` |
| 7 | Roadmap | `roadmap.mdx` | The board: every component not `Released`, grouped by its `Development` value, names only. The open headings in `docs/design-gaps.md` and `docs/naming-conflicts.md` (not marked RESOLVED), each linked to the file at the pinned SHA. **No dates, owners or priorities** unless a source states them. | Never empty: an empty board says "Nothing in progress" |
| 8 | News | `news.mdx` | Dated events, newest first, one line each, the fact and its link: each npm version and its publish time (`npm view <package> time --json`); each component that reached `Released` (its `Release Review` commit date and page link); the first commit on `astro` (the site's launch). No prose beyond the event. | No event yet |
| 9 | Help | `help.mdx` | Root `README.md` *Help*, *Support* or *Contributing* section, verbatim. The repository's GitHub issues URL. The `Production Storybook` URL and the docs site URL from `tools.md`. | README has no such section: notice, the links still render |

`astro.config.mjs` lists the sidebar explicitly in this order: a link for Home,
the Components group (with its index first, then component pages), then a link
for each of the other seven. Change the config only to keep this order.

**A section whose source is missing still exists** at its place and path. It holds
one notice naming what is missing and where it would come from, exactly as a
component tab does.

**The site's README.** `<folder>/README.md` says what the site is, where it
deploys, and how to run and build it, taken from `tools.md` (docs site paths and
commands) and `<folder>/package.json` scripts. It is rewritten every run.

## Inputs
For each component, from one pinned commit:

| Input | Where it is |
|---|---|
| Intent file | `src/components/<name>/<name>.intent.json` |
| Source | `src/components/<name>/`, its composed subcomponents, `src/index.ts`, `dist/index.d.ts` |
| Stories | `src/components/<name>/*.stories.tsx`, and the deployed Storybook's `index.json` |
| Built tokens | `dist/tokens.css`, from `npm run build:package` |

## Steps

### 1 · Find the site, pin the commit
`tools.md` names the framework — Astro Starlight — and the branch that deploys it,
`astro`. Under Paths it records the site's folder, the Vercel project linked to
`astro`, and the production URL. If it does not record them, stop here and report it. Do not scaffold a Starlight
site, create a Vercel project, or guess a folder or URL from another repo.

The page goes in `<folder>/src/content/docs/components/<name>.mdx`, Starlight's
content collection. If the site already keeps component pages somewhere else,
the existing pages win, and the path in `tools.md` is wrong — report that.

Pin the commit: the tip of `origin/main` by default, full SHA recorded. Read
every input from a worktree at that SHA and run `npm run build:package` there.

**Root `README.md` must exist at that SHA** and name the package from
`package.json` and its install command. Without it the Home, Start coding and Help
sections have no source, so stop the run and report it. Do not write a README.

**Check:** the folder and URL came from `tools.md`, there is one SHA, and the root
`README.md` exists there.

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

### 4 · Write the sections and the pages
First the nine site sections and `<folder>/README.md`, from their sources in the
table above. Then one `.mdx` file per component at
`<folder>/src/content/docs/components/<name>.mdx`. If the site already has a
component page, match its structure.

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

Commit the sections, the README, every page and their assets to the `astro`
branch — everything from this run in one commit — and push. That commit is the
deploy.

**Check:** the site builds; the built sidebar has the nine labels in order; each
component page's built HTML has five tab labels in order.

### 5 · Wait for Vercel
The Vercel project linked to `astro` deploys each push to production by itself.
**Never deploy by hand** (`vercel deploy`, a dashboard redeploy): the live site
must always trace to a commit on `astro`.

Wait for the deployment of the commit you pushed, not the latest one. Vercel
reports it on that commit in GitHub
(`gh api repos/<owner>/<repo>/deployments?sha=<sha>`, then that deployment's
statuses). Go on only when it reads `success`. If it fails, is cancelled, or does
not finish, every page in the commit fails verification.

### 6 · Verify the live site — before anything touches the board
**The nine sections first.** Fetch each section's live URL. Each must return `200`
on the production domain with its sidebar label as the `<h1>`, and the live
sidebar must list all nine labels in order. A failing section is reported; it does
not block component pages, but the run's card shows the site as incomplete.

**Then each component page.** Fetch the live page URL, not the deploy log:

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
- Every header link on the page returns `200`. One exception: the Figma link. The
  design file is team-only by decision (product owner, 2026-09-14), so a
  `www.figma.com` link passes when it answers `403` or a redirect to Figma's login
  page. Record the status you got in the card. Any other non-`200` Figma answer
  (`404`, a different host, a timeout) still fails.

**If any check fails, write nothing to the registry.** Report which check failed
and what the page returned.

### 7 · Write `Astro Link`
Write the exact URL you verified — the deep link to this page, not the site root
and not a preview URL. Read it back.

```
📘 Astro site  @ <short SHA>
sections  Home ✓ Components ✓ Tokens ✓ Start designing ✓ Start coding ✓ Changelog ✓ Roadmap ✓ News ✓ Help ✓
notices   <section>: <missing source>
readme    <folder>/README.md written

📘 Astro page · card  @ <short SHA>
page      <live URL>  → 200, 5 tabs, 5 panels
sections left out
  - <tab or header part>: <missing source>
Astro Link → written, read back
```

Once every link is written, read `Development` back. If it changed (a component
reached `Released`), regenerate the page badges and the Home, Components, Roadmap
and News sections from the board as it now reads, commit and push once more, wait
for that deployment, and re-fetch the changed pages. Links do not change.

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
- The agent that runs this skill, and its boundaries: `.claude/agents/doc-generator.md`
- The public surface and built output: `src/index.ts`, `dist/`
- Stack facts, including where the docs site lives: `tools.md`

## Self-check
- [ ] The docs site is Astro Starlight, and its folder and URL came from `tools.md`, not from a guess
- [ ] The root `README.md` existed at the pinned SHA
- [ ] All nine sections were regenerated from their sources, in sidebar order, and `<folder>/README.md` was rewritten
- [ ] Each section's live URL returned 200 with its label as `<h1>`, and the live sidebar lists all nine in order
- [ ] Roadmap and News hold no date, owner, priority or claim that a source does not state
- [ ] Every input was read at one pinned SHA
- [ ] Every part of the page traces to its one source; nothing was filled from elsewhere
- [ ] Missing sources are left out and named on the page and in the report
- [ ] Usage entries are verbatim from the intent file
- [ ] Examples come from the Storybook index, with no hand-written JSX
- [ ] Changelog subjects are verbatim commit subjects
- [ ] The header status is the registry's `Development`, not the Figma label
- [ ] The live URL returned 200 and holds all five tabs, in order, each non-empty
- [ ] Every header link returned 200, except a Figma link answering 403 or Figma's login redirect
- [ ] `Astro Link` was written only after that, is the verified URL, and was read back
- [ ] If verification failed, nothing was written
