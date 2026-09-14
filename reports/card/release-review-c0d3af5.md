# 🧾 Release review — card

| | |
|---|---|
| Reviewed commit | `c0d3af5251a90132da8d41a3e79cdb331c11ecc1` (2026-09-14T13:14:00+06:30), origin/main |
| Registry `Development` at review | `Completed` (Components row `rec1y6kyai6F3FVWv`, base `[Class Demo] Horizon DS`; `Design` = `Done`; Last Modified 2026-09-14T03:52:52Z) |
| Figma | component set `34:317` (variants `12:1343` enable, `34:318` hover; page `💠 Card` `7:701`), usage `40:240`, file `r1CpQEYecqROS0oIOMlqAx`; composed sets `8:1251` cardLayout, `8:1186` cardImage, component `8:778` cardText |
| Intent file | `src/components/card/card.intent.json`, `$commit` 5a692e1 |
| Production Storybook | https://horizon-design-system-delta.vercel.app/?path=/docs/components-card--docs |
| Verdict | **Blocked** |

A fresh review at `c0d3af5`. No result from the earlier review at `5e52483` was
carried over. The reviewer did not build, test, document, or write the intent
for this component.

Everything below was read from a worktree at the SHA above, after `npm ci` and
`npm run build:package` (both exit 0). Card composes `cardLayout`, `cardImage` and
`cardText`, and `cardImage` composes `iconContainer`: the imports at
`card.tsx:19–21` and `cardImage.tsx:10`.

## Gates
| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Intent written | Pass | `card.intent.json` is committed at the SHA (last changed in `3a9175f`) and parses. `git log -1 --format=%H c0d3af5 -- src/components/card src/components/cardLayout src/components/cardImage src/components/cardText src/components/iconContainer ':(exclude)*.intent.json'` → `21140e1` ("Card: give the favourite button its hover state"). `git merge-base --is-ancestor 21140e1 5a692e1` → exit 0. |
| 2 | Development `Completed` | Pass | Components `rec1y6kyai6F3FVWv` → `Development` = `Completed`, read this run after confirming base name `[Class Demo] Horizon DS`. |
| 3 | Tokens clean | **Fail** | **Raw px:** `cardLayout.css:50` `gap: 10px;`, `cardLayout.css:57` `min-height: 46px;`, `cardImage.css:100` `top: 7px;`, `cardImage.css:101` `right: 6.5px;`. **Core tokens** (keys in `tokens/core.value.tokens.json`): `cardImage.css:54` `--border-radius-4`, `cardImage.css:108` `--spacing-1`, `cardImage.css:109` `--spacing-2`, `iconContainer.css:9` `--border-radius-2`. **Raw font values:** `cardText.css:44, 55, 65, 73` append `system-ui, sans-serif` to the `font` token. Design gaps 2 and 3 carry waivers, but a waiver does not lift this rule. **Open gap with no waiver:** Card gap 6 (`docs/design-gaps.md:132`, "The photo is an empty placeholder") has no waiver and is not marked resolved. Its own text says "Not a defect". Gaps 4, 5, 7, 8 and 11 are waived. Gap 11 is also waived in the Context of Staging Testing row `recRKWuTGZeXeI8Ce`. Gaps 1, 9 and 10 are marked resolved. |
| 4 | Public surface decided | Pass | `src/index.ts:10–13` exports `Card`, `CardProps`, `CardState`, `CardLayoutProps`, `CardLayoutOrientation`, `CardImageProps`, `CardImageRatio`, `CardImageState` and `CardTextProps`. Every type `CardProps` is built from is exported. `dist/index.d.ts` exposes the same names. |
| 5 | Names final | **Fail** | Figma `34:317` has `state`, which is a prop at `card.tsx:27`. Composed `8:1186` has `state`, `ratio` and `overlayAction#8:22`, all props at `cardImage.tsx:17,26,28`. Composed `8:778` has `metadata`, `review` and `price`, all props. Composed `8:1251` has `orientation` and `hasSlot#8:28`, which are props, but also a SLOT property named **`Slot`** (`Slot#8:25`). The code prop is **`slot`** (`cardLayout.tsx:19`, `card.tsx:35`). Case differs, so the names do not match, and `docs/naming-conflicts.md` has no entry for it. The two Card entries in `docs/naming-conflicts.md` are resolved (lines 65, 101). |
| 6 | States complete | Pass | Set `34:317` has two variant rows, `state=enable` and `state=hover`. Their stories are `StateEnable` and `StateHover` (`card.stories.tsx:243–244`). All 38 Staging Testing rows linked to `rec1y6kyai6F3FVWv` read `Passed`. Row `recRKWuTGZeXeI8Ce` counts only on its recorded waiver: its Context says "WAIVED BY HUMAN 2026-09-13 — not a measured pass". |
| 7 | Version meaning known | Pass | No `v*` tag exists locally or on origin, so this is the first release. The version is `package.json`'s: `0.1.0`. `npm view @theproductiveschedule/horizon-design-system` → 404, so the version is not on the registry. |

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Fields present | Pass | All eight fields are present. `use_when` has 7 entries and `dont_use_when` has 4. `placement` and `pairs_with` are present but empty. |
| 2 | Every `dont_use_when` names an alternative | **Fail** | All 4 entries have `"alternative": null`: "Don’t scroll within a card to reveal information" (line 21); "Cards shouldn’t contain content that can be swiped, such as an image carousel or pagination. …" (line 25); "Don’t let cards bump other elements out of the way. …" (line 29); "On a mobile device, cards can't internally scroll, as it could cause two scroll bars to be displayed." (line 33). |
| 3 | `a11y` specific | Pass | All 18 entries name a concrete element, attribute or rule. Every citation was opened, and each says what its entry says: `card.test.tsx:36, 144, 145, 146, 147, 148, 168, 182, 191, 84, 94`; `iconContainer.tsx:22`; `cardImage.css:135, 89`; `cardImage.tsx:55, 86`; `cardText.tsx:38`; `card.css:32`. |
| 4 | `required_tokens` resolve | Pass | All 36 names are declared in `dist/tokens.css`. The 36 non-`--hds-*` `var(--…)` names across `card.css`, `cardLayout.css`, `cardImage.css`, `cardText.css` and `iconContainer.css` match the list exactly. |
| 5 | All variants covered | **Fail** | Keys are present for every Figma variant value (`state`, `layout.orientation`, `image.ratio`, `image.state`), and they match the union types `CardState`, `CardLayoutOrientation`, `CardImageRatio` and `CardImageState`. But five values are `null`: `state.enable`, `layout.orientation.vertical`, `layout.orientation.horizontal`, `image.ratio.4:3` and `image.ratio.1:1` (lines 48–57). |
| 6 | No two components claiming the same job | Pass | Card's "Use a card to display content and actions on a single topic." and Button's "Buttons communicate actions that people can take. …" describe different jobs: a container for one topic, and a single action. |

