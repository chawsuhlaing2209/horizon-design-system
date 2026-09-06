// Structural and behavioural tests for card and its subcomponents.
//
// Rendered with react-dom directly rather than a testing library: react-dom is
// already in the stack, and CLAUDE.md forbids adding a dependency to solve a
// problem the existing stack already solves.

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Card } from './card';

let host: HTMLDivElement;
let root: Root;

const render = (ui: React.ReactNode) => {
  act(() => { root.render(ui); });
};

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => { root.unmount(); });
  host.remove();
});

const q = (sel: string) => host.querySelector(sel);

describe('card — composition', () => {
  it('reintegrates all four subcomponents', () => {
    render(<Card />);
    expect(q('[data-node-id="8:804"]')).toBeTruthy();   // cardContainer
    expect(q('[data-node-id="8:1251"]')).toBeTruthy();  // cardLayout
    expect(q('[data-node-id="8:1186"]')).toBeTruthy();  // cardImage
    expect(q('[data-node-id="8:778"]')).toBeTruthy();   // cardText
  });

  it('keeps the two Figma `state` properties independent', () => {
    render(<Card container={{ state: 'hover' }} image={{ state: 'idle' }} />);
    expect(q('.hds-card')?.getAttribute('data-state')).toBe('hover');
    expect(q('.hds-card-image')?.getAttribute('data-state')).toBe('idle');
  });
});

describe('cardContainer — state', () => {
  it.each(['enable', 'hover'] as const)('renders state=%s', (state) => {
    render(<Card container={{ state }} />);
    expect(q('.hds-card')?.getAttribute('data-state')).toBe(state);
  });
});

describe('cardLayout — orientation and hasSlot', () => {
  it.each(['vertical', 'horizontal'] as const)('renders orientation=%s', (orientation) => {
    render(<Card layout={{ orientation }} />);
    expect(q('.hds-card-layout')?.getAttribute('data-orientation')).toBe(orientation);
  });

  it('omits the slot by default and renders it when hasSlot is true', () => {
    render(<Card />);
    expect(q('.hds-card-layout__slot')).toBeNull();

    render(<Card layout={{ hasSlot: true }} slot={<span>filler</span>} />);
    expect(q('.hds-card-layout__slot')?.textContent).toBe('filler');
  });
});

describe('cardImage — ratio, state, overlayAction', () => {
  it.each(['3:2', '1:1'] as const)('renders ratio=%s', (ratio) => {
    render(<Card image={{ ratio }} />);
    expect(q('.hds-card-image')?.getAttribute('data-ratio')).toBe(ratio);
  });

  it('drops the favourite button when overlayAction is false', () => {
    render(<Card image={{ overlayAction: false }} />);
    expect(q('.hds-card-image__favorite')).toBeNull();
  });

  it('falls back to a surface when no photo is supplied', () => {
    render(<Card />);
    expect(q('.hds-card-image__photo--empty')).toBeTruthy();

    render(<Card image={{ image: 'photo.png', imageAlt: 'a house' }} />);
    const img = q('.hds-card-image__photo') as HTMLImageElement | null;
    expect(img?.tagName).toBe('IMG');
    expect(img?.getAttribute('alt')).toBe('a house');
  });
});

describe('cardText — metadata, review, price', () => {
  it('hides the whole metadata block when metadata is false', () => {
    render(<Card text={{ metadata: false }} />);
    expect(q('.hds-card-text__meta')).toBeNull();
    expect(q('.hds-card-text__rating')).toBeNull();
    expect(q('.hds-card-text__price')).toBeNull();
  });

  it('hides only the review row when review is false', () => {
    render(<Card text={{ review: false }} />);
    expect(q('.hds-card-text__rating')).toBeNull();
    expect(q('.hds-card-text__price')).toBeTruthy();
  });

  it('hides only the price row when price is false', () => {
    render(<Card text={{ price: false }} />);
    expect(q('.hds-card-text__rating')).toBeTruthy();
    expect(q('.hds-card-text__price')).toBeNull();
  });

  // QA finding 1. Instance 12:1343 keeps the metadata container at its full
  // height with both rows hidden, so the card holds 296.25 either way. The
  // reserve is a CSS min-height composed from the two rows' own line-height
  // tokens; jsdom does no layout, so what is asserted here is its precondition —
  // the container must still be in the tree when both rows are hidden.
  it('keeps the metadata container when both rows are hidden', () => {
    render(<Card text={{ review: false, price: false }} />);
    expect(q('.hds-card-text__meta')).toBeTruthy();
    expect(q('.hds-card-text__rating')).toBeNull();
    expect(q('.hds-card-text__price')).toBeNull();
    expect(q('.hds-card-text__meta')?.children.length).toBe(0);
  });

  it('drops the container entirely when metadata is false', () => {
    render(<Card text={{ metadata: false, review: false, price: false }} />);
    expect(q('.hds-card-text__meta')).toBeNull();
  });

  it('renders the node copy by default', () => {
    render(<Card />);
    expect(q('.hds-card-text__title')?.textContent).toBe('Casa do Bairro');
    expect(q('.hds-card-text__location')?.textContent).toBe('Alfama, Lisbon · 1.2 km from centre');
  });
});

