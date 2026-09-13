// Publishes the package to npm. The only sanctioned way to do it: package.json
// carries "private": true so a stray `npm publish` is refused, and this script
// lifts that guard for exactly one command.
//
//   npm run release:publish -- <version> [--dry-run]
//
// In order:
//   1. preflight   on main and level with origin/main, version matches
//                  package.json, clean tree, tag unused, logged in
//   2. registry    refuse if <name>@<version> is already published
//   3. gates       lint, build:package, test, and every exports target in the pack
//   4. publish     "private" removed, `npm publish`, "private" restored at once
//   5. tag         annotated v<version>, pushed to origin
//   6. smoke test  install the published version into an empty folder and
//                  render components from it, through both ESM and CJS
//
// --dry-run runs every gate, passes --dry-run to npm publish, skips the tag, and
// smoke-tests the packed tarball instead of the registry copy. It may run off
// main or with a dirty tree, with a warning, so a release can be rehearsed on a
// branch; a real release cannot.
//
// The restore of "private": true is registered three ways — called inline right
// after publish, on process 'exit', and on SIGINT (and SIGTERM). Not `finally`:
// process.exit() skips finally blocks, and a skipped restore leaves the repo
// publishable with nothing reporting it. The 'exit' listener runs on
// process.exit(), on a normal end, and on an uncaught exception. Nothing can
// catch SIGKILL; if that happens, `git diff package.json` shows the damage.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const PKG = resolve('package.json');
const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;

const fail = (message) => {
  console.error(`\nrelease:publish: ${message}`);
  process.exit(1);
};

const step = (title) => console.log(`\n== ${title}`);

const run = (cmd, args, options = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  if (r.status !== 0) {
    fail(`\`${cmd} ${args.join(' ')}\` failed (${r.signal ?? `exit ${r.status}`}).`);
  }
};

const capture = (cmd, args, options = {}) =>
  spawnSync(cmd, args, { encoding: 'utf8', ...options });

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// ---- arguments ---------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const unknown = args.filter((a) => a.startsWith('-') && a !== '--dry-run');
const positional = args.filter((a) => !a.startsWith('-'));

if (unknown.length) fail(`unknown option ${unknown.join(', ')}.`);
if (positional.length !== 1) fail('usage: npm run release:publish -- <version> [--dry-run]');

const version = positional[0];
if (!SEMVER.test(version)) fail(`"${version}" is not a semver version.`);

const original = readFileSync(PKG, 'utf8');
const pkg = JSON.parse(original);
const spec = `${pkg.name}@${version}`;
const tag = `v${version}`;

console.log(`release:publish ${spec}${dryRun ? ' (dry run)' : ''}`);

// ---- 1. preflight ------------------------------------------------------------

step('preflight');

if (pkg.private !== true) {
  fail('package.json is missing "private": true. The guard must be in place before a release ' +
       '— if a previous run was killed, restore it with `git checkout package.json`.');
}

// The version is committed before release, not written here, so the tag below
// points at a commit whose package.json says the same thing the registry does.
if (pkg.version !== version) {
  fail(`package.json says ${pkg.version}, not ${version}. Commit the version bump first.`);
}

