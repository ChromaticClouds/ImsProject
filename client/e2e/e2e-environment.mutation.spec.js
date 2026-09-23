import { expect, test } from 'playwright/test';

const EID = process.env.E2E_SECOND_ADMIN_EID ?? 'E2E-SECOND-ADMIN';
const PASSWORD = process.env.E2E_TEST_PASSWORD;

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test('boots the isolated e2e environment with seeded users', async ({ page }) => {
  expect(
    PASSWORD,
    'E2E_TEST_PASSWORD is required for the isolated E2E environment',
  ).toBeTruthy();

  await page.goto('/login');
  await page.locator('input[name="eid"]').fill(EID);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  await expect(
    page.getByRole('main').getByText('메인 페이지', { exact: true }),
  ).toBeVisible();
});
