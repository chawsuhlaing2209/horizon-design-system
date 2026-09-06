// card — Figma node 12:1343
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=12-1343
//
// The organism. Per CLAUDE.md it is composed from its subcomponents rather than
// reimplementing them:
//
//   cardContainer  8:804    state
//   cardLayout     8:1251   orientation, hasSlot
//   cardImage      8:1186   ratio, state, overlayAction
//   cardText       8:778    metadata, review, price
//
// Prop names match the Figma property names exactly. `cardContainer.state` and
// `cardImage.state` are both called `state` in Figma; the subcomponent grouping
// below keeps both verbatim rather than renaming either. See
// docs/naming-conflicts.md.

import type { ReactNode } from 'react';

import { CardContainer, type CardContainerProps } from '../cardContainer/cardContainer';
import { CardLayout, type CardLayoutProps } from '../cardLayout/cardLayout';
import { CardImage, type CardImageProps } from '../cardImage/cardImage';
import { CardText, type CardTextProps } from '../cardText/cardText';

export type CardProps = {
  /** cardContainer 8:804 — `state`. */
  container?: CardContainerProps;
  /** cardLayout 8:1251 — `orientation`, `hasSlot`. */
  layout?: Omit<CardLayoutProps, 'image' | 'text'>;
  /** cardImage 8:1186 — `ratio`, `state`, `overlayAction`, and the photo. */
  image?: CardImageProps;
  /** cardText 8:778 — `metadata`, `review`, `price`, and the copy. */
  text?: CardTextProps;
  /** Rendered into cardLayout's slot when `layout.hasSlot` is true. */
  slot?: ReactNode;
};

export const Card = ({ container, layout, image, text, slot }: CardProps) => (
  <CardContainer {...container}>
    <CardLayout
      {...layout}
      slot={slot}
      image={<CardImage {...image} />}
      text={<CardText {...text} />}
    />
  </CardContainer>
);

export default Card;
