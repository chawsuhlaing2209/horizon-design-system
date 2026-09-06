// button — Figma node 26:70
// https://www.figma.com/design/r1CpQEYecqROS0oIOMlqAx/2.-Horizon-Component?node-id=26-70
//
// The atom. Two variant properties in Figma, both kept verbatim:
//
//   variant  filled | outlined
//   state    enable | hover | pressed | disabled
//
// `state` is a pin, not the only driver. Real `:hover` and `:active` render the
// same tokens, so the component behaves as a button; `state` forces one of them
// so a story or a QA pass can hold a state still and look at it. This is the
// same arrangement cardContainer uses for its own `state`.
//
// The label is `children`. Figma carries "Sign in" as sample content on the
// node rather than as a text property, so there is no design-named prop for it
// and no default here — a button without a label is a bug, not a variant.

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

export type ButtonVariant = 'filled' | 'outlined';
export type ButtonState = 'enable' | 'hover' | 'pressed' | 'disabled';

export type ButtonProps = {
  /** Figma `variant`. */
  variant?: ButtonVariant;
  /** Figma `state`. `disabled` also sets the native `disabled` attribute. */
  state?: ButtonState;
  /** The label. Compose an icon alongside it and the gap token applies. */
  children: ReactNode;
  /** Merged after `hds-button`, never in place of it. Not a Figma property. */
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'children'>;

export const Button = ({
  variant = 'filled',
  state = 'enable',
  children,
  type = 'button',
  className,
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    type={type}
    // `className` is destructured above rather than left in `rest` on purpose.
    // Spreading rest first and then writing className would silently drop a
    // consumer's class — the prop is in the public type via
    // ButtonHTMLAttributes, so it has to actually work. `hds-button` stays
    // first so the component's own styles are never the thing that goes
    // missing. Everything else in rest is still overridden by the explicit
    // attributes below, which is deliberate: `data-variant`, `data-state` and
    // `disabled` are derived from props and are not a consumer's to set.
    className={className ? `hds-button ${className}` : 'hds-button'}
    data-variant={variant}
    data-state={state}
    data-node-id="26:70"
    disabled={state === 'disabled'}
  >
    {children}
  </button>
);

export default Button;
