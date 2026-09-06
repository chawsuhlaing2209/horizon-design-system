import { core, space, MODES, byType, groupBy, dimensionFamily, spaceGroup, sortByStep } from './lib/data.js';
import { page, section, groupLabel, table, nameChip, value, alias, desc, el, warn } from './lib/ui.js';
import { dom } from './lib/DomHost';

const px = (v) => parseFloat(v) || 0;

const bar = (v) => el('span', { class: 'docs-bar', style: { width: v, display: 'inline-block' } });

const coreSpacing = sortByStep(byType(core, 'dimension').filter((t) => /^spacing-\d+$/.test(t.name)));

// Only the spacing-* roles live here; sizes, widths and radii are under Sizing.
const spacingRoles = (mode) => space[mode].filter((t) => t.name.startsWith('spacing-'));

const lookup = Object.fromEntries(MODES.map((m) => [m, new Map(space[m].map((t) => [t.name, t]))]));

export default {
  title: 'Foundations/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Spacing has three modes — web, mobile and back-office — and they do not all agree. ' +
          'The CSS build only ships the web mode, so treat the comparison table as the source of truth ' +
          'for what mobile and back-office actually get.',
      },
    },
  },
};

const CoreScale_raw = () =>
  page(
    section(
      `Core scale — ${coreSpacing.length} steps`,
      'The 4px base unit and its multiples. Semantic spacing aliases these; products should use the semantic names.',
      table(
        ['Token', 'Value', '', 'Usage'],
        coreSpacing.map((t) => [nameChip(t), value(t.value), bar(t.value), desc(t)]),
      ),
    ),
  );

const SemanticByMode_raw = () => {
  const rolesWeb = spacingRoles('web');
  const differing = rolesWeb.filter((t) =>
    new Set(MODES.map((m) => lookup[m].get(t.name)?.value)).size > 1);

  return page(
    section(
      `Semantic spacing — ${rolesWeb.length} roles × ${MODES.length} modes`,
      'Padding, gap and margin roles. The bar is drawn at the web value.',
      differing.length
        ? warn(`${differing.length} of ${rolesWeb.length} roles differ between modes — ` +
               `a component that hardcodes the web value will be wrong on ${MODES.slice(1).join(' and ')}.`)
        : null,
      ...[...groupBy(rolesWeb, spaceGroup)].map(([group, tokens]) => [
        groupLabel(group),
        table(
          ['Token', ...MODES, '', 'Aliases (web)', 'Usage'],
          tokens.map((t) => [
            nameChip(t),
            ...MODES.map((m) => {
              const v = lookup[m].get(t.name);
              const differs = v && v.value !== t.value;
              return el('span', { class: 'docs-value', style: differs ? { fontWeight: '700' } : {} },
                v ? v.value : '—');
            }),
            bar(t.value),
            alias(t) ?? '',
            desc(t),
          ]),
        ),
      ]).flat(),
    ),
  );
};

const AppliedScale_raw = () =>
  page(
    section(
      'Applied',
      'Each padding role drawn as a real inset, at the web value.',
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        spacingRoles('web')
          .filter((t) => t.name.startsWith('spacing-padding-'))
          .sort((a, b) => px(a.value) - px(b.value))
          .map((t) =>
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
              el('div', { class: 'docs-box', style: { padding: t.value, borderRadius: '4px' } },
                el('div', {
                  style: {
                    background: 'var(--color-bg-primary)', width: '120px', height: '20px', borderRadius: '2px',
                  },
                })),
              nameChip(t),
              value(t.value),
            ]))),
    ),
  );

// Each story builds plain DOM; dom() hosts it inside a React element.
export const CoreScale = () => dom(CoreScale_raw());
export const SemanticByMode = () => dom(SemanticByMode_raw());
export const AppliedScale = () => dom(AppliedScale_raw());

CoreScale.storyName = 'Core scale';
SemanticByMode.storyName = 'Semantic, by mode';
AppliedScale.storyName = 'Applied';
