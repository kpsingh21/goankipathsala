import { test, expect } from '@playwright/test';

test.describe('School Admin Authentication & Dashboard Navigation', () => {
  const schoolSlug = 'saraswati-vidya';

  test('should login as School Admin and render dashboard with school brand header', async ({ page }) => {
    // 1. Visit school portal login page
    await page.goto(`/school/${schoolSlug}/portal/login`);

    // 2. Fill in login form
    await page.fill('input[type="text"], input[type="email"]', 'admin@saraswati.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 3. Verify redirection to dashboard
    await expect(page).toHaveURL(new RegExp(`/school/${schoolSlug}/dashboard`));

    // 4. Verify sidebar brand header shows school name
    const schoolNameHeader = page.locator('aside h1');
    await expect(schoolNameHeader).toBeVisible();

    // 5. Verify main menu items are visible for Admin
    await expect(page.locator('text=Student Information')).toBeVisible();
    await expect(page.locator('text=Staff & Teachers')).toBeVisible();
    await expect(page.locator('text=Attendance Engine')).toBeVisible();
    await expect(page.locator('text=Fee Collections')).toBeVisible();
    await expect(page.locator('text=School Website & CMS')).toBeVisible();
  });
});