## Findings
1. **Gate 3: raw px in component CSS.** `cardLayout.css:50` (10px), `:57` (46px); `cardImage.css:100` (7px), `:101` (6.5px). Waived as gap 3, but this rule still fails. **Who:** Designer (move the values onto the scale or add tokens), then Engineer.
2. **Gate 3: core tokens in component CSS.** `cardImage.css:54` `--border-radius-4`, `:108` `--spacing-1`, `:109` `--spacing-2`; `iconContainer.css:9` `--border-radius-2`. Waived as gap 2, but this rule still fails. **Who:** Designer (bind semantic tokens in Figma), then Engineer.
3. **Gate 3: raw font family values.** `cardText.css:44, 55, 65, 73` append `system-ui, sans-serif` to each `font:` token. There is no design-gap entry or waiver for this. **Who:** Engineer.
4. **Gate 3: Card gap 6 is open with no waiver.** `docs/design-gaps.md:132` (empty photo placeholder). Mark it not-a-gap or resolved, or record a waiver. **Who:** Human.
5. **Gate 5: Figma `Slot` has no prop of the same name.** Figma `8:1251` property `Slot#8:25`; code prop `slot` (`cardLayout.tsx:19`, `card.tsx:35`). Either rename in Figma, or log and resolve the entry in `docs/naming-conflicts.md`. **Who:** Designer or Human.
6. **Check 2: all four `dont_use_when` entries name no alternative.** `card.intent.json:21, 25, 29, 33`. Figma Usage `40:240` needs each line to name what to use instead. **Who:** Designer, then doc-generator.
7. **Check 5: five `variant_intent` values are `null`.** `card.intent.json:48–57`. **Who:** Designer, then doc-generator.

No fix is described as done, and none was applied.

Notes (not failures):
- The registry `Figma` cell links node `12-1343`, the `state=enable` variant, not set `34:317`.
- In Figma, `8:1251` `hasSlot` defaults to `true`. In code, `hasSlot` defaults to `false` (`cardLayout.tsx:28`).
- No story pins cardImage `state=idle, ratio=1:1` (8:1187). `Ratio1x1` leaves the state unpinned (`auto`). Staging rows `recxvC0teYOg6Ya5w` and `recH73iwIstwR85ZL` test that row.
- In dark, `--color-border-default` equals `--color-bg-surface-secondary`, as QA noted in `recisNldJMxTS7P8O`.

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/card/`, `cardLayout/`, `cardImage/`, `cardText/` or
`iconContainer/` changes after that commit.
