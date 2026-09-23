import { expect, test } from 'playwright/test';

const EID = process.env.E2E_DEMO_EID ?? 'E2E-DEMO';
const PASSWORD = process.env.E2E_TEST_PASSWORD;

const expectStatus = async (request, method, url, options = {}) => {
  const response = await request[method](url, options);
  expect(response.status(), method.toUpperCase() + ' ' + url).toBe(403);
};

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test('DEMO account is read-only in the disposable environment', async ({ page, context }) => {
  expect(
    PASSWORD,
    'E2E_TEST_PASSWORD is required for the isolated E2E environment',
  ).toBeTruthy();

  await page.goto('/login');
  await page.locator('input[name="eid"]').fill(EID);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();
  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);

  const allowedRoutes = [
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

  for (const route of allowedRoutes) {
    await page.goto(route);
    const escaped = route.replaceAll('/', '\\/');
    await expect(page).toHaveURL(new RegExp(escaped + '(?:\\?.*)?$'));
  }

  const deniedRoutes = [
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
    '/dashboard/todo/create',
    '/dashboard/todo/999999/edit',
  ];

  for (const route of deniedRoutes) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  }

  const reads = [
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

  for (const url of reads) {
    const response = await context.request.get(url);
    expect(response.ok(), 'GET ' + url).toBeTruthy();
  }

  await expectStatus(context.request, 'post', '/api/purchase/order/post', { data: {} });
  await expectStatus(context.request, 'patch', '/api/purchase-orders/PLA-DEMO-DENY', { data: {} });
  await expectStatus(context.request, 'delete', '/api/purchase-orders/PLA-DEMO-DENY');
  await expectStatus(context.request, 'post', '/api/purchase-orders/PLA-DEMO-DENY/send');
  await expectStatus(context.request, 'post', '/api/purchase-orders/send', { data: { orderNumbers: [] } });
  await expectStatus(context.request, 'patch', '/api/inbounds/orders/by-number/PLA-DEMO-DENY/complete', { data: {} });
  await expectStatus(context.request, 'patch', '/api/outbounds/orders/by-number/REC-DEMO-DENY/complete', { data: {} });
  await expectStatus(context.request, 'post', '/api/adjust', { data: {} });
  await expectStatus(context.request, 'post', '/api/vendor', { data: {} });
  await expectStatus(context.request, 'put', '/api/vendor/999999', { data: {} });
  await expectStatus(context.request, 'delete', '/api/vendor/999999');
  await expectStatus(context.request, 'patch', '/api/user/permission/999999', { data: {} });
  await expectStatus(context.request, 'patch', '/api/user/change-password', { data: {} });
  await expectStatus(context.request, 'patch', '/api/todo/999999/toggle');
  await expectStatus(context.request, 'put', '/api/todo/999999', { data: {} });
  await expectStatus(context.request, 'delete', '/api/todo/999999');
  await expectStatus(context.request, 'post', '/api/invitation', { data: {} });
  await expectStatus(context.request, 'post', '/api/order/post', { data: {} });
  await expectStatus(context.request, 'patch', '/api/order/PLA-DEMO-DENY/manager', { data: {} });
});
