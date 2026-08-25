import { core, byType, groupBy, colorFamily, sortByStep } from './lib/data.js';
import { page, section, groupLabel, swatchGrid } from './lib/ui.js';

const colors = byType(core, 'color');

export default {
  title: 'Foundations/Colour/Core palette',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The raw palette, one mode ("value"). These are the only colours in the system — ' +
          'everything else aliases them. Do not use a core colour directly in a product: ' +
          'reach for a semantic token so light and dark both keep working.',
      },
    },
  },
};

export const AllFamilies = () =>
  page(
    section(
      `Core palette — ${colors.length} colours`,
      'Grouped by family, ordered by step. A checkerboard behind a swatch means the colour carries alpha.',
      ...[...groupBy(colors, colorFamily)].map(([family, tokens]) => [
        groupLabel(`${family} · ${tokens.length}`),
        swatchGrid(sortByStep(tokens)),
      ]).flat(),
    ),
  );
AllFamilies.storyName = 'All families';
