---
name: release-review
description: Review one component for release against seven gates and six checks, at one pinned commit, and deliver a verdict of Cleared or Blocked with a report. Never edits an intent file, never fixes what it finds, never publishes.
---

# Review a component for release

## When to use this
Use this when a component's `Development` reads `Completed` and someone wants it
released. The verdict and the report link are two of the three cells that move
the registry to `Released` (precedence 4). The third is `Astro Link`.

**This is the release agent's skill** (`.claude/agents/release.md`). The registry
gives `Release Review` and `Release Verdict` to the release agent and to nobody
else. Do not run it on a component
you built, tested, wrote the intent file for, or documented — not in this session
and not in the commits under review. A review by an author is not a review.

**Cleared is not approval.** It says the component passed the gates, not that it
should ship. A human approves (`CLAUDE.md`).

The review reads, runs checks, and reports. It **never edits an intent file,
never fixes what it finds, and never publishes.** Publishing is a later step the
release agent takes only after a person approves the version. A finding names where it is and
who can clear it. The repair belongs to someone else.

## Steps

### 1 · Pin the commit
Review exactly one commit. By default that is the tip of `origin/main`, because
releases publish from main only. Record its full SHA and commit date.

Work in a worktree at that SHA, so nothing on the local branch leaks in:

```
git fetch origin
git worktree add <scratchpad>/review-<short> <sha>
cd <scratchpad>/review-<short> && npm ci && npm run build:package
```

Every file read, every command run, and every quote in the report comes from that
worktree. "Built output" means its `dist/`.

**Check:** the report header can name one full SHA, and no step read the main
checkout.

### 2 · The seven gates
A gate passes or fails. Evidence you could not get is a fail: write down what was
missing, not what was probably true.

| # | Gate | Passes when |
|---|---|---|
| 1 | **Intent written** | `src/components/<name>/<name>.intent.json` is committed at the SHA and parses. Its sources are no newer than its `$commit`: the last commit that changed the component's source — its folder and the folder of every component it composes, **leaving out intent files** — is `$commit` itself or an ancestor of it. `git log -1 --format=%H <sha> -- src/components/<name> <composed folders> ':(exclude)*.intent.json'`, then `git merge-base --is-ancestor <that> <$commit>`. Intent files are left out because committing one is a commit to the folder: counted, it would make every intent file stale the moment it lands. An intent file behind its code describes a component that no longer exists. |
| 2 | **Development status `Completed`** | The registry's `Development` for this component reads exactly `Completed`. Resolve the base through `.claude/registry.local.json` and confirm `baseName` first (see `registry` — sibling bases share table IDs). `Released` is not `Completed`: it was reviewed already, so find out why you were asked again. |
| 3 | **Tokens clean** | No raw hex, px, or font value in the component's TSX or CSS, nor in the subcomponents it composes (`CLAUDE.md`). Every `var(--…)` is a semantic token, not a core one (`--spacing-1`, `--border-radius-4`, `--color-blue-600`). Every open entry for the component in `docs/design-gaps.md` has a **human-recorded waiver**, in one of two places: a `WAIVED FOR RELEASE` block directly under the gap's heading in `docs/design-gaps.md`, committed at the reviewed SHA; or the product-owner decision written into a Staging Testing row's Context, as Card's gap 11 has. A waiver can also cover a raw value or core token, but only one it names: the waived gap must quote that exact value or token (`10px`, `--spacing-1`), and the CSS or TSX line must be marked `DESIGN GAP` in its comment. Cite both the waiver and the line. A raw value or core token that no waiver names still fails, and so does one a waiver names under a different value (a waiver for `46px` does not cover `48px`). An open gap with no waiver fails. You never grant a waiver. |
| 4 | **Public surface decided** | The component is exported from `src/index.ts` with its prop types. The types its props are built from are exported too. `dist/index.d.ts` exposes the same names. |
| 5 | **Names final** | Every property in the Figma component set (`get_metadata` on the node, or `componentPropertyDefinitions` on the set) has a prop of the same name. `docs/naming-conflicts.md` holds no entry for the component that is not marked resolved. |
| 6 | **States complete** | Every variant × state row in the Figma component set has a story, and every Staging Testing row for the component reads `Passed`. A waived row counts only with its waiver recorded. |
| 7 | **Version meaning known** | The change since the last release tag (`git diff v<last>..<sha> -- src/`) is classified by what it does to the public surface: removed or renamed export or prop → breaking, added → feature, neither → fix. 0.x counts a breaking change as a minor bump. The version that class forces is named in the report, with the change that forces it, and is not on the registry (`npm view <name>@<version>`). `package.json` does not have to say it yet: the version is proposed after review and bumped after approval. With no earlier tag, the release is the first, its version is `package.json`'s, and the report says so. |

