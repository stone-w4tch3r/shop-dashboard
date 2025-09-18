import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure Playwright for mock auth
setup.describe.configure({ mode: 'serial' });

setup('global setup', async ({}) => {
  // Mock auth setup - no external services needed
  console.log('Setting up mock authentication for E2E tests');
});

// Define the path to the storage file for authenticated tests
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(
  __dirname,
  '../../../playwright/.mock-auth/user.json'
);

setup('authenticate and save state', async ({ page }) => {
  // Only run if we need authenticated tests
  if (!process.env.SKIP_AUTH_SETUP) {
    // Navigate to sign-in page
    await page.goto('/auth/sign-in');

    // Fill in mock credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 15000 });

    // Verify we can access protected routes
    await page.waitForSelector('nav, [role="navigation"]', { timeout: 15000 });

    // Save the authenticated state
    await page.context().storageState({ path: authFile });
  }
});
