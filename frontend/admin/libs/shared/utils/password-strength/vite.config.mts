/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/shared/utils/password-strength',
  plugins: [angular(), viteStaticCopy({ targets: [{ src: '*.md', dest: '.' }] })],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [],
  // },
  resolve: { tsconfigPaths: true },
  test: {
    name: 'password-strength',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/shared/utils/password-strength',
      provider: 'v8' as const,
    },
  },
}));
