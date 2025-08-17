import { test, expect } from '@playwright/test';

test.describe('Dashboard Visual Layout Tests', () => {
  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to sign-in
    await expect(page).toHaveURL(/.*\/auth\/sign-in/);
    await expect(
      page.getByRole('heading', { name: /sign.?in/i })
    ).toBeVisible();
  });

  test('should display sign-in form correctly', async ({ page }) => {
    await page.goto('/auth/sign-in');

    // Check form elements
    await expect(page.getByText(/email/i)).toBeVisible();
    await expect(page.getByRole('textbox')).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/auth/sign-in');

    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 } // Tablet
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Check no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);

      // Main content visible
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/auth/sign-in');

    // Filter critical errors only
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('DevTools') &&
        !error.includes('development') &&
        !error.includes('Warning') &&
        !error.includes('401')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper semantic structure', async ({ page }) => {
    await page.goto('/auth/sign-in');

    // Basic HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang');
    await expect(page.locator('title')).toBeAttached();
    await expect(page.locator('meta[name="viewport"]')).toBeAttached();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/auth/sign-in');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    if ((await focusedElement.count()) > 0) {
      await expect(focusedElement).toBeVisible();
    }
  });
});
