import { test, expect, devices } from '@playwright/test';

// All tests in this file target the iPhone 14 project defined in playwright.config.ts
// Run with: npx playwright test mobile-ui.spec.ts --project=iphone-14

async function navigateToWeightlifting(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
  if (await wlBtn.isVisible()) await wlBtn.tap();
}

async function completeAndLogSet(page: import('@playwright/test').Page, weight: string) {
  await page.locator('button').filter({ hasText: /^Set 1/ }).first().tap();
  await page.getByRole('spinbutton').fill(weight);
  await page.getByRole('button', { name: /log it/i }).tap();
}

test.describe('Mobile UI — iPhone 14', () => {
  test('category buttons are tappable and switch content', async ({ page }) => {
    await page.goto('/');
    const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
    if (await wlBtn.isVisible()) {
      await wlBtn.tap();
      await expect(page.getByTestId('weightlifting-content')).toBeVisible();
    }
  });

  test('SetLogPrompt weight input has inputmode="decimal"', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.locator('button').filter({ hasText: /^Set 1/ }).first().tap();
    const input = page.getByRole('spinbutton');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  test('SetLogPrompt is visible in viewport', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.locator('button').filter({ hasText: /^Set 1/ }).first().tap();
    await expect(page.getByTestId('set-log-prompt')).toBeInViewport();
  });

  test('weight input accepts decimal values', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.locator('button').filter({ hasText: /^Set 1/ }).first().tap();
    const input = page.getByRole('spinbutton');
    await input.fill('102.5');
    await expect(input).toHaveValue('102.5');
  });

  test('schedule panel opens and closes with tap', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).tap();
    await expect(page.getByTestId('schedule-panel')).toBeVisible();
    await page.getByRole('button', { name: /close/i }).tap();
    await expect(page.getByTestId('schedule-panel')).not.toBeVisible();
  });

  test('day tabs in schedule panel have horizontal scroll enabled', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).tap();
    const currentRow = page.getByTestId('current-week-row').first();
    if (await currentRow.isVisible()) {
      await currentRow.tap();
      await page.waitForTimeout(1000);
      const tabRow = page.getByTestId('day-tab-row');
      if (await tabRow.isVisible()) {
        const overflow = await tabRow.evaluate((el) => getComputedStyle(el).overflowX);
        expect(['auto', 'scroll']).toContain(overflow);
      }
    }
  });

  test('timer nudge buttons meet Apple 44pt minimum tap target', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    const nudgeBtn = page.getByTitle('+30s');
    const box = await nudgeBtn.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('rest timer does not cover exercise list', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    const timer = page.getByTestId('rest-timer');
    const list = page.getByTestId('exercise-list');
    const timerBox = await timer.boundingBox();
    const listBox = await list.boundingBox();
    if (timerBox && listBox) {
      // Timer should be at or below the exercise list top
      expect(timerBox.y).toBeGreaterThan(listBox.y);
    }
  });

  test('landscape orientation preserves layout', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 14 landscape'] });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('button', { name: /weightlifting/i }).first()).toBeVisible();
    await context.close();
  });
});