// Releases come from main only, and main only takes PRs from staging
// (CLAUDE.md), so everything published has been through staging and QA. Level
// with origin/main, not just on it: a local commit ahead of origin never went
// through that PR.
const offMain = (message) => {
  if (dryRun) console.warn(`warning: ${message} (allowed for --dry-run)`);
  else fail(`${message} Releases publish from main only.`);
};
const branch = capture('git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim();
if (branch !== 'main') {
  offMain(`on branch "${branch}", not main.`);
} else {
  const fetched = capture('git', ['fetch', 'origin', 'main']);
  if (fetched.status !== 0) fail(`could not fetch origin/main:\n${fetched.stderr}`);
  const head = capture('git', ['rev-parse', 'HEAD']).stdout.trim();
  const remote = capture('git', ['rev-parse', 'origin/main']).stdout.trim();
  if (head !== remote) offMain('main is not level with origin/main — pull, or merge through staging.');
}

const dirty = capture('git', ['status', '--porcelain']).stdout.trim();
if (dirty) {
  if (dryRun) console.warn(`warning: working tree is not clean (allowed for --dry-run):\n${dirty}`);
  else fail(`working tree is not clean:\n${dirty}`);
}

if (capture('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`]).status === 0) {
  fail(`tag ${tag} already exists locally.`);
}
const remoteTag = capture('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`]);
if (remoteTag.status !== 0) fail(`could not read tags from origin:\n${remoteTag.stderr}`);
if (remoteTag.stdout.trim()) fail(`tag ${tag} already exists on origin.`);

if (!dryRun) {
  const who = capture('npm', ['whoami']);
  if (who.status !== 0) fail('not logged in to npm. Run `npm login` first.');
  console.log(`npm user: ${who.stdout.trim()}`);
}

// ---- 2. registry -------------------------------------------------------------

step('registry');

// Fails closed: anything other than "found nothing" stops the release.
const view = capture('npm', ['view', spec, 'version', '--json']);
if (view.status === 0) {
  if (view.stdout.trim()) fail(`${spec} is already on the registry.`);
  console.log(`${pkg.name} exists; ${version} is not published.`);
} else if (/E404/.test(view.stdout + view.stderr)) {
  console.log(`${pkg.name} is not on the registry yet; ${version} will be its first version.`);
} else {
  fail(`could not check the registry for ${spec}:\n${view.stderr || view.stdout}`);
}

// ---- 3. gates ----------------------------------------------------------------

step('gates');

run('npm', ['run', 'lint']);
run('npm', ['run', 'build:package']);
run('npm', ['test']);

const targets = Object.values(pkg.exports).flatMap(function flatten(t) {
  return typeof t === 'string' ? [t] : Object.values(t).flatMap(flatten);
});
const pack = capture('npm', ['pack', '--dry-run', '--json']);
if (pack.status !== 0) fail(`npm pack --dry-run failed:\n${pack.stderr}`);
const packed = new Set(JSON.parse(pack.stdout)[0].files.map((f) => `./${f.path}`));
const missing = targets.filter((t) => !packed.has(t));
if (missing.length) fail(`exports point at files the package would not contain: ${missing.join(', ')}`);
console.log(`pack contains all ${targets.length} exports targets.`);

for (const file of ['dist/index.js', 'dist/index.cjs']) {
  if (!readFileSync(file, 'utf8').startsWith('"use client";')) {
    fail(`${file} does not start with "use client"; React Server Components would reject Card.`);
  }
}

// ---- 4. publish --------------------------------------------------------------

step('publish');

let restored = true;

const restore = () => {
  if (restored) return;
  try {
    writeFileSync(PKG, original);
    restored = true;
    if (readFileSync(PKG, 'utf8') !== original) throw new Error('package.json does not match after writing it back');
    console.log('restored "private": true in package.json');
  } catch (error) {
    console.error(
      '\n!!! release:publish could not restore "private": true in package.json.\n' +
      '!!! The repo is publishable by accident. Run `git checkout package.json` now.\n' +
      `!!! ${error.message}`);
    process.exitCode = 1;
  }
};

// Registered before the file changes, so there is no window without them.
process.on('exit', restore);
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });

const publishable = { ...pkg };
delete publishable.private;
restored = false; // before the write: a crash mid-write must still restore
writeFileSync(PKG, `${JSON.stringify(publishable, null, 2)}\n`);
console.log('removed "private": true for this one command');

// prepublishOnly runs build:package and the tests once more, inside publish.
const published = spawnSync('npm', ['publish', ...(dryRun ? ['--dry-run'] : [])], { stdio: 'inherit' });
restore();
if (published.status !== 0) {
  fail(`npm publish failed (${published.signal ?? `exit ${published.status}`}). Nothing was tagged.`);
}

// ---- 5. tag ------------------------------------------------------------------

step('tag');

if (dryRun) {
  console.log(`dry run: would create and push annotated tag ${tag}`);
} else {
  const tagged = capture('git', ['tag', '-a', tag, '-m', `${spec}`], { stdio: 'inherit' });
  const pushed = tagged.status === 0 && capture('git', ['push', 'origin', tag], { stdio: 'inherit' });
  if (!pushed || pushed.status !== 0) {
    fail(`${spec} IS PUBLISHED, but tagging failed. Create and push ${tag} on this commit by hand.`);
  }
}

// ---- 6. smoke test -----------------------------------------------------------

step('smoke test');

const dir = mkdtempSync(join(tmpdir(), 'hds-smoke-'));
let source = spec;

if (dryRun) {
  const tarball = capture('npm', ['pack', '--json', '--pack-destination', dir]);
  if (tarball.status !== 0) fail(`npm pack failed:\n${tarball.stderr}`);
  source = join(dir, JSON.parse(tarball.stdout)[0].filename);
} else {
  // A fresh publish can take a moment to appear.
  for (let attempt = 1; ; attempt += 1) {
    const seen = capture('npm', ['view', spec, 'version', '--prefer-online']).stdout.trim();
    if (seen === version) break;
    if (attempt === 10) fail(`${spec} IS PUBLISHED, but did not appear on the registry to smoke-test. Smoke folder: ${dir}`);
    sleep(6000);
  }
}

writeFileSync(join(dir, 'package.json'),
  `${JSON.stringify({ name: 'hds-smoke', private: true, type: 'module' }, null, 2)}\n`);

const react = pkg.peerDependencies.react;
const reactDom = pkg.peerDependencies['react-dom'];
run('npm', ['install', '--no-audit', '--no-fund', '--prefer-online',
  source, `react@${react}`, `react-dom@${reactDom}`], { cwd: dir });

const name = JSON.stringify(pkg.name);
writeFileSync(join(dir, 'smoke.mjs'), `
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Card } from ${name};

const require = createRequire(import.meta.url);
const cjs = require(${name});
const html = (el) => renderToStaticMarkup(el);
const css = (sub) => readFileSync(require.resolve(${name} + sub), 'utf8');

const checks = [
  ['ESM: Button renders', html(createElement(Button, null, 'Sign in')).includes('class="hds-button"')],
  ['ESM: Card renders', html(createElement(Card)).includes('class="hds-card"')],
  ['CJS: Button renders', html(createElement(cjs.Button, null, 'Sign in')).includes('class="hds-button"')],
  ['styles.css resolves', css('/styles.css').includes('.hds-button')],
  ['tokens.css resolves', css('/tokens.css').includes('[data-theme="dark"]')],
  ['internals stay internal', !('CardImage' in cjs)],
  ['"use client" survives install', readFileSync(require.resolve(${name}), 'utf8').startsWith('"use client";')],
];

for (const [label, ok] of checks) console.log((ok ? 'pass  ' : 'FAIL  ') + label);
if (checks.some(([, ok]) => !ok)) process.exit(1);
`);

const smoke = spawnSync('node', ['smoke.mjs'], { cwd: dir, stdio: 'inherit' });
if (smoke.status !== 0) {
  fail(`smoke test failed${dryRun ? '' : ` — ${spec} IS PUBLISHED; deprecate it or publish a fix`}. ` +
       `Smoke folder kept: ${dir}`);
}

rmSync(dir, { recursive: true, force: true });
console.log(`\nrelease:publish: ${spec} ${dryRun ? 'passed the dry run' : 'published, tagged and smoke-tested'}.`);
if (existsSync(PKG) && JSON.parse(readFileSync(PKG, 'utf8')).private !== true) {
  fail('package.json lost "private": true. Run `git checkout package.json`.');
}
