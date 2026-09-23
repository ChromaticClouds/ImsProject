import path from 'node:path';
import { defineConfig } from 'playwright/test';

const baseURL =
  process.env.E2E_BASE_URL ?? 'https://ims-project-pi.vercel.app';
const authFile = path.resolve('playwright/.auth/second-admin.json');

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.js',
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        browserName: 'chromium',
        storageState: authFile,
      },
    },
  ],
});
