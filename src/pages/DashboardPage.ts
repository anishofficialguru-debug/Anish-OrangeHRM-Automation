import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TEST_AT - Dashboard Page Object
 */
export class DashboardPage extends BasePage {
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly dashboardTitle: Locator;

  constructor(page: Page) {
    super(page);
    // Use .first() to avoid strict mode violation (tab + name both match)
    this.userDropdown = page.locator('.oxd-userdropdown-tab').first();
    this.logoutLink = page.locator('a:has-text("Logout")');
    this.dashboardTitle = page.locator('h6:has-text("Dashboard")');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardTitle).toBeVisible({ timeout: 15000 });
  }

  async logout(): Promise<void> {
    // Click the user dropdown (top-right)
    await this.userDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.userDropdown.click();
    // Click Logout
    await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/auth\/login/, { timeout: 15000 });
  }
}