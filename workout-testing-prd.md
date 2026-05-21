# PRD: Weight Input Validation, Persistence Testing & Cross-Platform UI Verification

**Status:** Draft  
**Last updated:** 2026-05-19

---

## Goals

1. Ensure weight entry is reliable — the right value is typed, accepted, stored, and retrieved without data loss or corruption across all input conditions.
2. Define a test suite covering weight logging logic, localStorage persistence, and the set-count prompt trigger.
3. Verify every piece of UI in the app functions correctly on desktop browsers and iPhone (Safari and Chrome for iOS), with particular attention to inputs, modals, the timer, and the dashboard chart.
4. Catch regressions early — tests run locally and in CI on every push to the main branch.

---

## Constraints

- No backend. All persistence tests operate against `localStorage` in a jsdom test environment (unit/integration) and against a real browser (E2E).
- iPhone testing targets Safari on iOS 16+ and Chrome for iOS, both on a physical device and in browser dev tools device emulation.
- Desktop testing targets Chrome, Firefox, and Safari on macOS.
- Tests must not require a paid testing service — Playwright's free tier covers all target browsers including WebKit (Safari engine).
- `use-workouts.ts` remains unmodified.
- Test files live alongside source files in `__tests__` folders or as `.test.ts(x)` colocated files — not in a separate top-level directory.

---

## File Structure

```
client/
  src/
    hooks/
      use-weight-log.ts
      use-weight-log.test.ts          ← NEW: unit tests for storage read/write/parse
      use-rest-timer.ts
      use-rest-timer.test.ts          ← NEW: unit tests for timer accuracy and state
    utils/
      parse-sets-reps.ts              ← NEW: extracted parser (was inline in component)
      parse-sets-reps.test.ts         ← NEW: unit tests for all setsReps formats
      weight-convert.ts               ← NEW: kg ↔ lbs conversion util
      weight-convert.test.ts          ← NEW: unit tests for conversion math
    components/
      SetLogPrompt.tsx
      SetLogPrompt.test.tsx           ← NEW: render + interaction tests
      RestTimer.tsx
      RestTimer.test.tsx              ← NEW: render + countdown tests
      ProgressionDashboard.tsx
      ProgressionDashboard.test.tsx   ← NEW: chart render + empty state tests

e2e/
  weight-logging.spec.ts             ← NEW: Playwright — full log flow on desktop + iPhone
  timer.spec.ts                      ← NEW: Playwright — timer start/pause/reset/chime
  dashboard.spec.ts                  ← NEW: Playwright — chart renders, data persists
  schedule-browser.spec.ts           ← NEW: Playwright — panel open/close, week nav, day tabs
  mobile-ui.spec.ts                  ← NEW: Playwright — all UI on iPhone viewport + touch

playwright.config.ts                 ← NEW: browser matrix (Chromium, Firefox, WebKit, iPhone)
vitest.config.ts                     ← NEW (or update existing): test environment config
```

---

## Test Stack

| Layer | Tool | Reason |
|---|---|---|
| Unit + integration | Vitest + React Testing Library | Fast, jsdom environment, same config as Vite |
| localStorage mock | Vitest's built-in `vi.stubGlobal` or `localStorage` mock | Isolate storage between tests |
| E2E cross-browser | Playwright | Free, runs WebKit (Safari engine), has iPhone device emulation built in |
| Assertions | Vitest `expect` + `@testing-library/jest-dom` | Familiar, covers DOM assertions |

---

## Unit Tests

### `parse-sets-reps.test.ts`

Covers every format present in the existing exercise data.

```typescript
describe('parseSetsReps', () => {
  it('parses standard format', () => {
    expect(parseSetsReps('4x5')).toEqual({ sets: 4, reps: '5' });
  });
  it('parses rep range', () => {
    expect(parseSetsReps('3x8-10')).toEqual({ sets: 3, reps: '8-10' });
  });
  it('parses timed sets', () => {
    expect(parseSetsReps('4x30s')).toEqual({ sets: 4, reps: '30s' });
  });
  it('parses single set', () => {
    expect(parseSetsReps('1x5')).toEqual({ sets: 1, reps: '5' });
  });
  it('falls back gracefully on unexpected format', () => {
    expect(parseSetsReps('AMRAP')).toEqual({ sets: 1, reps: 'AMRAP' });
  });
  it('returns sets: 1 for empty string', () => {
    expect(parseSetsReps('')).toEqual({ sets: 1, reps: '' });
  });
});
```

