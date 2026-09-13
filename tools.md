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

## Paths

- Token source: `tokens/*.json` (exported from Figma, committed)
- Token config: `style-dictionary.config.js`
- Generated output: `build/tokens/` (never edit by hand, gitignored)
- Package output: `dist/` (generated, gitignored); public surface is `src/index.ts`
- Components: `src/components/<Name>/`
- Agents: `.claude/agents/`
- Skills: `.claude/skills/`
- Docs site (Astro Starlight): **not created yet.** Record its folder and production URL here when it exists; component pages go in `<folder>/src/content/docs/components/<name>.mdx`

## Dependency rules

- Match the package manager in this file. This project uses npm, not yarn or pnpm.
- Use the existing package scripts before inventing commands.
- Do not add a dependency without explaining why in your report.
- Do not add a UI or component library. This repo is the component library.
- If this file disagrees with `package.json`, inspect the repo and say so.
