import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { EmployeeData } from '../types/employee';
import { SmartWaits } from '../utils/waits';

/**
 * TEST_AT - PIM (Employee) Page Object
 * Handles employee creation, search, update, deletion
 */
export class PIMPage extends BasePage {
  // Navigation
  readonly pimMenu: Locator;
  readonly addEmployeeButton: Locator;
  readonly employeeListTab: Locator;

  // Add Employee form
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly createLoginToggle: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;

  // Employee List / Search
  readonly searchEmployeeName: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly employeeRows: Locator;
  readonly deleteSelectedButton: Locator;
  readonly confirmDeleteButton: Locator;

  // Personal Details (after creation)
  readonly personalDetailsHeader: Locator;
  readonly employeeNameHeader: Locator;

  constructor(page: Page) {
    super(page);

    this.pimMenu = page.locator('a[href*="/pim/viewPimModule"], span:has-text("PIM")').first();
    this.addEmployeeButton = page.locator('button:has-text("Add")');
    this.employeeListTab = page.locator('a:has-text("Employee List")');

    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    // Employee Id is the text input under the "Employee Id" label (no name attribute)
this.employeeIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
    this.createLoginToggle = page.locator('.oxd-switch-input');
    this.usernameInput = page.locator('input[autocomplete="off"]').nth(1);
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');

    this.searchEmployeeName = page.locator('input[placeholder="Type for hints..."]').first();
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.employeeRows = page.locator('.oxd-table-body .oxd-table-row');
    this.deleteSelectedButton = page.locator('button:has-text("Delete Selected")');
    this.confirmDeleteButton = page.locator('button.oxd-button--label-danger:has-text("Yes, Delete")');

    this.personalDetailsHeader = page.locator('h6:has-text("Personal Details")');
    this.employeeNameHeader = page.locator('.orangehrm-edit-employee-name h6');
  }

  async navigateToPIM(): Promise<void> {
    await this.click(this.pimMenu);
    await this.waits.waitForNetworkIdle();
    await expect(this.page).toHaveURL(/pim/);
  }

  async navigateToAddEmployee(): Promise<void> {
    await this.navigateToPIM();
    await this.click(this.addEmployeeButton);
    await expect(this.firstNameInput).toBeVisible({ timeout: 10000 });
  }

