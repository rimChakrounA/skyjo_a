import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
  },
  test: {
    name: 'server',
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
