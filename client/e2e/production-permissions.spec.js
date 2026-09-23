import { expect, test } from 'playwright/test';

const expectStatus = async (request, method, url, options = {}) => {
  const response = await request[method](url, options);
  expect(response.status(), method.toUpperCase() + ' ' + url).toBe(403);
};

const readOnlyRoutes = [
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

const mutationRoutes = [
  '/dashboard/adjust',
  '/dashboard/purchase-order/create',
  '/dashboard/purchase-order/PLA-PRODUCTION-DEMO-DENY/edit',
  '/dashboard/inbounds/register/PLA-PRODUCTION-DEMO-DENY',
  '/dashboard/inbounds/pending/edit/PLA-PRODUCTION-DEMO-DENY',
  '/dashboard/outbounds/register/REC-PRODUCTION-DEMO-DENY',
  '/dashboard/receive-order/post',
  '/dashboard/vendor/create',
  '/dashboard/vendor/modify/999999',
  '/dashboard/notice/create',
  '/dashboard/notice/999999/edit',
  '/dashboard/user/setting',
  '/dashboard/todo/create',
  '/dashboard/todo/999999/edit',
];

const readApis = [
  '/api/product?page=1',
  '/api/purchase-orders',
  '/api/inbounds/pending?from=2026-01-01&to=2026-12-31&page=0&size=20',
  '/api/outbounds/pending/summary?from=2026-01-01&to=2026-12-31&page=0&size=20',
  '/api/order/receive',
  '/api/vendor',
  '/api/notice/list?page=1',
  '/api/history/brands?type=SOJU',
  '/api/stats/types',
];

test.describe('production DEMO permission matrix', () => {
  test.describe('DEMO: read-only routes', () => {
    for (const path of readOnlyRoutes) {
      test(path, async ({ page }) => {
        await page.goto(path);
        const escaped = path.replaceAll('/', '\\/');
        await expect(page).toHaveURL(
          new RegExp(escaped + '(?:/)?(?:\\?.*)?$'),
        );
      });
    }
  });

  test.describe('DEMO: mutation routes denied', () => {
    for (const path of mutationRoutes) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
        await expect(
          page.getByRole('main').getByText('메인 페이지', { exact: true }),
        ).toBeVisible();
      });
    }
  });

  test('DEMO: read APIs remain accessible while mutations return 403', async ({
    context,
  }) => {
    for (const url of readApis) {
      const response = await context.request.get(url);
      expect(response.ok(), 'GET ' + url).toBeTruthy();
    }

    await expectStatus(context.request, 'post', '/api/purchase/order/post', {
      data: {},
    });
    await expectStatus(
      context.request,
      'patch',
      '/api/purchase-orders/PLA-PRODUCTION-DEMO-DENY',
      {
        data: {
          recieveDate: '2026-12-31',
          items: [],
        },
      },
    );
    await expectStatus(
      context.request,
      'delete',
      '/api/purchase-orders/PLA-PRODUCTION-DEMO-DENY',
    );
    await expectStatus(
      context.request,
      'post',
      '/api/purchase-orders/PLA-PRODUCTION-DEMO-DENY/send',
    );
    await expectStatus(context.request, 'post', '/api/purchase-orders/send', {
      data: { orderNumbers: [] },
    });
    await expectStatus(
      context.request,
      'patch',
      '/api/inbounds/orders/by-number/PLA-PRODUCTION-DEMO-DENY/complete',
      { data: {} },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/outbounds/orders/by-number/REC-PRODUCTION-DEMO-DENY/complete',
      { data: {} },
    );
    await expectStatus(context.request, 'post', '/api/adjust', { data: {} });
    await expectStatus(context.request, 'post', '/api/vendor', { data: {} });
    await expectStatus(context.request, 'put', '/api/vendor/999999', {
      data: {},
    });
    await expectStatus(context.request, 'delete', '/api/vendor/999999');
    await expectStatus(
      context.request,
      'patch',
      '/api/user/permission/999999',
      { data: {} },
    );
    await expectStatus(context.request, 'patch', '/api/user/change-password', {
      data: {},
    });
    await expectStatus(context.request, 'patch', '/api/todo/999999/toggle');
    await expectStatus(context.request, 'put', '/api/todo/999999', {
      data: {},
    });
    await expectStatus(context.request, 'delete', '/api/todo/999999');
    await expectStatus(context.request, 'post', '/api/invitation', {
      data: {},
    });
    await expectStatus(context.request, 'post', '/api/order/post', {
      data: {},
    });
    await expectStatus(
      context.request,
      'patch',
      '/api/order/PLA-PRODUCTION-DEMO-DENY/manager',
      { data: {} },
    );
  });
});
