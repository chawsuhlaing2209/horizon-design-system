# tools.md — what this project is built with

Stack facts and commands only. Rules about how we work live in `CLAUDE.md`.

## Stack

- Framework: React 19 with Vite
- Language: TypeScript, strict
- Package manager: npm
- Styling: CSS custom properties, generated from tokens
- Tokens: Style Dictionary v5, reading the Figma "Design Tokens" plugin export
- Component workshop: Storybook 10 (react-vite)
- Tests: Vitest
- Library build: tsup (ESM + CJS); declarations from `tsc` via `tsconfig.build.json`
- Accessibility: Storybook a11y addon
- Documentation site: Astro Starlight — one page per component, written by the `astro-page` skill

## Commands

| Job | Command |
|---|---|
| Install | `npm install` |
| Build tokens | `npm run build:tokens` |
| Run Storybook | `npm run storybook` |
| Build Storybook | `npm run build-storybook` |
| Test | `npm test` |
| Type check | `npm run lint` |
| Build the npm package | `npm run build:package` (tokens → `build:lib` → `build:css`) |
| Release to npm | `npm run release:publish -- <version> [--dry-run]` |
| Build the docs site | `npm ci && npm run build` in `docs-site/` on the `astro` branch |
| Run the docs site | `npm run dev` in `docs-site/` |

## Paths

- Token source: `tokens/*.json` (exported from Figma, committed)
- Token config: `style-dictionary.config.js`
- Generated output: `build/tokens/` (never edit by hand, gitignored)
- Package output: `dist/` (generated, gitignored); public surface is `src/index.ts`
- Components: `src/components/<name>/` (camelCase)
- Agents: `.claude/agents/`
- Skills: `.claude/skills/`
- Docs site (Astro Starlight): folder `docs-site/`, which exists only on the `astro` branch. Astro 7 with Starlight 0.42, its own `package.json` and lockfile.
  - Vercel project: `horizon-docs` (root directory `docs-site`, production branch `astro`; builds on any other branch are skipped). Each push to `astro` deploys production; never deploy by hand.
  - Production URL: https://horizon-docs-alpha.vercel.app
  - Format: the Sunim reference site (https://sunim-ds-reference.vercel.app). Sidebar groups Get Started, Designing, Developing, Skills, Core, Styling, Help; splash home page.
  - Component pages: `docs-site/src/content/docs/core/components/<name>.mdx`, served at `https://horizon-docs-alpha.vercel.app/core/components/<name>/` (old `/components/<name>/` URLs redirect).
  - Generator: `node docs-site/scripts/generate.mjs --repo <horizon-design-system worktree>` writes home, components, tokens, changelog, roadmap and news from the repo, `docs-site/sources/*.json` and the Storybook index. The guides are written and re-checked each run. See `docs-site/README.md`.
- README: `README.md` at the repo root is required on `main` and in every published tarball.

## Shell and CI facts

- The shell is **zsh**. Write `${var}` rather than `$var:…` (zsh reads `:r`, `:s` and friends as modifiers), and use `${=var}` when an unquoted variable must split into words.
- A staging or `astro` commit's Vercel deployment: `gh api "repos/chawsuhlaing2209/horizon-design-system/deployments?sha=<sha>"`, then that deployment's `statuses`; `environment_url` holds the URL once `state` is `success`. Storybook deploys as `Preview – horizon-design-system`; the docs site as `Production – horizon-docs`.
- A new npm version can take a few minutes to appear on the registry after `release:publish` reports it published.

## Dependency rules

- Match the package manager in this file. This project uses npm, not yarn or pnpm.
- Use the existing package scripts before inventing commands.
- Do not add a dependency without explaining why in your report.
- Do not add a UI or component library. This repo is the component library.
- If this file disagrees with `package.json`, inspect the repo and say so.