describe('favourite button — behaviour', () => {
  it('is a real button with an accessible name and pressed state', () => {
    render(<Card />);
    const btn = q('.hds-card-image__favorite') as HTMLButtonElement;
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.type).toBe('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Save to favourites');
    expect(btn.tabIndex).toBe(0);
  });

  it('reports the next pressed state when clicked', () => {
    const onFavoriteToggle = vi.fn();
    render(<Card image={{ favorited: false, onFavoriteToggle }} />);
    const btn = q('.hds-card-image__favorite') as HTMLButtonElement;

    act(() => { btn.click(); });
    expect(onFavoriteToggle).toHaveBeenCalledWith(true);
  });

  // QA finding 3. The suite previously asserted only that the callback fired,
  // which passed against a button whose pressed state never changed.
  it('actually toggles its pressed state when uncontrolled', () => {
    render(<Card image={{ defaultFavorited: false }} />);
    const btn = q('.hds-card-image__favorite') as HTMLButtonElement;
    expect(btn.getAttribute('aria-pressed')).toBe('false');

    act(() => { btn.click(); });
    expect(btn.getAttribute('aria-pressed')).toBe('true');

    act(() => { btn.click(); });
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('honours a controlled value and does not self-update', () => {
    const onFavoriteToggle = vi.fn();
    render(<Card image={{ favorited: true, onFavoriteToggle }} />);
    const btn = q('.hds-card-image__favorite') as HTMLButtonElement;

    act(() => { btn.click(); });
    expect(onFavoriteToggle).toHaveBeenCalledWith(false);
    // Controlled: the owner decides, so the DOM must not move on its own.
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('fills the glyph only while pressed', () => {
    render(<Card image={{ defaultFavorited: false }} />);
    const icon = () => q('.hds-icon') as HTMLElement;
    expect(icon().style.fontVariationSettings).toContain("'FILL' 0");

    act(() => { (q('.hds-card-image__favorite') as HTMLButtonElement).click(); });
    expect(icon().style.fontVariationSettings).toContain("'FILL' 1");
  });
});

// QA finding 4. The overlay rule used to be `.hds-card:hover`, an ancestor
// selector, so hovering the card's text tinted the image and beat the prop.
describe('cardImage — overlay state is not overridden by the card', () => {
  it('marks the image `auto` when no state is pinned', () => {
    render(<Card />);
    expect(q('.hds-card-image')?.getAttribute('data-state')).toBe('auto');
  });

  it.each(['idle', 'hover'] as const)('pins data-state=%s when supplied', (state) => {
    render(<Card image={{ state }} />);
    expect(q('.hds-card-image')?.getAttribute('data-state')).toBe(state);
  });

  it('keeps container and image state independent', () => {
    render(<Card container={{ state: 'hover' }} image={{ state: 'idle' }} />);
    expect(q('.hds-card')?.getAttribute('data-state')).toBe('hover');
    expect(q('.hds-card-image')?.getAttribute('data-state')).toBe('idle');
  });

  it('renders the Material Symbols favorite glyph', () => {
    render(<Card />);
    const icon = q('.hds-icon');
    expect(icon?.classList.contains('material-symbols-outlined')).toBe(true);
    expect(icon?.textContent).toBe('favorite');
  });
});
