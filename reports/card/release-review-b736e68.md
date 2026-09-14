# 🧾 Release review — card

| | |
|---|---|
| Reviewed commit | `b736e68da63ef555b9668b6bb36a5de76dd35139` (2026-09-14T19:28:34+06:30), origin/main |
| Registry `Development` at review | `Completed` (Components row `rec1y6kyai6F3FVWv`, base `[Class Demo] Horizon DS`; `Design` = `Done`; Last Modified 2026-09-14T12:51:56Z) |
| Figma | component set `34:317` (variants `12:1343` enable, `34:318` hover; page `💠 Card` `7:701`), usage `40:240`, file `r1CpQEYecqROS0oIOMlqAx`; composed sets `8:1251` cardLayout, `8:1186` cardImage, component `8:778` cardText |
| Intent file | `src/components/card/card.intent.json`, `$commit` 76f2a37 |
| Production Storybook | https://horizon-design-system-delta.vercel.app/?path=/docs/components-card--docs |
| Verdict | **Cleared** |

This is a fresh review at `b736e68`. Nothing was carried over from the reviews at `47c3d4d`,
`5e52483` or `c0d3af5`. The reviewer did not build, test, document, or write the intent for this
component.

Everything below was read from a worktree at the SHA above, after `npm ci` and
`npm run build:package` (both exit 0). Card composes `cardLayout`, `cardImage` and `cardText`
(`card.tsx:19–21`), and `cardImage` composes `iconContainer` (`cardImage.tsx:10`). Figma was read
live on 2026-09-14 through the Plugin API (`componentPropertyDefinitions` on each set). Between
`47c3d4d` and `b736e68` the only changes are `docs/design-gaps.md:171` (Card gap 6 heading) and the
two `47c3d4d` review reports; nothing under `src/` changed.