### `weight-convert.test.ts`

```typescript
describe('kgToLbs', () => {
  it('converts correctly', () => expect(kgToLbs(100)).toBeCloseTo(220.46, 1));
  it('handles zero', () => expect(kgToLbs(0)).toBe(0));
  it('handles decimals', () => expect(kgToLbs(102.5)).toBeCloseTo(226.0, 0));
});

describe('lbsToKg', () => {
  it('converts correctly', () => expect(lbsToKg(225)).toBeCloseTo(102.06, 1));
  it('round-trips without significant drift', () => {
    expect(kgToLbs(lbsToKg(225))).toBeCloseTo(225, 1);
  });
});
```

### `use-weight-log.test.ts`

Each test runs with a fresh `localStorage` mock (cleared in `beforeEach`).

```typescript
describe('saveSetLog', () => {
  it('writes an entry to localStorage', () => {
    saveSetLog(mockEntry);
    const keys = getLogIndex();
    expect(keys).toHaveLength(1);
  });
  it('stores weight in kg regardless of input unit', () => {
    saveSetLog({ ...mockEntry, weightKg: lbsToKg(225), unit: 'lbs' });
    const entry = getSetLog(keys[0]);
    expect(entry.weightKg).toBeCloseTo(102.06, 1);
  });
  it('appends to index without duplicating', () => {
    saveSetLog(mockEntry);
    saveSetLog({ ...mockEntry, id: 'log-2', setNumber: 2 });
    expect(getLogIndex()).toHaveLength(2);
  });
  it('pre-fills last weight for an exercise', () => {
    saveSetLog({ ...mockEntry, weightKg: 100 });
    saveSetLog({ ...mockEntry, id: 'log-2', setNumber: 2, weightKg: 105 });
    expect(getLastWeightForExercise(mockEntry.exerciseId)).toBe(105);
  });
});

describe('getSessionSummaries', () => {
  it('groups sets by session timestamp', () => {
    // two sets same session, one from a different day
    const summaries = getSessionSummaries('exercise-1');
    expect(summaries).toHaveLength(2);
  });
  it('computes maxWeightKg correctly', () => {
    const [latest] = getSessionSummaries('exercise-1');
    expect(latest.maxWeightKg).toBe(105);
  });
  it('computes totalVolumeKg as sum of weight * reps', () => {
    // 2 sets × 5 reps × 100kg = 1000, + 1 set × 5 reps × 105kg = 525 → total 1525
    const [latest] = getSessionSummaries('exercise-1');
    expect(latest.totalVolumeKg).toBeCloseTo(1525, 0);
  });
  it('returns empty array when no logs exist', () => {
    expect(getSessionSummaries('nonexistent-id')).toEqual([]);
  });
});

describe('clearExerciseLogs', () => {
  it('removes all entries for one exercise and leaves others', () => {
    saveSetLog({ ...mockEntry, exerciseId: 'ex-1' });
    saveSetLog({ ...mockEntry, id: 'log-other', exerciseId: 'ex-2' });
    clearExerciseLogs('ex-1');
    expect(getSessionSummaries('ex-1')).toHaveLength(0);
    expect(getSessionSummaries('ex-2')).toHaveLength(1);
  });
});

describe('localStorage persistence', () => {
  it('survives a simulated page reload', () => {
    saveSetLog(mockEntry);
    // re-initialize the hook (simulate fresh mount)
    const { result } = renderHook(() => useWeightLog());
    expect(result.current.getLastWeightForExercise(mockEntry.exerciseId)).toBeDefined();
  });
  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('wt:index', 'not-valid-json');
    expect(() => getLogIndex()).not.toThrow();
    expect(getLogIndex()).toEqual([]);
  });
  it('handles localStorage quota exceeded without crashing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => saveSetLog(mockEntry)).not.toThrow();
  });
});
```

