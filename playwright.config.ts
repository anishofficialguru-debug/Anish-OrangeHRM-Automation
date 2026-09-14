import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific config
const env = process.env.TEST_ENV || 'demo';
dotenv.config({ path: path.resolve(__dirname, `config/.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, 'config/.env') }); // fallback

const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

/**
 * TEST_AT OrangeHRM Automation Framework
 * Playwright configuration with environment support, retries, parallelization
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry logic for stability
  workers: process.env.CI ? 4 : undefined, // Parallelization in CI
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment for cross-browser if needed
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],
  // Global setup/teardown can be added here if needed
});
