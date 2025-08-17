import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('should redirect to sign-in when accessing dashboard unauthenticated', async ({
    page
  }) => {
    await page.goto('/dashboard');

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/.*\/auth\/sign-in/);
    await expect(
      page.getByRole('heading', { name: /sign.?in/i })
    ).toBeVisible();
  });

  test('should redirect to sign-in when accessing products unauthenticated', async ({
    page
  }) => {
    await page.goto('/dashboard/product');

    // Should redirect to sign-in page with redirect URL
    await expect(page).toHaveURL(/.*\/auth\/sign-in.*redirect_url/);
  });

  test('should load sign-in page correctly', async ({ page }) => {
    await page.goto('/auth/sign-in');

    // Should show sign-in page
    await expect(page).toHaveURL(/.*\/auth\/sign-in/);
    await expect(page.getByText(/email/i)).toBeVisible();
  });
});
