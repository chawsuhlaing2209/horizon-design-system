---
title: Versioning
description: What a version number of the Horizon package promises, what it does not, and how the number moves.
---

## The short version

`@theproductiveschedule/horizon-design-system` follows semantic versioning, and it is below `1.0.0`. Below `1.0.0`, semver allows a minor version to break things. That is the contract, not a loophole, and it is why the version starts with a zero.

If a break would cost you, pin an exact version and read the [changelog](/get-started/changelog/) before you move.

## What 0.1.0 promises

- **Every component on the public surface cleared a release review.** A component is exported from `src/index.ts` only after it passed QA on its staging build, went live in the production Storybook, and cleared the seven release gates. The review report is linked from the registry and from [News](/get-started/news/).
- **Prop names match the Figma property names.** `variant`, `state`, `orientation` and the rest are the words the design file uses.
- **Every visual value comes from a token,** except the values each component page lists under *What Figma never bound*, which a person decided to ship as they are.
- **React is a peer dependency,** `^19.0.0`, not bundled.

## What 0.1.0 does not promise

- **That the next minor version keeps every prop.** Removing or renaming an export or a prop is a breaking change, and below `1.0.0` a breaking change moves the minor number.
- **That open design gaps are closed.** The [roadmap](/get-started/roadmap/) lists every one still open, including the ones waived for release.
- **Token values.** Tokens come from Figma. A re-export can change a colour or a spacing step in any version.

## How the number moves before 1.0.0

The release agent proposes a version from the change that forces it, and a person approves it before anything publishes:

| The change | Below `1.0.0` |
|---|---|
| An export or a prop is removed or renamed | minor (`0.1.0` → `0.2.0`) |
| An export or a prop is added | minor |
| A fix that changes neither | patch (`0.1.0` → `0.1.1`) |

## Where the version lives

- `package.json` on `main`
- A `v<version>` git tag, pushed when the version publishes
- The npm registry, where a published number can never be reused

## Cutting a release

Releases publish from `main` only, through `npm run release:publish`. That script runs every gate again, refuses a version already on the registry, publishes, tags, and installs the published package into an empty folder to render a component from it. A release also includes a README in the package and this site's pages for every released component.
