import { semanticColor, groupBy, semanticGroup } from './lib/data.js';
import { page, section, groupLabel, themeSplit, table, nameChip, value, alias, desc, el } from './lib/ui.js';

const GROUP_NOTE = {
  bg: 'Surfaces and fills.',
  text: 'Foreground copy.',
  border: 'Strokes, dividers and the focus ring.',
  icon: 'Icon fills, kept separate from text so they can diverge.',
};

// Light and dark declare the same names — that is the contract. Drive the rows
// from light and look dark up by name, so a name missing from dark is visible
// as a blank rather than silently dropped.
const byName = (mode) => new Map(semanticColor[mode].map((t) => [t.name, t]));

const chip = (token) =>
  el('span', {
    style: {
      display: 'inline-block', width: '28px', height: '20px', borderRadius: '3px',
      background: token ? token.value : 'transparent',
      border: '1px solid var(--color-border-bold)', verticalAlign: 'middle',
    },
  });

const rows = (tokens, dark) =>
  tokens.map((t) => {
    const d = dark.get(t.name);
    return [
      nameChip(t),
      el('span', {}, [chip(t), ' ', value(t.value)]),
      el('span', {}, [chip(d), ' ', value(d ? d.value : '— not declared in dark —')]),
      alias(t) ?? '',
      desc(t),
    ];
  });

export default {
  title: 'Foundations/Colour/Semantic',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The colours products actually use. Every one aliases a core token, and every name ' +
          'is declared in both modes — so a component written against semantic tokens themes itself.',
      },
    },
  },
};

export const LightAndDark = () => {
  const dark = byName('dark');
  return page(
    section(
      `Semantic colour — ${semanticColor.light.length} roles × 2 modes`,
      'Both modes side by side. The alias column shows which core token each role points at.',
      ...[...groupBy(semanticColor.light, semanticGroup)].map(([group, tokens]) => [
        groupLabel(`${group} · ${tokens.length} — ${GROUP_NOTE[group] ?? ''}`),
        table(['Token', 'Light', 'Dark', 'Aliases', 'Usage'], rows(tokens, dark)),
      ]).flat(),
    ),
  );
};
LightAndDark.storyName = 'Light and dark';

export const InContext = () =>
  page(
    section(
      'In context',
      'The same markup rendered in both modes, using only semantic tokens.',
      themeSplit(() =>
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } }, [
          el('div', {
            style: {
              background: 'var(--color-bg-surface-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--border-radius-surface, 8px)',
              padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
            },
          }, [
            el('div', { style: { font: 'var(--title-md, 500 16px/24px Inter)' } }, 'Surface primary'),
            el('div', { style: { color: 'var(--color-text-secondary)', fontSize: '14px' } },
              'Secondary text on a card, with a '),
            el('a', { href: '#', style: { color: 'var(--color-text-link)' } }, 'link'),
            el('div', { style: { display: 'flex', gap: '8px', marginTop: '4px' } }, [
              el('button', {
                style: {
                  background: 'var(--color-bg-primary)', color: 'var(--color-text-inverse)',
                  border: 0, borderRadius: 'var(--border-radius-control, 6px)',
                  padding: '8px 16px', font: 'inherit', fontSize: '14px',
                },
              }, 'Primary'),
              el('button', {
                style: {
                  background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-bold)',
                  borderRadius: 'var(--border-radius-control, 6px)',
                  padding: '8px 16px', font: 'inherit', fontSize: '14px',
                },
              }, 'Secondary'),
            ]),
          ]),
          ...['positive', 'negative', 'warning', 'info'].map((tone) =>
            el('div', {
              style: {
                background: `var(--color-bg-${tone}-subtle)`,
                color: `var(--color-text-${tone === 'info' ? 'link' : tone}, var(--color-text-primary))`,
                padding: '8px 12px', borderRadius: '4px', fontSize: '13px',
              },
            }, `${tone} subtle`)),
        ]),
      ),
    ),
  );
InContext.storyName = 'In context';
