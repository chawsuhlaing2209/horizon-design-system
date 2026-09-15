---
title: Embedding
description: Why the Storybook and Figma frames on a component page can come up blank, and what fixes each.
---

## The Storybook frames

Every component page embeds stories from the [production Storybook](https://horizon-design-system-delta.vercel.app), twice: once in the light theme and once in the dark, with the page's theme deciding which shows. The hidden frame loads lazily and costs nothing until you switch.

Two headers have to agree for a frame to show:

- **This site's Content Security Policy** must list the Storybook origin in `frame-src`. It does: `https://horizon-design-system-delta.vercel.app`, set in `docs-site/vercel.json`.
- **The Storybook's own response** must not forbid framing, through `X-Frame-Options` or a `frame-ancestors` directive. The Horizon Storybook sends neither today.

### If a frame is blank

- The Storybook moved to a new URL: `storybookUrl` in `docs-site/reference.config.json` and `frame-src` in `docs-site/vercel.json` both need the new origin.
- The Storybook started sending `frame-ancestors 'self'`: add this site's origin to that directive, rather than `*`, which would let any site frame it.
- The story was renamed: the next site build picks up the new id from the Storybook's `index.json`.

Every frame has a link beneath it, so a blank frame costs a click rather than the content.

## The Figma frames

The *Design* tab embeds the live Figma node through `embed.figma.com`. The file is shared with the team only, so the frame shows a sign-in to anyone outside it, and the *Open the node in Figma* link beneath it asks for the same access. That is the file's sharing setting, not a fault on this site.
