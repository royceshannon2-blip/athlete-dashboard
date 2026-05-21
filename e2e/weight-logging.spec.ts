import { test, expect } from '@playwright/test';

async function navigateToWeightlifting(page: import('@playwright/test').Page) {
  await page.goto('/');
  // Select weightlifting category if not already selected
  const wlTab = page.getByRole('button', { name: /weightlifting/i }).first();
  if (await wlTab.isVisible()) await wlTab.click();
}

async function clickFirstSet(page: import('@playwright/test').Page) {
  await page.locator('button').filter({ hasText: /^Set 1/ }).first().click();
}

test.describe('Weight logging flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('set prompt appears after clicking a set button', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    await expect(page.getByText(/set 1 of/i)).toBeVisible();
  });

  test('entering a weight and submitting saves to localStorage', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    await page.getByRole('spinbutton').fill('225');
    await page.getByRole('button', { name: /log it/i }).click();
    const stored = await page.evaluate(() => {
      const index = JSON.parse(localStorage.getItem('wt:index') || '[]');
      return index.length;
    });
    expect(stored).toBe(1);
  });

  test('last weight pre-fills on next set', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    await page.getByRole('spinbutton').fill('225');
    await page.getByRole('button', { name: /log it/i }).click();
    // Click set 2
    await page.locator('button').filter({ hasText: /^Set 2/ }).first().click();
    // Weight should be pre-filled (stored as kg, displayed as lbs)
    const input = page.getByRole('spinbutton');
    await expect(input).not.toHaveValue('');
  });

  test('skipping a set does not log an entry', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    await page.getByRole('button', { name: /skip/i }).click();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('wt:index') || '[]').length
    );
    expect(stored).toBe(0);
  });

  test('data persists after page reload', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    await page.getByRole('spinbutton').fill('225');
    await page.getByRole('button', { name: /log it/i }).click();
    await page.reload();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('wt:index') || '[]').length
    );
    expect(stored).toBe(1);
  });

  test('weight tracking prompt does not appear in basketball category', async ({ page }) => {
    const basketballBtn = page.getByRole('button', { name: /basketball/i }).first();
    if (await basketballBtn.isVisible()) {
      await basketballBtn.click();
    }
    // Basketball has no "Set N" buttons
    await expect(page.locator('button').filter({ hasText: /^Set 1/ })).toHaveCount(0);
  });

  test('negative weight shows validation error', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    await page.getByRole('spinbutton').fill('-50');
    await page.getByRole('button', { name: /log it/i }).click();
    await expect(page.getByText(/enter a valid weight/i)).toBeVisible();
  });

  test('inputmode="decimal" is set on weight input', async ({ page }) => {
    await navigateToWeightlifting(page);
    await clickFirstSet(page);
    const input = page.getByRole('spinbutton');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
  });
});
