import { expect, test } from 'playwright/test';

import {
  loginAsProductionDemo,
  navigateAsSpa,
} from './utils/login-production-demo.js';

const expectStatus = async (
  request,
  method,
  url,
  accessToken,
  options = {},
) => {
  const response = await request[method](url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
  '/api/product/categories',
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
        await loginAsProductionDemo(page);
        await navigateAsSpa(page, path);
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
        await loginAsProductionDemo(page);
        await navigateAsSpa(page, path);
        await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
        await expect(
          page.getByRole('main').getByText('메인 페이지', { exact: true }),
        ).toBeVisible();
      });
    }
  });

  test('DEMO: read APIs remain accessible while mutations return 403', async ({
    page,
    context,
  }) => {
    const accessToken = await loginAsProductionDemo(page);
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    for (const url of readApis) {
      const response = await context.request.get(url, {
        headers: authHeaders,
      });
      expect(response.ok(), 'GET ' + url).toBeTruthy();
    }

    await expectStatus(
      context.request,
      'post',
      '/api/purchase/order/post',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/purchase-orders/PLA-PRODUCTION-DEMO-DENY',
      accessToken,
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
      accessToken,
    );
    await expectStatus(
      context.request,
      'post',
      '/api/purchase-orders/PLA-PRODUCTION-DEMO-DENY/send',
      accessToken,
    );
    await expectStatus(
      context.request,
      'post',
      '/api/purchase-orders/send',
      accessToken,
      { data: { orderNumbers: [] } },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/inbounds/orders/by-number/PLA-PRODUCTION-DEMO-DENY/complete',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/outbounds/orders/by-number/REC-PRODUCTION-DEMO-DENY/complete',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'post',
      '/api/adjust',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'post',
      '/api/vendor',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'put',
      '/api/vendor/999999',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'delete',
      '/api/vendor/999999',
      accessToken,
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/user/permission/999999',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/user/change-password',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/todo/999999/toggle',
      accessToken,
    );
    await expectStatus(
      context.request,
      'put',
      '/api/todo/999999',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'delete',
      '/api/todo/999999',
      accessToken,
    );
    await expectStatus(
      context.request,
      'post',
      '/api/invitation',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'post',
      '/api/order/post',
      accessToken,
      { data: {} },
    );
    await expectStatus(
      context.request,
      'patch',
      '/api/order/PLA-PRODUCTION-DEMO-DENY/manager',
      accessToken,
      { data: {} },
    );
  });
});
