import { expect, test } from '@playwright/test';

const EID = process.env.E2E_EID;
const PASSWORD = process.env.E2E_PASSWORD;

async function login(page) {
  await page.goto('/login');
  await page.getByLabel('사원번호').fill(EID);
  await page.getByLabel('비밀번호').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();
  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
}

test.beforeEach(() => {
  expect(EID, 'E2E_EID GitHub Actions secret is required').toBeTruthy();
  expect(PASSWORD, 'E2E_PASSWORD GitHub Actions secret is required').toBeTruthy();
});

test.describe('production authorized routes', () => {
  const routes = [
    '/dashboard',
    '/dashboard/product',
    '/dashboard/purchase-order',
    '/dashboard/inbounds/pending',
    '/dashboard/receive-order',
    '/dashboard/outbounds/pending',
    '/dashboard/adjust',
    '/dashboard/statistics',
    '/dashboard/history',
  ];

  for (const path of routes) {
    test(path, async ({ page }) => {
      await login(page);
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`\\${path.replaceAll('/', '\\/')}(?:\\/)?(?:\\?.*)?$}`));
    });
  }
});

test.describe('production rank restrictions', () => {
  const restrictedRoutes = [
    '/dashboard/user/setting',
    '/dashboard/vendor',
  ];

  for (const path of restrictedRoutes) {
    test(path, async ({ page }) => {
      await login(page);
      await page.goto(path);
      await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
      await expect(page.getByText('메인 페이지', { exact: true })).toBeVisible();
    });
  }
});
