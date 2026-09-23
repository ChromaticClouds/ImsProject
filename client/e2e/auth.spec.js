import { expect, test } from 'playwright/test';

const EID = process.env.E2E_EID;
const PASSWORD = process.env.E2E_PASSWORD;

test.beforeEach(() => {
  expect(EID, 'E2E_EID GitHub Actions secret is required').toBeTruthy();
  expect(PASSWORD, 'E2E_PASSWORD GitHub Actions secret is required').toBeTruthy();
});

test('logs in with the production demo account', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('사원번호').fill(EID);
  await page.getByLabel('비밀번호').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  await expect(page.getByText('메인 페이지', { exact: true })).toBeVisible();
});

test('keeps the authenticated session after a reload', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('사원번호').fill(EID);
  await page.getByLabel('비밀번호').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  await page.reload();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  await expect(page.getByText('메인 페이지', { exact: true })).toBeVisible();
});
