import { Page, Locator, expect } from '@playwright/test';
import { SmartWaits } from '../utils/waits';

/**
 * TEST_AT - Base Page Object
 * Provides common actions and smart waits for all pages
 */
export abstract class BasePage {
  readonly page: Page;
  readonly waits: SmartWaits;

  constructor(page: Page) {
    this.page = page;
    this.waits = new SmartWaits(page);
  }

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async click(locator: Locator): Promise<void> {
    await this.waits.waitForStable(locator);
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await this.waits.waitForStable(locator);
    await locator.clear();
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    return (await locator.textContent())?.trim() || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
