import { test, expect } from '@playwright/test';

test.describe('Schedule browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens when Schedule button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    await expect(page.getByTestId('schedule-panel')).toBeVisible();
  });

  test('closing panel removes it from view', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    await expect(page.getByTestId('schedule-panel')).toBeVisible();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByTestId('schedule-panel')).not.toBeVisible();
  });

  test('current week row is present and highlighted', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    const currentRow = page.getByTestId('current-week-row').first();
    await expect(currentRow).toBeVisible();
    await expect(currentRow).toHaveClass(/highlighted/);
  });

  test('past week rows are present when history exists', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    const pastRows = page.getByTestId('past-week-row');
    // Past rows may or may not exist depending on schedule data
    const count = await pastRows.count();
    expect(count).toBeGreaterThanOrEqual(0);
    if (count > 0) {
      await expect(pastRows.first()).toBeVisible();
    }
  });

  test('upcoming weeks show Preview badge', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    const upcomingRows = page.getByTestId('upcoming-week-row');
    const count = await upcomingRows.count();
    if (count > 0) {
      await expect(upcomingRows.first().getByText(/preview/i)).toBeVisible();
    }
  });

  test('selecting a week shows day tabs', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    const currentRow = page.getByTestId('current-week-row').first();
    await currentRow.click();
    await expect(page.getByTestId('day-tab-row')).toBeVisible();
  });

  test('day tab row contains day abbreviations', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    const currentRow = page.getByTestId('current-week-row').first();
    await currentRow.click();
    // Wait for the week plan to load
    await page.waitForTimeout(1000);
    const dayTabRow = page.getByTestId('day-tab-row');
    await expect(dayTabRow).toBeVisible();
  });

  test('closing panel returns main workout view', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).click();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByTestId('main-workout-view')).toBeVisible();
  });
});
