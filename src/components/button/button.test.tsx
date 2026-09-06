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

  it('passes through native button attributes', () => {
    render(<Button aria-label="Sign in to Horizon" name="signin">Sign in</Button>);
    expect(button().getAttribute('aria-label')).toBe('Sign in to Horizon');
    expect(button().name).toBe('signin');
  });
});
