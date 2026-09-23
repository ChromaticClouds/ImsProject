import { expect, test } from 'playwright/test';

// Runtime EMPLOYEE coverage intentionally remains out of scope until a dedicated
// non-production EMPLOYEE account is available; this suite uses SECOND_ADMIN + ALL.

const demoAllowedRoutes = [
  '/dashboard',
  '/dashboard/product',
  '/dashboard/purchase-order',
  '/dashboard/inbounds/pending',
  '/dashboard/receive-order',
  '/dashboard/outbounds/pending',
  '/dashboard/vendor',
  '/dashboard/statistics',
  '/dashboard/history',
  '/dashboard/notice',
];

const demoDeniedRoutes = [
  '/dashboard/adjust',
  '/dashboard/purchase-order/create',
  '/dashboard/purchase-order/PLA-DEMO-DENY/edit',
  '/dashboard/inbounds/register/PLA-DEMO-DENY',
  '/dashboard/inbounds/pending/edit/PLA-DEMO-DENY',
  '/dashboard/outbounds/register/REC-DEMO-DENY',
  '/dashboard/receive-order/post',
  '/dashboard/vendor/create',
  '/dashboard/vendor/modify/999999',
  '/dashboard/notice/create',
  '/dashboard/notice/999999/edit',
  '/dashboard/user/setting',
];

test.describe('production permission matrix', () => {
  test.describe('DEMO: read-only routes', () => {
    for (const path of demoAllowedRoutes) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveURL(
          new RegExp(path + '(?:/)?(?:\\?.*)?$'),
        );
      });
    }
  });

  test.describe('DEMO: mutation route boundaries', () => {
    for (const path of demoDeniedRoutes) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
        await expect(
          page.getByRole('main').getByText('메인 페이지', { exact: true }),
        ).toBeVisible();
      });
    }
  });
});
