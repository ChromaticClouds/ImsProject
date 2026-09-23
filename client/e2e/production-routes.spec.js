import { expect, test } from 'playwright/test';

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
      await page.goto(path);
      await expect(page).toHaveURL(
        new RegExp(path + '(?:/)?(?:\\?.*)?
      );
    });
  }
});
),
      );
    });
  }
});
