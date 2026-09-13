// card — Figma component set 34:317
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=34-317
//
// The organism, and its own container. Figma's Card set carries the `state`
// property and the container styling itself (variants 12:1343 `state=enable`
// and 34:318 `state=hover`), so there is no separate container subcomponent.
// The rest is composed from subcomponents, per CLAUDE.md:
//
//   cardLayout  8:1251   orientation, hasSlot
//   cardImage   8:1186   ratio, state, overlayAction
//   cardText    8:778    metadata, review, price
//
// Prop names match the Figma property names exactly. Card's `state` is a prop
// on Card. cardImage also has a property called `state`; it stays on the image
// group, so neither is renamed. See docs/naming-conflicts.md.

import type { ReactNode } from 'react';

import { CardLayout, type CardLayoutProps } from '../cardLayout/cardLayout';
import { CardImage, type CardImageProps } from '../cardImage/cardImage';
import { CardText, type CardTextProps } from '../cardText/cardText';

export type CardState = 'enable' | 'hover';

export type CardProps = {
  /** Figma `state`. `hover` raises the card on elevation/level2. */
  state?: CardState;
  /** cardLayout 8:1251 — `orientation`, `hasSlot`. */
  layout?: Omit<CardLayoutProps, 'image' | 'text'>;
  /** cardImage 8:1186 — `ratio`, `state`, `overlayAction`, and the photo. */
  image?: CardImageProps;
  /** cardText 8:778 — `metadata`, `review`, `price`, and the copy. */
  text?: CardTextProps;
  /** Rendered into cardLayout's slot when `layout.hasSlot` is true. */
  slot?: ReactNode;
};

export const Card = ({ state = 'enable', layout, image, text, slot }: CardProps) => (
  <article className="hds-card" data-state={state} data-node-id="34:317">
    <div className="hds-card__items">
      <CardLayout
        {...layout}
        slot={slot}
        image={<CardImage {...image} />}
        text={<CardText {...text} />}
      />
    </div>
  </article>
);

export default Card;
