#!/usr/bin/env node
/*
 * Generates the reference half of the Horizon docs site from the design system
 * repository, the registry and the deployed Storybook.
 *
 *   node scripts/generate.mjs --repo <path to horizon-design-system at the pinned commit>
 *
 * The repo must have run `npm run build:package`, so dist/ exists.
 *
 * Inputs, and nothing else:
 *   --repo                      src/, dist/, docs/, README.md, package.json, git history and tags
 *   sources/registry-status.json the board as read this run: names and statuses only, no IDs
 *   sources/figma.json          the Figma reads this run: descriptions, nodes, variant properties
 *   reference.config.json       URLs and embed heights
 *   <storybookUrl>/index.json   the stories that exist on the deployed Storybook
 *   npm view <package> time     publish dates
 *
 * Writes (every one is overwritten on every run, so never edit them by hand):
 *   src/content/docs/index.mdx
 *   src/content/docs/core/components/overview.md
 *   src/content/docs/core/components/<name>.mdx
 *   src/content/docs/core/tokens.md
 *   src/content/docs/get-started/changelog.md
 *   src/content/docs/get-started/roadmap.md
 *   src/content/docs/get-started/news.md
 *   src/styles/tokens.generated.css
 *
 * The guides (designing/, developing/, styling/, help/, skills/, versioning,
 * upgrading) are written from the same repo by hand and checked on every run.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
if (!arg('repo')) fail('pass --repo <path to horizon-design-system at the pinned commit>');
const REPO = resolve(arg('repo'));

function fail(msg) {
  console.error(`generate: ${msg}`);
  process.exit(1);
}
const read = (p) => readFileSync(p, 'utf8');
const readJSON = (p) => JSON.parse(read(p));
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const out = (rel, text) => {
  const p = join(SITE, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text.endsWith('\n') ? text : `${text}\n`);
  console.log(`wrote ${rel}`);
};

const cfg = readJSON(join(SITE, 'reference.config.json'));
const board = readJSON(join(SITE, 'sources/registry-status.json'));
const figma = readJSON(join(SITE, 'sources/figma.json'));
for (const f of ['dist/index.d.ts', 'dist/tokens.css', 'README.md', 'package.json']) {
  if (!existsSync(join(REPO, f))) fail(`${f} missing in --repo (run npm run build:package there)`);
}
const SHA = git(REPO, 'rev-parse', 'HEAD');
const pkg = readJSON(join(REPO, 'package.json'));
const blob = (file, line) => `${cfg.repoUrl}/blob/${SHA}/${file}${line ? `?plain=1#L${line}` : ''}`;
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const today = new Date().toISOString().slice(0, 10);

/* ── Markdown helpers ─────────────────────────────────────────────────────── */

// Plain text into Markdown/MDX: keep `code` spans, escape what MDX would parse.
function md(s) {
  return String(s)
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith('`') && part.endsWith('`') && part.length > 1
      ? part
      : part.replace(/\\/g, '\\\\').replace(/[{}]/g, (c) => `\\${c}`).replace(/</g, '&lt;').replace(/>/g, '&gt;')))
    .join('');
}
const cell = (s) => md(s).replace(/\|/g, '\\|').replace(/\n/g, '<br/>');
const codeCell = (s) => `\`${String(s).replace(/\|/g, '\\|')}\``;
const table = (head, rows) => [
  `| ${head.join(' | ')} |`,
  `|${head.map(() => '---').join('|')}|`,
  ...rows.map((r) => `| ${r.join(' | ')} |`),
].join('\n');

/* ── Tokens ───────────────────────────────────────────────────────────────── */

function parseBlock(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return {};
  const body = css.slice(start, css.indexOf('\n}', start));
  const tokens = {};
  for (const m of body.matchAll(/^\s*(--[a-zA-Z0-9-]+):\s*(.*?);\s*(?:\/\*\*\s*([\s\S]*?)\s*\*\/)?\s*$/gm)) {
    tokens[m[1]] = { value: m[2], description: m[3] || '' };
  }
  return tokens;
}
const tokensCss = read(join(REPO, 'dist/tokens.css'));
const LIGHT = parseBlock(tokensCss, ':root');
const DARK = parseBlock(tokensCss, '[data-theme="dark"]');
const isColour = (v) => /^(#|rgb|hsl)/.test(v);
const swatch = (v) => (isColour(v) ? `<span class="hds-swatch" style="background:${v}"></span>` : '');
const valueCell = (v) => `${swatch(v)}${codeCell(v)}`;
const isCore = (name) => /-\d+[a-z]?$/.test(name) || /^--color-[a-z]+-\d/.test(name);
const semanticNames = Object.keys(LIGHT).filter((n) => !isCore(n));
const tokenGroup = (name) => {
  const seg = name.slice(2).split('-')[0];
  if (['display', 'headline', 'title', 'body', 'label'].includes(seg)) return 'type';
  return seg;
};

/* ── Components ───────────────────────────────────────────────────────────── */

const indexDts = read(join(REPO, 'dist/index.d.ts'));
const exportedNames = new Set([...indexDts.matchAll(/\b([A-Z]\w*)\b/g)].map((m) => m[1]));
const PUBLISHABLE = new Set(['Completed', 'Released']);
const boardRows = board.components.map((c) => ({ ...c, folder: c.name[0].toLowerCase() + c.name.slice(1) }));
const published = boardRows.filter((c) =>
  PUBLISHABLE.has(c.development) && c.releaseVerdict === 'Cleared' && exportedNames.has(c.name));
const unpublished = boardRows.filter((c) => !published.includes(c));
const publishedFolders = new Set(published.map((c) => c.folder));

function composes(folder, seen = new Set()) {
  const file = join(REPO, 'src/components', folder, `${folder}.tsx`);
  if (!existsSync(file)) return [];
  for (const m of read(file).matchAll(/from '\.\.\/(\w+)\/\1'/g)) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      composes(m[1], seen);
    }
  }
  return [...seen];
}
function importedBy(folder) {
  return readdirSync(join(REPO, 'src/components')).filter((f) => {
    const file = join(REPO, 'src/components', f, `${f}.tsx`);
    return f !== folder && existsSync(file) && new RegExp(`from '\\.\\./${folder}/${folder}'`).test(read(file));
  });
}

