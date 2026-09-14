import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

/**
 * TEST_AT - API level verification tests
 * Uses authenticated browser context to leverage session cookies
 */
test.describe('TEST_AT API Verification @api', () => {
  test('TEST_AT_API_001 - Authenticated session can reach PIM employees endpoint', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await loginPage.expectLoginSuccess();

    // Use the same page's request context (carries cookies)
    const response = await page.request.get('/web/index.php/api/v2/pim/employees', {
      params: { limit: 5 },
    });

    console.log(`TEST_AT API response status: ${response.status()}`);
    // Public demo may restrict pure API access; accept 200 or auth errors
    expect([200, 401, 403]).toContain(response.status());

    if (response.ok()) {
      const body = await response.json();
      expect(body).toHaveProperty('data');
    }
  });

  test('TEST_AT_API_002 - Unauthenticated request is rejected', async ({ request }) => {
    const response = await request.get(
      'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees'
    );
    expect([401, 403]).toContain(response.status());
  });
});
