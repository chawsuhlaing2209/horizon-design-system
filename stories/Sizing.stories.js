import { core, space, MODES, byType, groupBy, dimensionFamily, spaceGroup, sortByStep } from './lib/data.js';
import { page, section, groupLabel, table, nameChip, value, alias, desc, el } from './lib/ui.js';
import { dom } from './lib/DomHost';

const dims = byType(core, 'dimension');
const coreFamily = (prefix) => sortByStep(dims.filter((t) => t.name.startsWith(prefix)));

const lookup = Object.fromEntries(MODES.map((m) => [m, new Map(space[m].map((t) => [t.name, t]))]));
// Everything in the space collection that is not spacing-* — sizes, widths, radii.
const nonSpacing = space.web.filter((t) => !t.name.startsWith('spacing-'));

export default {
  title: 'Foundations/Sizing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Control and icon sizes, border widths, and corner radii — core primitives and the semantic roles that alias them.',
      },
    },
  },
};

const Radius_raw = () =>
  page(
    section(
      'Corner radius',
      'Core radii, and the three semantic roles products should use.',
      groupLabel('core'),
      el('div', { style: { display: 'flex', gap: '16px', flexWrap: 'wrap' } },
        coreFamily('border-radius-').map((t) =>
          el('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, [
            el('div', { class: 'docs-radius', style: { borderRadius: t.value } }),
            nameChip(t), value(t.value),
          ]))),
      groupLabel('semantic'),
      table(
        ['Token', ...MODES, '', 'Aliases (web)', 'Usage'],
        nonSpacing.filter((t) => t.name.startsWith('border-radius-')).map((t) => [
          nameChip(t),
          ...MODES.map((m) => value(lookup[m].get(t.name)?.value ?? '—')),
          el('span', {
            class: 'docs-radius',
            style: { borderRadius: t.value, display: 'inline-block', width: '48px', height: '28px' },
          }),
          alias(t) ?? '', desc(t),
        ]),
      ),
    ),
  );

const BorderWidths_raw = () =>
  page(
    section(
      'Border width',
      'Core widths and the semantic roles, including the focus ring.',
      groupLabel('core'),
      table(['Token', 'Value', '', 'Usage'], coreFamily('border-size-').map((t) => [
        nameChip(t), value(t.value),
        el('span', {
          style: {
            display: 'inline-block', width: '80px', height: '0',
            borderTop: `${t.value} solid var(--color-bg-primary)`, verticalAlign: 'middle',
          },
        }),
        desc(t),
      ])),
      groupLabel('semantic'),
      table(['Token', ...MODES, '', 'Aliases (web)', 'Usage'],
        nonSpacing.filter((t) => t.name.startsWith('border-width-')).map((t) => [
          nameChip(t),
          ...MODES.map((m) => value(lookup[m].get(t.name)?.value ?? '—')),
          el('span', {
            style: {
              display: 'inline-block', width: '80px', height: '0',
              borderTop: `${t.value} solid var(--color-bg-primary)`, verticalAlign: 'middle',
            },
          }),
          alias(t) ?? '', desc(t),
        ])),
    ),
  );

const SizeScale_raw = () =>
  page(
    section(
      'Size scale',
      'The core size ramp, then the control and icon roles that alias it. Squares are drawn to scale.',
      groupLabel('core'),
      table(['Token', 'Value', '', 'Usage'], coreFamily('size-').map((t) => [
        nameChip(t), value(t.value),
        el('span', { class: 'docs-box', style: { display: 'inline-block', width: t.value, height: t.value } }),
        desc(t),
      ])),
      ...[...groupBy(nonSpacing.filter((t) => t.name.startsWith('size-')), spaceGroup)].map(([group, tokens]) => [
        groupLabel(group),
        table(['Token', ...MODES, '', 'Aliases (web)', 'Usage'], tokens.map((t) => [
          nameChip(t),
          ...MODES.map((m) => {
            const v = lookup[m].get(t.name);
            const differs = v && v.value !== t.value;
            return el('span', { class: 'docs-value', style: differs ? { fontWeight: '700' } : {} }, v ? v.value : '—');
          }),
          el('span', { class: 'docs-box', style: { display: 'inline-block', width: t.value, height: t.value } }),
          alias(t) ?? '', desc(t),
        ])),
      ]).flat(),
    ),
  );

// Each story builds plain DOM; dom() hosts it inside a React element.
export const Radius = () => dom(Radius_raw());
export const BorderWidths = () => dom(BorderWidths_raw());
export const SizeScale = () => dom(SizeScale_raw());

BorderWidths.storyName = 'Border widths';
SizeScale.storyName = 'Size scale';
