---
title: Contributing
description: Who does what in Horizon, how work moves from Figma to a release, which files are generated, and how to run it locally.
---

## Who does what

From the system's rules (`CLAUDE.md`):

> The engineer builds and fixes. It never verifies its own work.
> QA tests and reports. It never repairs.
> A human approves. No agent approves its own work, ever.

| Role | Does |
|---|---|
| Designer (human) | The Figma component, its Usage region, the Design sign-off, decisions on design gaps |
| Engineer | Builds the component from its Figma node, deploys the staging Storybook, writes the staging link |
| QA | Tests the deployed staging build against Figma, every variant and state, and records each case |
| DevOps | Promotes a passing component from `staging` to `main` and the production Storybook, on a person's approval |
| Doc generator | Writes each component's intent file from Figma, and builds this site |
| Release | Reviews components against the release gates, packages and publishes, on a person's approval of the version |
| PM | Sweeps the registry and verifies every link and record the others wrote |

### They hand over through the registry

Each component has a row in the registry, and its `Development` status is a formula over the evidence: a staging link, test results, a production link, a release review, a docs link. An agent starts when the status says its step is next, not when someone asks in a chat.

## How work moves

1. Design signs off a Figma component.
2. The engineer builds it on a branch, merges into `staging`, and deploys the staging Storybook.
3. QA tests that build. Failures go back to the engineer.
4. A person approves, and DevOps promotes `staging` to `main` and production.
5. The release review clears it, the package publishes from `main`, and this site gets its page.

**Git rules:** a component branch never merges into `main`; `main` accepts pull requests from `staging` only; releases publish from `main` only.

## Which files are generated

Never edit these by hand; fix their source instead.

| Generated | From |
|---|---|
| `build/tokens/`, `dist/tokens.css` | `tokens/*.json`, exported from Figma |
| `dist/` | `src/`, by `npm run build:package` |
| `src/components/<name>/<name>.intent.json` | The Figma Usage region, the prop doc comments and the stories |
| This site's home, component pages, tokens, changelog, roadmap and news | The repo, the registry and the Storybook, by `docs-site/scripts/generate.mjs` |

## Running it locally

| Job | Command |
|---|---|
| Install | `npm install` |
| Build tokens | `npm run build:tokens` |
| Storybook | `npm run storybook` |
| Tests | `npm test` |
| Type check | `npm run lint` |
| Package build | `npm run build:package` |
| This site | `npm ci && npm run dev` in `docs-site/` on the `astro` branch |

## Before you open a pull request

- `npm run lint` and `npm test` pass.
- Every visual value is a semantic token, and every new variant and state has a story.
- Prop names match the Figma property names.
- The pull request targets `staging`.
