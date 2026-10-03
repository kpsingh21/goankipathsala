import { test, expect } from '@playwright/test';

test.describe('Student SIS Directory & Bulk ID Card Regression Tests', () => {
  const schoolSlug = 'saraswati-vidya';

  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto(`/school/${schoolSlug}/portal/login`);
    await page.fill('input[type="text"], input[type="email"]', 'admin@saraswati.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(new RegExp(`/school/${schoolSlug}/dashboard`));
  });

  test('should display student records and search filter', async ({ page }) => {
    // Ensure on Students section
    await page.locator('text=Student Information').first().click();

    // Verify student action bar is present
    await expect(page.locator('text=Bulk Print ID Cards')).toBeVisible();
    await expect(page.locator('text=ID Card Look & Feel')).toBeVisible();

    // Test search filter
    const searchInput = page.locator('input[placeholder*="Search"]').or(page.locator('input[type="text"]').first());
    await searchInput.fill('Aarav');
    await page.waitForTimeout(400);

    // Verify filtered result
    await expect(page.locator('text=Aarav')).toBeVisible();
  });

  test('should open ID Card Look & Feel template settings modal', async ({ page }) => {
    await page.locator('text=Student Information').first().click();

    // Click ID Card Look & Feel button
    await page.locator('button:has-text("ID Card Look & Feel")').click();

    // Verify modal is open
    await expect(page.locator('text=ID Card Designer & Look & Feel')).toBeVisible();
    await expect(page.locator('text=Show School Logo')).toBeVisible();
    await expect(page.locator('text=Show Barcode')).toBeVisible();

    // Close modal
    await page.locator('button:has-text("✕")').or(page.locator('button:has-text("Close")')).first().click();
  });

  test('should open Bulk Print ID Cards preview modal with cards rendered', async ({ page }) => {
    await page.locator('text=Student Information').first().click();

    // Click Bulk Print ID Cards
    await page.locator('button:has-text("Bulk Print ID Cards")').click();

    // Verify Bulk Print modal opens
    await expect(page.locator('text=Bulk ID Cards Ready to Print')).toBeVisible();
    await expect(page.locator('button:has-text("Print All ID Cards")')).toBeVisible();

    // Close preview modal
    await page.locator('button:has-text("✕")').first().click();
  });
});
