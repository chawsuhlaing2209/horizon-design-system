# 🧾 Release review — button

| | |
|---|---|
| Reviewed commit | `c0d3af5251a90132da8d41a3e79cdb331c11ecc1` (2026-09-14T13:14:00+06:30), origin/main |
| Registry `Development` at review | `Completed` (Components row `recxAh3Dd401nLLVr`, base `[Class Demo] Horizon DS`; `Design` = `Done`; Last Modified 2026-09-14T02:52:49Z) |
| Figma | component set `26:70` (page `💠 Button` `25:65`), usage `65:750`, file `r1CpQEYecqROS0oIOMlqAx` |
| Intent file | `src/components/button/button.intent.json`, `$commit` 5a692e1 |
| Production Storybook | https://horizon-design-system-delta.vercel.app/?path=/docs/components-button--docs |
| Verdict | **Blocked** |

A fresh review at `c0d3af5`. No result from the earlier review at `5e52483` was
carried over. The reviewer did not build, test, document, or write the intent
for this component.

Everything below was read from a worktree at the SHA above, after `npm ci` and
`npm run build:package` (both exit 0).

## Gates
| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Intent written | Pass | `button.intent.json` is committed at the SHA (last changed in `3a9175f`) and parses. `git log -1 --format=%H c0d3af5 -- src/components/button ':(exclude)*.intent.json'` → `fbf19cf` (#32). `git merge-base --is-ancestor fbf19cf 5a692e1` → exit 0. Button composes no other component. |
| 2 | Development `Completed` | Pass | Components `recxAh3Dd401nLLVr` → `Development` = `Completed`, read this run after confirming base name `[Class Demo] Horizon DS`. |
| 3 | Tokens clean | **Fail** | The CSS is clean. `button.css` has no hex, px or font literal, and all 19 `var(--…)` names are semantic: none is a key in `tokens/core.value.tokens.json`. `button.tsx` has none either. But three open entries in `docs/design-gaps.md` have no waiver, and none of them is marked resolved: Button gap 4 (line 446, "No `size` property, no `loading` state, no icon slot"), gap 9 (line 549, "Coverage gap: Enter / Space activation is unverified by anyone", which asks for a manual keyboard pass before release), and gap 8 (line 566, the disabled filled label at about 1.27:1). The waiver commit `2c4ff1a` lists gap 9 as "Not waived". Nothing in any Button Staging Testing row's Context waives these gaps. |
| 4 | Public surface decided | Pass | `src/index.ts:9` exports `Button`, `ButtonProps`, `ButtonVariant` and `ButtonState`. `ButtonProps` is built from `ButtonVariant`, `ButtonState` and React's `ButtonHTMLAttributes`. `dist/index.d.ts` exposes the same four names. |
| 5 | Names final | Pass | Figma `26:70` `componentPropertyDefinitions` has `state` (VARIANT: enable, hover, focused, disabled) and `variant` (VARIANT: filled, outlined). Both are props at `button.tsx:26,28`. `docs/naming-conflicts.md` has two Button entries, and both are marked resolved (lines 101 and 114). |
| 6 | States complete | Pass | Figma has 8 variant rows (26:71, 26:73, 26:82, 26:87, 26:98, 26:100, 26:102, 26:104). Each has its own story at `button.stories.tsx:67–90`. All 26 Staging Testing rows linked to `recxAh3Dd401nLLVr` read `Passed`, and none relies on a waiver. |
| 7 | Version meaning known | Pass | No `v*` tag exists locally or on origin (`git tag -l` and `git ls-remote --tags origin` are both empty), so this is the first release. The version is `package.json`'s: `0.1.0`. `npm view @theproductiveschedule/horizon-design-system` → 404, so the version is not on the registry. |

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Fields present | Pass | All eight fields are present. `use_when` has 5 entries and `dont_use_when` has 3. `placement` and `pairs_with` are present but empty, which this check allows. |
| 2 | Every `dont_use_when` names an alternative | **Fail** | 2 of 3 entries have `"alternative": null`: "A button container’s width shouldn’t be narrower than its label text" (line 23) and "Don’t wrap text. For maximum legibility, label text should remain on a single line." (line 27). Entry 1's alternative, "overflow menus or as icon buttons", is a verbatim substring of its text. |
| 3 | `a11y` specific | Pass | All 14 entries name a concrete element, attribute, key or rule. Every citation was opened, and each says what its entry says: `button.test.tsx:38, 113, 43, 84, 91, 118, 119, 130, 175`; `button.tsx:30`; `button.css:54, 82, 104, 108`. |
| 4 | `required_tokens` resolve | Pass | All 19 names are declared in `dist/tokens.css`. The 19 `var(--…)` names in `button.css` match the list exactly: none is missing and none is extra. |
| 5 | All variants covered | **Fail** | Every Figma value has a key, and the keys match `ButtonVariant` and `ButtonState`. But five values are `null`: `variant.filled`, `variant.outlined`, `state.enable`, `state.hover` and `state.focused` (lines 37–43). |
| 6 | No two components claiming the same job | Pass | Button's "Buttons communicate actions that people can take. They are typically placed throughout the UI, in places like: Dialogs, Modal windows, Forms, Cards, Toolbars" and Card's "Use a card to display content and actions on a single topic." describe different jobs: a single action, and a container for one topic. Button names cards only as a place it sits. |

## Findings
1. **Gate 3: Button gap 4 is open with no waiver.** `docs/design-gaps.md:446`. There is no `size` property, no `loading` state and no icon slot. Clear it with a `WAIVED FOR RELEASE` block recorded by a person, or by resolving the gap in Figma. **Who:** Human (product owner) or Designer.
2. **Gate 3: Button gap 9 is open with no waiver.** `docs/design-gaps.md:549`. Nobody has verified Enter/Space activation, and the entry asks for "one manual keyboard pass by a human before release". The Staging Testing rows record automated key events only. Commit `2c4ff1a` names this gap as not waived. **Who:** Human (a manual keyboard pass, or a recorded waiver).
3. **Gate 3: Button gap 8 is open with no waiver.** `docs/design-gaps.md:566`. The disabled filled label is about 1.27:1, and the entry is headed "Observation". Mark it resolved or not-a-gap, or record a waiver. **Who:** Human or Designer.
4. **Check 2: two `dont_use_when` entries name no alternative.** `button.intent.json:23` and `:27`. Figma node `65:750` (Usage, page `💠 Button`) needs each line to name what to use instead. The intent file is then re-transposed. **Who:** Designer, then doc-generator.
5. **Check 5: five `variant_intent` values are `null`.** `button.intent.json:37–43`. Figma documents no purpose for `filled`, `outlined`, `enable`, `hover` or `focused`. **Who:** Designer, then doc-generator.

No fix is described as done, and none was applied.

Notes (not failures): on outlined, focus changes only the 1px stroke and draws no ring (design-gaps Button gap 1, resolved). `--color-text-link` is 4.12:1 on the dark surface (design-gaps "Token contrast"). That entry is a token-set entry, not a Button entry.

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/button/` changes after that commit.
