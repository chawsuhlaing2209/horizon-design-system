---
title: The knowledge skill
description: Whether a skill ships inside the Horizon package for coding agents, and what an agent can read instead today.
---

## Not in 0.1.0

No knowledge skill ships inside `@theproductiveschedule/horizon-design-system` at `0.1.0`. The published tarball holds `dist/` and `package.json`, and nothing an agent loads as a skill.

## What an agent can read today

- **This site.** Each component page's *Usage* tab says when to use the component and when not to, in the design team's own words, and its *Code* tab lists every prop with its doc comment.
- **The types.** `dist/index.d.ts` carries every public prop with the same doc comments, so an editor or an agent reading the types gets the meaning of each variant value.
- **The intent files in the repository.** `src/components/<name>/<name>.intent.json` holds `use_when`, `dont_use_when`, `best_practice`, what each variant is for, placement, pairings, required tokens and accessibility facts. They are not in the package.

## When it ships

A knowledge skill would be generated from those same intent files, so it could not disagree with this site. When one ships, it will be listed in the [changelog](/get-started/changelog/).
