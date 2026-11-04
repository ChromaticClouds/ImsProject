import { defineConfig } from 'playwright/test';

const baseURL =
  process.env.E2E_BASE_URL ?? 'https://ims-project-pi.vercel.app';

export default defineConfig({
  testDir: './e2e',
  testIgnore: ['**/*.mutation.spec.js'],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // 배포 서버의 첫 응답이 느린 경우를 위해 CI에서만 한 번 다시 시도한다.
  // 실패한 시도의 trace·스크린샷은 retain-on-failure로 남고, 다시 시도해서
  // 통과한 건은 요약에 flaky로 표시된다(.github/workflows/e2e.yml).
  retries: process.env.CI ? 1 : 0,
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
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
