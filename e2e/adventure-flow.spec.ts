import { test, expect } from '@playwright/test';

/**
 * The Hidden Trail adventure product was removed from the public route tree.
 * Legacy adventure URLs redirect to Trails.
 */
test.describe('Legacy adventure routes', () => {
  test('adventure landing redirects to trails', async ({ page }) => {
    await page.goto('/adventure');
    await expect(page).toHaveURL(/\/trails/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('adventure how-it-works redirects to trails', async ({ page }) => {
    await page.goto('/adventure/how-it-works');
    await expect(page).toHaveURL(/\/trails/);
  });
});
