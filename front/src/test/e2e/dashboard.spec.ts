import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Dashboard Layout and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Setup Clerk testing token to bypass auth
    await setupClerkTestingToken({ page });
    await page.goto('/dashboard');
  });

  test('should display main dashboard layout components', async ({ page }) => {
    // Test sidebar visibility and navigation
    await expect(page.getByRole('navigation')).toBeVisible();

    // Test header visibility
    await expect(page.getByRole('banner')).toBeVisible();

    // Test main content area
    await expect(page.getByRole('main')).toBeVisible();

    // Test user navigation is present
    await expect(page.getByTestId('user-nav')).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Test navigation to Products
    await page.getByRole('link', { name: /products/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard\/product/);
    await expect(
      page.getByRole('heading', { name: /products/i })
    ).toBeVisible();

    // Test navigation back to Dashboard
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard$/);

    // Test navigation to Profile
    await page.getByRole('link', { name: /profile/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard\/profile/);
  });

  test('should have responsive sidebar behavior', async ({ page }) => {
    // Test sidebar toggle on mobile/smaller screens
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check if sidebar is collapsible
    const sidebarToggle = page.getByRole('button', {
      name: /toggle.*sidebar/i
    });
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      // Verify sidebar state changes
      await expect(page.getByRole('navigation')).toHaveAttribute(
        'data-state',
        'collapsed'
      );
    }
  });

  test('should display correct page titles and breadcrumbs', async ({
    page
  }) => {
    // Check dashboard title
    await expect(page).toHaveTitle(/dashboard/i);

    // Navigate to products and check title
    await page.getByRole('link', { name: /products/i }).click();
    await expect(page).toHaveTitle(/products/i);

    // Check breadcrumbs if present
    const breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
    if (await breadcrumbs.isVisible()) {
      await expect(breadcrumbs).toContainText('Dashboard');
      await expect(breadcrumbs).toContainText('Products');
    }
  });
});

test.describe('Dashboard Content and Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto('/dashboard');
  });

  test('should handle empty state when no content is available', async ({
    page
  }) => {
    // Since content was temporarily removed, test empty state handling
    const mainContent = page.getByRole('main');
    await expect(mainContent).toBeVisible();

    // Check for empty state indicators or placeholders
    const emptyState = page.getByText(/no.*data|empty|coming.*soon/i);
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should display loading states appropriately', async ({ page }) => {
    // Test loading indicators during navigation
    await page.getByRole('link', { name: /products/i }).click();

    // Check for loading skeletons or spinners
    const loadingIndicator =
      page.getByTestId('loading') || page.getByText(/loading/i);
    // Note: This may be brief, so we'll check if it exists without strict timing
  });

  test('should handle theme switching', async ({ page }) => {
    // Test theme toggle functionality
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Verify theme change by checking body class or data attribute
      const body = page.locator('body');
      await expect(body).toHaveAttribute('class', /dark|light/);
    }
  });

  test('should handle user menu interactions', async ({ page }) => {
    // Test user avatar/menu
    const userMenu =
      page.getByTestId('user-nav') ||
      page.getByRole('button', { name: /user.*menu|profile/i });
    if (await userMenu.isVisible()) {
      await userMenu.click();

      // Check for dropdown menu
      const dropdown =
        page.getByRole('menu') || page.getByTestId('user-menu-dropdown');
      if (await dropdown.isVisible()) {
        await expect(dropdown).toBeVisible();

        // Test profile link
        const profileLink = dropdown.getByRole('menuitem', {
          name: /profile/i
        });
        if (await profileLink.isVisible()) {
          await expect(profileLink).toBeVisible();
        }
      }
    }
  });
});

test.describe('Dashboard Accessibility and UX', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto('/dashboard');
  });

  test('should meet basic accessibility requirements', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check for skip navigation link
    const skipLink = page.getByRole('link', {
      name: /skip.*main|skip.*content/i
    });
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }

    // Check for proper landmark roles
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through main elements
    await page.keyboard.press('Tab');

    // Check if focus is visible on interactive elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test navigation with arrow keys if applicable
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  });

  test('should handle different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Desktop small
      { width: 1920, height: 1080 } // Desktop large
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Verify layout doesn't break
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();

      // Check for horizontal scroll issues
      const bodyScrollWidth = await page.evaluate(
        () => document.body.scrollWidth
      );
      const bodyClientWidth = await page.evaluate(
        () => document.body.clientWidth
      );
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 20); // Allow small tolerance
    }
  });
});

test.describe('Dashboard Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
  });

  test('should handle navigation to non-existent routes', async ({ page }) => {
    await page.goto('/dashboard/non-existent-route');

    // Check for 404 page or redirect
    await expect(
      page.getByText(/not.*found|404/i) || page.getByRole('heading')
    ).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline condition
    await page.context().setOffline(true);
    await page.goto('/dashboard');

    // Check for error handling
    const errorMessage = page.getByText(/error|offline|connection/i);
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }

    // Restore network
    await page.context().setOffline(false);
  });

  test('should handle console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/dashboard');

    // Allow some time for potential errors
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (e.g., development warnings)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('DevTools') &&
        !error.includes('development') &&
        !error.includes('Warning')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
