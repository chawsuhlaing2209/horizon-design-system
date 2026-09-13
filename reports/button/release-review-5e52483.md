# 🧾 Release review — button

| | |
|---|---|
| Reviewed commit | `5e5248306c8edc71385189bfa4388e2ce0038090` (2026-09-13T19:41:28+06:30), origin/main |
| Registry `Development` at review | `Completed` (Components row `recxAh3Dd401nLLVr`, base `[Class Demo] Horizon DS`; `Design` = `Done`; Last Modified 2026-09-12T03:04:32Z) |
| Figma | component set `26:70` (page `💠 Button` `25:65`), usage `65:750`, file `r1CpQEYecqROS0oIOMlqAx` |
| Intent file | `src/components/button/button.intent.json`, `$commit` 108e8b0 |
| Production Storybook | https://horizon-design-system-delta.vercel.app/?path=/docs/components-button--docs |
| Verdict | **Blocked** |

Everything below was read from a worktree detached at the reviewed commit, after
`npm ci && npm run build:package` succeeded there. Figma was read live with read-only
Plugin API scripts.

## Gates
| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Intent written | Pass | Committed at the SHA and parses. Last non-intent commit to `src/components/button` is `c843d2a`; `git merge-base --is-ancestor c843d2a 108e8b0` → true. Button composes no other component (`button.tsx` imports only React types). |
| 2 | Development status `Completed` | Pass | Board read this run: `Development` = `Completed`, after confirming `baseName` = `[Class Demo] Horizon DS`. |
| 3 | Tokens clean | **Fail** | `button.css` has no raw hex, px or font value outside comments, and every `var(--…)` is semantic. But `docs/design-gaps.md` holds open Button entries 1, 2, 3, 6, 7, 9 and 10, each ending in a "Needed" decision. None of the 17 Button Staging Testing rows records a waiver in Context. |
| 4 | Public surface decided | Pass | `src/index.ts` exports `Button`, `ButtonProps`, `ButtonVariant` and `ButtonState`; `ButtonProps` is otherwise built from React's `ButtonHTMLAttributes` and `ReactNode`. `dist/index.d.ts` and `dist/index.d.cts` expose the same names. |
| 5 | Names final | **Fail** | Set `26:70` properties `state` and `variant` both exist as props (`button.tsx:25-27`). But `docs/naming-conflicts.md` holds two Button entries not marked resolved: "`state` names a token `focused` that carries `pressed`" ("**Status:** open — needs a designer's decision", line 90), and "`state="enable"` is not `"enabled"`" ("**Status:** open — cosmetic, low priority", line 103). |
| 6 | States complete | Pass | The 8 variants `26:71 … 26:104` (`state` × `variant`) each have a story: `FilledEnable`, `FilledHover`, `FilledPressed`, `FilledDisabled`, `OutlinedEnable`, `OutlinedHover`, `OutlinedPressed` and `OutlinedDisabled` (`button.stories.tsx:68-91`). All 17 linked Staging Testing rows read `Passed`, none of them waived. |
| 7 | Version meaning known | Pass | No `v*` tag locally or on origin, so this is the first release. The version is `package.json`'s `0.1.0`. `npm view @theproductiveschedule/horizon-design-system` → E404: `0.1.0` is not on the registry. |

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Fields present | **Fail** | All eight keys are present, and `use_when` (5) and `dont_use_when` (3) are non-empty. But `"placement": []` and `"pairs_with": []` are empty. `.claude/agents/release.md` step 4 classes an empty `placement` or `pairs_with` as a check failure. |
| 2 | Every `dont_use_when` names an alternative | **Fail** | `dont_use_when[1]` "A button container’s width shouldn’t be narrower than its label text" and `[2]` "Don’t wrap text. For maximum legibility, label text should remain on a single line." have `"alternative": null`. `[0]`'s "overflow menus or as icon buttons" is a verbatim substring of its text and passes. |
| 3 | `a11y` is specific | Pass | Opened all 13 citations. Each names a concrete element, attribute or focus rule, and each cited line says it: `button.test.tsx:38,113,43,84,91,98,118,119,130,175` and `button.css:104,105,109`. |
| 4 | `required_tokens` resolve | Pass | All 20 names are declared in `dist/tokens.css`. Every `var(--…)` in `button.css` is in the list, and every listed name is used there. |
| 5 | All variants covered | **Fail** | `variant_intent` values that are `null`: `variant.filled`, `variant.outlined`, `state.enable`, `state.hover` and `state.pressed`. Figma and code value lists agree: `variant` filled/outlined ↔ `ButtonVariant`; `state` enable/hover/pressed/disabled ↔ `ButtonState`. |
| 6 | No two components claiming the same job | Pass | The only other intent file is `card.intent.json`. Button's `use_when` names cards as a place a button goes, and card's lists buttons as content. That is containment, not the same job. |

## Findings
1. **Open design gaps without a recorded waiver** (gate 3): `docs/design-gaps.md` Button gaps 1 (no `state=focused` variant), 2 (pressed stroke bound to a `focused` token), 3 (outlined strokes are styles, not variables), 6 (outlined stroke alignment: 94×44 against 96×46), 7 (dark mode presses in opposite directions), 9 (Enter/Space activation unverified by anyone) and 10 (usage headings say "card"). Cleared by the Designer in Figma, or by a Human for 9 (a manual keyboard pass), or by a Human writing a waiver into the Staging Testing Context.
2. **Open naming entries** (gate 5): `docs/naming-conflicts.md:58-90` and `:94-103`. Cleared by the Designer, who renames in Figma, or by a Human, who marks each resolved.
3. **`dont_use_when` entries name no alternative** (check 2): `button.intent.json` `dont_use_when[1]`, `[2]`. Cleared by the Designer, in the Figma usage frame `65:750`. Never in the intent file.
4. **Null `variant_intent` values** (check 5): `variant.*`, `state.enable`, `state.hover`, `state.pressed`. Cleared by the Designer, in Figma.
5. **Empty `placement` and `pairs_with`** (check 1): `button.intent.json`. Cleared by the Designer, in Figma.

No fix is described as done, and none was applied.

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/button/` changes after that commit.
