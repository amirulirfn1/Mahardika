import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
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