## Gates
| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Intent written | Pass | `card.intent.json` is committed at the SHA (blob `be69d7a`, last changed in `4a89ebc`) and parses. `git log -1 --format=%H b736e68 -- src/components/card src/components/cardLayout src/components/cardImage src/components/cardText src/components/iconContainer ':(exclude)*.intent.json'` → `9598a88`. `git merge-base --is-ancestor 9598a88 76f2a37` → exit 0. |
| 2 | Development `Completed` | Pass | Components `rec1y6kyai6F3FVWv` → `Development` = `Completed`. Read this run, after confirming the base name `[Class Demo] Horizon DS`. |
| 3 | Tokens clean | Pass | **Raw values and core tokens: all covered.** Each is marked `DESIGN GAP` in a comment and quoted exactly by a waiver. `cardImage.css:57` `--border-radius-4` (marked `:54`); `cardImage.css:111` `--spacing-1` and `:112` `--spacing-2` (marked `:108`). All three are quoted by the gap 2 waiver and its scope note (`docs/design-gaps.md:30`, `:36–38`). `cardImage.css:103` `top: 7px` and `:104` `right: 7px` (marked `:99`); `cardLayout.css:50` `10px` (marked `:48`); `cardLayout.css:58` `48px` (marked `:54`). All four are quoted by the gap 3 waiver dated 2026-09-14 (`:84–89`). No hex or font literal remains (the four `font:` declarations in `cardText.css:48, 59, 69, 77` are token references). Every other `var(--…)` is semantic. **Open gaps:** gaps 2 (`:30`), 3 (`:84`), 4 (`:125`), 5 (`:153`), 7 (`:189`), 8 (`:262`) and 11 (`:360`) carry `WAIVED FOR RELEASE` blocks. Gap 11 is also waived in the Context of Staging Testing row `recRKWuTGZeXeI8Ce`. Gaps 1 (`:15`), 6 (`:171`), 9 (`:279`), 10 (`:307`) and 12 (`:407`) are marked resolved in their headings. **Gap 6**, the finding at `47c3d4d`, now reads "The photo is an empty placeholder — RESOLVED, 2026-09-14 (product owner's decision)", from `13b5f76` (PR #51, merged by `chawsuhlaing2209`). The decision it rests on is recorded under it at `:179–183`. |
| 4 | Public surface decided | Pass | `src/index.ts:10–13` exports `Card`, `CardProps`, `CardState`, `CardLayoutProps`, `CardLayoutOrientation`, `CardImageProps`, `CardImageRatio`, `CardImageState` and `CardTextProps`. Every type `CardProps` is built from is exported. `dist/index.d.ts:2–5` and `dist/index.d.cts:2–5` expose the same names. `IconContainerProps` is not exported and no exported type references it. |
| 5 | Names final | Pass | Figma `34:317`: `state` → prop at `card.tsx:27`. Composed `8:1251`: `orientation`, `hasSlot#8:28` and `slot#8:25` (SLOT) → props at `cardLayout.tsx:19, 21, 23` and `card.tsx:35`. Composed `8:1186`: `state`, `ratio` and `overlayAction#8:22` → props at `cardImage.tsx:30, 21, 32`. Composed `8:778`: `metadata#8:16`, `review#8:17` and `price#8:18` → props at `cardText.tsx:11, 13, 15`. Both Card entries in `docs/naming-conflicts.md` are marked resolved (`:65`, `:78`). |
| 6 | States complete | Pass | Set `34:317` has two variant rows, `state=enable` (`12:1343`) and `state=hover` (`34:318`), with stories `StateEnable` and `StateHover` (`card.stories.tsx:243–244`). All 44 Staging Testing rows linked to `rec1y6kyai6F3FVWv` read `Passed`. Row `recRKWuTGZeXeI8Ce` counts only because its waiver is recorded: its Context reads "WAIVED BY HUMAN 2026-09-13 — not a measured pass". |
| 7 | Version meaning known | Pass | No `v*` tag exists locally or on origin, so this is the first release. The version is `package.json`'s, `0.1.0`, and everything public counts as Added. `npm view @theproductiveschedule/horizon-design-system` → E404, so it is not on the registry. |

## Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Fields present and sourced | Pass | All eight fields are present. `use_when` has 7 entries, `dont_use_when` 4, `best_practice` 7, `placement` 2 (stories `InResultsGrid` `card.stories.tsx:299`, `InListWithButton` `:318`), `pairs_with` 1, `required_tokens` 35 and `a11y` 18. No `alternative` is non-null, so none can be unsourced. |
| 2 | Every `dont_use_when` names an alternative | Warning | All 4 entries have `"alternative": null`. See Warnings. |
| 3 | `a11y` is specific | Pass | All 18 entries name a concrete element, attribute or rule. Every citation was opened and says what its entry says: `card.test.tsx:36` (`article.hds-card`), `:144` (tagName `BUTTON`), `:145` (type `button`), `:146` (aria-pressed `true`), `:147` (aria-label "Save to favourites", no label passed), `:148` (tabIndex 0), `:168` (uncontrolled toggle), `:182` (controlled value unchanged), `:191` (`'FILL' 1` after press), `:84` (no favourite button), `:94` (alt from `imageAlt`); `iconContainer.tsx:22` (`aria-hidden="true"`); `cardImage.css:138` (focus-visible selector; outline and offset at `:139–140`), `:92` (overlay `transition: none`); `cardImage.tsx:59` (`imageAlt = ''`), `:90` (empty `<div>`); `cardText.tsx:38` (`<p>` title); `card.css:32` (`transition: none`). |
| 4 | `required_tokens` resolve | Pass | All 35 names are declared in `dist/tokens.css`. The 35 non-`--hds-*` `var(--…)` names across `card.css`, `cardLayout.css`, `cardImage.css`, `cardText.css` and `iconContainer.css` match the list exactly: none missing, none extra. |
| 5 | All variants covered | Pass | Figma variant values: `34:317` state (enable, hover); `8:1251` orientation (horizontal, vertical); `8:1186` state (hover, idle) and ratio (4:3, 1:1). Each has a non-null key under `state`, `layout.orientation`, `image.state` and `image.ratio`. The keys match the unions `CardState`, `CardLayoutOrientation`, `CardImageState` and `CardImageRatio`. |
| 6 | No two components claiming the same job | Pass | Card's "Use a card to display content and actions on a single topic." and Button's "Use buttons for discrete actions." describe different jobs. |

## Findings
None.

## Warnings
Check 2 only. These do not affect the verdict. The Designer can add alternatives in Figma usage
frame `40:240` (page `💠 Card`).
- "Don’t scroll within a card to reveal information" (`alternative: null`)
- "Cards shouldn’t contain content that can be swiped, such as an image carousel or pagination. Also, swipe gestures shouldn’t cause portions of cards to detach upon swiping." (`alternative: null`)
- "Don’t let cards bump other elements out of the way. When a card is picked up, it appears in front of all elements, except app bars and navigation." (`alternative: null`)
- "On a mobile device, cards can't internally scroll, as it could cause two scroll bars to be displayed." (`alternative: null`)

Notes (not failures):
- Gap 6 was closed by a heading change. `13b5f76` was authored with Claude Code (PR #51 body) and
  merged by the human account `chawsuhlaing2209`. The product-owner decision it points to had been
  in the file since `d095822`. This review accepts the RESOLVED mark as recorded; it did not grant it.
- `variant_intent.image.state.idle` and `.hover` hold the same sentence, "Pins the overlay: `hover`
  forces it on, `idle` forces it off." Both are non-null.
- The registry `Figma` cell links node `12-1343`, the `state=enable` variant, not set `34:317`.
- In Figma, `8:1251` `hasSlot` and `8:1186` `overlayAction` default to `true`. In code `hasSlot`
  defaults to `false` (`cardLayout.tsx:32`).
- The iconButton set `8:1134` (idle, hover) sits inside cardImage but is not an exposed property of
  `8:1186`, so check 5 does not list it.
- In dark, `--color-border-default` equals `--color-bg-surface-secondary`, so the empty-image frame
  has no visible edge (QA row `reczCK9rid2IXW9Vs`).

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/card/`, `cardLayout/`, `cardImage/`, `cardText/` or
`iconContainer/` changes after that commit.
