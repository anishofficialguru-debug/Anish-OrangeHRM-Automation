import { Page, Locator, expect } from '@playwright/test';

/**
 * TEST_AT - Smart waiting utilities
 * Complements Playwright's auto-waiting with explicit, resilient waits
 */
export class SmartWaits {
  constructor(private page: Page) {}

  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => {});
  }

  async waitForStable(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Wait for OrangeHRM success toast (very short-lived).
   * Falls back gracefully if the toast disappears before we catch it.
   */
  async waitForSuccessToast(timeout = 8000): Promise<void> {
    const successToast = this.page.locator('.oxd-toast--success');
    const anyToast = this.page.locator('.oxd-toast');

    try {
      await Promise.race([
        successToast.first().waitFor({ state: 'visible', timeout }),
        anyToast.first().waitFor({ state: 'visible', timeout }),
      ]);
    } catch {
      // Toast already gone or never appeared – common on the demo site
    }

    // Let it disappear so it doesn't interfere with next actions
    await successToast.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await anyToast.first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async retryAction(
    action: () => Promise<void>,
    maxAttempts = 3,
    delayMs = 1000
  ): Promise<void> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await action();
        return;
      } catch (err) {
        lastError = err as Error;
        if (attempt < maxAttempts) {
          await this.page.waitForTimeout(delayMs);
        }
      }
    }
    throw lastError;
  }
}