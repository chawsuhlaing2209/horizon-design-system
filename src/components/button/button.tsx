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
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'children'>;

export const Button = ({
  variant = 'filled',
  state = 'enable',
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    type={type}
    className="hds-button"
    data-variant={variant}
    data-state={state}
    data-node-id="26:70"
    disabled={state === 'disabled'}
  >
    {children}
  </button>
);

export default Button;
