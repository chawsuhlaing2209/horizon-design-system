import { typographyStyles } from './lib/data.js';
import { page, section, groupLabel, table, nameChip, value, desc, el, warn, typographyStyle } from './lib/ui.js';
import { dom } from './lib/DomHost';

const SAMPLE = 'Horizon design system';

// `role` is the part before the size: display-lg -> display, title-md-bold -> title.
const role = (t) => t.name.split('-')[0];

// `cssOutput` is read back out of build/css/tokens.css, so this is what the
// build really emitted. A font shorthand that does not start with a weight
// number means the weight name Figma wrote was not in the build's lookup, and
// the emitted CSS is invalid.
const shorthandBroken = (t) => t.cssOutput != null && !/^\d/.test(t.cssOutput.trim());
const broken = typographyStyles.filter(shorthandBroken);

const specimen = (t) => el('div', { style: typographyStyle(t) }, SAMPLE);

export default {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The 21 composite typography styles — the things a designer actually picks in Figma. ' +
          'Specimens are rendered from the structured token values, not from the CSS shorthand, ' +
          'because the shorthand drops letter-spacing.',
      },
    },
  },
};

const Styles_raw = () => {
  const groups = new Map();
  for (const t of typographyStyles) {
    const r = role(t);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(t);
  }

  return page(
    section(
      `Typography styles — ${typographyStyles.length}`,
      'Grouped by role. Every specimen is rendered at its real size, line height and tracking.',
      ...[...groups].map(([r, tokens]) => [
        groupLabel(`${r} · ${tokens.length}`),
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' } },
          tokens.map((t) =>
            el('div', {}, [
              specimen(t),
              el('div', { style: { marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' } }, [
                nameChip(t),
                value(`${t.typography.fontWeight} · ${t.typography.fontSize}/${t.typography.lineHeight} · tracking ${t.typography.letterSpacing}`),
              ]),
              desc(t),
            ]))),
      ]).flat(),
    ),
  );
};

const Values_raw = () =>
  page(
    section(
      'Values',
      'Structured values, next to what build/css/tokens.css actually contains.',
      broken.length
        ? warn(
            `${broken.length} of ${typographyStyles.length} styles emit invalid CSS: ` +
            `${broken.map((t) => t.cssVar).join(', ')}. ` +
            'Figma wrote the weight as "Semi Bold" and the WEIGHTS map in build-tokens.js only ' +
            'knows "SemiBold", so the name passes through unmapped and the browser drops the ' +
            'whole declaration. The specimens are correct because they render from the structured ' +
            'token value; the CSS variable is not. Fix is in build-tokens.js, not in tokens/.')
        : null,
      table(
        ['Token', 'Family', 'Weight', 'Size / line height', 'Tracking', 'CSS output'],
        typographyStyles.map((t) => [
          nameChip(t),
          value(t.typography.fontFamily),
          value(String(t.typography.fontWeight)),
          value(`${t.typography.fontSize} / ${t.typography.lineHeight}`),
          value(t.typography.letterSpacing),
          el('span', {
            class: 'docs-value',
            style: shorthandBroken(t) ? { color: 'var(--color-text-negative)', fontWeight: '700' } : {},
          }, t.cssOutput ?? 'not shipped in CSS'),
        ]),
      ),
    ),
  );

// Each story builds plain DOM; dom() hosts it inside a React element.
export const Styles = () => dom(Styles_raw());
export const Values = () => dom(Values_raw());