### `SetLogPrompt.test.tsx`

```typescript
describe('SetLogPrompt', () => {
  it('renders set number and total sets', () => {
    render(<SetLogPrompt exerciseName="Back Squat" setNumber={2} totalSets={4} />);
    expect(screen.getByText(/set 2 of 4/i)).toBeInTheDocument();
  });
  it('pre-fills input with last known weight', () => {
    render(<SetLogPrompt lastWeight={102.5} unit="lbs" />);
    expect(screen.getByRole('spinbutton')).toHaveValue(102.5);
  });
  it('calls onLog with the entered weight on submit', async () => {
    const onLog = vi.fn();
    render(<SetLogPrompt onLog={onLog} lastWeight={100} unit="lbs" />);
    await userEvent.clear(screen.getByRole('spinbutton'));
    await userEvent.type(screen.getByRole('spinbutton'), '225');
    await userEvent.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).toHaveBeenCalledWith(expect.objectContaining({ weightLbs: 225 }));
  });
  it('calls onSkip and does not call onLog when skip is pressed', async () => {
    const onLog = vi.fn();
    const onSkip = vi.fn();
    render(<SetLogPrompt onLog={onLog} onSkip={onSkip} />);
    await userEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(onSkip).toHaveBeenCalled();
    expect(onLog).not.toHaveBeenCalled();
  });
  it('rejects non-numeric input', async () => {
    render(<SetLogPrompt />);
    await userEvent.type(screen.getByRole('spinbutton'), 'abc');
    expect(screen.getByRole('spinbutton')).toHaveValue(null);
  });
  it('rejects negative weight', async () => {
    const onLog = vi.fn();
    render(<SetLogPrompt onLog={onLog} />);
    await userEvent.type(screen.getByRole('spinbutton'), '-50');
    await userEvent.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).not.toHaveBeenCalled();
    expect(screen.getByText(/enter a valid weight/i)).toBeInTheDocument();
  });
  it('rejects implausibly large weight (>1000 lbs)', async () => {
    const onLog = vi.fn();
    render(<SetLogPrompt onLog={onLog} unit="lbs" />);
    await userEvent.type(screen.getByRole('spinbutton'), '9999');
    await userEvent.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).not.toHaveBeenCalled();
  });
  it('toggling unit updates the label but not the stored kg value', async () => {
    render(<SetLogPrompt lastWeight={100} unit="kg" />);
    await userEvent.click(screen.getByRole('button', { name: /lbs/i }));
    expect(screen.getByText(/lbs/i)).toBeInTheDocument();
  });
  it('prompt appears the correct number of times per exercise', () => {
    // 4x5 → 4 prompts. Simulate completing all 4 sets.
    const { rerender } = render(<ExerciseView setsReps="4x5" />);
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByText(new RegExp(`set ${i} of 4`, 'i'))).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: /log it/i }));
      rerender(<ExerciseView setsReps="4x5" currentSet={i + 1} />);
    }
    expect(screen.queryByText(/set 5 of 4/i)).not.toBeInTheDocument();
  });
});
```

### `use-rest-timer.test.ts`

```typescript
describe('useRestTimer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts counting down from the given duration', () => {
    const { result } = renderHook(() => useRestTimer(120));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(30000));
    expect(result.current.remaining).toBeCloseTo(90, 0);
  });
  it('pausing freezes the countdown', () => {
    const { result } = renderHook(() => useRestTimer(120));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(30000));
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(30000));
    expect(result.current.remaining).toBeCloseTo(90, 0);
  });
  it('reset returns to full duration', () => {
    const { result } = renderHook(() => useRestTimer(120));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(60000));
    act(() => result.current.reset());
    expect(result.current.remaining).toBe(120);
  });
  it('calls onComplete when reaching zero', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useRestTimer(10, { onComplete }));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(11000));
    expect(onComplete).toHaveBeenCalledOnce();
  });
  it('does not go below zero', () => {
    const { result } = renderHook(() => useRestTimer(10));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(30000));
    expect(result.current.remaining).toBe(0);
  });
  it('+30s nudge adds 30 seconds to remaining time', () => {
    const { result } = renderHook(() => useRestTimer(120));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(60000));
    act(() => result.current.nudge(30));
    expect(result.current.remaining).toBeCloseTo(90, 0);
  });
});
```

