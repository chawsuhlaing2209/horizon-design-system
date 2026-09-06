// Figma node under test:
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=12-1343
//
// Subcomponent nodes that carry the variants:
//   cardContainer  ?node-id=8-804
//   cardLayout     ?node-id=8-1251
//   cardImage      ?node-id=8-1186
//   cardText       ?node-id=8-778
//
// The component API is nested by subcomponent so every Figma property name
// stays verbatim (see docs/naming-conflicts.md). Storybook controls are flat,
// so this file maps flat args onto that nested shape in `render`. The only
// place `imageState` appears is here, as a control name — never in the API.

import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
import type { CardImageRatio, CardImageState } from '../cardImage/cardImage';
import type { CardContainerState } from '../cardContainer/cardContainer';
import type { CardLayoutOrientation } from '../cardLayout/cardLayout';

// A stand-in photo. The Slide Image in Figma is an empty placeholder, so there
// is no design asset for it — this only shows that a supplied image crops
// correctly. Stories without it render the empty-surface fallback, which is
// what the node itself draws.
const DEMO_PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fa8ee"/><stop offset="1" stop-color="#0f2f6b"/></linearGradient></defs><rect width="256" height="256" fill="url(#g)"/></svg>'
  );

type Flat = {
  state: CardContainerState;
  orientation: CardLayoutOrientation;
  hasSlot: boolean;
  ratio: CardImageRatio;
  imageState: CardImageState | 'auto';
  overlayAction: boolean;
  metadata: boolean;
  review: boolean;
  price: boolean;
  title: string;
  locationInfo: string;
  ratingScore: string;
  reviewCount: string;
  priceAmount: string;
  priceInfo: string;
  image: string;
  imageAlt: string;
  favorited: boolean;
  favoriteLabel: string;
  onFavoriteToggle: (next: boolean) => void;
};

/** Cards are fluid; the node fixes them. 227px is the vertical node, 301px the
 *  horizontal container — which puts cardLayout at the node's 269px. */
const frameWidth = (o: CardLayoutOrientation) => (o === 'horizontal' ? '301px' : '227px');

const SLOT = <span style={{ font: 'var(--body-sm)', color: 'var(--color-text-subtle)' }}>Slot content</span>;

/**
 * Storybook args are not state: an arg written back by the component does not
 * re-render, so a `favorited` arg alone gives a button that reports
 * aria-pressed="false" for ever (QA finding 3). This holds the pressed state
 * for real and re-syncs when the control changes, so the control still works
 * and clicking still toggles.
 */
const CardStory = (a: Flat) => {
  const [favorited, setFavorited] = useState(a.favorited);
  useEffect(() => { setFavorited(a.favorited); }, [a.favorited]);

  return (
    <div style={{ padding: '24px', width: 'fit-content' }}>
      <div style={{ width: frameWidth(a.orientation) }}>
        <Card
          container={{ state: a.state }}
          layout={{ orientation: a.orientation, hasSlot: a.hasSlot }}
          slot={a.hasSlot ? SLOT : undefined}
          image={{
            ratio: a.ratio,
            // 'auto' is the unpinned mode — expressed in the API by omitting `state`.
            state: a.imageState === 'auto' ? undefined : a.imageState,
            overlayAction: a.overlayAction,
            image: a.image || undefined,
            imageAlt: a.imageAlt,
            favorited,
            favoriteLabel: a.favoriteLabel,
            onFavoriteToggle: (next) => {
              setFavorited(next);
              a.onFavoriteToggle?.(next);
            },
          }}
          text={{
            metadata: a.metadata,
            review: a.review,
            price: a.price,
            title: a.title,
            locationInfo: a.locationInfo,
            ratingScore: a.ratingScore,
            reviewCount: a.reviewCount,
            priceAmount: a.priceAmount,
            priceInfo: a.priceInfo,
          }}
        />
      </div>
    </div>
  );
};

const FIGMA = {
  container: 'cardContainer (8:804)',
  layout: 'cardLayout (8:1251)',
  image: 'cardImage (8:1186)',
  text: 'cardText (8:778)',
  content: 'Content',
  behaviour: 'Behaviour',
};

