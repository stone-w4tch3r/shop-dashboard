import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure Playwright with Clerk
setup.describe.configure({ mode: 'serial' });

setup('global setup', async ({}) => {
  await clerkSetup({
    frontendApiUrl: process.env.E2E_CLERK_FRONTEND_API_URL || ''
  });
  if (!process.env.E2E_CLERK_FRONTEND_API_URL) {
    throw new Error('E2E_CLERK_FRONTEND_API_URL is not set');
  }
  if (!process.env.E2E_CLERK_USER_USERNAME) {
    throw new Error('E2E_CLERK_USER_USERNAME is not set');
  }
  if (!process.env.E2E_CLERK_USER_PASSWORD) {
    throw new Error('E2E_CLERK_USER_PASSWORD is not set');
  }
});

// Define the path to the storage file for authenticated tests
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../../../playwright/.clerk/user.json');

setup('authenticate and save state', async ({ page }) => {
  // Only run if we need authenticated tests
  if (!process.env.SKIP_AUTH_SETUP) {
    const { clerk } = await import('@clerk/testing/playwright');

    // Use setupClerkTestingToken for additional protection
    const { setupClerkTestingToken } = await import(
      '@clerk/testing/playwright'
    );
    await setupClerkTestingToken({ page });

    await page.goto('/');
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: process.env.E2E_CLERK_USER_USERNAME || '',
        password: process.env.E2E_CLERK_USER_PASSWORD || ''
      }
    });

    // Navigate to dashboard to ensure we can access protected routes
    await page.goto('/dashboard');
    await page.waitForSelector('nav, [role="navigation"]', { timeout: 15000 });

    // Save the authenticated state
    await page.context().storageState({ path: authFile });
  }
});