---

## E2E Tests (Playwright)

### `playwright.config.ts` — Browser Matrix

```typescript
export default defineConfig({
  projects: [
    { name: 'chromium',  use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',   use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',    use: { ...devices['Desktop Safari'] } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
    { name: 'iphone-14-landscape', use: { ...devices['iPhone 14 landscape'] } },
  ],
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
});
```

---

### `weight-logging.spec.ts`

```typescript
test.describe('Weight logging flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('prompt appears after marking a set complete', async ({ page }) => {
    await page.getByRole('tab', { name: /weightlifting/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await expect(page.getByText(/set 1 of/i)).toBeVisible();
  });

  test('entering a weight and submitting saves to localStorage', async ({ page }) => {
    await page.getByRole('tab', { name: /weightlifting/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await page.getByRole('spinbutton').fill('225');
    await page.getByRole('button', { name: /log it/i }).click();
    const stored = await page.evaluate(() => {
      const index = JSON.parse(localStorage.getItem('wt:index') || '[]');
      return index.length;
    });
    expect(stored).toBe(1);
  });

  test('last weight pre-fills on second set', async ({ page }) => {
    await page.getByRole('tab', { name: /weightlifting/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await page.getByRole('spinbutton').fill('225');
    await page.getByRole('button', { name: /log it/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await expect(page.getByRole('spinbutton')).toHaveValue('225');
  });

  test('skipping a set does not log an entry', async ({ page }) => {
    await page.getByRole('tab', { name: /weightlifting/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await page.getByRole('button', { name: /skip/i }).click();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('wt:index') || '[]').length
    );
    expect(stored).toBe(0);
  });

  test('data persists after page reload', async ({ page }) => {
    await page.getByRole('tab', { name: /weightlifting/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await page.getByRole('spinbutton').fill('225');
    await page.getByRole('button', { name: /log it/i }).click();
    await page.reload();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('wt:index') || '[]').length
    );
    expect(stored).toBe(1);
  });

  test('weight tracking prompt does not appear in basketball category', async ({ page }) => {
    await page.getByRole('tab', { name: /basketball/i }).click();
    await page.getByRole('button', { name: /complete set/i }).first().click();
    await expect(page.getByText(/set \d+ of/i)).not.toBeVisible();
  });
});
```

### `timer.spec.ts`

```typescript
test.describe('Rest timer', () => {
  test('auto-starts after logging a set', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    await expect(page.getByTestId('rest-timer')).toBeVisible();
    await expect(page.getByTestId('timer-running-indicator')).toBeVisible();
  });

  test('pause stops the countdown', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
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
    expect(display).toMatch(/2:00/); // default 120s
  });

  test('+30s nudge increases remaining time', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: /\+30/i }).click();
    const display = await page.getByTestId('timer-display').textContent();
    // started at 120, elapsed ~10s, nudged +30 → expect ~140s
    const secs = parseTimerDisplay(display);
    expect(secs).toBeGreaterThan(130);
  });

  test('timer settings persist across reload', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.getByTestId('timer-settings-button').click();
    await page.getByLabel(/default duration/i).fill('180');
    await page.getByRole('button', { name: /save/i }).click();
    await page.reload();
    await page.getByTestId('timer-settings-button').click();
    await expect(page.getByLabel(/default duration/i)).toHaveValue('180');
  });
});
```

### `dashboard.spec.ts`

