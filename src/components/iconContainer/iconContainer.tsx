// iconContainer — Figma node 8:895
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=8-895
//
// Figma description: "Use this component to hold and present icons, ensuring
// they are properly aligned and spaced within the interface."
//
// Icons are Material Symbols, per CLAUDE.md. The face is loaded from the Google
// Fonts CDN in .storybook/fonts.css; the glyph is selected by its ligature name.

import './iconContainer.css';

export type IconContainerProps = {
  /** Material Symbols ligature name, e.g. `favorite`. */
  name: string;
  /** Filled axis of the variable font. The Figma heart is filled. */
  filled?: boolean;
};

export const IconContainer = ({ name, filled = true }: IconContainerProps) => (
  <span className="hds-icon-container" data-node-id="8:895">
    <span
      className="material-symbols-outlined hds-icon"
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
      aria-hidden="true"
    >
      {name}
    </span>
  </span>
);

export default IconContainer;
