import { effects } from './lib/data.js';
import { page, section, table, nameChip, value, desc, el } from './lib/ui.js';
import { dom } from './lib/DomHost';

export default {
  title: 'Foundations/Elevation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Five shadow styles. Each is a multi-layer shadow, so the docs show the layer count ' +
          'as well as the composed value. Cards sit on a subtle ground — a shadow is invisible on flat white.',
      },
    },
  },
};

const Levels_raw = () =>
  page(
    section(
      `Elevation — ${effects.length} levels`,
      'Rendered on bg-base-subtle.',
      el('div', { class: 'elev-grid' }, effects.map((t) =>
        el('div', { class: 'elev-card', style: { boxShadow: t.value } }, [
          el('div', { style: { font: 'var(--title-sm, 500 14px/20px Inter)' } }, t.name.replace('elevation-', '')),
          nameChip(t),
          el('span', { class: 'docs-desc' }, `${t.layers.length} layer${t.layers.length > 1 ? 's' : ''}`),
        ]))),
    ),
    section(
      'Values',
      null,
      table(['Token', 'Layers', 'Composed value', 'Usage'], effects.map((t) => [
        nameChip(t),
        value(String(t.layers.length)),
        el('span', { class: 'docs-value', style: { whiteSpace: 'normal', wordBreak: 'break-word' } }, String(t.value)),
        desc(t),
      ])),
    ),
  );

// Each story builds plain DOM; dom() hosts it inside a React element.
export const Levels = () => dom(Levels_raw());
