import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['**/*.integration-spec.ts'],
    globals: true,
    watch: false,
    fileParallelism: false,
  },
});
