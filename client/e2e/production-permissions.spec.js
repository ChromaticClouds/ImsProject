import { expect, test } from 'playwright/test';

// Runtime EMPLOYEE coverage intentionally remains out of scope until a dedicated
// non-production EMPLOYEE account is available; this suite uses SECOND_ADMIN + ALL.

const secondAdminAllowedRoutes = [
  '/dashboard/inbounds/pending',
  '/dashboard/outbounds/pending',
  '/dashboard/adjust',
  '/dashboard/purchase-order',
  '/dashboard/receive-order',
];

const secondAdminDeniedRoutes = [
  '/dashboard/user/setting',
  '/dashboard/vendor',
  '/dashboard/notice/create',
];

test.describe('production permission matrix', () => {
  test.describe('SECOND_ADMIN + ALL: role-authorized routes', () => {
    for (const path of secondAdminAllowedRoutes) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveURL(
          new RegExp(path + '(?:/)?(?:\\?.*)?
        );
      });
    }
  });

  test.describe('SECOND_ADMIN + ALL: FIRST_ADMIN-only boundaries', () => {
    for (const path of secondAdminDeniedRoutes) {
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
),
        );
      });
    }
  });

  test.describe('SECOND_ADMIN + ALL: FIRST_ADMIN-only boundaries', () => {
    for (const path of secondAdminDeniedRoutes) {
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
