// cardImage — Figma node 8:1186
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=8-1186
//
// Figma description: "Subcomponent of the card. Use to configure card image
// ratio and state."
//
// Variants: state = idle | hover, ratio = 3:2 | 1:1, plus overlayAction.

import { useState } from 'react';
import { IconContainer } from '../iconContainer/iconContainer';
import './cardImage.css';

export type CardImageRatio = '3:2' | '1:1';
export type CardImageState = 'idle' | 'hover';

export type CardImageProps = {
  /** Figma `ratio`. Note: the `3:2` variant renders 4:3 — see docs/design-gaps.md. */
  ratio?: CardImageRatio;
  /**
   * Figma `state`. Pins the overlay: `hover` forces it on, `idle` forces it off.
   *
   * Omit it — the default — and the overlay follows a real pointer over the
   * image itself. A pinned value always wins over the pointer, so a story can
   * hold either state for review. Hovering any other part of the card does not
   * affect it; the two `state` properties are independent in the node.
   */
  state?: CardImageState;
  /** Figma `overlayAction`. Shows the favourite button over the image. */
  overlayAction?: boolean;

  /** Photo src. Empty in the node, so a quiet surface stands in. */
  image?: string;
  /** Alt text. Empty means decorative. */
  imageAlt?: string;

  /**
   * Pressed state of the favourite button.
   *
   * Controlled when supplied: the component renders exactly this and reports
   * changes through `onFavoriteToggle`, which must update it. Omit it and the
   * button manages its own state from `defaultFavorited`.
   */
  favorited?: boolean;
  /** Initial pressed state when `favorited` is not supplied. */
  defaultFavorited?: boolean;
  /** Called with the next pressed state. Required if `favorited` is supplied. */
  onFavoriteToggle?: (next: boolean) => void;
  favoriteLabel?: string;
};

export const CardImage = ({
  ratio = '3:2',
  state,
  overlayAction = true,
  image,
  imageAlt = '',
  favorited,
  defaultFavorited = true,
  onFavoriteToggle,
  favoriteLabel = 'Save to favourites',
}: CardImageProps) => {
  // Controlled when `favorited` is supplied, uncontrolled otherwise — the
  // standard React pairing. Without the uncontrolled path a consumer who omits
  // the handler ships a button that reports aria-pressed="false" forever.
  const isControlled = favorited !== undefined;
  const [internal, setInternal] = useState(defaultFavorited);
  const pressed = isControlled ? favorited : internal;

  const toggle = () => {
    const next = !pressed;
    if (!isControlled) setInternal(next);
    onFavoriteToggle?.(next);
  };

  return (
    <div
      className="hds-card-image"
      data-ratio={ratio}
      // `auto` means no pinned state: CSS lets a real pointer over the image
      // drive the overlay. `idle` and `hover` both beat the pointer.
      data-state={state ?? 'auto'}
      data-node-id="8:1186"
    >
      {image ? (
        <img className="hds-card-image__photo" src={image} alt={imageAlt} />
      ) : (
        <div className="hds-card-image__photo hds-card-image__photo--empty" />
      )}

      {/* Overlay 8:1182 — shown in the hover variant. Rendered always so a real
          pointer hover can drive it; CSS decides visibility. */}
      <div className="hds-card-image__overlay" data-node-id="8:1182" />

      {overlayAction && (
        <button
          type="button"
          className="hds-card-image__favorite"
          aria-pressed={pressed}
          aria-label={favoriteLabel}
          onClick={toggle}
          data-node-id="8:1166"
        >
          <IconContainer name="favorite" filled={pressed} />
        </button>
      )}
    </div>
  );
};

export default CardImage;
