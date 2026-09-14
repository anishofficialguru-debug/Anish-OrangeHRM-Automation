import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TEST_AT - Login Page Object
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text, .oxd-input-field-error-message');
    this.dashboardHeader = page.locator('h6.oxd-text--h6').filter({ hasText: 'Dashboard' });
  }

  async goto(): Promise<void> {
    await this.navigate('/web/index.php/auth/login');
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waits.waitForNetworkIdle();
  }

  async loginAsAdmin(): Promise<void> {
    const user = process.env.ADMIN_USERNAME || 'Admin';
    const pass = process.env.ADMIN_PASSWORD || 'admin123';
    await this.login(user, pass);
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardHeader).toBeVisible({ timeout: 15000 });
  }

  async expectLoginFailure(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible();
  }
}
