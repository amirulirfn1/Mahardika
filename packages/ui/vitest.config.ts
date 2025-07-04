import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'tests/legacy'],
    css: {
      modules: {
        classNameStrategy: 'stable',
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    passWithNoTests: true,
  },
});
