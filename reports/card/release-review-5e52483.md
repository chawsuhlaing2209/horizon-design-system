# 🧾 Release review — card

| | |
|---|---|
| Reviewed commit | `5e5248306c8edc71385189bfa4388e2ce0038090` (2026-09-13T19:41:28+06:30), origin/main |
| Registry `Development` at review | `Completed` (Components row `rec1y6kyai6F3FVWv`, base `[Class Demo] Horizon DS`; `Design` = `Done`; Last Modified 2026-09-13T02:36:44Z) |
| Figma | component set `34:317` (page `💠 Card` `7:701`), usage `40:240`, file `r1CpQEYecqROS0oIOMlqAx` |
| Intent file | `src/components/card/card.intent.json`, `$commit` 108e8b0 |
| Production Storybook | https://horizon-design-system-delta.vercel.app/?path=/docs/components-card--docs |
| Verdict | **Blocked** |

Everything below was read from a worktree detached at the reviewed commit, after
`npm ci && npm run build:package` succeeded there. Figma was read live with read-only
Plugin API scripts.

## Gates
| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Intent written | Pass | Committed at the SHA and parses. Last non-intent commit to `src/components/{card,cardContainer,cardImage,cardLayout,cardText,iconContainer}` is `c843d2a`; `git merge-base --is-ancestor c843d2a 108e8b0` → true. |
| 2 | Development status `Completed` | Pass | Board read this run: `Development` = `Completed`, after confirming `baseName` = `[Class Demo] Horizon DS`. |
| 3 | Tokens clean | **Fail** | Raw px: `cardImage.css:101` `top: 7px`, `:102` `right: 6.5px`, `cardLayout.css:12` `--hds-card-layout-gap: 10px`, `:52` `min-height: 46px`. Core tokens: `cardImage.css:27,58` `--border-radius-4`, `:109` `--spacing-1`, `:110` `--spacing-2`, `iconContainer.css:9` `--border-radius-2`. Open entries in `docs/design-gaps.md` with no waiver in any Card Staging Testing row: gaps 1, 2, 3, 4, 5, 7, 8, 9. Only gap 11 is waived (row `recRKWuTGZeXeI8Ce`). |
| 4 | Public surface decided | Pass | `src/index.ts` exports `Card`, `CardProps`, and the types `CardProps` is built from (`CardContainerProps`, `CardContainerState`, `CardLayoutProps`, `CardLayoutOrientation`, `CardImageProps`, `CardImageRatio`, `CardImageState`, `CardTextProps`). `dist/index.d.ts` and `dist/index.d.cts` expose the same names. |
| 5 | Names final | **Fail** | `componentPropertyDefinitions` on set `34:317` returns one property, `state` (`enable`, `hover`). `CardProps` has no prop named `state`: its keys are `container`, `layout`, `image`, `text` and `slot`, and the value is reachable only as `container.state`. `docs/naming-conflicts.md` marks the Card `state` entry resolved, but that resolution addresses it through cardContainer `8:804`, which `getNodeByIdAsync('8:804')` returns as null in the file today. |
| 6 | States complete | Pass | Set `34:317` variants `12:1343 state=enable` and `34:318 state=hover` have stories `StateEnable` and `StateHover` (`card.stories.tsx:244-245`). All 34 linked Staging Testing rows read `Passed`. Row `recRKWuTGZeXeI8Ce` is a waiver, not a measured pass, and carries the waiver in Context. |
| 7 | Version meaning known | Pass | No `v*` tag locally or on origin, so this is the first release. The version is `package.json`'s `0.1.0`. `npm view @theproductiveschedule/horizon-design-system` → E404: the package, and so `0.1.0`, is not on the registry. |

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Fields present | **Fail** | All eight keys are present, and `use_when` (7) and `dont_use_when` (4) are non-empty. But `"placement": []` and `"pairs_with": []` are empty. `.claude/agents/release.md` step 4 classes an empty `placement` or `pairs_with` as a check failure. |
| 2 | Every `dont_use_when` names an alternative | **Fail** | All four entries have `"alternative": null`: "Don’t scroll within a card to reveal information"; "Cards shouldn’t contain content that can be swiped, …"; "Don’t let cards bump other elements out of the way. …"; "On a mobile device, cards can't internally scroll, …". |
| 3 | `a11y` is specific | Pass | Opened all 18 citations. Each names a concrete element, attribute, label or focus rule, and each cited line says it: `cardContainer.tsx:21` `<article>`, `card.test.tsx:142-146,166,180,79,89`, `iconContainer.tsx:22` `aria-hidden="true"`, `cardImage.tsx:55,86`, `cardImage.css:129,130,93`, `cardText.tsx:38`, `cardContainer.css:29`. |
| 4 | `required_tokens` resolve | Pass | All 36 names are declared in `dist/tokens.css` (a negative control confirmed the check detects a missing name). Every `var(--…)` in the five CSS files is in the list, leaving `--hds-*` aside, and every listed name is used. |
| 5 | All variants covered | **Fail** | `variant_intent` values that are `null`: `container.state.enable`, `layout.orientation.vertical`, `layout.orientation.horizontal`, `image.ratio.3:2` and `image.ratio.1:1`. Figma and code value lists agree (set `34:317` `state` ↔ `CardContainerState`; `8:1251` `orientation` ↔ `CardLayoutOrientation`; `8:1186` `state`/`ratio` ↔ `CardImageState`/`CardImageRatio`). |
| 6 | No two components claiming the same job | Pass | The only other intent file is `button.intent.json`. Its `use_when` places buttons inside cards ("… Forms, Cards, Toolbars"), and card's "Contents can include … buttons" lists them as content. That is containment, not the same job. |