function parseProps(folder, typeName) {
  const file = join(REPO, 'dist/components', folder, `${folder}.d.ts`);
  const text = read(file);
  const m = text.match(new RegExp(`export type ${typeName} = \\{\\n([\\s\\S]*?)\\n\\}([^;]*);`));
  if (!m) return null;
  const rows = [];
  let doc = null;
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    let ln = lines[i].trim();
    if (ln.startsWith('/**')) {
      const buf = [ln];
      while (!buf[buf.length - 1].endsWith('*/')) buf.push(lines[(i += 1)].trim());
      doc = buf.join('\n').replace(/^\/\*\*|\*\/$/g, '').split('\n')
        .map((b) => b.replace(/^\s*\*\s?/, '').trimEnd()).join('\n').trim();
    } else if (ln) {
      const pm = ln.match(/^(\w+)(\??):\s*(.*);$/);
      if (!pm) fail(`cannot parse member of ${typeName}: ${ln}`);
      rows.push({ name: pm[1], optional: pm[2] === '?', type: pm[3], doc });
      doc = null;
    }
  }
  return { rows, tail: m[2].trim().replace(/^&\s*/, '') };
}
function parseAliases(folder) {
  const text = read(join(REPO, 'dist/components', folder, `${folder}.d.ts`));
  return [...text.matchAll(/export type (\w+) = ('[^;]*');/g)].map((m) => ({ name: m[1], values: m[2] }));
}
function parseDefaults(folder) {
  const text = read(join(REPO, 'src/components', folder, `${folder}.tsx`));
  const m = text.match(/export const [A-Z]\w* = \(\{([\s\S]*?)\}\s*:/);
  const defaults = {};
  if (m) for (const d of m[1].matchAll(/(\w+)\s*=\s*('[^']*'|"[^"]*"|true|false|-?\d+(?:\.\d+)?)/g)) defaults[d[1]] = d[2];
  return defaults;
}
function cssTokens(folder) {
  const file = join(REPO, 'src/components', folder, `${folder}.css`);
  if (!existsSync(file)) return [];
  return [...new Set([...read(file).matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map((m) => m[1]).filter((t) => !t.startsWith('--hds-')))];
}
function designGapComments(folder) {
  const rel = `src/components/${folder}/${folder}.css`;
  if (!existsSync(join(REPO, rel))) return [];
  const text = read(join(REPO, rel));
  const found = [];
  for (const m of text.matchAll(/\/\*([\s\S]*?)\*\//g)) {
    if (!/DESIGN GAP/.test(m[1])) continue;
    // The comment marks the declarations right after it, or the rule it sits on.
    // A file header, followed by neither, marks nothing.
    const after = text.slice(m.index + m[0].length).split('\n').map((l) => l.trim()).filter(Boolean);
    const isDecl = (l) => /^-{0,2}[a-z-]+\s*:\s*[^;{]+;$/.test(l);
    let lines = [];
    if (after[0] && after[0].endsWith('{')) {
      lines = after.slice(1, after.indexOf('}') === -1 ? undefined : after.indexOf('}')).filter(isDecl);
    } else {
      for (const l of after) { if (!isDecl(l)) break; lines.push(l); }
    }
    const raw = lines.filter((l) => /\b\d+(\.\d+)?px\b|var\(--[a-z-]+-\d|^--hds-[a-z-]+:\s*[\d.]+;$/.test(l));
    const decl = (raw.length ? raw : lines).join(' ');
    if (!decl) continue;
    const gap = m[1].replace(/^\s*\*\s?/gm, '').replace(/\s+/g, ' ').trim();
    const tail = gap.slice(gap.indexOf('DESIGN GAP')).replace(/^DESIGN GAP:?\s*[—-]?\s*/, '');
    // When the reason is written before the marker ("… off the 4px scale. DESIGN GAP — see …"), keep it.
    const note = tail.length >= 40 ? tail : gap.replace(/DESIGN GAP:?\s*[—-]?\s*/, '').trim();
    found.push({ file: rel, line: text.slice(0, m.index).split('\n').length, decl, text: note });
  }
  return found;
}
function gapEntries(name) {
  const text = read(join(REPO, 'docs/design-gaps.md'));
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${name} `) || l === `## ${name}`);
  if (start === -1) return [];
  const entries = [];
  for (let i = start + 1; i < lines.length && !lines[i].startsWith('## '); i += 1) {
    if (!lines[i].startsWith('### ')) continue;
    let end = i + 1;
    while (end < lines.length && !lines[end].startsWith('### ') && !lines[end].startsWith('## ')) end += 1;
    const body = lines.slice(i + 1, end).join('\n');
    const heading = lines[i].slice(4);
    const resolved = /RESOLVED/.test(heading) && !/HALF RESOLVED/.test(heading);
    const status = resolved ? 'resolved' : /WAIVED FOR RELEASE/.test(body) ? 'waived for release, still open' : 'open';
    entries.push({ heading, line: i + 1, status });
  }
  return entries;
}
function sinceVersion(name) {
  const tags = git(REPO, 'tag', '--list', 'v*', '--sort=creatordate').split('\n').filter(Boolean);
  for (const t of tags) {
    try {
      if (new RegExp(`export \\{ ${name}\\b`).test(git(REPO, 'show', `${t}:src/index.ts`))) return t.slice(1);
    } catch { /* tag without src/index.ts */ }
  }
  return null;
}
function changelog(folders) {
  const paths = folders.map((f) => `src/components/${f}`);
  const log = git(REPO, 'log', '--date=short', '--format=%H%x09%ad%x09%s', '--', ...paths);
  const tags = git(REPO, 'tag', '--list', 'v*').split('\n').filter(Boolean);
  return log.split('\n').filter(Boolean).map((line) => {
    const [hash, date, subject] = line.split('\t');
    const inTags = tags.filter((t) => {
      try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', hash, t]); return true; } catch { return false; }
    });
    return { hash, date, subject, tags: inTags };
  });
}

let storyIndex;
try {
  storyIndex = await (await fetch(`${cfg.storybookUrl}/index.json`)).json();
} catch (e) {
  fail(`cannot read ${cfg.storybookUrl}/index.json: ${e.message}`);
}
const storiesFor = (Name) => Object.values(storyIndex.entries).filter((e) => e.type === 'story' && e.title === `Components/${Name}`);
const storyUrl = (id) => `${cfg.storybookUrl}/?path=/story/${id}`;
const docsUrl = (Name) => `${cfg.storybookUrl}/?path=/docs/components-${Name.toLowerCase()}--docs`;

function classifyStories(Name, f) {
  const vocab = new Set(['true', 'false']);
  for (const set of f.sets) for (const p of set.props) {
    vocab.add(p.name.toLowerCase());
    for (const v of p.values) for (const t of v.toLowerCase().split(/[^a-z0-9]+/)) if (t) vocab.add(t);
  }
  for (const a of Object.keys(f.storyAliases || {})) vocab.add(a.toLowerCase());
  const matrix = [];
  const review = [];
  const examples = [];
  for (const s of storiesFor(Name)) {
    const tokens = s.name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    if (/^matrix$/i.test(s.name) || /^figma node/i.test(s.name)) review.push(s);
    else if (tokens.length && tokens.every((t) => vocab.has(t))) matrix.push(s);
    else examples.push(s);
  }
  return { matrix, review, examples };
}

function embedPair(id, title, kind, height) {
  const mode = kind === 'docs' ? 'docs' : 'story';
  const frame = (theme) => `<iframe class="hds-embed hds-embed--${kind}" data-embed-theme="${theme}" style="height:${height}px" src="${cfg.storybookUrl}/iframe.html?id=${id}&viewMode=${mode}&globals=theme:${theme}" title="${md(title)} — ${theme}" loading="lazy"></iframe>`;
  return `<div class="hds-embed-pair">\n${frame('light')}\n${frame('dark')}\n</div>`;
}
const embedHeight = (folder, id, fallback) => (cfg.embeds?.[folder]?.[id] ?? cfg.embeds?.[folder]?.default ?? fallback);

function readmeUsage() {
  const text = read(join(REPO, 'README.md'));
  const section = text.split(/^## /m).find((s) => s.startsWith('Usage'));
  const m = section && section.match(/```tsx\n([\s\S]*?)```/);
  return m ? m[1].trimEnd() : null;
}
function readmeIntro() {
  const lines = read(join(REPO, 'README.md')).split('\n');
  const h = lines.findIndex((l) => l.startsWith('# '));
  const para = [];
  for (let i = h + 1; i < lines.length; i += 1) {
    if (!lines[i].trim()) { if (para.length) break; continue; }
    para.push(lines[i]);
  }
  return para.join(' ');
}

let npmTimes = {};
try {
  npmTimes = JSON.parse(execFileSync('npm', ['view', pkg.name, 'time', '--json'], { encoding: 'utf8' }));
} catch { /* not published yet */ }
const versions = Object.keys(npmTimes).filter((k) => /^\d/.test(k)).sort((a, b) => npmTimes[a].localeCompare(npmTimes[b]));
const latest = versions[versions.length - 1] || null;

/* ── Component page ───────────────────────────────────────────────────────── */

function componentPage(c, order) {
  const { name: Name, folder } = c;
  const f = figma.components[folder];
  if (!f) fail(`sources/figma.json has no entry for ${folder}`);
  const intent = readJSON(join(REPO, 'src/components', folder, `${folder}.intent.json`));
  const subs = composes(folder);
  const folders = [folder, ...subs];
  const since = sinceVersion(Name);
  const figmaNode = f.sets[0].node;
  const figmaUrl = `${figma.fileUrl}?node-id=${figmaNode.replace(':', '-')}`;
  const figmaEmbed = `https://embed.figma.com/design/${figma.fileKey}/${figma.fileSlug}?node-id=${figmaNode.replace(':', '-')}&embed-host=horizon-reference`;
  const status = c.development.toLowerCase();
  const L = [];
  const w = (s = '') => L.push(s);

  w('---');
  w(`title: ${JSON.stringify(Name)}`);
  w(`description: ${JSON.stringify(f.description)}`);
  w('sidebar:');
  w(`  order: ${order}`);
  w('  badge:');
  w(`    text: ${JSON.stringify(status)}`);
  w(`    variant: ${status === 'released' ? 'success' : 'note'}`);
  w('---');
  w();
  w("import { Tabs, TabItem, Aside, LinkCard } from '@astrojs/starlight/components';");
  w();
  w(`{/* Generated by docs-site/scripts/generate.mjs from horizon-design-system at ${SHA}. Never edit by hand. */}`);
  w();
  w('<p class="hds-pageheader">');
  w(`<span class="hds-status">${status}${since ? ` · since ${since}` : ''}</span>`);
  w(`<a href="${docsUrl(Name)}">Storybook</a>`);
  w(`<a href="${figmaUrl}">Figma node ${figmaNode}</a>`);
  w(`<a href="${cfg.repoUrl}/tree/${SHA}/src/components/${folder}">Source</a>`);
  w('</p>');
  w();
  w('<Tabs>');
  w();

  /* Usage */
  w('<TabItem label="Usage">');
  w();
  w('### When to use it');
  w();
  for (const u of intent.use_when) w(`- ${md(u).replace(/\n/g, '<br />')}`);
  w();
  if (intent.placement?.length) {
    w(`**Where it goes.** ${intent.placement.map((p) => `${md(p.text)} ([${p.story}](${storyUrl(`components-${folder.toLowerCase()}--${p.story.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`)}))`).join('. ')}.`);
    w();
  }
  if (intent.dont_use_when?.length) {
    w('<Aside type="caution" title="When not to use it">');
    w();
    for (const d of intent.dont_use_when) w(`- ${md(d.text)}${d.alternative ? ` **Instead:** ${md(d.alternative)}.` : ''}`);
    w();
    w('</Aside>');
    w();
  }
  if (intent.best_practice?.length) {
    w('### Best practice');
    w();
    for (const b of intent.best_practice) w(`- ${md(b)}`);
    w();
  }
  const vi = Object.entries(intent.variant_intent || {}).flatMap(([p, vals]) => Object.entries(vals).map(([v, t]) => [p, v, t]));
  if (vi.length) {
    w('### What each variant is for');
    w();
    w(table(['Property', 'Value', 'What it is for'], vi.map(([p, v, t]) => [codeCell(p), codeCell(v), t ? cell(t) : '_Not documented._'])));
    w();
  }
  w('### Accessibility');
  w();
  if (intent.a11y?.length) {
    for (const a of intent.a11y) {
      const [file, lines] = a.source.split(':');
      const [from, to] = (lines || '').split('-');
      const href = `${cfg.repoUrl}/blob/${SHA}/${file}${from ? `?plain=1#L${from}${to ? `-L${to}` : ''}` : ''}`;
      w(`- ${md(a.text)} <small>[${a.source.replace(/^src\/components\//, '')}](${href})</small>`);
    }
  } else {
    w('_Not documented: the intent file has no accessibility facts._');
  }
  w();
  w('### Composition');
  w();
  if (subs.length) w(`**Built from** ${subs.map((s) => `\`${s}\``).join(', ')} — internal subcomponents, imported rather than copied, and not exported as components of their own.`);
  else w('**Built from** no other component.');
  w();
  const pairs = (intent.pairs_with || []).map((p) => {
    const target = publishedFolders.has(p.component) ? `[${cap(p.component)}](/core/components/${p.component}/)` : `\`${p.component}\``;
    return `${target}, shown together in \`${p.story}\``;
  });
  if (pairs.length) { w(`**Pairs with** ${pairs.join('; ')}.`); w(); }
  const by = importedBy(folder);
  w(by.length ? `**Imported by** ${by.map((b) => (publishedFolders.has(b) ? `[${cap(b)}](/core/components/${b}/)` : `\`${b}\``)).join(', ')}. Changing this component means re-testing those.` : '**Imported by** no other component.');
  w();
  w('### What this version promises');
  w();
  w(`\`${Name}\` ${since ? `entered the public surface in **${since}**` : 'is on the public surface'} and reads **${status}** on the registry: it passed QA on its staging build, is live in the production Storybook, and cleared the release review.`);
  w();
  w(`The package is at \`${latest || pkg.version}\`. Below \`1.0.0\` a minor version is allowed to break things, which is why the version starts with a zero. [What the number promises](/get-started/versioning/) has the detail.`);
  w();
  w('</TabItem>');
  w();

  /* Examples */
  const { matrix, review, examples } = classifyStories(Name, f);
  w('<TabItem label="Examples">');
  w();
  w('### The common case');
  w();
  const usage = readmeUsage();
  if (usage && usage.includes(`<${Name}`)) {
    w('```tsx');
    w(usage);
    w('```');
    w();
    w('From the README, the same example every install starts from.');
  } else {
    w('_No example in the README uses this component yet._');
  }
  w();
  w('### Worth seeing');
  w();
  w('These are the stories written on purpose — in a layout, beside another component, or showing behaviour — rather than to fill a row of the variant matrix. Each one is rendered live from Storybook, in the theme this page is in.');
  w();
  if (!examples.length) w('_No story outside the variant matrix yet._');
  for (const s of examples) {
    w(`#### ${md(s.name)}`);
    w();
    w(embedPair(s.id, `${Name} — ${s.name}`, 'story', embedHeight(folder, s.id, 240)));
    w();
    w(`<p class="hds-embed-note">Rendered live from Storybook · <a href="${storyUrl(s.id)}">open it there</a> to change the props or the theme.</p>`);
    w();
  }
  w('</TabItem>');
  w();

  /* Code */
  w('<TabItem label="Code">');
  w();
  w('### Import');
  w();
  const exportLine = indexDts.split('\n').find((l) => new RegExp(`export \\{ ${Name},`).test(l));
  const names = exportLine ? exportLine.match(/\{ (.*) \}/)[1] : Name;
  w('```tsx');
  w(`import { ${names} } from '${pkg.name}';`);
  w(`import '${pkg.name}/tokens.css';`);
  w(`import '${pkg.name}/styles.css';`);
  w('```');
  w();
  w('The stylesheets are imported once, at the root of the app. `src/index.ts` decides what is public; anything not exported there is internal.');
  w();
  w('### Props');
  w();
  const propTypes = folders.flatMap((fo) => {
    const t = `${cap(fo)}Props`;
    return exportedNames.has(t) || fo === folder ? [[fo, t]] : [];
  });
  for (const [fo, t] of propTypes) {
    const parsed = parseProps(fo, t);
    if (!parsed) continue;
    const defaults = parseDefaults(fo);
    if (propTypes.length > 1) { w(`#### \`${t}\``); w(); }
    w(table(['Prop', 'Type', 'Default', 'What it does'], parsed.rows.map((r) => [
      codeCell(r.name), codeCell(r.type),
      r.optional ? (defaults[r.name] ? codeCell(defaults[r.name].replace(/^'|'$/g, '')) : '—') : '**required**',
      r.doc ? cell(r.doc) : '—',
    ])));
    w();
    if (parsed.tail) { w(`\`${t}\` also accepts \`${parsed.tail}\`.`); w(); }
  }
  w('Prop names mirror the Figma property names exactly. That is a rule of the system, recorded in `CLAUDE.md`, so a design change and a code change stay the same conversation.');
  w();
  const aliases = folders.flatMap(parseAliases).filter((a) => exportedNames.has(a.name));
  if (aliases.length) {
    w('### Types');
    w();
    w(table(['Type', 'Values'], aliases.map((a) => [codeCell(a.name), a.values.split('|').map((v) => codeCell(v.trim().replace(/^'|'$/g, ''))).join(' · ')])));
    w();
  }
  w('### Tokens it needs');
  w();
  const used = {};
  for (const fo of folders) for (const t of cssTokens(fo)) (used[t] ||= []).push(fo);
  const missing = Object.keys(used).filter((t) => !LIGHT[t]);
  if (missing.length) fail(`${Name} uses tokens not in dist/tokens.css: ${missing.join(', ')}`);
  w('Every token this component and its subcomponents cannot render without. Change one and this component changes with it.');
  w();
  w(table(['Token', 'Light', 'Dark'].concat(subs.length ? ['Used in'] : []), Object.keys(used).sort().map((t) => [
    codeCell(t), valueCell(LIGHT[t].value), DARK[t] ? valueCell(DARK[t].value) : 'same as light',
  ].concat(subs.length ? [used[t].map((x) => `\`${x}\``).join(', ')] : []))));
  w();
  w('<Aside type="note" title="Two themes">');
  w('Light values sit on `:root`. The dark column is the `[data-theme="dark"]` block, which redeclares only the colours that change, so every other token reads the same in both.');
  w('</Aside>');
  w();
  w('### The full API, in Storybook');
  w();
  w("Storybook's own props table and controls, live. This is the same page an engineer works against.");
  w();
  w(embedPair(`components-${Name.toLowerCase()}--docs`, `${Name} — full API`, 'docs', 620));
  w();
  w(`<p class="hds-embed-note">If this frame is blank, see <a href="/help/embedding/">Embedding</a>. <a href="${docsUrl(Name)}">Open it directly</a>.</p>`);
  w();
  w('</TabItem>');
  w();

  /* Design */
  w('<TabItem label="Design">');
  w();
  w('### The Figma node');
  w();
  w(`Node \`${figmaNode}\` — what this component was built from, and what QA tests against. The live node, not a screenshot of it.`);
  w();
  w(`<iframe class="hds-embed hds-embed--figma" src="${figmaEmbed}" title="${Name} in Figma" loading="lazy" allowfullscreen></iframe>`);
  w();
  w(`<p class="hds-embed-note">The Figma file is shared with the team only, so this frame shows a sign-in to anyone outside it. <a href="${figmaUrl}">Open the node in Figma</a>.</p>`);
  w();
  w('### The variant matrix');
  w();
  for (const set of f.sets) {
    const variants = set.props.filter((p) => p.type === 'VARIANT');
    const count = variants.reduce((n, p) => n * p.values.length, 1);
    w(`**${set.label}** (\`${set.node}\`) — ${set.props.map((p) => `\`${p.name}\` (${p.type === 'SLOT' ? 'slot' : p.values.map((v) => `\`${v}\``).join(' · ')})`).join(', ')}${variants.length ? `. ${variants.map((p) => cap(p.name)).join(' × ')} = **${count} variant${count === 1 ? '' : 's'}**.` : '.'}`);
    w();
  }
  w('Every variant in the Figma set has a story. That is the contract between design and code: a variant with no story is a guaranteed QA failure, and a story with no variant behind it is something nobody designed.');
  w();
  w('<details>');
  w(`<summary>All ${matrix.length} matrix stories${review.length ? `, and ${review.length} review view${review.length === 1 ? '' : 's'}` : ''}</summary>`);
  w();
  for (const s of [...matrix, ...review]) w(`- [${md(s.name)}](${storyUrl(s.id)})`);
  w();
  w('</details>');
  w();
  w('### Both themes');
  w();
  w('The component names tokens and never values, so it follows whichever theme the page is in.');
  w();
  w('<div class="hds-modes">');
  for (const theme of ['light', 'dark']) {
    w(`<div class="hds-mode" data-theme="${theme}">`);
    w('<div class="hds-mode__swatches"><span style="background:var(--color-bg-base)"></span><span style="background:var(--color-bg-surface-primary)"></span><span style="background:var(--color-bg-primary)"></span><span style="background:var(--color-text-primary)"></span></div>');
    w(`<div class="hds-mode__name">${theme}</div>`);
    w('</div>');
  }
  w('</div>');
  w();
  w('### What Figma never bound');
  w();
  const comments = folders.flatMap(designGapComments);
  if (comments.length) {
    w('Values in the code that carry a `DESIGN GAP` comment: the design left them unbound, or bound them to a core token, and a person decided how they ship.');
    w();
    w(table(['Declaration', 'Why it is not a semantic token', 'Where'], comments.map((g) => [
      codeCell(g.decl), cell(g.text), `[${g.file.replace(/^src\/components\//, '')}:${g.line}](${blob(g.file, g.line)})`,
    ])));
  } else {
    w('Nothing: every value in the code is bound to a semantic token.');
  }
  w();
  const gaps = gapEntries(Name);
  if (gaps.length) {
    w('### Recorded design gaps');
    w();
    w(table(['Gap', 'Status'], gaps.map((g) => [`[${cell(g.heading.replace(/\s+—\s+(HALF )?RESOLVED.*$/, ''))}](${blob('docs/design-gaps.md', g.line)})`, g.status])));
    w();
  }
  w('</TabItem>');
  w();

  /* Changelog */
  const rows = changelog(folders);
  w('<TabItem label="Changelog">');
  w();
  w(`Every commit to ${folders.map((x) => `\`src/components/${x}\``).join(', ')}, newest first. A release column names each version the commit shipped in.`);
  w();
  w(table(['Date', 'Commit', 'Subject', 'Release'], rows.map((r) => [
    r.date, `[\`${r.hash.slice(0, 7)}\`](${cfg.repoUrl}/commit/${r.hash})`, cell(r.subject), r.tags.map((t) => `\`${t}\``).join(', ') || 'unreleased',
  ])));
  w();
  w('</TabItem>');
  w();
  w('</Tabs>');
  return L.join('\n');
}

