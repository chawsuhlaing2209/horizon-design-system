// cardLayout — Figma node 8:1251
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=8-1251
//
// Figma description: "Subcomponent of the Card. Use to configure the
// orientation of the card."
//
// Variants: orientation = vertical | horizontal, plus hasSlot.

import type { ReactNode } from 'react';
import './cardLayout.css';

export type CardLayoutOrientation = 'vertical' | 'horizontal';

export type CardLayoutProps = {
  /** Figma `orientation`. Stacks the image above the text, or beside it. */
  orientation?: CardLayoutOrientation;
  /** Figma `hasSlot`. Reserves the slot below the text for extra content. */
  hasSlot?: boolean;
  /** Rendered into the slot when hasSlot is true. */
  slot?: ReactNode;
  /** cardImage. */
  image: ReactNode;
  /** cardText. */
  text: ReactNode;
};

export const CardLayout = ({
  orientation = 'vertical',
  hasSlot = false,
  slot,
  image,
  text,
}: CardLayoutProps) => (
  <div className="hds-card-layout" data-orientation={orientation} data-node-id="8:1251">
    {image}
    <div className="hds-card-layout__body">
      {text}
      {hasSlot && <div className="hds-card-layout__slot" data-node-id="8:1315">{slot}</div>}
    </div>
  </div>
);

export default CardLayout;