**Check:** every gate has a result and the evidence behind it — a command and its
output, a file and line, or a registry value read back.

### 3 · The six checks
Run these on the intent file. They find problems; the report records them. The
intent file stays exactly as it was.

Check 2 is the one **warning**: its result is `Pass` or `Warning`, never `Fail`, so
it never blocks. Some things have no alternative to name, and an honest "don't"
with nothing after it is still guidance. Every other check is `Pass` or `Fail`.

| # | Check | Fails when |
|---|---|---|
| 1 | **Fields present and sourced** | A non-null `alternative` is not a verbatim substring of its `text`. Any of `use_when`, `dont_use_when`, `best_practice`, `variant_intent`, `placement`, `pairs_with`, `required_tokens`, `a11y` is missing. An empty `use_when` or `dont_use_when` also fails unless `docs/design-gaps.md` records the missing usage region. |
| 2 | **Every `dont_use_when` names an alternative** *(warning)* | **Warning** when any entry's `alternative` is `null`: list each one, and name the Figma usage frame where the Designer can add one if it exists. Never blocks. A non-null `alternative` that is not a verbatim substring of its `text` is a different problem, invented content, and that is a **Fail** of check 1. The fix is in Figma, never in the intent file. |
| 3 | **`a11y` is specific, not generic** | An entry names no concrete element, attribute, label, key, or focus rule. Or its cited `file:line` does not say what the entry says — open every citation. |
| 4 | **`required_tokens` resolve in the built output** | A name in the list is not declared in `dist/tokens.css`. Or a `var(--…)` in the component's CSS is missing from the list, leaving `--hds-*` private properties aside. A colour token declared in `:root` but not in `[data-theme="dark"]` is not a failure: the dark block holds only the colours that change. |
| 5 | **All variants covered** | A value of a Figma variant property has no key in `variant_intent`, or its value is `null`. The code's union types are the second list: a value in one list and not the other is also a failure. |
| 6 | **No two components claiming the same job** | This component's `use_when` and another intent file's `use_when` describe the same content or action for the same situation, and neither file's `dont_use_when` points at the other. Quote both lines. Deciding which component owns the job is a human's call, not yours. |

**Check:** every check names the entries it looked at, and every failure quotes
the entry.

### 4 · The verdict
**Cleared** only when all seven gates pass and checks 1, 3, 4, 5 and 6 pass. Check 2
may read `Warning` on a Cleared review; its warnings are listed in the report and
the card. Anything else is **Blocked**. There is no "Cleared pending": a
condition on a clearance is a block. A check 2 warning is not a condition, and
nothing has to happen before the component ships.

### 5 · Write the report
`reports/<name>/release-review-<short SHA>.md`, written from the worktree's
findings.

```
# 🧾 Release review — card

| | |
|---|---|
| Reviewed commit | `<full SHA>` (<commit date>), origin/main |
| Registry `Development` at review | `Completed` |
| Figma | `12:1343`, usage `40:240`, file `r1CpQEYecqROS0oIOMlqAx` |
| Intent file | `src/components/card/card.intent.json`, `$commit` <short> |
| Verdict | **<Cleared or Blocked>** |

## Gates
| # | Gate | Result | Evidence |

## Checks
| # | Check | Result | Evidence |

## Findings
One per failure: what, where (file:line, node, record), and who can clear it
(Designer, Engineer, Human). No fix is described as done, and none is applied.

## Warnings
Check 2 only: each `dont_use_when` entry with no alternative, quoted. These do not
affect the verdict.

## Staleness
This review holds only for the commit above. It is stale once anything in
`src/components/<name>/`, or in a component it composes, changes after that commit.
```

Commit the report alone on `review/<name>-<short SHA>`, branched from
`origin/staging`, and open a PR into `staging`. The report is the only file in
that commit.

Then **merge that PR** with a merge commit, without waiting for anyone. It holds
nothing but the report, and the report is the record. Merge only your own
review-report PR, and only after GitHub reports it mergeable. If it cannot merge
(a conflict, a failed check), stop: write no cells, and say what blocked it.