/* ── Pages ────────────────────────────────────────────────────────────────── */

const componentsDir = join(SITE, 'src/content/docs/core/components');
if (existsSync(componentsDir)) {
  for (const f of readdirSync(componentsDir)) if (f !== '.gitkeep') rmSync(join(componentsDir, f));
}
published.forEach((c, i) => out(`src/content/docs/core/components/${c.folder}.mdx`, componentPage(c, i + 1)));

// All components
out('src/content/docs/core/components/overview.md', [
  '---',
  'title: All components',
  'description: Every component on the public surface, with the one line that says what it is for.',
  'sidebar:',
  '  order: 0',
  '---',
  '',
  `<!-- Generated by docs-site/scripts/generate.mjs at ${SHA}. Never edit by hand. -->`,
  '',
  `${published.length} component${published.length === 1 ? '' : 's'} on the public surface of \`${pkg.name}\`, each with a page that says when to use it, how to call it, what it was built from, and what has changed.`,
  '',
  table(['Component', 'Status', 'Since', 'What it is for'], published.map((c) => [
    `[${c.name}](/core/components/${c.folder}/)`, c.development.toLowerCase(), sinceVersion(c.name) || '—', cell(figma.components[c.folder].description),
  ])),
  '',
  '## What is not here',
  '',
  unpublished.length
    ? `Components on the registry that have not cleared a release yet: ${unpublished.map((c) => `**${c.name}** (${c.development || 'not started'})`).join(', ')}. They get a page the run after they read \`Released\` or \`Completed\` with a cleared release review.`
    : 'Every component on the registry has cleared its release review. Anything in design or build appears on the [Roadmap](/get-started/roadmap/) until it does.',
  '',
  `Internal subcomponents — ${[...new Set(published.flatMap((c) => composes(c.folder)))].map((s) => `\`${s}\``).join(', ') || 'none'} — are documented inside the component that uses them, not as pages of their own, because they are not exported.`,
].join('\n'));

// Tokens
{
  const used = {};
  for (const c of published) for (const fo of [c.folder, ...composes(c.folder)]) for (const t of cssTokens(fo)) (used[t] ||= new Set()).add(c.name);
  const groups = {};
  for (const n of semanticNames) (groups[tokenGroup(n)] ||= []).push(n);
  const core = Object.keys(LIGHT).filter(isCore);
  const tokenFiles = readdirSync(join(REPO, 'tokens')).filter((f) => f.endsWith('.json') && f !== 'manifest.json');
  const L = [
    '---',
    'title: Tokens',
    'description: Every token in the package, which components break if one moves, and where the values come from.',
    '---',
    '',
    `<!-- Generated by docs-site/scripts/generate.mjs from dist/tokens.css at ${SHA}. Never edit by hand. -->`,
    '',
    `The package ships ${Object.keys(LIGHT).length} tokens as CSS custom properties in \`${pkg.name}/tokens.css\`: ${semanticNames.length} semantic tokens that components use, and ${core.length} core scale steps they must not. ${Object.keys(DARK).length} of them are redeclared for the dark theme.`,
    '',
    '## What the released components depend on',
    '',
    table(['Token', 'Light', 'Dark', 'Used by'], Object.keys(used).sort().map((t) => [
      codeCell(t), valueCell(LIGHT[t].value), DARK[t] ? valueCell(DARK[t].value) : 'same as light',
      [...used[t]].map((n) => `[${n}](/core/components/${n.toLowerCase()}/)`).join(', '),
    ])),
    '',
    '## Every semantic token',
    '',
  ];
  for (const [g, names] of Object.entries(groups)) {
    L.push('<details>', `<summary><code>${g}</code> — ${names.length} tokens</summary>`, '');
    L.push(table(['Token', 'Light', 'Dark', 'What it is for'], names.map((n) => [
      codeCell(n), valueCell(LIGHT[n].value), DARK[n] ? valueCell(DARK[n].value) : 'same as light', cell(LIGHT[n].description || '—'),
    ])));
    L.push('', '</details>', '');
  }
  L.push('## The core scale', '', 'Primitive steps the semantic tokens point at. `CLAUDE.md`: components use semantic tokens only, so a component reaching for one of these has skipped the token that should sit in front of it.', '');
  L.push('<details>', `<summary>${core.length} core tokens</summary>`, '');
  L.push(table(['Token', 'Value'], core.map((n) => [codeCell(n), valueCell(LIGHT[n].value)])));
  L.push('', '</details>', '');
  L.push('## Where they come from', '');
  L.push(`Designers export the Figma variables with the Design Tokens plugin into \`tokens/\` (${tokenFiles.map((f) => `\`${f}\``).join(', ')}). Style Dictionary v5 builds them into \`build/tokens/\`, and the package build copies the result into \`dist/tokens.css\`. Nobody edits a value in code: a wrong value is fixed in Figma and re-exported.`);
  out('src/content/docs/core/tokens.md', L.join('\n'));
}

