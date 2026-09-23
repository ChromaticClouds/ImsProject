import { expect } from 'playwright/test';

const EID = process.env.E2E_EID;
const PASSWORD = process.env.E2E_PASSWORD;

export const loginAsProductionDemo = async (page) => {
  expect(EID, 'E2E_EID GitHub Actions secret is required').toBeTruthy();
  expect(PASSWORD, 'E2E_PASSWORD GitHub Actions secret is required').toBeTruthy();

  await page.goto('/login');

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/auth/login') &&
      response.request().method() === 'POST',
  );

  await page.locator('input[name="eid"]').fill(EID);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  const loginResponse = await loginResponsePromise;
  expect(
    loginResponse.ok(),
    'Production DEMO login API must return 2xx',
  ).toBeTruthy();

  const loginBody = await loginResponse.json();
  const accessToken = loginBody?.data?.token;
  expect(accessToken, 'Production DEMO access token is required').toBeTruthy();

  await expect(page).toHaveURL(/\/dashboard(?:\/)?$/);
  await expect(
    page.getByRole('main').getByText('메인 페이지', { exact: true }),
  ).toBeVisible();

  return accessToken;
};

export const navigateAsSpa = async (page, path) => {
  await page.evaluate((nextPath) => {
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);
};
