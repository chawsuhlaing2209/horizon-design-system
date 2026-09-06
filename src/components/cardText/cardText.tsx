// cardText — Figma node 8:778
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=8-778
//
// Figma description: "Subcomponent of the card. Use to configure card text and
// visibility."
//
// Properties: metadata, review, price — all booleans.

import './cardText.css';

export type CardTextProps = {
  /** Figma `metadata`. Shows the rating and price block as a whole. */
  metadata?: boolean;
  /** Figma `review`. Shows the rating score and review count row. */
  review?: boolean;
  /** Figma `price`. Shows the price row. */
  price?: boolean;

  title?: string;
  locationInfo?: string;
  ratingScore?: string;
  reviewCount?: string;
  priceAmount?: string;
  priceInfo?: string;
};

export const CardText = ({
  metadata = true,
  review = true,
  price = true,
  title = 'Casa do Bairro',
  locationInfo = 'Alfama, Lisbon · 1.2 km from centre',
  ratingScore = '4.7',
  reviewCount = '(318 reviews)',
  priceAmount = '121 EUR',
  priceInfo = 'per night',
}: CardTextProps) => (
  <div className="hds-card-text" data-node-id="8:778">
    <div className="hds-card-text__heading" data-node-id="8:767">
      <p className="hds-card-text__title" data-node-id="8:768">{title}</p>
      <p className="hds-card-text__location" data-node-id="8:769">{locationInfo}</p>
    </div>

    {metadata && (
      <div className="hds-card-text__meta" data-node-id="8:770">
        {review && (
          <div className="hds-card-text__row" data-node-id="8:771">
            <p className="hds-card-text__rating" data-node-id="8:772">{ratingScore}</p>
            <p className="hds-card-text__review-count" data-node-id="8:773">{reviewCount}</p>
          </div>
        )}
        {price && (
          <div className="hds-card-text__row" data-node-id="8:774">
            <p className="hds-card-text__price" data-node-id="8:775">{priceAmount}</p>
            <p className="hds-card-text__price-info" data-node-id="8:776">{priceInfo}</p>
          </div>
        )}
      </div>
    )}
  </div>
);

export default CardText;