// Changelog
{
  const tags = git(REPO, 'tag', '--list', 'v*', '--sort=-creatordate').split('\n').filter(Boolean);
  const L = [
    '---',
    'title: Changelog',
    'description: Every released version, what it added, and what it needs.',
    '---',
    '',
    `<!-- Generated by docs-site/scripts/generate.mjs from git tags and npm at ${SHA}. Never edit by hand. -->`,
    '',
  ];
  const exportsAt = (ref) => {
    try {
      const src = git(REPO, 'show', `${ref}:src/index.ts`);
      return new Set([...src.matchAll(/export (?:type )?\{([^}]*)\}/g)]
        .flatMap((m) => m[1].split(',').map((n) => n.replace(/^\s*type\s+/, '').trim()).filter(Boolean)));
    } catch { return new Set(); }
  };
  const unreleased = tags.length ? git(REPO, 'log', '--date=short', '--format=%h%x09%ad%x09%s', `${tags[0]}..HEAD`, '--', 'src', 'package.json').split('\n').filter(Boolean) : [];
  L.push('## Unreleased', '');
  L.push(unreleased.length
    ? unreleased.map((l) => { const [h, d, s] = l.split('\t'); return `- ${d} [\`${h}\`](${cfg.repoUrl}/commit/${h}) ${md(s)}`; }).join('\n')
    : `Nothing: no commit to \`src/\` or \`package.json\` on \`main\` since \`${tags[0] || 'the first commit'}\`.`);
  L.push('');
  tags.forEach((tag, i) => {
    const version = tag.slice(1);
    const date = npmTimes[version] ? npmTimes[version].slice(0, 10) : git(REPO, 'log', '-1', '--format=%ad', '--date=short', tag);
    const now = exportsAt(tag);
    const before = i + 1 < tags.length ? exportsAt(tags[i + 1]) : new Set();
    const added = [...now].filter((n) => !before.has(n));
    const removed = [...before].filter((n) => !now.has(n));
    const peers = JSON.parse(git(REPO, 'show', `${tag}:package.json`)).peerDependencies || {};
    L.push(`## ${version} — ${date}`, '');
    L.push(npmTimes[version] ? `Published to npm as \`${pkg.name}@${version}\`, tag [\`${tag}\`](${cfg.repoUrl}/releases/tag/${tag}).` : `Tag [\`${tag}\`](${cfg.repoUrl}/tree/${tag}).`, '');
    const comps = added.filter((n) => boardRows.some((c) => c.name === n));
    L.push('### Added', '');
    if (comps.length) for (const n of comps) L.push(`- [\`${n}\`](/core/components/${n.toLowerCase()}/) — ${md(figma.components[n.toLowerCase()]?.description || '')}`);
    const types = added.filter((n) => !comps.includes(n));
    if (types.length) L.push(`- Types: ${types.map((n) => `\`${n}\``).join(', ')}`);
    if (!before.size) L.push('- Stylesheets: `tokens.css` and `styles.css`');
    if (!added.length) L.push('None.');
    L.push('');
    L.push('### Removed', '', removed.length ? removed.map((n) => `- \`${n}\``).join('\n') : 'None.', '');
    L.push('### Requires', '', Object.entries(peers).map(([k, v]) => `- \`${k}\` \`${v}\``).join('\n') || 'Nothing.', '');
  });
  out('src/content/docs/get-started/changelog.md', L.join('\n'));
}

