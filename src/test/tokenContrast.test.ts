// Contrast guard for --color-text-accent, in both modes.
//
// Why this test exists, and why it is this narrow.
//
// docs/design-gaps.md #7 records that --color-text-accent once pointed at
// orange-500 (#f0932b), which is 2.36:1 on the light surface and fails WCAG AA
// for text. It was repointed at orange-700 (#9c601c, 5.12:1). It was then
// SILENTLY REVERTED by a Figma re-export, and had to be fixed a second time.
//
// QA re-checked this on the staging build and found the cause is still live:
// get_variable_defs on 8:778 and 12:1343 still returns #f0932b for light mode,
// because the Figma variable was never updated — only the built token was. So
// the next re-export can undo it a third time, silently, and nothing would
// catch it. This test is that catch.
//
// It reads the GENERATED token data rather than the source in tokens/, so it
// fails wherever the regression enters: the Figma export, tokens/, or
// style-dictionary.config.js.
//
// SCOPE — deliberately only this one token pair.
// Several other text tokens fail 4.5:1 today, in dark mode especially
// (--color-text-warning is 2.56:1, --color-text-negative 3.29:1). Those are
// reported under "Token contrast" in docs/design-gaps.md for a designer to rule
// on. They are NOT asserted here: CLAUDE.md says a design gap is reported
// rather than filled in, and failing the suite on values nobody has decided
// would block the repo on someone else's open question. This token is
// different — the decision was already made, twice, and lost once.

import { describe, expect, it } from 'vitest';

// The generated JSON, not the CSS. Vitest returns an empty string for a `.css`
// import even with Vite's `?raw` suffix, and reading the file through node:fs
// would mean adding @types/node — which CLAUDE.md forbids when the existing
// stack already solves the problem. `resolveJsonModule` is already on, and
// build-token-data.js emits exactly these values alongside their aliases.
import coreTokens from '../../build/tokens/json/core.json';
import lightTokens from '../../build/tokens/json/semantic-color.light.json';
import darkTokens from '../../build/tokens/json/semantic-color.dark.json';

type Token = { name: string; value: string; alias: string | null };

const find = (tokens: Token[], name: string): Token => {
  const token = tokens.find((t) => t.name === name);
  if (!token) throw new Error(`token ${name} is missing from the generated set`);
  return token;
};

const channel = (hex: string, offset: number) => {
  const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return 0.2126 * channel(h, 0) + 0.7152 * channel(h, 2) + 0.0722 * channel(h, 4);
};

const contrast = (a: string, b: string) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const core = coreTokens as Token[];
const light = lightTokens as Token[];
// The dark set re-declares only what changes between modes.
const dark = [...(darkTokens as Token[]), ...light];

describe('--color-text-accent contrast', () => {
  it.each([
    ['light', light],
    ['dark', dark],
  ])('meets WCAG AA on the card surface in %s mode', (_mode, tokens) => {
    const text = find(tokens, 'color-text-accent');
    const surface = find(tokens, 'color-bg-surface-primary');

    expect(contrast(text.value, surface.value)).toBeGreaterThanOrEqual(4.5);
  });

  it('still aliases orange-700 in light mode, not orange-500', () => {
    // The exact regression, twice over. Asserted on the ALIAS rather than the
    // hex, because a re-export changes the alias — checking the resolved value
    // alone would miss a case where orange-700 itself drifted lighter.
    expect(find(light, 'color-text-accent').alias).toBe('{color-orange-700}');
  });

  it('orange-500 is still the one that fails, so the guard is pointing at the right token', () => {
    // If orange-500 ever became AA-passing, this test's premise would be stale
    // and the guard above would be protecting nothing. Fail loudly if so.
    const surface = find(light, 'color-bg-surface-primary');
    expect(contrast(find(core, 'color-orange-500').value, surface.value)).toBeLessThan(4.5);
  });
});