// The controls are flat while the component API is nested, so the meta is typed
// against the flat shape the stories actually pass.
//
// `component: Card` is deliberately NOT set. React docgen would read the real
// nested props (container / layout / image / text) and merge those inferred
// argTypes over the flat ones below, replacing the radios and text fields with
// unusable "Set object" rows — and its `image` (CardImageProps) would collide
// with the flat `image` (photo src). The argTypes below are the whole API
// surface for the docs page.
const meta: Meta<Flat> = {
  title: 'Components/Card',
  tags: ['autodocs'],

  render: (a) => <CardStory {...a} />,

  parameters: {
    // preview.tsx disables controls and actions globally for the token-docs
    // pages, which have no props. Components need both, so re-enable here.
    controls: { disable: false, expanded: true },
    actions: { disable: false },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Card, built from Figma node 12:1343 and composed from cardContainer, ' +
          'cardLayout, cardImage and cardText. The component API is nested by ' +
          'subcomponent so every Figma property name stays verbatim — including ' +
          'the two different properties both called `state`. These controls are ' +
          'flat for usability and are mapped onto that shape.',
      },
    },
  },

  argTypes: {
    state: {
      description: 'cardContainer `state`. `hover` raises the card on elevation/level2.',
      options: ['enable', 'hover'],
      control: { type: 'radio' },
      table: { category: FIGMA.container, defaultValue: { summary: 'enable' } },
    },
    orientation: {
      description: 'cardLayout `orientation`.',
      options: ['vertical', 'horizontal'],
      control: { type: 'radio' },
      table: { category: FIGMA.layout, defaultValue: { summary: 'vertical' } },
    },
    hasSlot: {
      description: 'cardLayout `hasSlot`. Reserves the 46px slot below the text.',
      control: 'boolean',
      table: { category: FIGMA.layout, defaultValue: { summary: 'false' } },
    },
    ratio: {
      description: 'cardImage `ratio`. The `3:2` variant renders 4:3 — see docs/design-gaps.md.',
      options: ['3:2', '1:1'],
      control: { type: 'radio' },
      table: { category: FIGMA.image, defaultValue: { summary: '3:2' } },
    },
    imageState: {
      description:
        'cardImage `state`. `auto` leaves it unpinned so a real pointer over the image drives the overlay; `idle` and `hover` pin it and beat the pointer. Flat control name only — the API keeps `state`, and `auto` there is simply omitting it.',
      options: ['auto', 'idle', 'hover'],
      control: { type: 'radio' },
      table: { category: FIGMA.image, defaultValue: { summary: 'auto' } },
    },
    overlayAction: {
      description: 'cardImage `overlayAction`. Shows the favourite button.',
      control: 'boolean',
      table: { category: FIGMA.image, defaultValue: { summary: 'true' } },
    },
    metadata: { description: 'cardText `metadata`.', control: 'boolean', table: { category: FIGMA.text, defaultValue: { summary: 'true' } } },
    review: { description: 'cardText `review`.', control: 'boolean', table: { category: FIGMA.text, defaultValue: { summary: 'true' } } },
    price: { description: 'cardText `price`.', control: 'boolean', table: { category: FIGMA.text, defaultValue: { summary: 'true' } } },

    title: { control: 'text', table: { category: FIGMA.content } },
    locationInfo: { control: 'text', table: { category: FIGMA.content } },
    ratingScore: { control: 'text', table: { category: FIGMA.content } },
    reviewCount: { control: 'text', table: { category: FIGMA.content } },
    priceAmount: { control: 'text', table: { category: FIGMA.content } },
    priceInfo: { control: 'text', table: { category: FIGMA.content } },
    image: { description: 'Photo src. Empty in the node, so a quiet surface stands in.', control: 'text', table: { category: FIGMA.content } },
    imageAlt: { description: 'Alt text. Empty means decorative.', control: 'text', table: { category: FIGMA.content } },

    favorited: {
      description: 'Pressed state of the favourite button. The unfavourited look has no design — see docs/design-gaps.md.',
      control: 'boolean',
      table: { category: FIGMA.behaviour, defaultValue: { summary: 'true' } },
    },
    favoriteLabel: { description: 'Accessible name for the favourite button.', control: 'text', table: { category: FIGMA.behaviour } },
    onFavoriteToggle: { description: 'Called with the new pressed state.', action: 'favoriteToggled', table: { category: FIGMA.behaviour } },
  },

  args: {
    state: 'enable',
    orientation: 'vertical',
    hasSlot: false,
    ratio: '3:2',
    imageState: 'auto',
    overlayAction: true,
    metadata: true,
    review: true,
    price: true,
    title: 'Casa do Bairro',
    locationInfo: 'Alfama, Lisbon · 1.2 km from centre',
    ratingScore: '4.7',
    reviewCount: '(318 reviews)',
    priceAmount: '121 EUR',
    priceInfo: 'per night',
    image: '',
    imageAlt: '',
    favorited: true,
    favoriteLabel: 'Save to favourites',
    onFavoriteToggle: () => {},
  },
};

