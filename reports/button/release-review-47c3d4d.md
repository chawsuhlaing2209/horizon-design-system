# 🧾 Release review — button

| | |
|---|---|
| Reviewed commit | `47c3d4da71a6ec0b5a2440a5f569f0d4cc0202c4` (2026-09-14T19:12:13+06:30), origin/main |
| Registry `Development` at review | `Completed` (Components row `recxAh3Dd401nLLVr`, base `[Class Demo] Horizon DS`; `Design` = `Done`; Last Modified 2026-09-14T11:32:56Z) |
| Figma | component set `26:70` (page `💠 Button` `25:65`), usage `65:750`, file `r1CpQEYecqROS0oIOMlqAx` |
| Intent file | `src/components/button/button.intent.json`, `$commit` 76f2a37 |
| Production Storybook | https://horizon-design-system-delta.vercel.app/?path=/docs/components-button--docs |
| Verdict | **Cleared** |

This is a fresh review at `47c3d4d`. Nothing was carried over from the reviews at `5e52483` or
`c0d3af5`. The reviewer did not build, test, document, or write the intent
for this component.

Everything below was read from a worktree at the SHA above, after `npm ci` and
`npm run build:package` (both exit 0). Figma was read live on 2026-09-14 through
the Plugin API (`componentPropertyDefinitions` on the set).

## Gates
| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Intent written | Pass | `button.intent.json` is committed at the SHA (last changed in `4a89ebc`) and parses. `git log -1 --format=%H 47c3d4d -- src/components/button ':(exclude)*.intent.json'` → `9598a88`. `git merge-base --is-ancestor 9598a88 76f2a37` → exit 0. Button composes no other component: its only import is `react` (`button.tsx:19`). |
| 2 | Development `Completed` | Pass | Components `recxAh3Dd401nLLVr` → `Development` = `Completed`. Read this run, after confirming the base name `[Class Demo] Horizon DS`. |
| 3 | Tokens clean | Pass | `button.css` and `button.tsx` contain no hex, px or font literal outside comments. All 19 `var(--…)` names are semantic, and none is a key in `tokens/core.value.tokens.json`. Every open Button entry in `docs/design-gaps.md` has a `WAIVED FOR RELEASE` block directly under its heading: gap 2 (`:466`), gap 3 (`:485`), gap 4 (`:507`), gap 6 (`:546`), gap 7 (`:590`), gap 9 (`:614`), gap 8 (`:636`) and gap 10 (`:649`). Gaps 1 (`:427`) and 5 (`:526`) are marked resolved. No waiver is needed for a raw value or core token, because there are none. |
| 4 | Public surface decided | Pass | `src/index.ts:9` exports `Button`, `ButtonProps`, `ButtonVariant` and `ButtonState`. `ButtonProps` is built from `ButtonVariant`, `ButtonState` and React's `ButtonHTMLAttributes`. `dist/index.d.ts:1` and `dist/index.d.cts:1` expose the same four names. |
| 5 | Names final | Pass | Figma `26:70` `componentPropertyDefinitions`: `state` (VARIANT: enable, hover, focused, disabled) and `variant` (VARIANT: filled, outlined). Both are props (`button.tsx:30, 38`). Both Button entries in `docs/naming-conflicts.md` are marked resolved (`:114`, `:127`). |
| 6 | States complete | Pass | Figma has 8 variant rows: 26:71, 26:73, 26:82, 26:87, 26:98, 26:100, 26:102 and 26:104. Each has its own story (`button.stories.tsx:68–91`, `FilledEnable` … `OutlinedDisabled`). All 28 Staging Testing rows linked to `recxAh3Dd401nLLVr` read `Passed`, and none relies on a waiver. |
| 7 | Version meaning known | Pass | No `v*` tag exists (`git tag -l` and `git ls-remote --tags origin` are both empty), so this is the first release. The version is `package.json`'s, `0.1.0`, and everything public counts as Added. `npm view @theproductiveschedule/horizon-design-system` → E404, so the version is not on the registry. |

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Fields present and sourced | Pass | All eight fields are present. `use_when` has 5 entries, `dont_use_when` 3, `best_practice` 2, `placement` 2 (stories `InForm`, `InCard`, both at `button.stories.tsx:128, 148`), `pairs_with` 1, `required_tokens` 19 and `a11y` 14. The one non-null `alternative`, "overflow menus or as icon buttons", is a verbatim substring of its text. |
| 2 | Every `dont_use_when` names an alternative | Warning | 2 of 3 entries have `"alternative": null`. See Warnings. |
| 3 | `a11y` is specific | Pass | All 14 entries name a concrete element, attribute, key or rule. Every citation was opened and says what its entry says: `button.test.tsx:38, 113, 43, 84, 91, 118, 119, 130, 175`; `button.tsx:40`; `button.css:54` (selector; background at `:56`), `:82` (selector; border at `:84`), `:104`, `:108`. |
| 4 | `required_tokens` resolve | Pass | All 19 names are declared in `dist/tokens.css`. The 19 `var(--…)` names in `button.css` match the list exactly: none is missing and none is extra. |
| 5 | All variants covered | Pass | `variant_intent.variant` has `filled` and `outlined`. `variant_intent.state` has `enable`, `hover`, `focused` and `disabled`. Every value is non-null, and the keys match Figma's options and the unions `ButtonVariant` / `ButtonState` (`button.tsx:21–22`). |
| 6 | No two components claiming the same job | Pass | Button's "Use buttons for discrete actions." and Card's "Use a card to display content and actions on a single topic." describe different jobs: one action, and a container for one topic. Button names cards only as a place it sits. |

## Findings
None.

## Warnings
Check 2 only. These do not affect the verdict. The Designer can add an alternative in
Figma usage frame `65:750` (page `💠 Button`).
- "A button container’s width shouldn’t be narrower than its label text" (`alternative: null`)
- "Don’t wrap text. For maximum legibility, label text should remain on a single line." (`alternative: null`)

Notes (not failures):
- Several waived gaps stay open in Figma: gap 3 (outlined strokes bound to styles), gap 7 (dark
  focus directions), gap 8 (disabled filled label at about 1.27:1) and gap 9 (no manual keyboard pass).
- `docs/design-gaps.md` gap 2 says its naming-conflicts entry "stays open", but
  `docs/naming-conflicts.md:114` marks that entry resolved. Gate 5 reads the naming register.

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/button/` changes after that commit.
