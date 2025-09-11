import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.ts?(x)'],
    exclude: [
      'tests/**/*.e2e.{test,spec}.ts?(x)',
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
    ],
    environment: 'node',
    reporters: 'default',
  },
});

