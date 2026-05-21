import { test, expect } from '@playwright/test';

async function navigateToWeightlifting(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  const wlBtn = page.getByRole('button', { name: /weightlifting/i }).first();
  if (await wlBtn.isVisible()) await wlBtn.click();
}

async function completeAndLogSet(page: import('@playwright/test').Page, weight: string) {
  await page.locator('button').filter({ hasText: /^Set 1/ }).first().click();
  await page.getByRole('spinbutton').fill(weight);
  await page.getByRole('button', { name: /log it/i }).click();
}

function parseTimerDisplay(text: string | null): number {
  if (!text) return 0;
  const [mins, secs] = text.split(':').map(Number);
  return (mins || 0) * 60 + (secs || 0);
}

test.describe('Rest timer', () => {
  test('timer becomes visible after logging a set', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    // After logging, rest timer should be visible (opacity-100)
    await expect(page.getByTestId('rest-timer')).toBeVisible();
  });

  test('timer shows a running indicator after auto-start', async ({ page }) => {
    await navigateToWeightlifting(page);
    // Timer should auto-start based on prefs (autoStart: true by default)
    await completeAndLogSet(page, '135');
    // Give it a moment to initialize
    await page.waitForTimeout(600);
    await expect(page.getByTestId('timer-running-indicator')).toBeVisible();
  });

  test('pause stops the countdown', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    await page.waitForTimeout(1000);
    const before = await page.getByTestId('timer-display').textContent();
    await page.getByRole('button', { name: /pause/i }).click();
    await page.waitForTimeout(3000);
    const after = await page.getByTestId('timer-display').textContent();
    expect(before).toBe(after);
  });

  test('reset returns timer to full duration', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: /reset/i }).click();
    const display = await page.getByTestId('timer-display').textContent();
    expect(display).toMatch(/2:0[01]/); // default 120s
  });

  test('+30s nudge increases remaining time', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    await page.waitForTimeout(10_000);
    await page.getByTitle('+30s').click();
    const display = await page.getByTestId('timer-display').textContent();
    const secs = parseTimerDisplay(display);
    // started at 120, elapsed ~10s, nudged +30 → expect ~140s
    expect(secs).toBeGreaterThan(130);
  });

  test('timer settings button opens settings', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    await page.getByTestId('timer-settings-button').click();
    // TimerSettings drawer should open — look for duration input
    await expect(page.getByLabel(/rest duration/i)).toBeVisible();
  });
});
