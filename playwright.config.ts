import { defineConfig, devices } from '@playwright/test';
const USE_BASE = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL;

export default defineConfig({
	testDir: 'apps/app/tests',
	testMatch: '**/*.e2e.spec.ts',
	fullyParallel: false,
	retries: 0,
	workers: 1,
	use: {
		baseURL: (USE_BASE as string) || 'http://localhost:3100',
		trace: 'on-first-retry',
		headless: true,
	},
	reporter: [['html', { outputFolder: 'apps/app/playwright-report', open: 'never' }]],
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: USE_BASE
		? undefined
		: {
				command: 'pnpm start -p 3100',
				cwd: 'apps/app',
				port: 3100,
				reuseExistingServer: true,
				timeout: 120_000,
		  },
});