## Findings
1. **Raw px values in component CSS** (gate 3): `src/components/cardImage/cardImage.css:101-102`, `src/components/cardLayout/cardLayout.css:12,52`. Recorded as design gap 3. Cleared by the Designer, who moves the values onto the scale or adds tokens, then the Engineer. Or a Human records a waiver.
2. **Core tokens used in a component** (gate 3): `cardImage.css:27,58,109,110`, `iconContainer.css:9`. Recorded as design gap 2. Cleared by the Designer, who adds the semantic radius and rebinds the insets, then the Engineer. Or a Human records a waiver.
3. **Open design gaps without a recorded waiver** (gate 3): `docs/design-gaps.md` Card gaps 1 (`ratio=3:2` renders 4:3), 4 (pressed/focus/disabled not designed), 5 (unfavourited heart), 7 (Figma `color/text/accent` still `#f0932b` in light), 8 (overlay strength has no token) and 9 (metadata reserve unconfirmed). None of the 34 Card Staging Testing rows records a waiver for them. Cleared by the Designer, or a Human writing the waiver.
4. **Figma property `state` on set `34:317` has no same-named prop on `Card`** (gate 5): `src/components/card/card.tsx:24-35`. The naming decision in `docs/naming-conflicts.md` is anchored on node `8:804`, which is no longer in the file. Cleared by a Human, who decides whether `container.state` satisfies the name rule and updates the register, or by the Engineer.
5. **`dont_use_when` entries name no alternative** (check 2): all four, `card.intent.json` `dont_use_when[0..3]`. Cleared by the Designer, in the Figma usage frame `40:240`. Never in the intent file.
6. **Null `variant_intent` values** (check 5): `container.state.enable`, `layout.orientation.*`, `image.ratio.*`. Cleared by the Designer, in Figma.
7. **Empty `placement` and `pairs_with`** (check 1): `card.intent.json`. Cleared by the Designer, in Figma.

No fix is described as done, and none was applied.

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/card/`, or in a component it composes (`cardContainer`, `cardImage`,
`cardLayout`, `cardText`, `iconContainer`), changes after that commit.