```typescript
test.describe('Progression dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await seedTwoSessions(page); // helper: logs sets on two different dates
  });

  test('exercise selector lists exercises with logged data', async ({ page }) => {
    await page.getByRole('button', { name: /dashboard/i }).click();
    await expect(page.getByRole('combobox')).toContainText('Back Squat');
  });

  test('chart renders with correct number of data points', async ({ page }) => {
    await page.getByRole('button', { name: /dashboard/i }).click();
    await page.getByRole('combobox').selectOption('Back Squat');
    const dots = page.locator('[data-testid="chart-dot"]');
    await expect(dots).toHaveCount(2);
  });

  test('session history table shows newest session first', async ({ page }) => {
    await page.getByRole('button', { name: /dashboard/i }).click();
    const rows = page.locator('[data-testid="session-row"]');
    const firstDate = await rows.first().getAttribute('data-date');
    const secondDate = await rows.nth(1).getAttribute('data-date');
    expect(new Date(firstDate!).getTime()).toBeGreaterThan(new Date(secondDate!).getTime());
  });

  test('clear exercise data removes it from chart and table', async ({ page }) => {
    await page.getByRole('button', { name: /dashboard/i }).click();
    await page.getByRole('button', { name: /clear all data/i }).click();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByText(/no sets logged yet/i)).toBeVisible();
  });

  test('CSV export downloads a non-empty file', async ({ page }) => {
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /dashboard/i }).click();
    await page.getByRole('button', { name: /export.*csv/i }).click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/\.csv$/);
  });
});
```

### `mobile-ui.spec.ts`

All tests in this file run on the `iphone-14` project defined in `playwright.config.ts`.

```typescript
test.describe('Mobile UI — iPhone 14', () => {
  test('category tabs are tappable and switch content', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /weightlifting/i }).tap();
    await expect(page.getByTestId('weightlifting-content')).toBeVisible();
  });

  test('SetLogPrompt numeric keyboard appears on weight input', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.getByRole('button', { name: /complete set/i }).first().tap();
    const input = page.getByRole('spinbutton');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  test('SetLogPrompt is fully visible without scrolling', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.getByRole('button', { name: /complete set/i }).first().tap();
    const prompt = page.getByTestId('set-log-prompt');
    await expect(prompt).toBeInViewport();
  });

  test('RestTimer strip does not obscure exercise list', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    const timer = page.getByTestId('rest-timer');
    const list = page.getByTestId('exercise-list');
    const timerBox = await timer.boundingBox();
    const listBox = await list.boundingBox();
    // timer should be below exercise list or pinned at bottom, not overlapping
    expect(timerBox!.y).toBeGreaterThan(listBox!.y);
  });

  test('ScheduleBrowserPanel opens and closes with tap', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).tap();
    await expect(page.getByTestId('schedule-panel')).toBeVisible();
    await page.getByRole('button', { name: /close/i }).tap();
    await expect(page.getByTestId('schedule-panel')).not.toBeVisible();
  });

  test('day tabs in ScheduleBrowserPanel are horizontally scrollable on small screen', async ({ page }) => {
    await page.getByRole('button', { name: /schedule/i }).tap();
    const tabRow = page.getByTestId('day-tab-row');
    const overflow = await tabRow.evaluate(el => getComputedStyle(el).overflowX);
    expect(['auto', 'scroll']).toContain(overflow);
  });

  test('dashboard chart renders at mobile width without overflow', async ({ page }) => {
    await seedTwoSessions(page);
    await page.getByRole('button', { name: /dashboard/i }).tap();
    const chart = page.getByTestId('progression-chart');
    const chartBox = await chart.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    expect(chartBox!.width).toBeLessThanOrEqual(viewportWidth);
  });

  test('timer +/- buttons are large enough to tap accurately', async ({ page }) => {
    await navigateToWeightlifting(page);
    await completeAndLogSet(page, '135');
    const nudgeBtn = page.getByRole('button', { name: /\+30/i });
    const box = await nudgeBtn.boundingBox();
    // Apple HIG minimum tap target: 44×44pt
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('weight input accepts decimal on iPhone numeric keyboard', async ({ page }) => {
    await navigateToWeightlifting(page);
    await page.getByRole('button', { name: /complete set/i }).first().tap();
    const input = page.getByRole('spinbutton');
    await input.fill('102.5');
    await expect(input).toHaveValue('102.5');
  });

  test('landscape orientation does not break layout', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 14 landscape'] });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('tab', { name: /weightlifting/i })).toBeVisible();
    await context.close();
  });
});
```

