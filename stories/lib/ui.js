// Docs-only helpers, built on the shared DOM helper. The framework here is
// plain HTML on purpose: token docs should not need a UI framework to render.
//
// `el` itself lives in ./dom.js. The components are React, so this helper is
// docs-only; it is re-exported here so the existing
// `import { el, ... } from './lib/ui.js'` in every docs story keeps working.

import { el } from './dom.js';

export { el };

export const page = (...children) => el('div', {}, children);

export const section = (title, note, ...children) =>
  el('section', { class: 'docs-section' }, [
    title && el('h2', {}, title),
    note && el('p', { class: 'docs-note' }, note),
    ...children,
  ]);

export const groupLabel = (text) => el('div', { class: 'docs-group-label' }, text);

export const warn = (text) => el('div', { class: 'docs-warn' }, text);

/** The CSS custom property, click to copy. Devs paste `var(--x)`; the chip shows `--x`. */
export const nameChip = (token) =>
  el('button', {
    class: 'docs-name',
    type: 'button',
    title: `Copy var(${token.cssVar})`,
    onClick: async (e) => {
      const btn = e.currentTarget;
      try {
        await navigator.clipboard.writeText(`var(${token.cssVar})`);
        btn.dataset.copied = 'true';
        setTimeout(() => delete btn.dataset.copied, 1200);
      } catch {
        /* Clipboard is blocked in some embedded contexts; the name is still readable. */
      }
    },
  }, token.cssVar);

export const value = (text) => el('span', { class: 'docs-value' }, text);
export const alias = (token) => token.alias ? el('span', { class: 'docs-alias' }, `← ${token.alias}`) : null;
export const desc = (token) => el('span', { class: 'docs-desc' }, token.description || '');

export const table = (headers, rows) =>
  el('table', { class: 'docs-table' }, [
    el('thead', {}, el('tr', {}, headers.map((h) => el('th', {}, h)))),
    el('tbody', {}, rows.map((cells) => el('tr', {}, cells.map((c) => el('td', {}, c))))),
  ]);

export const swatch = (token) =>
  el('figure', { class: 'swatch', style: { margin: 0 } }, [
    el('div', { class: 'swatch-chip' }, el('span', { style: { background: token.value } })),
    el('figcaption', { class: 'swatch-meta' }, [
      nameChip(token),
      value(token.value),
      alias(token),
      desc(token),
    ]),
  ]);

export const swatchGrid = (tokens) => el('div', { class: 'swatch-grid' }, tokens.map(swatch));

/** Light and dark rendered together — the only honest way to review a semantic ramp. */
export const themeSplit = (renderPanel) =>
  el('div', { class: 'theme-split' }, [
    el('div', { class: 'theme-panel', 'data-theme': 'light' }, [el('h3', {}, 'Light'), renderPanel('light')]),
    el('div', { class: 'theme-panel', 'data-theme': 'dark' }, [el('h3', {}, 'Dark'), renderPanel('dark')]),
  ]);

/** Typography tokens carry structured values; turn one into inline styles. */
export const typographyStyle = (t) => ({
  fontFamily: `${t.typography.fontFamily}, Inter, system-ui, sans-serif`,
  fontWeight: String(t.typography.fontWeight),
  fontSize: t.typography.fontSize,
  lineHeight: t.typography.lineHeight,
  letterSpacing: t.typography.letterSpacing ?? 'normal',
  margin: 0,
});
