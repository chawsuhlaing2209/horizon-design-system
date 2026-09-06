---
name: registry
description: The Airtable component registry — every table, every column, and the one agent that owns each. Use whenever an agent is about to read or write the board, needs to know whether it is allowed to write a column, or needs to resolve the base and table IDs.
---

# 📋 Registry

The Airtable base is the board. It records what is true about every component:
what is designed, what is built, what is tested, what is shipped.

This file is the contract for that board. It says what each column is, and
which single agent is allowed to write it. One column, one owner — always.

## Resolving the base

**IDs are not in this file, and must never be written into it.** They live in
`.claude/registry.local.json`, which is gitignored. The committed template is
`.claude/registry.local.json.example`.

If `registry.local.json` is missing, copy the example, fill in the real IDs, and
stop to tell the human — do not guess an ID and do not search Airtable for a base
whose name looks close. Writing to the wrong base is silent and expensive.

```
baseId                    → the base
tables.components         → Components
tables.stagingTesting     → Staging Testing
tables.dsFeedback         → DS Feedback
tables.githubCommits      → GitHub Commits
tables.oneOffComponents   → One-Off Components
```

Read the file, take the ID, use it. Refer to tables by these key names in
prose, tickets and reports — never by their raw `tbl…` IDs.

### ⚠️ A table ID does not identify a base

This account holds several design-system bases that are copies of one original,
and **they share table and field IDs**. `tables.components` and the Development
field ID are byte-identical across at least three different bases — the same
`tbl…` and `fld…` values address a different board in each.

Consequences, and they are not theoretical:

- A table ID carried over from another repo, another skill, or an older
  transcript will resolve **successfully** against the wrong base and return
  plausible rows. There is no error to catch.
- Always pair a table ID with `baseId` from `registry.local.json`, read in the
  same operation. Never cache one without the other.
- If a component name you did not expect appears in Components, stop. You are
  probably pointed at a sibling base. Confirm `baseName` before writing anything.

## The Development formula

`Development` is the component's real status. It is a **formula**. It reads
evidence and derives a status from it.

**No agent may write Development. Not the PM, not the Engineer, not QA, not
DevOps, not a human acting through an agent. There is nothing to write — it is
computed.** To change it, change the evidence underneath it. An agent that finds
itself wanting to set this column has misdiagnosed its own task.

The same holds for every derived column listed under *Nobody writes these* below.

### Precedence — first match wins

| # | Condition | Result |
|---|---|---|
| 1 | Staging Testing Results Summary contains `Failed` **and** `re-test` | **Fixing** |
| 2 | Staging Testing Results Summary contains `Failed` | **To be fixed** |
| 3 | Staging Testing Results Summary contains `re-test` | **Fixed** |
| 4 | Astro Link set **and** Release Review set **and** Release Verdict = `Cleared` | **Released** |
| 5 | Production Storybook set | **Completed** |
| 6 | Staging Testing Results Summary is not empty | **To be deployed** |
| 7 | Staging Storybook set | **Ready for Testing** |
| 8 | Figma set **and** Design = `Done` | **To-do** |
| 9 | otherwise | *(empty — but see Flag 1)* |

Two consequences worth knowing before they surprise you.

**A failure outranks everything below it.** A released component that fails a
re-test reads `To be fixed`, not `Released`. That is correct: it is broken, and
the fact that it is also published is what makes it urgent.

**Released needs all three cells.** The Astro link says it is documented; Release
Review and Release Verdict say a reviewer checked it before it went public. Any
one alone is not a release.

---

## Ownership

Owners are one of: **Human**, **PM**, **Engineer**, **QA**, **DevOps**,
**Reviewer**, **Token-builder**, or **Derived** (no writer).
`Derived` means the cell is computed by Airtable — see *Nobody writes these*.

### Components

| Column | Owner | Notes |
|---|---|---|
| Components | Human | The component name. Creating the row admits the component to the system. |
| Category | Human | Atomic-design tier: ATOMS / MOLECULES / ORGANISMS / TEMPLATES / UI. |
| Figma | Human | The design source. Feeds precedence 8. |
| Staging Storybook | Engineer | Written after the staging build is deployed and seen to render. Feeds precedence 7. |
| Production Storybook | DevOps | Written on promotion to production. Feeds precedence 5. |
| Astro Link | DevOps | The deep-linked docs page, written only after it is seen to render. Feeds precedence 4. Release never writes this. |
| Design | Human | Sign-off. Blank means not signed off; no agent nudges it along. Feeds precedence 8. |
| **Development** | **Derived** | **Formula. No agent may write it.** |
| Synchronization % | Derived | Formula over the two count columns. |
| Commit | Engineer | |
| Last Modified | Derived | Airtable system column. |
| [Staging] Test Records | QA | Links to the Staging Testing rows QA logs. |
| Staging Testing Results Summary | Derived | Rollup of Testing Results. Drives precedence 1, 2, 3 and 6. |
| Total Staging Tests | Derived | Count of linked test rows. |
| Staging Passed Count | Derived | Count of linked test rows. See Flag 4. |
| [Production] Test Records | QA | Plain text, not a link. See Flag 6. |
| Staging Passed Tests | Derived | Rollup. See Flag 3. |
| Semantic Tokens | Token-builder | See Flag 7. |
| GitHub Commits | Engineer | Links to the GitHub Commits table. |
| Composes | Engineer | The components this one imports. Build up, never sideways. |
| Composed Into | Derived | Reverse of Composes. Read it to find who must be re-tested. |
| Release Review | Reviewer | URL of the review report **at the commit it reviewed** — never a branch URL. Written with Release Verdict or not at all. |
| Release Verdict | Reviewer | `Cleared` or `Blocked`. Empty means not reviewed. Written with Release Review or not at all. |
| Component Tokens | Token-builder | |
| Semantic Tokens 2 | Token-builder | See Flag 7. |

