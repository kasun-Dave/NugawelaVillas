import { test, expect } from '@playwright/test';

test.describe('Smoke — public site', () => {
  test('home page loads with hero and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Lanka Horizons/i }).first()).toBeVisible();
    const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(mainNav).toBeVisible();
    await expect(mainNav.getByRole('link', { name: 'Destinations' })).toBeVisible();
    await expect(mainNav.getByRole('link', { name: 'Attractions' })).toBeVisible();
  });

  test('attractions listing loads', async ({ page }) => {
    await page.goto('/attractions');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('destinations listing loads', async ({ page }) => {
    await page.goto('/destinations');
    await expect(page.getByRole('heading', { level: 1, name: 'Destinations' })).toBeVisible();
  });

  test('legacy rooms redirect to attractions', async ({ page }) => {
    await page.goto('/rooms');
    await expect(page).toHaveURL(/\/attractions/);
  });

  test('legacy adventure redirect to trails', async ({ page }) => {
    await page.goto('/adventure');
    await expect(page).toHaveURL(/\/trails/);
  });

  test('search page loads', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('skip link focuses main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await skipLink.click();
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