export default meta;
type Story = StoryObj<Flat>;
const args = (o: Partial<Flat>) => ({ args: o });

/* ---- The node itself -------------------------------------------------- */

/** Reproduces instance 12:1343 exactly: metadata shown, review and price off. */
export const FigmaNode: Story = { name: 'Figma node 12:1343', ...args({ imageState: 'hover', review: false, price: false }) };

/* ---- cardContainer · state -------------------------------------------- */
export const StateEnable: Story = { name: 'state = enable', ...args({ state: 'enable' }) };
export const StateHover: Story = { name: 'state = hover', ...args({ state: 'hover' }) };

/* ---- cardLayout · orientation, hasSlot -------------------------------- */
export const OrientationVertical: Story = { name: 'orientation = vertical', ...args({ orientation: 'vertical' }) };
// Node 8:1250 defaults hasSlot to true, so the story does too. The component
// default stays false, matching instance 12:1343.
export const OrientationHorizontal: Story = { name: 'orientation = horizontal', ...args({ orientation: 'horizontal', hasSlot: true }) };
export const HasSlot: Story = { name: 'hasSlot = true', ...args({ hasSlot: true }) };

/* ---- cardImage · ratio, state, overlayAction -------------------------- */
export const Ratio3x2: Story = { name: 'ratio = 3:2', ...args({ ratio: '3:2' }) };
export const Ratio1x1: Story = { name: 'ratio = 1:1', ...args({ ratio: '1:1' }) };
export const ImageStateIdle: Story = { name: 'imageState = idle', ...args({ imageState: 'idle', image: DEMO_PHOTO }) };
export const ImageStateHover: Story = { name: 'imageState = hover', ...args({ imageState: 'hover', image: DEMO_PHOTO }) };
// Node 8:1196. cardImage publishes a 2x2 matrix, not two independent axes, and
// this row had no story (QA finding 5). It is the only case that renders the
// overlay's -1px inset and 8px radius against a square rather than a 4:3 box.
export const ImageStateHoverRatio1x1: Story = {
  name: 'imageState = hover, ratio = 1:1',
  ...args({ imageState: 'hover', ratio: '1:1', image: DEMO_PHOTO }),
};

export const OverlayActionOff: Story = { name: 'overlayAction = false', ...args({ overlayAction: false }) };

/* ---- cardText · metadata, review, price ------------------------------- */
export const MetadataOff: Story = { name: 'metadata = false', ...args({ metadata: false }) };
export const ReviewOff: Story = { name: 'review = false', ...args({ review: false }) };
export const PriceOff: Story = { name: 'price = false', ...args({ price: false }) };

/* ---- Behaviour --------------------------------------------------------- */

/** The favourite control is a real button: click or keyboard toggles it. */
export const FavouriteToggle: Story = { name: 'Favourite toggle (interactive)', ...args({ favorited: false, image: DEMO_PHOTO }) };

/** Long strings wrap rather than overflowing the container. */
export const LongContent: Story = {
  name: 'Long content',
  ...args({
    title: 'Casa do Bairro Alto com Vista para o Rio Tejo',
    locationInfo: 'Alfama, Lisbon · 1.2 km from centre · close to public transport',
  }),
};
