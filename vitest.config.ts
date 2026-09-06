import { defineConfig } from 'vitest/config';

// No @vitejs/plugin-react here on purpose: that plugin exists for Fast Refresh,
// which tests do not use, and pulling it in couples this config to a second copy
// of Vite's types (Vitest bundles its own). esbuild handles the JSX transform.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
