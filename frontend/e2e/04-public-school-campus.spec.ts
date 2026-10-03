import { test, expect } from '@playwright/test';

test.describe('Public School Campus Website & Landing Page Tests', () => {
  const schoolSlug = 'saraswati-vidya';

  test('should load public school website with header, hero, and facilities', async ({ page }) => {
    // 1. Visit public school website
    await page.goto(`/school/${schoolSlug}`);

    // 2. Verify header navbar displays school name
    const headerTitle = page.locator('header h1');
    await expect(headerTitle).toContainText('Saraswati Gramin Vidya Mandir');

    // 3. Verify tagline and about section
    await expect(page.locator('text=Quality Rural Education & Digital Empowerment')).toBeVisible();

    // 4. Verify facilities section exists
    await expect(page.locator('text=World-Class Facilities').or(page.locator('text=Campus Facilities'))).toBeVisible();

    // 5. Verify bus routes section displays route information
    await expect(page.locator('text=Transport').or(page.locator('text=Bus Routes'))).toBeVisible();
  });
});