### Staging Testing

One row per variant / state / size. **QA owns every column in this table.**
The Engineer never writes here — it would be marking its own work.

| Column | Owner |
|---|---|
| Component/Sub Component | QA |
| Testing Results | QA |
| Composed In | QA |
| Variants | QA |
| Size | QA |
| State | QA |
| Context | QA |
| Attachment | QA |
| Expected Results | QA |
| Suggestion for Improvement | QA |

`Testing Results` is the single most load-bearing cell in the base — four of the
nine Development branches read the rollup of this one column.

### DS Feedback

| Column | Owner |
|---|---|
| Feedback | Human |
| Components | Human |
| Submitted By | Human |
| Step to Reproduce | Human |
| Suggestion | Human |
| Urgency | Human |
| Attachment | Human |
| Status | PM |

Consumers report; the PM triages. An agent never edits the words of a human's
report — it may only move `Status`.

### GitHub Commits

**The Engineer owns every column.** Records are written from real commits.

| Column | Owner |
|---|---|
| Commit Hash | Engineer |
| Message | Engineer |
| Author | Engineer |
| Date Committed | Engineer |
| Link to Components | Engineer |
| Files Changed | Engineer |
| Commit URL | Engineer |
| Commit Type | Engineer |

### One-Off Components

Components built for one project that never entered the system.
**Human owns every column.** No agent writes this table.

| Column | Owner |
|---|---|
| Components | Human |
| Project | Human |
| Usage quantity | Human |
| Git Repo | Human |
| Figma | Human |

---

## Nobody writes these

Attempting to write any of these is an error, not a permission problem:

`Development` · `Synchronization %` · `Staging Testing Results Summary` ·
`Total Staging Tests` · `Staging Passed Count` · `Staging Passed Tests` ·
`Composed Into` · `Last Modified`

---

## Flags — where the description and the formula disagree

These are recorded, not fixed. Fixing a base column is a human's decision.

**Flag 1 — `Development` says "otherwise blank" but blank rows read `To-do`.**
*Confirmed on live data.* The formula's final branch returns `""`, but the
column's result is a single-select whose default choice is named `To-do`. Both
rows currently in the base have Figma set and Design empty, so branch 8 fails and
branch 9 fires — and both display `To-do`. A component nobody has started is
therefore **indistinguishable from one that is designed, signed off and ready to
build**. Do not treat `To-do` as evidence that Design is `Done`. Check the Design
column directly.

**Flag 2 — `Development` step 6 says "any staging test rows exist"; the formula
tests the rollup, not the count.** Branch 6 fires on
`Staging Testing Results Summary != ""`. A linked test row whose `Testing Results`
is still blank contributes nothing to that rollup, so test rows can exist while
Development still reads `Ready for Testing`. `Total Staging Tests` is the column
that actually means "rows exist", and the formula does not reference it. QA must
set `Testing Results` on every row it creates, or the board will not move.

**Flag 3 — `Staging Passed Tests` says "Feeds Synchronization %". It does not.**
`Synchronization %` references only `Total Staging Tests` and
`Staging Passed Count`. Nothing in the base references `Staging Passed Tests`.
Its description names a wiring that is not there.

**Flag 4 — `Staging Passed Count` and `Total Staging Tests` are configured
identically.** Both are counts over the same link column, with no filter visible
in the schema. If that is the whole configuration, `Synchronization %` is `100%`
whenever any test row exists, pass or fail — a metric that cannot report a
problem. *Not confirmed on data: the base has no test rows yet.* Open the column
in the Airtable UI and check whether `Staging Passed Count` carries a filter
before trusting any synchronisation number.

**Flag 5 — the staleness rule in `Release Review` is prose, not a check.**
"A review is stale once Last Modified is later than the commit it links to" —
nothing computes this and nothing enforces it. A stale review looks exactly like
a fresh one. The Reviewer must compare the dates by hand.

**Flag 6 — `[Production] Test Records` is plain text; `[Staging] Test Records` is
a record link.** Production results cannot be rolled up, counted, or fed into any
formula. There is no production equivalent of the staging ladder.

**Flag 7 — `Semantic Tokens` and `Semantic Tokens 2` are two undescribed text
columns with near-identical names.** Ownership is assigned to Token-builder for
both, but which one is authoritative is not recorded anywhere. Ask before writing
either. Note that in the sibling `Sunim Design System` base the same-named column
is a record link into a real Semantic Tokens table — so a token written here as
plain text is not the same object it is there.

**Flag 8 — two descriptions point at `.claude/skills/release-review/SKILL.md`,
which does not exist in this repo.** `Release Review` and `Release Verdict` both
cite it as the source of "the seven gates". There is also no Reviewer agent and no
Release agent defined under `.claude/agents/`. Until both exist, the Reviewer
columns have an owner on paper and no owner in fact — leave them empty rather
than filling them from a different agent.
