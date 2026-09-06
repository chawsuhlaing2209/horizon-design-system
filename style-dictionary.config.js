// Style Dictionary v5 configuration.
//
// tools.md names this file as the token config; build-tokens.js is the runner.
// Source is tokens/*.json, the committed Figma "Design Tokens" plugin export.
// Output is build/tokens/, which is generated and gitignored — never edit it.

import StyleDictionary from 'style-dictionary';

const T = 'tokens/';
export const CORE = T + 'core.value.tokens.json';
export const STYLES = [T + 'typography.styles.tokens.json', T + 'effects.styles.tokens.json'];
export const src = (name) => T + name;

export const BUILD = 'build/tokens/';

// Figma writes font weight as a style NAME. CSS needs a number.
const WEIGHTS = { Thin:100, ExtraLight:200, Light:300, Regular:400, Medium:500,
                  SemiBold:600, 'Semi Bold':600, Bold:700, ExtraBold:800, Black:900 };

// Runs BEFORE any transform, so the shorthand sees the fixed values.
StyleDictionary.registerPreprocessor({
  name: 'typography/fix',
  preprocessor: (dict) => {
    const walk = (node) => {
      for (const key of Object.keys(node)) {
        const t = node[key];
        if (!t || typeof t !== 'object') continue;
        if (t.$type === 'typography' && t.$value) {
          const v = t.$value;
          t.$value = {
            ...v,
            fontWeight: WEIGHTS[v.fontWeight] ?? v.fontWeight,
            lineHeight: typeof v.lineHeight === 'number'
              ? { value: v.lineHeight, unit: 'px' }
              : v.lineHeight,
          };
        } else {
          walk(t);
        }
      }
      return node;
    };
    return walk(dict);
  },
});

export const css = (name, sources, selector, filter) =>
  new StyleDictionary({
    source: sources,
    preprocessors: ['typography/fix'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: BUILD + 'css/',
        files: [{ destination: name, format: 'css/variables',
                  options: { selector, showFileHeader: false }, filter }],
      },
    },
  });

export const native = (sources) =>
  new StyleDictionary({
    source: sources,
    preprocessors: ['typography/fix'],
    platforms: {
      ios: { transformGroup: 'ios-swift', buildPath: BUILD + 'ios/',
             files: [{ destination: 'Tokens.swift', format: 'ios-swift/class.swift',
                       options: { className: 'Tokens' } }] },
      android: { transformGroup: 'android', buildPath: BUILD + 'android/',
                 files: [{ destination: 'colors.xml', format: 'android/resources',
                           resourceType: 'color', filter: { $type: 'color' } }] },
    },
  });
