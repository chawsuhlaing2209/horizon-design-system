---
name: component-intent
description: Write {component}.intent.json beside a component — when to use it, when not to, what each variant is for, where it goes, what it pairs with, the tokens it needs, and its accessibility facts — transposed from the Figma documentation page, the code, and the stories. Never invents a product rule.
---

# Write a component's intent file

## When to use this
Use this when a component needs its intent recorded, or when its Figma usage
region, its code, or its stories have changed and the intent file is behind. The
file is read by `release-review` and by `astro-page`, so it is written before
either runs.

Do not use it to improve the guidance. This skill copies what the sources say.
Wording that is vague, wrong, or missing in a source is reported; it is never
rewritten here.

**A plausible sentence in these fields is worse than an empty field, because
nothing downstream can tell it is wrong.** An empty field is an honest gap that
the release review will catch. An invented one passes every check and ships.

## The file

`src/components/<name>/<name>.intent.json` — camelCase, beside the component,
per `CLAUDE.md`. One file per component folder.

```json
{
  "$component": "card",
  "$commit": "<full SHA the sources were read at>",
  "$figma": { "file": "r1CpQEYecqROS0oIOMlqAx", "page": "7:701", "usage": "40:240", "component": "34:317" },

  "use_when":       ["<verbatim line>"],
  "dont_use_when":  [{ "text": "<verbatim line>", "alternative": "<verbatim substring of text, or null>" }],
  "best_practice":  ["<verbatim line>"],
  "variant_intent": { "<prop>": { "<value>": "<verbatim from the code, or null>" } },
  "placement":      [{ "text": "<what the story renders around it>", "story": "<story export>" }],
  "pairs_with":     [{ "component": "<name>", "story": "<story export>" }],
  "required_tokens": ["--color-bg-surface-primary"],
  "a11y":           [{ "text": "<a fact about the rendered output>", "source": "<file>:<line>" }]
}
```

Keys starting with `$` are provenance, not intent. They tell the reviewer which
commit and which Figma nodes the file came from. `$figma.component` is the
component set, read live. It is not the node named in the story file: that one
can go stale when the design is restructured (Card's `12:1343` is now a variant
inside set `34:317`). A mismatch is a finding for the report.

Every key is always present. Empty is `[]` or `{}`, never a missing key and
never a placeholder string.

## Steps

### 1 · Pin the sources
Record the full SHA of the commit you are reading from (`git rev-parse HEAD`) in
`$commit`. Read the code and stories at that commit and nowhere else.

**Check:** `$commit` is a full SHA and the working tree is clean for
`src/components/<name>/`.

### 2 · Figma usage region → `use_when`, `dont_use_when`, `best_practice`
The documentation lives on the component's own page in file
`r1CpQEYecqROS0oIOMlqAx`. Pages are named `💠 <Name>` (`💠 Card`, `💠 Button`).

**`get_metadata` with no node lists only the Thumbnail page.** List pages with a
read-only `use_figma` script instead (`figma.root.children`). Load the `figma-use`
skill first, as that tool requires, and write nothing to the file.

Read the whole usage region — every column heading and every `Value` line — in
**one** script per page, and return it as data. One read per component keeps the
run fast and gives every field the same snapshot of the file.

On the page, the region is a frame named `Usage` with a `When to use` heading.
Inside its `right` frame are three columns. Each is a heading plus `Text Line`
instances, and each line's text is the TEXT layer named `Value`:

| Column | Layer name | Heading text | Field |
|---|---|---|---|
| 1 | `dos` | `Use a …` | `use_when` |
| 2 | `donts` | `Do not use a …` | `dont_use_when` |
| 3 | `dos` | `Best Practice` | `best_practice` |

**Identify each column by layer name and heading text together.** Neither is
reliable alone: two columns are both named `dos`, and the headings were copied
between pages — the Button page's columns still read `Use a card` and
`Do not use a card`. Report copied headings as a design gap, and still transpose
the lines under them. If the layer name and heading disagree about which column
is which, stop and report it.

Transpose each visible `Value` as one entry, in canvas order:
- Exact characters. Keep typographic apostrophes (`’`), capitalisation, and full
  stops as they are. Trim only trailing whitespace.
- A line break inside one `Value` stays inside that entry as `\n`. Do not split
  it into two entries, and do not join two `Text Line`s into one.
- Skip hidden layers (`visible === false`), and say how many you skipped.
- Ignore text outside the `Usage` frame. The Card page has a loose template note
  ("Don’t use card when.... Use card when...") that is not guidance.

For each `dont_use_when` entry, set `alternative` to the part of the sentence
that names **something else to use instead** — another component, pattern, or
placement — **copied as a verbatim substring of `text`**. Restating the rule is
not an alternative: "label text should remain on a single line" says how to use
a button, not what to use instead, so it gives `null`.
The Button line "Consider presenting low-priority actions in overflow menus or as
icon buttons" gives `"overflow menus or as icon buttons"`. If the sentence names
no alternative, `alternative` is `null`. Never supply one: the missing alternative
is a finding for the release review and a fix for the designer.

**If the component has no page, or its page has no `Usage` frame** — true of
every subcomponent (`cardImage`, `cardLayout`, …) — leave `use_when`,
`dont_use_when` and `best_practice` empty. Add the gap to `docs/design-gaps.md`
under the component's heading. Do not borrow the parent's region: Card's usage
is about Card.

**Check:** every entry matches a visible `Value` layer character for character,
and every `alternative` is a substring of its `text` or `null`.

