import { test, expect } from '@playwright/test';

test.describe('Dashboard Authenticated Flow', () => {
  test('should access dashboard when authenticated and display layout', async ({
    page
  }) => {
    // This test will use the stored authentication state
    await page.goto('/dashboard');

    // Should be able to access dashboard without redirect
    await expect(page).toHaveURL(/.*\/dashboard$/);

    // Check main layout components are present
    await expect(page.getByRole('navigation')).toBeVisible({ timeout: 10000 });

    // Check for sidebar elements
    const sidebar = page.getByRole('navigation');
    await expect(sidebar).toContainText(/dashboard/i);

    // Check for header
    const header = page.locator('header, [role="banner"]');
    if ((await header.count()) > 0) {
      await expect(header.first()).toBeVisible();
    }

    // Check for user navigation/profile
    const userNav =
      page.getByTestId('user-nav') || page.locator('[data-testid*="user"]');
    if ((await userNav.count()) > 0) {
      await expect(userNav.first()).toBeVisible();
    }

    // Test navigation to products page
    const productsLink = page.getByRole('link', { name: /products/i });
    if ((await productsLink.count()) > 0) {
      await productsLink.click();
      await expect(page).toHaveURL(/.*\/dashboard\/product/);
    }

    // Navigate back to dashboard
    await page
      .getByRole('link', { name: /dashboard/i })
      .first()
      .click();
    await expect(page).toHaveURL(/.*\/dashboard$/);
  });
});
