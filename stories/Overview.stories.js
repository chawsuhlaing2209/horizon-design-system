import { core, semanticColor, space, type, typographyStyles, effects, MODES } from './lib/data.js';
import { page, section, table, el, value, warn, groupLabel } from './lib/ui.js';

const COLLECTIONS = [
  ['core', 'value', core.length, 'The raw palette and dimension primitives. Never used directly in a product.'],
  ['semantic-color', 'light, dark', semanticColor.light.length + semanticColor.dark.length, 'Roles products use. Both modes declare the same names.'],
  ['semantic-space', MODES.join(', '), MODES.reduce((n, m) => n + space[m].length, 0), 'Padding, gap, margin, control and icon sizes, widths, radii.'],
  ['type', MODES.join(', '), MODES.reduce((n, m) => n + type[m].length, 0), 'Size, line height and tracking per step, plus weights and family.'],
  ['typography (style)', '—', typographyStyles.length, 'Composite styles — what a designer picks in Figma.'],
  ['effects (style)', '—', effects.length, 'Multi-layer shadows.'],
];

const total = COLLECTIONS.reduce((n, r) => n + r[2], 0);

export default {
  title: 'Foundations/Overview',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'What is in the system, where it comes from, and what the build does and does not ship.' } } },
};

export const Overview = () =>
  page(
    section(
      `Horizon tokens — ${total} entries`,
      'Exported from Figma by the plugin into tokens/, built by Style Dictionary. These pages read the ' +
      'same token sources the build reads, so they cannot drift from what Figma exported.',
      table(
        ['Collection', 'Modes', 'Tokens', 'What it is'],
        COLLECTIONS.map(([name, modes, count, what]) => [
          el('span', { class: 'docs-name' }, name),
          value(modes),
          value(String(count)),
          el('span', { class: 'docs-desc' }, what),
        ]),
      ),
    ),
    section(
      'What the build ships',
      'Worth knowing before you reach for a token in code.',
      table(
        ['Output', 'Contains'],
        [
          [el('span', { class: 'docs-name' }, 'build/css/tokens.css'),
           el('span', { class: 'docs-desc' }, 'Core, semantic light, and the web mode only, under :root.')],
          [el('span', { class: 'docs-name' }, 'build/css/tokens-dark.css'),
           el('span', { class: 'docs-desc' }, 'Semantic dark, under [data-theme="dark"].')],
          [el('span', { class: 'docs-name' }, 'build/ios/Tokens.swift'),
           el('span', { class: 'docs-desc' }, 'Core, semantic light, and the mobile mode.')],
          [el('span', { class: 'docs-name' }, 'build/android/colors.xml'),
           el('span', { class: 'docs-desc' }, 'Colours only, mobile mode.')],
        ],
      ),
      warn(
        'No output ships the back-office mode, and no CSS output ships mobile. If you are building ' +
        'back-office UI against tokens.css you are getting web spacing and web type, not the compact ' +
        'values Figma authored. These pages document all three modes from source.',
      ),
    ),
    section(
      'Using a token',
      null,
      groupLabel('css'),
      el('pre', {
        style: {
          background: 'var(--color-bg-base-subtle)', padding: '12px', borderRadius: '6px',
          overflowX: 'auto', fontSize: '12px', margin: '0 0 16px',
        },
      }, '.button {\n  background: var(--color-bg-primary);\n  padding: var(--spacing-padding-md);\n  border-radius: var(--border-radius-control);\n}'),
      el('p', { class: 'docs-note' },
        'Click any token name on these pages to copy its var() reference. Use semantic tokens in products; ' +
        'core tokens exist so the semantic layer has something to point at.'),
    ),
  );
