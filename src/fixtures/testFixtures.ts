import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PIMPage } from '../pages/PIMPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TestDataGenerator } from '../utils/testData';
import { EmployeeData } from '../types/employee';

/**
 * TEST_AT - Custom Playwright fixtures
 * Provides pre-authenticated pages and test data
 */
type TEST_ATFixtures = {
  loginPage: LoginPage;
  pimPage: PIMPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
  employeeData: EmployeeData;
};

export const test = base.extend<TEST_ATFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  pimPage: async ({ page }, use) => {
    await use(new PIMPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Pre-authenticated admin session
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await loginPage.expectLoginSuccess();
    await use(page);
  },

  // Fresh unique employee data per test
  employeeData: async ({}, use) => {
    const data = TestDataGenerator.generateEmployee();
    await use(data);
  },
});

export { expect };
