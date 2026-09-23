import { expect, test } from 'playwright/test';

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

const protectedRoutes = [
  '/dashboard',
  '/dashboard/product',
  '/dashboard/vendor',
  '/dashboard/inbounds/pending',
  '/dashboard/outbounds/pending',
  '/dashboard/adjust',
  '/dashboard/purchase-order',
  '/dashboard/receive-order',
  '/dashboard/notice/create',
  '/dashboard/user/setting',
];

test.describe('production unauthenticated route redirects', () => {
  for (const path of protectedRoutes) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login(?:\/)?$/);
    });
  }
});
