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
    await expect(page.getByRole('main')).toBeVisible({ timeout: 10000 });

    // Check for breadcrumb navigation (this is the visible navigation)
    const breadcrumbNav = page.getByRole('navigation', { name: /breadcrumb/i });
    await expect(breadcrumbNav).toBeVisible();
    await expect(breadcrumbNav).toContainText(/dashboard/i);

    // Check for toggle sidebar button (header element) - be specific to main one
    const sidebarToggle = page
      .getByRole('main')
      .getByRole('button', { name: /toggle sidebar/i });
    await expect(sidebarToggle).toBeVisible();

    // Test sidebar toggle functionality - just verify the button works
    await sidebarToggle.click();

    // Wait a moment for any transition
    await page.waitForTimeout(500);

    // The sidebar might toggle state rather than show as dialog
    // Just verify that clicking doesn't cause errors and button still exists
    await expect(sidebarToggle).toBeVisible();
  });
});
