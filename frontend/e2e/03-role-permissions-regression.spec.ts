import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control (RBAC) & Teacher Permissions Regression Tests', () => {
  const schoolSlug = 'saraswati-vidya';

  test.beforeEach(async ({ page }) => {
    // Login as Class Teacher
    await page.goto(`/school/${schoolSlug}/portal/login`);
    await page.fill('input[type="text"], input[type="email"]', 'teacher@saraswati.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(new RegExp(`/school/${schoolSlug}/dashboard`));
  });

  test('teacher should see role badge as CLASS_TEACHER or TEACHER', async ({ page }) => {
    const roleBadge = page.locator('aside p').filter({ hasText: /TEACHER/ });
    await expect(roleBadge).toBeVisible();
  });

  test('teacher should NOT have access to School Website & CMS', async ({ page }) => {
    // Website CMS menu button should not exist in the sidebar
    const websiteNav = page.locator('aside button:has-text("School Website & CMS")');
    await expect(websiteNav).toHaveCount(0);
  });

  test('teacher should NOT see configure bus route options in Transport section', async ({ page }) => {
    // Navigate to Transport
    await page.locator('aside button:has-text("Transport")').click();

    // Verify Configure / Add Route button is not visible
    const addRouteBtn = page.locator('button:has-text("Add Bus Route"), button:has-text("Configure New Bus Route")');
    await expect(addRouteBtn).toHaveCount(0);
  });

  test('teacher can view notices but CANNOT broadcast or edit notices', async ({ page }) => {
    // Navigate to Notices
    await page.locator('aside button:has-text("Notices")').click();

    // Verify notices list is visible
    await expect(page.locator('text=Notice Board').or(page.locator('text=Circulars'))).toBeVisible();

    // Verify "Broadcast Notice" button or creation form is hidden for Teacher
    const broadcastBtn = page.locator('button:has-text("Broadcast Notice")');
    await expect(broadcastBtn).toHaveCount(0);
  });

  test('teacher can view weekly timetable but CANNOT edit or delete slots', async ({ page }) => {
    // Navigate to Timetable
    await page.locator('aside button:has-text("Timetable")').click();

    // Verify timetable schedule table is visible
    await expect(page.locator('text=Weekly Timetable').or(page.locator('text=Schedule'))).toBeVisible();

    // Verify Edit Slot / Delete Slot buttons are not rendered for Teacher
    const editSlotBtn = page.locator('button:has-text("Edit Slot"), button:has-text("Delete Slot")');
    await expect(editSlotBtn).toHaveCount(0);
  });
});
