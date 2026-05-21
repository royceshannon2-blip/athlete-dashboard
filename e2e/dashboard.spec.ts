import { test, expect } from '@playwright/test';

async function seedTwoSessions(page: import('@playwright/test').Page) {
  // Inject two log entries with different dates directly into localStorage
  await page.evaluate(() => {
    const entries = [
      {
        id: 'log-old',
        exerciseId: 'ex-squat',
        exerciseName: 'Back Squat',
        date: '2026-05-01',
        sessionTs: new Date('2026-05-01').getTime(),
        setNumber: 1,
        targetReps: '5',
        weightKg: 100,
        unit: 'kg',
      },
      {
        id: 'log-new',
        exerciseId: 'ex-squat',
        exerciseName: 'Back Squat',
        date: '2026-05-15',
        sessionTs: new Date('2026-05-15').getTime(),
        setNumber: 1,
        targetReps: '5',
        weightKg: 105,
        unit: 'kg',
      },
    ];
    entries.forEach((e) => localStorage.setItem(`wt:log:${e.exerciseId}:${e.date}:${e.setNumber}`, JSON.stringify(e)));
    localStorage.setItem('wt:index', JSON.stringify(entries.map((e) => `wt:log:${e.exerciseId}:${e.date}:${e.setNumber}`)));
  });
}

test.describe('Progression dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('dashboard button is visible in weightlifting view', async ({ page }) => {
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await expect(page.getByRole('button', { name: /dashboard/i })).toBeVisible();
  });

  test('opening dashboard shows empty state when no data', async ({ page }) => {
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await page.getByRole('button', { name: /dashboard/i }).click();
    await expect(page.getByText(/no weight data logged yet/i)).toBeVisible();
  });

  test('exercise appears in dashboard after seeding data', async ({ page }) => {
    await seedTwoSessions(page);
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await page.getByRole('button', { name: /dashboard/i }).click();
    await expect(page.getByText(/back squat/i)).toBeVisible();
  });

  test('session history table shows data rows', async ({ page }) => {
    await seedTwoSessions(page);
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await page.getByRole('button', { name: /dashboard/i }).click();
    const rows = page.locator('[data-testid="session-row"]');
    await expect(rows).toHaveCount(2);
  });

  test('session history is sorted newest first', async ({ page }) => {
    await seedTwoSessions(page);
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await page.getByRole('button', { name: /dashboard/i }).click();
    const rows = page.locator('[data-testid="session-row"]');
    const firstDate = await rows.first().getAttribute('data-date');
    const secondDate = await rows.nth(1).getAttribute('data-date');
    expect(new Date(firstDate!).getTime()).toBeGreaterThan(new Date(secondDate!).getTime());
  });

  test('clear data removes entries from the table', async ({ page }) => {
    await seedTwoSessions(page);
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await page.getByRole('button', { name: /dashboard/i }).click();

    page.on('dialog', (dialog) => dialog.accept());
    await page.getByText(/clear data/i).click();

    await expect(page.getByText(/no weight data logged yet/i)).toBeVisible();
  });

  test('progression-chart is rendered when data exists', async ({ page }) => {
    await seedTwoSessions(page);
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) await wlBtn.click();
    await page.getByRole('button', { name: /dashboard/i }).click();
    await expect(page.getByTestId('progression-chart')).toBeVisible();
  });
});
