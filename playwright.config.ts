import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'apps/app/tests',
	testMatch: '**/*.e2e.spec.ts',
	fullyParallel: false,
	retries: 0,
	workers: 1,
	use: {
		baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
		trace: 'on-first-retry',
		headless: true,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm -C apps/app start -p 3000',
		port: 3000,
		reuseExistingServer: true,
		timeout: 120_000,
	},
});


