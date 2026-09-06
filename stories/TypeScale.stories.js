import { type, MODES, byType, typeScale } from './lib/data.js';
import { page, section, groupLabel, table, nameChip, value, desc, el } from './lib/ui.js';
import { dom } from './lib/DomHost';

const SAMPLE = 'The quick brown fox';

const specimen = (mode, row) =>
  el('div', {
    style: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: row.size.value,
      lineHeight: row.lineheight ? row.lineheight.value : 'normal',
      letterSpacing: row.tracking ? row.tracking.value : 'normal',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
  }, SAMPLE);

const modeTable = (mode) => {
  const rows = typeScale(type[mode]);
  return table(
    ['Step', 'Size', 'Line height', 'Tracking', 'Specimen'],
    rows.map((r) => [
      el('span', { class: 'docs-name' }, r.step),
      value(r.size.value),
      value(r.lineheight ? r.lineheight.value : '—'),
      value(r.tracking ? r.tracking.value : '—'),
      specimen(mode, r),
    ]),
  );
};

const nonScale = (mode) => type[mode].filter((t) => t.type !== 'dimension');

export default {
  title: 'Foundations/Type scale',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The type scale is authored three times — web, mobile and back-office — as parallel ' +
          'size / line-height / tracking tokens. Back-office is the compact one. Only the web mode ' +
          'reaches the CSS build, so mobile and back-office are documented here from source.',
      },
    },
  },
};

// One story per mode, so the sidebar shows that three modes exist at all.
const Web_raw = () => page(section('Type scale — web', `${typeScale(type.web).length} steps.`, modeTable('web')));
const Mobile_raw = () => page(section('Type scale — mobile', `${typeScale(type.mobile).length} steps.`, modeTable('mobile')));
const BackOffice_raw = () => page(section('Type scale — back-office', 'The compact mode.', modeTable('back-office')));

const CompareModes_raw = () => {
  const steps = typeScale(type.web).map((r) => r.step);
  const look = Object.fromEntries(MODES.map((m) => [m, new Map(typeScale(type[m]).map((r) => [r.step, r]))]));
  const differing = steps.filter((s) => new Set(MODES.map((m) => look[m].get(s)?.size.value)).size > 1);

  return page(
    section(
      'Compare modes',
      `${differing.length} of ${steps.length} steps have a different font size between modes. Bold marks a value that differs from web.`,
      table(
        ['Step', ...MODES.map((m) => `${m} size / line height`)],
        steps.map((s) => [
          el('span', { class: 'docs-name' }, s),
          ...MODES.map((m) => {
            const r = look[m].get(s);
            if (!r) return value('—');
            const differs = r.size.value !== look.web.get(s).size.value;
            return el('span', { class: 'docs-value', style: differs ? { fontWeight: '700' } : {} },
              `${r.size.value} / ${r.lineheight ? r.lineheight.value : '—'}`);
          }),
        ]),
      ),
    ),
  );
};

const WeightsAndFamily_raw = () =>
  page(
    section(
      'Weights and family',
      'Shared across all three modes.',
      table(['Token', 'Value', 'Specimen', 'Usage'], nonScale('web').map((t) => [
        nameChip(t), value(String(t.value)),
        el('span', {
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: t.type === 'fontWeight' ? String(t.value) : '400',
            fontSize: '18px',
          },
        }, SAMPLE),
        desc(t),
      ])),
    ),
  );

// Each story builds plain DOM; dom() hosts it inside a React element.
export const Web = () => dom(Web_raw());
export const Mobile = () => dom(Mobile_raw());
export const BackOffice = () => dom(BackOffice_raw());
export const CompareModes = () => dom(CompareModes_raw());
export const WeightsAndFamily = () => dom(WeightsAndFamily_raw());

BackOffice.storyName = 'Back-office';
CompareModes.storyName = 'Compare modes';
WeightsAndFamily.storyName = 'Weights and family';