// Roadmap
{
  const L = [
    '---',
    'title: Roadmap',
    'description: Everything recorded as open against this system, what each item is waiting on, and why none of it carries a date.',
    '---',
    '',
    `<!-- Generated by docs-site/scripts/generate.mjs from the registry and docs/ at ${SHA}. Never edit by hand. -->`,
    '',
    'This page lists what the registry and the design-gap record say is open. It carries no dates, owners or priorities, because none of those sources states one, and a date written here would be a promise nobody made.',
    '',
    '## Components in progress',
    '',
  ];
  const inProgress = boardRows.filter((c) => c.development !== 'Released');
  if (inProgress.length) {
    const by = {};
    for (const c of inProgress) (by[c.development || 'Not started'] ||= []).push(c.name);
    for (const [s, names] of Object.entries(by)) L.push(`- **${s}:** ${names.join(', ')}`);
  } else {
    L.push(`Nothing: all ${boardRows.length} components on the registry read \`Released\`.`);
  }
  L.push('', '## Open design gaps', '', 'Each links to its entry in `docs/design-gaps.md`. "Waived for release" means a person chose to ship with the gap; it is still open until the design changes.', '');
  const gapText = read(join(REPO, 'docs/design-gaps.md')).split('\n');
  const sections = gapText.map((l, i) => [l, i]).filter(([l]) => l.startsWith('## '));
  for (const [heading] of sections) {
    const name = heading.slice(3).split(' — ')[0];
    // Component sections number their gaps; system-wide sections (token contrast,
    // token build) mark an open entry with an `### Open:` heading instead.
    const entries = gapEntries(name).filter((g) => g.status !== 'resolved' && !/^(Fixed|Resolved)\b/.test(g.heading))
      .map((g) => ({ ...g, heading: g.heading.replace(/^Open:\s*/, '') }));
    if (!entries.length) continue;
    L.push(`### ${name}`, '', ...entries.map((g) => `- [${md(g.heading.replace(/^(\d+\.\s*)?HALF RESOLVED — /, '$1'))}](${blob('docs/design-gaps.md', g.line)}) — ${/HALF RESOLVED/.test(g.heading) ? 'half resolved, ' : ''}${g.status}`), '');
  }
  const naming = read(join(REPO, 'docs/naming-conflicts.md')).split(/^## /m).slice(1).filter((s) => !/\*\*Status:\*\* resolved/i.test(s) && !/RESOLVED/.test(s.split('\n')[0]));
  L.push('## Open naming conflicts', '', naming.length ? naming.map((s) => `- ${md(s.split('\n')[0])}`).join('\n') : 'None: every entry in `docs/naming-conflicts.md` is resolved.', '');
  out('src/content/docs/get-started/roadmap.md', L.join('\n'));
}

// News
{
  const events = [];
  for (const v of versions) events.push([npmTimes[v].slice(0, 10), `\`${v}\` published to npm`, `[\`${pkg.name}@${v}\`](https://www.npmjs.com/package/${pkg.name}/v/${v}) went public. The [changelog](/get-started/changelog/) lists what it carries.`]);
  const released = published.filter((c) => c.development === 'Released' && c.releaseReview);
  const byDate = {};
  for (const c of released) {
    const sha = (c.releaseReview.match(/blob\/([0-9a-f]{40})\//) || [])[1];
    let date = null;
    try { date = sha ? git(REPO, 'show', '-s', '--format=%ad', '--date=short', sha) : null; } catch { date = null; }
    if (date) (byDate[date] ||= []).push(c);
  }
  for (const [date, cs] of Object.entries(byDate)) {
    events.push([date, `${cs.map((c) => c.name).join(' and ')} released`, `${cs.map((c) => `[${c.name}](/core/components/${c.folder}/) ([release review](${c.releaseReview}))`).join(' and ')} cleared the release review and got a verified page on this site, which is what moves the registry to \`Released\`.`]);
  }
  try {
    const first = git(SITE, 'log', '--reverse', '--format=%ad', '--date=short', '--', '.').split('\n')[0];
    if (first) events.push([first, 'This site went live', `The docs site launched on the \`astro\` branch, deployed to [${cfg.siteUrl.replace(/^https:\/\//, '')}](${cfg.siteUrl}).`]);
  } catch { /* not a git checkout */ }
  events.sort((a, b) => b[0].localeCompare(a[0]));
  out('src/content/docs/get-started/news.md', [
    '---',
    'title: News',
    'description: Dated entries for things that happened to this system — a version published, a component released, the site going live.',
    '---',
    '',
    `<!-- Generated by docs-site/scripts/generate.mjs from npm, the registry and git at ${SHA}. Never edit by hand. -->`,
    '',
    'One entry per event, newest first. A version\'s contents are on the [changelog](/get-started/changelog/); this page records when things happened.',
    '',
    ...events.flatMap(([d, t, body]) => [`## ${d} — ${t}`, '', body, '']),
  ].join('\n'));
}

// Home
{
  const latestDate = latest ? npmTimes[latest].slice(0, 10) : null;
  out('src/content/docs/index.mdx', [
    '---',
    `title: ${JSON.stringify(cfg.title)}`,
    `description: ${JSON.stringify(cfg.description)}`,
    'template: splash',
    'hero:',
    '  tagline: |',
    `    ${readmeIntro().replace(/`/g, '')}`,
    '  actions:',
    '    - text: Start designing',
    '      link: /designing/introduction/',
    '      icon: right-arrow',
    '    - text: Start coding',
    '      link: /developing/introduction/',
    '      icon: right-arrow',
    '      variant: secondary',
    '    - text: Open Storybook',
    `      link: ${cfg.storybookUrl}`,
    '      icon: external',
    '      variant: minimal',
    '---',
    '',
    "import { Card, CardGrid, LinkCard } from '@astrojs/starlight/components';",
    '',
    `{/* Generated by docs-site/scripts/generate.mjs at ${SHA}. Never edit by hand. */}`,
    '',
    latest ? `## Latest release — \`${latest}\`` : '## Not published yet',
    '',
    `<p class="hds-release-date">${latestDate ? `Published ${latestDate}. ` : ''}${published.length} component${published.length === 1 ? '' : 's'} on the public surface, carried by ${semanticNames.length} semantic tokens in a light and a dark theme.</p>`,
    '',
    '```bash',
    `npm install ${pkg.name}`,
    '```',
    '',
    `<LinkCard title="Read the release notes" description="What ${latest || 'the next version'} added and what it needs." href="/get-started/changelog/" />`,
    '',
    '## Where to go',
    '',
    '<CardGrid>',
    '  <LinkCard title="Start designing" href="/designing/introduction/" description="The Figma file, the themes and modes you design against, and how tokens get from Figma into code." />',
    `  <LinkCard title="Start coding" href="/developing/introduction/" description="Install ${pkg.name}, load the two stylesheets, and render the first component." />`,
    `  <LinkCard title="Components" href="/core/components/overview/" description="All ${published.length} of them — what each is for, when not to use it, and how to call it." />`,
    `  <LinkCard title="Tokens" href="/core/tokens/" description="The ${semanticNames.length} semantic tokens the components stand on, and what breaks if one moves." />`,
    '</CardGrid>',
    '',
    '## What this site is',
    '',
    '<CardGrid stagger>',
    '  <Card title="Explained here, rendered in Storybook" icon="open-book">',
    '    Storybook is where every variant renders, live, in every state. This site explains when to use each component. Its pages embed and link into the matching stories rather than re-rendering anything.',
    '  </Card>',
    '  <Card title="Written from the release\'s own files" icon="approve-check">',
    '    A component\'s usage section is its intent file, the same file the release review checks. A component gets a page only after it clears that review.',
    '  </Card>',
    '  <Card title="The reference is generated" icon="setting">',
    '    Components, tokens, the changelog, the roadmap, news and this page come out of `docs-site/scripts/generate.mjs`, from the code, the token build, the stories and the registry. The guides are written from the same repo.',
    '  </Card>',
    '  <Card title="It says what is still open" icon="warning">',
    '    Every component page lists the values Figma never bound and the design gaps recorded against it, and the roadmap lists every gap still open.',
    '  </Card>',
    '</CardGrid>',
  ].join('\n'));
}

// Token sheet for the site itself: the package's tokens, plus a light block so a
// light tile inside a dark page renders light.
{
  const lightBlock = Object.keys(DARK).map((n) => `  ${n}: ${LIGHT[n]?.value};`).join('\n');
  out('src/styles/tokens.generated.css', [
    '/*',
    ` * GENERATED by scripts/generate.mjs from dist/tokens.css at ${SHA}.`,
    ' * Never edit this file. Fix the value in Figma, re-export, rebuild.',
    ' */',
    '',
    tokensCss.trim(),
    '',
    '[data-theme="light"] {',
    lightBlock,
    '}',
  ].join('\n'));
}

console.log(`generate: ${published.length} component pages from ${SHA.slice(0, 7)} (${today})`);
