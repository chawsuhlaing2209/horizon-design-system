// Structural and behavioural tests for button (26:70).
//
// Rendered with react-dom directly rather than a testing library: react-dom is
// already in the stack, and CLAUDE.md forbids adding a dependency to solve a
// problem the existing stack already solves. Mirrors card.test.tsx.

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import type { ButtonState, ButtonVariant } from './button';

let host: HTMLDivElement;
let root: Root;

const render = (ui: React.ReactNode) => {
  act(() => { root.render(ui); });
};

const button = () => host.querySelector('button.hds-button') as HTMLButtonElement;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => { root.unmount(); });
  host.remove();
});

describe('button', () => {
  it('renders a real button element, not a div', () => {
    render(<Button>Sign in</Button>);
    expect(button()).toBeTruthy();
    expect(button().tagName).toBe('BUTTON');
  });

  it('defaults to type=button so it never submits a form by accident', () => {
    render(<Button>Sign in</Button>);
    expect(button().type).toBe('button');
  });

  it('renders the label', () => {
    render(<Button>Sign in</Button>);
    expect(button().textContent).toBe('Sign in');
  });

  it('defaults to variant=filled, state=enable', () => {
    render(<Button>Sign in</Button>);
    expect(button().dataset.variant).toBe('filled');
    expect(button().dataset.state).toBe('enable');
  });

  it('records the Figma node it was built from', () => {
    render(<Button>Sign in</Button>);
    expect(button().dataset.nodeId).toBe('26:70');
  });

  // Every row of the variant matrix reaches the DOM as its own pair of hooks,
  // which is what the CSS selects on.
  const matrix: Array<[ButtonVariant, ButtonState]> = [
    ['filled', 'enable'],
    ['filled', 'hover'],
    ['filled', 'pressed'],
    ['filled', 'disabled'],
    ['outlined', 'enable'],
    ['outlined', 'hover'],
    ['outlined', 'pressed'],
    ['outlined', 'disabled'],
  ];

  it.each(matrix)('variant=%s state=%s reaches the DOM', (variant, state) => {
    render(<Button variant={variant} state={state}>Sign in</Button>);
    expect(button().dataset.variant).toBe(variant);
    expect(button().dataset.state).toBe(state);
  });

  describe('state=disabled', () => {
    it('sets the native disabled attribute', () => {
      render(<Button state="disabled">Sign in</Button>);
      expect(button().disabled).toBe(true);
    });

    it('does not fire onClick', () => {
      const onClick = vi.fn();
      render(<Button state="disabled" onClick={onClick}>Sign in</Button>);
      act(() => { button().dispatchEvent(new MouseEvent('click', { bubbles: true })); });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it.each(['enable', 'hover', 'pressed'] as const)('state=%s stays enabled and fires onClick', (state) => {
    const onClick = vi.fn();
    render(<Button state={state} onClick={onClick}>Sign in</Button>);
    expect(button().disabled).toBe(false);
    act(() => { button().dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Keyboard activation is the platform's job, and neither this suite nor the
  // QA harness can deliver a trusted keypress — a bare native <button> injected
  // into a real page records zero clicks from a synthetic Enter too. So these
  // do not assert that Enter fires onClick. They assert the three things that
  // would BREAK native activation if they were wrong, which is the part that is
  // actually ours. Logged as a coverage gap in docs/design-gaps.md.
  describe('keyboard activation is not obstructed', () => {
    it('is a native button, not a div with a role', () => {
      render(<Button>Sign in</Button>);
      expect(button().tagName).toBe('BUTTON');
      expect(button().getAttribute('role')).toBe(null);
    });

    it('is in the tab order and is not given a hand-rolled tabIndex', () => {
      render(<Button>Sign in</Button>);
      expect(button().tabIndex).toBe(0);
      expect(button().hasAttribute('tabindex')).toBe(false);
    });

    it('does not intercept keydown, and passes a handler through', () => {
      const onKeyDown = vi.fn();
      render(<Button onKeyDown={onKeyDown}>Sign in</Button>);
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      act(() => { button().dispatchEvent(event); });
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      // Nothing in the component calls preventDefault, so the browser is still
      // free to synthesise the click.
      expect(event.defaultPrevented).toBe(false);
    });
  });

  // QA found this by reading the type, not the render: `className` is public via
  // ButtonHTMLAttributes, and spreading rest before writing className silently
  // dropped whatever a consumer passed. Nothing exercised the path.
  describe('className', () => {
    it('keeps hds-button when a consumer passes nothing', () => {
      render(<Button>Sign in</Button>);
      expect(button().className).toBe('hds-button');
    });

    it('merges a consumer class instead of discarding it', () => {
      render(<Button className="checkout__cta">Sign in</Button>);
      expect(button().classList.contains('hds-button')).toBe(true);
      expect(button().classList.contains('checkout__cta')).toBe(true);
    });

    it('never lets a consumer class replace hds-button', () => {
      render(<Button className="checkout__cta">Sign in</Button>);
      expect(button().className.startsWith('hds-button')).toBe(true);
    });

    it('still applies the variant and state hooks alongside it', () => {
      render(<Button className="checkout__cta" variant="outlined" state="hover">Sign in</Button>);
      expect(button().dataset.variant).toBe('outlined');
      expect(button().dataset.state).toBe('hover');
    });
  });

  // The derived attributes are written after the spread on purpose, so a
  // consumer cannot desynchronise the rendered state from the props.
  it('does not let a consumer override the derived attributes', () => {
    render(
      <Button variant="filled" state="enable" {...({ 'data-variant': 'outlined', 'data-state': 'pressed' } as object)}>
        Sign in
      </Button>
    );
    expect(button().dataset.variant).toBe('filled');
    expect(button().dataset.state).toBe('enable');
  });

  it('passes through native button attributes', () => {
    render(<Button aria-label="Sign in to Horizon" name="signin">Sign in</Button>);
    expect(button().getAttribute('aria-label')).toBe('Sign in to Horizon');
    expect(button().name).toBe('signin');
  });
});
