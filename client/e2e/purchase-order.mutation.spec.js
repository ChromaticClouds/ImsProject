import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from 'playwright/test';

const EID = process.env.E2E_SECOND_ADMIN_EID ?? 'E2E-SECOND-ADMIN';
const PASSWORD = process.env.E2E_TEST_PASSWORD;
const FIXTURE_VENDOR = 'E2E 테스트 공급처';
const FIXTURE_PRODUCT = 'E2E 테스트 소주';
const EXPECTED_COUNT = 12;
const EXPECTED_PURCHASE_PRICE = 1200;
const EXPECTED_TOTAL_PRICE = EXPECTED_COUNT * EXPECTED_PURCHASE_PRICE;

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test('creates a purchase order and exposes it in the draft list', async ({
  page,
  context,
}) => {
  expect(
    PASSWORD,
    'E2E_TEST_PASSWORD is required for the isolated E2E environment',
  ).toBeTruthy();

  await page.goto('/login');
  await page.locator('input[name="eid"]').fill(EID);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);

  const bootstrapResponse = await context.request.get(
    '/api/purchase/order/bootstrap',
  );
  expect(bootstrapResponse.ok()).toBeTruthy();

  const bootstrapBody = await bootstrapResponse.json();
  expect(bootstrapBody.success).toBeTruthy();

  const vendor = bootstrapBody.data?.vendors?.find(
    (item) => item.name === FIXTURE_VENDOR,
  );
  expect(vendor, 'E2E supplier fixture must be seeded').toBeTruthy();

  const productResponse = await context.request.get(
    `/api/purchase/order/supplier/${vendor.id}/product`,
    { params: { search: FIXTURE_PRODUCT } },
  );
  expect(productResponse.ok()).toBeTruthy();

  const productBody = await productResponse.json();
  expect(productBody.success).toBeTruthy();

  const product = productBody.data?.find(
    (item) => item.name === FIXTURE_PRODUCT,
  );
  expect(product, 'E2E product fixture must be available from supplier').toBeTruthy();
  expect(product.vendorItemId).toBeTruthy();

  const receiveDate = new Date();
  receiveDate.setDate(receiveDate.getDate() + 1);
  const date = [
    receiveDate.getFullYear(),
    String(receiveDate.getMonth() + 1).padStart(2, '0'),
    String(receiveDate.getDate()).padStart(2, '0'),
  ].join('-');

  const postResponse = await context.request.post('/api/purchase/order/post', {
    data: {
      supplierId: vendor.id,
      date,
      products: [
        {
          id: product.id,
          vendorItemId: product.vendorItemId,
          name: product.name,
          type: product.type,
          brand: product.brand,
          salePrice: product.salePrice,
          imageUrl: product.imageUrl,
          count: EXPECTED_COUNT,
        },
      ],
    },
  });

  expect(postResponse.ok()).toBeTruthy();

  const postBody = await postResponse.json();
  expect(postBody.success).toBeTruthy();

  await page.goto('/dashboard/purchase-order');
  await expect(page.getByRole('heading', { name: '발주 관리' })).toBeVisible();

  const draftSearchResponse = await context.request.get(
    '/api/purchase-orders',
    {
      params: {
        view: 'DRAFT',
        keyword: FIXTURE_PRODUCT,
        page: 1,
        size: 10,
      },
    },
  );
  expect(draftSearchResponse.ok()).toBeTruthy();

  const draftBody = await draftSearchResponse.json();
  const createdOrder = draftBody.content?.find((group) =>
    group.items?.some(
      (item) =>
        item.productName === FIXTURE_PRODUCT &&
        item.count === EXPECTED_COUNT &&
        item.purchasePrice === EXPECTED_PURCHASE_PRICE,
    ),
  );

  expect(createdOrder, 'created E2E purchase order must be listed as draft').toBeTruthy();
  expect(createdOrder.vendorName).toBe(FIXTURE_VENDOR);
  expect(createdOrder.totalCount).toBe(EXPECTED_COUNT);
  expect(createdOrder.totalPrice).toBe(EXPECTED_TOTAL_PRICE);
  expect(createdOrder.status).toBeNull();
  expect(createdOrder.recieveDate).toBe(date);
  expect(createdOrder.orderNumber).toMatch(/^PLA-\d{8}-\d{6}$/);

  await expect(page.getByText(createdOrder.orderNumber, { exact: true })).toBeVisible();
  await expect(page.getByText(FIXTURE_VENDOR, { exact: true })).toBeVisible();
  await expect(
    page.getByText(`${EXPECTED_TOTAL_PRICE.toLocaleString()}원`, { exact: true }),
  ).toBeVisible();

  const resultDir = path.resolve('test-results');
  fs.mkdirSync(resultDir, { recursive: true });
  fs.writeFileSync(
    path.join(resultDir, 'created-purchase-order.json'),
    JSON.stringify(
      {
        orderNumber: createdOrder.orderNumber,
        orderId: createdOrder.items?.[0]?.orderId ?? null,
        productId: product.id,
        vendorItemId: product.vendorItemId,
        count: EXPECTED_COUNT,
        purchasePrice: EXPECTED_PURCHASE_PRICE,
        totalPrice: EXPECTED_TOTAL_PRICE,
        receiveDate: date,
      },
      null,
      2,
    ),
  );
});
