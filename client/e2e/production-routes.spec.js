import { expect, test } from 'playwright/test';

test.describe('production authorized read routes', () => {
  const routes = [
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
    '/dashboard/todo',
  ];

  for (const path of routes) {
    test(path, async ({ page }) => {
      await page.goto(path);
      const escaped = path.replaceAll('/', '\\/');
      await expect(page).toHaveURL(
        new RegExp(escaped + '(?:/)?(?:\\?.*)?$'),
      );
    });
  }
});
