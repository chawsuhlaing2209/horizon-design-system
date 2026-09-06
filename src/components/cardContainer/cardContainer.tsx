// cardContainer — Figma node 8:804
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=8-804
//
// Figma description: "Use as a container to place card's subcomponents. Do not
// use this for other components."
//
// Variants: state = enable | hover.

import type { ReactNode } from 'react';
import './cardContainer.css';

export type CardContainerState = 'enable' | 'hover';

export type CardContainerProps = {
  /** Figma `state`. `hover` raises the card on elevation/level2. */
  state?: CardContainerState;
  /** cardItems slot — 8:810. */
  children?: ReactNode;
};

export const CardContainer = ({ state = 'enable', children }: CardContainerProps) => (
  <article className="hds-card" data-state={state} data-node-id="8:804">
    <div className="hds-card__items" data-node-id="8:810">{children}</div>
  </article>
);

export default CardContainer;
