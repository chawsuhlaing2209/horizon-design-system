// Writes the two stylesheets the package exports. Runs after the library build
// (tsup cleans dist/), and after the token build, whose output it reads.
//
//   dist/styles.css  src/styles.css with its local @imports inlined
//   dist/tokens.css  build/tokens/css/tokens.css + tokens-dark.css
//
// No bundler: the only job is inlining local @imports, and the remote font
// @imports must stay @imports, hoisted to the top where CSS requires them.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUT = 'dist/';
const IMPORT = /^@import\s+(?:url\()?\s*['"]([^'"]+)['"]\s*\)?\s*;\s*$/gm;

const read = (path) => {
  if (!existsSync(path)) {
    console.error(`build-css: ${path} is missing.` +
      (path.startsWith('build/') ? ' Run `npm run build:tokens` first.' : ''));
    process.exit(1);
  }
  return readFileSync(path, 'utf8');
};

const remote = [];
const inline = (path) =>
  read(path).replace(IMPORT, (line, spec) => {
    if (/^(https?:)?\/\//.test(spec)) {
      if (!remote.includes(line)) remote.push(line);
      return '';
    }
    return inline(resolve(dirname(path), spec));
  });

mkdirSync(OUT, { recursive: true });

const body = inline('src/styles.css');
writeFileSync(OUT + 'styles.css', `${remote.join('\n')}\n\n${body.trim()}\n`);

writeFileSync(OUT + 'tokens.css',
  `${read('build/tokens/css/tokens.css').trim()}\n\n` +
  `${read('build/tokens/css/tokens-dark.css').trim()}\n`);

console.log('build-css: wrote dist/styles.css, dist/tokens.css');