    async createEmployee(data: EmployeeData, createLogin = false): Promise<string> {
    await this.navigateToAddEmployee();

    // Fill required name fields using direct Playwright actions (more reliable)
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.firstNameInput.click();
    await this.firstNameInput.fill(data.firstName);

    if (data.middleName) {
      await this.middleNameInput.click();
      await this.middleNameInput.fill(data.middleName);
    }

    await this.lastNameInput.click();
    await this.lastNameInput.fill(data.lastName);

    // Prefer the auto-generated Employee Id (safest on the public demo)
    let empId = await this.employeeIdInput.inputValue().catch(() => '');
    if (data.employeeId && /^\d+$/.test(data.employeeId)) {
      await this.employeeIdInput.click();
      await this.employeeIdInput.fill('');
      await this.employeeIdInput.fill(data.employeeId);
      empId = data.employeeId;
    }

    console.log(`TEST_AT Creating employee: ${data.firstName} ${data.lastName}, EmpId=${empId}`);

    if (createLogin && data.username && data.password) {
      await this.createLoginToggle.click();
      await this.page.waitForTimeout(500);
      const userInput = this.page.locator('input[autocomplete="off"]').nth(1);
      const passInputs = this.page.locator('input[type="password"]');
      await userInput.fill(data.username);
      await passInputs.nth(0).fill(data.password);
      await passInputs.nth(1).fill(data.password);
    }

    // Click Save and wait for navigation to Personal Details
    await Promise.all([
      this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: 25000 }).catch(() => null),
      this.saveButton.click(),
    ]);

    await this.page.waitForTimeout(1500);

    const currentUrl = this.page.url();
    console.log(`TEST_AT After save URL: ${currentUrl}`);

    const onPersonalDetails =
      currentUrl.includes('viewPersonalDetails') ||
      (await this.personalDetailsHeader.isVisible().catch(() => false));

    if (!onPersonalDetails) {
      const errors = await this.page.locator('.oxd-input-field-error-message, .oxd-alert-content, .oxd-text--danger').allTextContents();
      const pageTitle = await this.page.locator('h6').allTextContents();
      console.log('TEST_AT Create failed. Titles:', pageTitle, 'Errors:', errors);
      await this.page.screenshot({ path: 'test-results/create-employee-error.png', fullPage: true });
      throw new Error(
        `Employee creation failed. Still on: ${currentUrl}. Titles: ${pageTitle.join(', ')}. Errors: ${errors.join(' | ')}`
      );
    }

    await this.waits.waitForSuccessToast(3000);
    await expect(this.personalDetailsHeader).toBeVisible({ timeout: 10000 });

    return empId || data.employeeId || '';
  }

  async getCreatedEmployeeName(): Promise<string> {
    return this.getText(this.employeeNameHeader);
  }

    async searchEmployee(name: string): Promise<void> {
    await this.navigateToPIM();
    const listTab = this.page.locator('a:has-text("Employee List"), li:has-text("Employee List")').first();
    if (await listTab.isVisible().catch(() => false)) {
      await listTab.click();
    }
    await this.page.waitForTimeout(300);

    const searchInput = this.page.locator('input[placeholder="Type for hints..."]').first();
    await searchInput.click();
    await searchInput.fill('');
    await searchInput.fill(name);
    await this.page.waitForTimeout(600);
    await this.page.locator('button[type="submit"]:has-text("Search")').click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async expectEmployeeInList(name: string): Promise<void> {
    const row = this.employeeRows.filter({ hasText: name });
    await expect(row.first()).toBeVisible({ timeout: 10000 });
  }

  async expectEmployeeNotInList(name: string): Promise<void> {
    const row = this.employeeRows.filter({ hasText: name });
    await expect(row).toHaveCount(0, { timeout: 8000 });
  }

    async deleteEmployeeByName(name: string): Promise<void> {
    await this.searchEmployee(name);

    const row = this.employeeRows.filter({ hasText: name }).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    // Use the per-row trash icon (more reliable than bulk "Delete Selected")
    const trashButton = row.locator('button:has(i.bi-trash), i.bi-trash').first();
    await trashButton.click();

    // Confirm deletion in the modal
    const confirmBtn = this.page.locator(
      'button.oxd-button--label-danger:has-text("Yes, Delete"), button:has-text("Yes, Delete")'
    );
    await expect(confirmBtn).toBeVisible({ timeout: 8000 });
    await confirmBtn.click();

    // Brief wait for toast / list refresh
    await this.waits.waitForSuccessToast(4000);
  }

  async updateEmployeeFirstName(newFirstName: string, empNumber?: string): Promise<void> {
  if (empNumber) {
    await this.page.goto(
      `/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  await this.page
    .locator('.oxd-loading-spinner, .oxd-form-loader')
    .waitFor({ state: 'hidden', timeout: 5000 })
    .catch(() => {});

  const firstName = this.page.getByRole('textbox', { name: 'First Name' });
  await firstName.waitFor({ state: 'visible', timeout: 15000 });

  // Reliable way to update controlled inputs on OrangeHRM
  await firstName.click();
  await firstName.clear();
  await firstName.pressSequentially(newFirstName, { delay: 30 });

  // Commit the value
  await firstName.press('Tab');

  // Click the Personal Details Save button (first one)
  await this.page.locator('form').filter({ has: firstName })
    .getByRole('button', { name: 'Save' })
    .click();

  // Wait for success toast
  await expect(this.page.locator('.oxd-toast--success')).toBeVisible({ timeout: 10000 });

  // Give the UI time to settle
  await this.page.waitForTimeout(1000);
}
}