### 3 · Code → `variant_intent`, `required_tokens`, `a11y`

**`variant_intent`** — one key per variant prop, one key per value, taken from
the component's union types (`ButtonVariant`, `CardImageRatio`, …). These are the
Figma properties of type VARIANT. BOOLEAN properties (`hasSlot`, `overlayAction`,
`metadata`) are not variants and get no key.

The meaning is a sentence from the `/** … */` doc comment on that prop, copied
verbatim, that says what a value does or is for. Nothing else counts:
- A sentence naming several values goes to each value it names.
- "Figma `variant`." says where the name came from, so it gives `null`.
- A pointer to a gap ("Note: the `3:2` variant renders 4:3 — see
  docs/design-gaps.md") records a defect, not a meaning, so it gives `null`.
- File header comments, inline comments, and Storybook `argTypes` descriptions
  are not the prop's doc comment, even when they explain the value better. Report
  where the better sentence lives, so the Engineer can move it into the doc
  comment. Card is composed, so its
variants live on the subcomponents: key them by the path the Card API uses
(`"image.ratio"`, `"container.state"`).

A value with no stated meaning is `null`. Do not infer "outlined is for secondary
actions" from a filled/outlined pair, however obvious it looks.

**`required_tokens`** — every `var(--…)` in the component's CSS and TSX, plus the
CSS of every component it imports from `src/components/`, followed all the way
down. Deduplicate and sort.
- Leave out custom properties the component declares for itself
  (`--hds-card-layout-gap`, `--hds-card-image-overlay-strength`). They are
  private, not tokens — but keep the tokens their values reference.
- Keep core tokens (`--spacing-1`, `--border-radius-4`) if the CSS uses them.
  Recording what the code needs is this file's job; judging whether it should
  need them is the release review's.

**`a11y`** — facts about what the component renders, each with a `file:line`
citation: the element (`native <button type="button">`), roles and `aria-*`
attributes (`aria-pressed` on the favourite button), default labels
(`favoriteLabel` defaults to "Save to favourites"), how disabled works (the native
`disabled` attribute is set when `state="disabled"`), `aria-hidden` decoration,
and `:focus-visible` rules with the token they draw with. A test that asserts the
behaviour is a better citation than the line that implements it.

Never write a generic claim ("accessible", "WCAG compliant", "screen-reader
friendly"). If you cannot point at a line, it is not a fact.

**Check:** every `variant_intent` value is a verbatim comment or `null`, every
token was found by search rather than recalled, and every `a11y` entry cites a
line that says what the entry says.

### 4 · Stories → `placement`, `pairs_with`
From `src/components/<name>/*.stories.tsx`.

**`placement`** — where a story shows the component used in a product context:
a render function or decorator that puts it in a form, a dialog, a toolbar, a
grid of results, or another component's slot. Describe what the code does, and
name the story export.

These are not placement:
- Storybook chrome: `layout: 'centered'`, and the docs-root decorator in
  `.storybook/preview.tsx`.
- Review views that exist to compare against Figma: a matrix of every variant
  (Button's `Matrix`), or a frame sized to the node's width (Card's `CardStory`
  wrapper). A consumer reading these would take a QA fixture for a layout rule.

**`pairs_with`** — other design-system components a story renders together with
this one, imported from `src/components/`. Not the component's own
subcomponents: Card composing `cardImage` is structure, not a pairing.

If no story shows either, leave the field empty and list it as a gap. The
`Usage` region's "placed in Dialogs, Modal windows, Forms" already sits in
`use_when`, verbatim. It is not copied into `placement`, which only records what
the stories show.

**Check:** every entry names a story export that exists and renders what the
entry says.

### 5 · Write, then report the gaps
Write the file with two-space indentation and a trailing newline. Rewrite it
whole from the sources on every run. Never hand-merge with the old file, so the
diff shows exactly what the sources changed.

Leave the file in the working tree, so it can be seen before it is committed.
Commit on `intent/<name>` and open a PR into `staging` when someone asks. Never
into `main` (`CLAUDE.md`).

```
📝 Intent · card
written  src/components/card/card.intent.json  @ <short SHA>
use_when <n> · dont_use_when <n> (<n> with an alternative) · best_practice <n>
variant_intent <n> values, <n> null
gaps
  - <field>: <what is missing> (<Figma node, file, or story>)
```

## References
- The Figma file: `r1CpQEYecqROS0oIOMlqAx`, one `💠 <Name>` page per documented component
- The component, its CSS, and its composed subcomponents: `src/components/<name>/`
- The design-gap register: `docs/design-gaps.md`
- Rules this file must not contradict: `CLAUDE.md`
- The consumers of this file: `.claude/skills/release-review/SKILL.md`, `.claude/skills/astro-page/SKILL.md`

## Self-check
- [ ] Every key is present; nothing is a placeholder
- [ ] `use_when`, `dont_use_when` and `best_practice` match visible Figma `Value` layers character for character
- [ ] Columns were identified by layer name **and** heading, not by either alone
- [ ] Every `alternative` is a verbatim substring of its line, or `null`
- [ ] No usage region → those three fields are empty, and the gap is in `docs/design-gaps.md`
- [ ] Every `variant_intent` value is a verbatim code comment or `null`
- [ ] `required_tokens` came from searching the CSS, with `--hds-*` private properties left out
- [ ] Every `a11y` entry cites a line, and none is generic
- [ ] `placement` and `pairs_with` cite story exports that exist
- [ ] I wrote no sentence a source does not contain
