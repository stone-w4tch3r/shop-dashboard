import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Wait for page to load and check for common elements
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Check that navigation is present
    await expect(page.getByRole('navigation')).toBeVisible()
  })
  
  test('should navigate to products page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on products navigation item
    await page.getByRole('link', { name: /products/i }).click()
    
    // Should navigate to products page
    await expect(page).toHaveURL(/.*\/dashboard\/product/)
  })
})

test.describe('Products', () => {
  test('should display product list', async ({ page }) => {
    await page.goto('/dashboard/product')
    
    // Should show products table or empty state
    await expect(page.getByRole('main')).toBeVisible()
  })
})