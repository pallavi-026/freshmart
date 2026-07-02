const { test, expect } = require('@playwright/test');

test.describe('FreshMart Core Flow', () => {
  test('should load home page and show products', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check if title exists
    await expect(page).toHaveTitle(/FreshMart/);
    
    // Check if "Shop by Category" section is visible
    const categorySection = page.locator('text=Shop by Category');
    await expect(categorySection).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Shop Now →');
    
    await expect(page).toHaveURL(/.*products/);
    const productGrid = page.locator('.product-grid');
    await expect(productGrid).toBeVisible();
  });
});