**Check:** the report names the reviewed SHA in its filename and its header, and
the verdict matches the tables.

### 6 · Record it on the board — both cells or neither
Once the report's PR is merged:

1. `Release Review` ← the report's permalink, pinned to the commit that added it:
   `https://github.com/chawsuhlaing2209/horizon-design-system/blob/<report commit SHA>/reports/<name>/release-review-<short>.md`.
   **Never a branch URL** — a branch moves, and the link would stop pointing at
   this review.
2. `Release Verdict` ← `Cleared` or `Blocked`.
3. Read both cells back. If either write failed, clear the one that landed and
   report it. A verdict without its report, or a report without its verdict, is
   the half-record the registry forbids.
4. **GitHub Commits** ← one new row for the report commit, taken from `git log` on
   that commit, never typed from memory:

   | Column | Value |
   |---|---|
   | Commit Hash | the short SHA |
   | Message | the commit subject |
   | Author | the commit author |
   | Date Committed | the author date, in UTC |
   | Link to Components | the reviewed component |
   | Files Changed | `reports/<name>/release-review-<short>.md` |
   | Commit URL | `https://github.com/chawsuhlaing2209/horizon-design-system/commit/<full SHA>` |
   | Commit Type | `Documentation` |

   Read the row back. Creating it adds the row to the component's `GitHub
   Commits` cell by itself, since that cell is the other side of the same link.
   Never write that cell directly, and never edit or remove a row you did not
   create. If the row fails, the two cells above still stand: report the missing
   row, do not clear the verdict.

Nothing computes staleness (registry Flag 5). A stale review looks exactly like a
fresh one, and the report's header date is the only defence.

Then remove the worktree.

```
🧾 Release review · <name> · <Cleared | Blocked>  @ <short SHA>
gates  <n>/7  (<# gate>: <the evidence that failed it>)
checks <n>/6  (<# check>: <the entry that failed it>)
warnings <n>  (check 2: <n> dont_use_when with no alternative)
report → <permalink> · PR #<n> merged into staging (<merge SHA>)
Release Review, Release Verdict → written, read back
GitHub Commits → row for <short SHA> written, read back
```

## Judgement — what is and is not a finding
- **A "don't" with no alternative is a warning, not a block.** "Don’t scroll
  within a card to reveal information" names no alternative. Check 2 reports it
  as a warning, and the verdict ignores it. If the Designer adds an alternative,
  it goes in Figma. The intent file did its job by copying it.
- **An empty field with a recorded gap is honest, but it still blocks.** Check 1
  passes, because the field is present and the gap is on record. The gates and the
  other checks do not treat empty as covered.
- **A waived design gap is not a clean token.** It passes gate 3 only because a
  human wrote the waiver down, and a raw value or core token passes only if that
  waiver names it exactly. Cite the waiver and the line.
- **The Figma status labels are not the registry.** The documentation frame's
  "Development Completed" is typed by a person. Gate 2 reads the board.

## References
- The board contract, owners, and flags: `.claude/skills/registry/SKILL.md`
- What an intent file is and where its fields come from: `.claude/skills/component-intent/SKILL.md`
- The public surface: `src/index.ts`; the built output: `dist/` (from `npm run build:package`)
- Open design gaps: `docs/design-gaps.md`; naming decisions: `docs/naming-conflicts.md`
- Rules: `CLAUDE.md`; commands: `tools.md`

## Self-check
- [ ] I did not build, test, document, or write the intent for this component
- [ ] Everything was read from a worktree at one pinned SHA
- [ ] Each of the seven gates has a result and evidence
- [ ] Each of the six checks has a result, and each failure or warning quotes the entry
- [ ] Check 2 reads `Pass` or `Warning`, never `Fail`
- [ ] The verdict is `Cleared` only if all seven gates and checks 1, 3, 4, 5, 6 passed
- [ ] The report is at `reports/<name>/release-review-<short SHA>.md` and names the SHA
- [ ] `Release Review` is a commit permalink, not a branch URL
- [ ] `Release Review` and `Release Verdict` were written together and read back
- [ ] My review-report PR was merged into `staging` before I wrote the board, and I merged nothing else
- [ ] A GitHub Commits row exists for the report commit, from `git log`, and was read back
- [ ] I edited no intent file, fixed nothing, and published nothing