### `schedule-browser.spec.ts`

```typescript
test.describe('Schedule browser', () => {
  test('opens when Schedule button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).click();
    await expect(page.getByTestId('schedule-panel')).toBeVisible();
  });

  test('current week is highlighted and pre-selected', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).click();
    await expect(page.getByTestId('current-week-row')).toHaveClass(/highlighted/);
  });

  test('selecting a past week loads its day tabs', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).click();
    await page.getByTestId('past-week-row').first().click();
    await expect(page.getByRole('tab', { name: /mon/i })).toBeVisible();
  });

  test('upcoming week shows Preview badge', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).click();
    const upcomingRow = page.getByTestId('upcoming-week-row').first();
    await expect(upcomingRow.getByText(/preview/i)).toBeVisible();
  });

  test('closing panel returns focus to main view', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /schedule/i }).click();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByTestId('schedule-panel')).not.toBeVisible();
    await expect(page.getByTestId('main-workout-view')).toBeVisible();
  });
});
```

---

## CI Configuration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run test:unit

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

Playwright test traces are uploaded on failure so failures are diagnosable without re-running locally.

---

## Key Decisions

### Why Vitest over Jest?

The project uses Vite. Vitest shares the same config, transform pipeline, and module resolution — no duplicate config. It is also meaningfully faster for this project's size.

### Why Playwright over Cypress for mobile?

Playwright ships with WebKit (the Safari engine) and real iPhone device emulation out of the box at no cost. Cypress requires a paid plan for multi-browser support and does not support WebKit. For a static GitHub Pages project, Playwright's built-in `npx playwright install` is the simplest path to verified Safari and iPhone coverage.

### Why test `inputmode="decimal"` specifically?

On iPhone, `<input type="number">` shows a number pad without a decimal point in some iOS versions, which breaks entering weights like 102.5. Setting `inputmode="decimal"` on the weight input ensures the correct keyboard. The test enforces that this attribute is present — catching any accidental removal during refactoring.

### Why test tap target size?

Apple's Human Interface Guidelines require a minimum 44×44pt tap target. Playwright's `boundingBox()` returns dimensions in CSS pixels, which match points on standard density screens. The test catches buttons that are technically present but too small to tap reliably on a real device.

### Why seed data in E2E tests rather than mocking?

Dashboard and persistence tests need real `localStorage` entries that survive page actions and reloads. Seeding via page actions (actually completing sets and logging weights) tests the full stack. A `seedTwoSessions` helper encapsulates the repetitive navigation so individual tests stay readable.

---

## Definition of Done

- [ ] All unit tests pass: `parseSetsReps`, `weight-convert`, `use-weight-log`, `SetLogPrompt`, `use-rest-timer`.
- [ ] `use-weight-log` tests verify write, read, last-weight pre-fill, session grouping, volume calculation, clear-by-exercise, and corrupted/quota-exceeded localStorage handling.
- [ ] `SetLogPrompt` tests verify correct set count triggering, pre-fill, submission, skip, negative rejection, and implausible value rejection.
- [ ] All E2E tests pass on Chromium, Firefox, WebKit, iPhone 14 portrait, and iPhone 14 landscape.
- [ ] Weight entered on iPhone with a decimal (e.g. 102.5) is stored and retrieved correctly.
- [ ] Timer countdown is accurate to within 1 second after 60 seconds of elapsed time.
- [ ] No UI element overflows the viewport on iPhone 14 in portrait or landscape.
- [ ] All tap targets in the lifting view meet the 44×44pt minimum.
- [ ] CI runs unit tests and E2E tests on every push and pull request to main.
- [ ] Playwright traces are uploaded as artifacts on test failure.
- [ ] `use-workouts.ts` is unmodified.
- [ ] Basketball and jumping categories show no weight tracking UI elements in any test environment.
