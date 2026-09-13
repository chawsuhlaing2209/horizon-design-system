import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'tsup';

// Library build: ESM + CJS, react and react-dom external. CSS is not bundled —
// components carry no CSS imports, and build-css.js writes dist/styles.css and
// dist/tokens.css after this runs.
//
// Type definitions come from `onSuccess`, not `dts: true`. tsup's dts step
// bundles rollup-plugin-dts, which needs the TypeScript JS API; TypeScript 7
// ships only the native compiler, and the build crashes on load. So tsc emits
// the declarations, and this hook makes them resolve for both formats:
//
//   - relative specifiers gain `.js`, which Node16/NodeNext resolution requires
//     (tsc keeps the extensionless paths the source uses under `bundler`)
//   - every .d.ts gets a .d.cts twin pointing at `.cjs`, so the `require`
//     condition gets CJS-typed declarations instead of ESM ones
const RELATIVE = /(from\s+|import\()(['"])(\.{1,2}\/[^'"]+?)(\.js)?\2/g;

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

const emitDeclarations = () => {
  execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json'], { stdio: 'inherit' });
  for (const file of walk('dist').filter((f) => f.endsWith('.d.ts'))) {
    const src = readFileSync(file, 'utf8');
    const withExt = (ext: string) =>
      src.replace(RELATIVE, (_m, head, q, spec) => `${head}${q}${spec}${ext}${q}`);
    writeFileSync(file, withExt('.js'));
    writeFileSync(file.replace(/\.d\.ts$/, '.d.cts'), withExt('.cjs'));
  }
};

// `"use client"` heads both bundles. The components use state and event
// handlers (CardImage's favourite toggle), so in a React Server Components app
// — Next.js App Router — importing them from a server component fails without
// it. It goes in as a banner because esbuild strips module-level directives
// from source files when it bundles them. Outside RSC it is an inert string.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  banner: { js: '"use client";' },
  onSuccess: async () => emitDeclarations(),
});
