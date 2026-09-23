import fs from 'node:fs/promises';
import path from 'node:path';

import { expect, test as setup } from 'playwright/test';

const EID = process.env.E2E_EID;
const PASSWORD = process.env.E2E_PASSWORD;
const AUTH_FILE = path.resolve('playwright/.auth/second-admin.json');

setup('authenticate the production demo account', async ({ page }) => {
  expect(EID, 'E2E_EID GitHub Actions secret is required').toBeTruthy();
  expect(PASSWORD, 'E2E_PASSWORD GitHub Actions secret is required').toBeTruthy();

  await fs.mkdir(path.dirname(AUTH_FILE), { recursive: true });

  await page.goto('/login');
  await page.locator('input[name="eid"]').fill(EID);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  await expect(
    page.getByRole('main').getByText('메인 페이지', { exact: true }),
  ).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });
});
