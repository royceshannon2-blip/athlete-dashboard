# PRD: Haiku-Powered Automated Test Suite

**Status:** Draft  
**Model:** `claude-haiku-4-5-20251001`  
**Scope:** Three test suites — exercise cycle scheduling, historical navigation, and weight progression dashboard validation  
**Architecture:** Haiku drives all test logic via the Anthropic API; the app's localStorage is seeded directly before each suite runs

---

## Why Haiku

Haiku runs fast and cheap. These tests involve generating realistic fixture data, making judgment calls about whether displayed output "looks correct," and narrating pass/fail in plain English — tasks that benefit from a model but don't need Sonnet-level reasoning. All three suites call the same `/v1/messages` endpoint with `claude-haiku-4-5-20251001`.

---

## How Tests Work

Each suite follows the same pattern:

1. **Seed** — inject fixture data directly into `localStorage` under the app's existing key schema (`wt:*`)
2. **Navigate** — programmatically set app state (selected day, category, duration) to trigger the view under test
3. **Observe** — scrape the rendered DOM for the values that should be present
4. **Evaluate** — pass the scraped output to Haiku as a prompt; Haiku returns `PASS`, `FAIL`, or `WARN` with a plain-English reason
5. **Report** — collect all verdicts into a test report rendered in the UI

Haiku does not control the browser. It reads text descriptions of what the DOM contains and decides whether that matches the expected behavior. This keeps the test runner simple and the prompts small.

---

## Shared Infrastructure

### File: `client/src/testing/test-runner.ts`

```ts
interface TestCase {
  id: string
  suite: string
  description: string
  seed: () => void           // writes to localStorage
  observe: () => string      // scrapes DOM, returns plain-text snapshot
  expected: string           // plain English description of what should be true
}

interface TestResult {
  id: string
  verdict: "PASS" | "FAIL" | "WARN"
  reason: string
  raw: string                // the observed DOM snapshot
}

async function runTest(tc: TestCase): Promise<TestResult>
async function runSuite(suite: TestCase[]): Promise<TestResult[]>
```

### Haiku evaluation prompt (used for every test)

```
You are a test evaluator. You will be given:
1. A description of what a UI feature is expected to show
2. A plain-text snapshot of what the UI actually shows

Return a JSON object with exactly these fields:
{
  "verdict": "PASS" | "FAIL" | "WARN",
  "reason": "one sentence explanation"
}

EXPECTED: {expected}

OBSERVED: {observed}

Return only the JSON object. No preamble.
```

Response parsed as JSON. If parsing fails, verdict is `WARN` with reason "Haiku response was not valid JSON."

### File: `client/src/testing/seed-utils.ts`

Utility functions used by all three suites:

```ts
function seedWeightLog(entries: SeedEntry[]): void
// Writes wt:log:{exerciseId}:{date}:{setNumber} entries + updates wt:index

function clearWeightLog(): void
// Removes all wt:* keys from localStorage

function seedWorkoutSchedule(exercises: ScheduledExercise[]): void
// Writes any schedule overrides needed to test future/past dates

function formatDateKey(date: Date): string
// Returns "YYYY-MM-DD"
```

---

## Suite 1: Exercise Cycle Scheduling (6 Months)

### Goal

Verify that a 6-month cycle of different exercises is stored and displayed correctly — including that exercises scheduled far in the future appear on the correct future dates, and exercises from the past are still accessible.

### Fixture Data

Generate a cycle of 24 distinct weightlifting exercises distributed across 6 months (roughly one new exercise introduced per week). The cycle rotates through muscle groups: push, pull, legs, core. Example distribution:

| Week | Exercises introduced |
|---|---|
| 1 | Bench Press, Squat, Bent Row, Plank Hold |
| 2 | Overhead Press, Romanian Deadlift, Cable Row, Hanging Knee Raise |
| ... | ... |
| 24 | (final rotation) |

Haiku generates the full 24-week fixture on first run using this prompt:

```
Generate a 6-month (24-week) weightlifting exercise cycle as a JSON array.
Each entry: { week: number, exercises: [{ id, name, muscleGroup, setsReps, rest }] }
Use realistic exercise names, 3-5 exercises per week, rotating push/pull/legs/core.
Return only the JSON array.
```

The generated fixture is written to `localStorage` under a test-only key `wt:test:schedule` and reused on subsequent runs (not regenerated each time).

### Test Cases

**ST-01: Future date shows correct exercises**  
Seed: full 6-month schedule  
Action: set selected day to +8 weeks from today  
Observe: exercise names rendered in WorkoutTable  
Expected: exercises match week 9 of the generated cycle

**ST-02: Current week shows current exercises**  
Seed: same  
Action: set selected day to today  
Observe: exercise names rendered  
Expected: exercises match week 1 of the cycle

**ST-03: Schedule does not bleed between weeks**  
Seed: same  
Action: set selected day to +3 weeks, then +4 weeks, capture both  
Observe: two separate DOM snapshots  
Expected: the two exercise lists are different (different week = different drills)

**ST-04: All 24 weeks have at least 3 exercises**  
Seed: same  
Action: iterate all 24 week offsets programmatically, capture exercise count each time  
Observe: array of { week, count }  
Expected: every week count ≥ 3, for longer durations number of exersizes still goes up

---

## Suite 2: Historical Navigation (1 Month Back)

### Goal

Verify that exercises and logged sets from ~1 month ago are still visible and correctly displayed when the user navigates to a past date.

### Fixture Data

Seed weight log entries dated 28–32 days ago. Use 3 exercises, 3 sets each, logged across 5 different past dates:

```ts
const pastDates = [-28, -29, -30, -31, -32].map(d => {
  const date = new Date()
  date.setDate(date.getDate() + d)
  return formatDateKey(date)
})

const exercises = [
  { id: "ex-bench", name: "Bench Press" },
  { id: "ex-squat", name: "Squat" },
  { id: "ex-row",   name: "Bent Row" }
]

// For each date × exercise × set (1–3):
// wt:log:{exerciseId}:{date}:{setNumber} = { weightKg: realistic value, ... }
```

Weight values increase slightly across dates to simulate progression (e.g. bench goes 80kg → 82.5kg → 85kg across the 5 dates).

### Test Cases

**HN-01: Past date shows logged exercises**  
Seed: above  
Action: navigate to 30 days ago  
Observe: workout view content  
Expected: Bench Press, Squat, and Bent Row all appear

**HN-02: Logged weights are visible in the correct session**  
Seed: above  
Action: navigate to 30 days ago  
Observe: any weight values rendered for Bench Press  
Expected: a weight value near 82.5kg (or ~182 lbs) is visible somewhere in the card

**HN-03: Navigating forward from past date returns to current exercises**  
Seed: above  
Action: navigate to 30 days ago, then navigate to today  
Observe: exercise list for today  
Expected: exercise names match today's scheduled cycle (not the past entries)

**HN-04: Past dates outside the seeded range show no logged data**  
Seed: above  
Action: navigate to 60 days ago  
Observe: workout view  
Expected: no weight values are shown (cards show empty/no-data state, not an error)

---

## Suite 3: Weight Progression Dashboard

### Goal

Verify that the ProgressionDashboard correctly displays per-exercise weight trends on a chart, that the exercise selector switches between exercises, and that the chart data matches the seeded log entries.

### Fixture Data

Seed 3 exercises with 8 sessions each, spread over the past 8 weeks (one session per week per exercise). Weight increases each week to create a clear upward trend:

```ts
const exercises = [
  { id: "ex-bench", name: "Bench Press",   baseKg: 80,  stepKg: 2.5 },
  { id: "ex-squat", name: "Squat",         baseKg: 100, stepKg: 5   },
  { id: "ex-deadlift", name: "Deadlift",   baseKg: 120, stepKg: 5   }
]

// For each exercise, 8 sessions at weekly intervals:
// week 0 (8 weeks ago): baseKg
// week 1 (7 weeks ago): baseKg + stepKg
// ...
// week 7 (this week): baseKg + (7 × stepKg)
// Each session: 3 sets logged, all at the same weight for that week
```

### Test Cases

**WD-01: Dashboard opens and shows exercise selector**  
Seed: above  
Action: open ProgressionDashboard  
Observe: full panel content  
Expected: an exercise selector/dropdown is visible containing at least "Bench Press", "Squat", and "Deadlift"

**WD-02: Default selected exercise shows a chart with data points**  
Seed: above  
Action: open dashboard, observe default state  
Observe: chart area content (axis labels, data point values, tooltip content if accessible)  
Expected: chart contains 8 data points; values increase over time; no "no data" empty state shown

**WD-03: Switching exercises updates the chart**  
Seed: above  
Action: open dashboard → select Bench Press → capture chart → select Squat → capture chart  
Observe: two chart snapshots  
Expected: the two snapshots show different weight values (Squat base is 100kg vs Bench 80kg); chart updates on selection change

**WD-04: Session history table matches seeded data**  
Seed: above  
Action: open dashboard, select Deadlift  
Observe: session history table rows  
Expected: 8 rows visible; most recent row shows weight near 155kg (120 + 7×5); oldest row shows ~120kg; rows are newest-first

**WD-05: Chart trend is visibly upward**  
Seed: above (linear increase per exercise)  
Action: open dashboard, select each exercise in turn, capture chart description  
Observe: first and last data point values for each exercise  
Expected: for every exercise, the last data point weight is greater than the first data point weight

**WD-06: Unit toggle affects chart display**  
Seed: above  
Action: open TimerSettings, switch unit to lbs, open dashboard, select Bench Press  
Observe: chart axis labels and tooltip values  
Expected: values shown in lbs (~176 lbs for 80kg base); no kg values visible

---

## Suite 4: Basketball Drill Cycle Scheduling (6 Months)

### Goal

Verify that a 6-month cycle of different basketball drills across three sub-categories (shooting, ball handling, finishing) is stored and displayed correctly across multiple weeks and durations.

### Fixture Data

Generate drills across three sub-categories rotating through 8 weeks. Example:

| Week | Shooting | Ball Handling | Finishing |
|---|---|---|---|
| 1 | Spot Shooting | Stationary Crossover | Euro Step Layup |
| 2 | Catch and Shoot | Figure-8 Dribble | Reverse Layup |
| ... | ... | ... | ... |
| 8 | Deep Three | Speed Crossover | Contested Layup |

Each drill has a different rep type: makes (absolute), setsPerHand (with right/left), makesPerHand (per hand makes).

### Test Cases

**BB-ST-01: Future date shows correct drills**  
Seed: 8-week drill cycle  
Action: set selected day to +8 weeks from today  
Observe: drill names rendered in WorkoutTable  
Expected: drills match week 9 with Spot Shooting, Crossover Drill, and Euro Step Layup

**BB-ST-02: Current week shows current drills**  
Seed: same  
Action: set selected day to today  
Observe: drill names rendered  
Expected: drills match current week with correct make/set targets

**BB-ST-03: Drill schedule does not bleed between dates**  
Seed: same  
Action: set selected day to +3 weeks, then +4 weeks, capture both  
Observe: two separate DOM snapshots  
Expected: the two drill lists are different (different week = different drills)

**BB-ST-04: All 8 weeks have at least 2 drills**  
Seed: same  
Action: iterate all 8 week offsets programmatically, capture drill count each time  
Observe: array of { week, count }  
Expected: every week count ≥ 2, with consistent drill variety

---

## Suite 5: Basketball Drill Historical Navigation (1 Month Back)

### Goal

Verify that basketball drills and logged performance from ~1 month ago are still visible and correctly displayed when navigating to past dates.

### Fixture Data

Seed drill performance logs dated 28–32 days ago. Use 3 drills across sub-categories, with performance data logged across 5 different past dates:

```ts
const pastDates = [-28, -29, -30, -31, -32].map(d => {
  const date = new Date()
  date.setDate(date.getDate() + d)
  return formatDateKey(date)
})

const drills = [
  { id: "bb-spot", name: "Spot Shooting", repsType: "makes" },
  { id: "bb-cross", name: "Stationary Crossover", repsType: "setsPerHand" },
  { id: "bb-euro", name: "Euro Step Layup", repsType: "makesPerHand" }
]

// For each date × drill:
// wt:drill:{drillId}:{date} = { repsType, repsValue, sessionTs, ... }
```

Performance values increase slightly across dates to simulate progression (e.g. Spot Shooting: 14 → 15 → 16 → 17 → 18 makes).

### Test Cases

**BB-HN-01: Past date shows logged drills**  
Seed: above  
Action: navigate to 30 days ago  
Observe: workout view content  
Expected: Spot Shooting, Stationary Crossover, and Euro Step Layup all appear

**BB-HN-02: Logged reps are visible in the correct session**  
Seed: above  
Action: navigate to 30 days ago  
Observe: any rep values rendered for Spot Shooting  
Expected: a make value near 16 is visible somewhere in the card

**BB-HN-03: Navigating forward from past date returns to current drills**  
Seed: above  
Action: navigate to 30 days ago, then navigate to today  
Observe: drill list for today  
Expected: drill names match today's scheduled cycle (not the past entries)

**BB-HN-04: Past dates outside the seeded range show no logged data**  
Seed: above  
Action: navigate to 60 days ago  
Observe: workout view  
Expected: no rep values are shown (cards show empty/no-data state, not an error)

---

## Suite 6: Basketball Drill Performance Dashboard

### Goal

Verify that the ProgressionDashboard correctly displays per-drill performance trends on a chart, that the drill selector switches between drills, and that the chart data matches the seeded log entries.

### Fixture Data

Seed 3 drills (shooting, ball handling, finishing) with 8 sessions each, spread over 8 weeks (one session per week per drill). Performance increases each week to create a clear upward trend:

```ts
const drills = [
  { id: "bb-spot", name: "Spot Shooting", baseValue: 12 },
  { id: "bb-cross", name: "Stationary Crossover", baseValue: 3 },
  { id: "bb-euro", name: "Euro Step Layup", baseValue: 8 }
]

// For each drill, 8 sessions at weekly intervals:
// week 0 (8 weeks ago): baseValue
// week 1 (7 weeks ago): baseValue + 1
// ...
// week 7 (this week): baseValue + 7
// Each session: makes or sets logged, all at the increased value for that week
```

### Test Cases

**BB-WD-01: Dashboard opens and shows drill selector**  
Seed: above  
Action: open ProgressionDashboard  
Observe: full panel content  
Expected: a drill selector/dropdown is visible containing "Spot Shooting", "Stationary Crossover", and "Euro Step Layup"

**BB-WD-02: Default selected drill shows a chart with data points**  
Seed: above  
Action: open dashboard, observe default state  
Observe: chart area content (axis labels, data point values)  
Expected: chart contains 8 data points; values increase over time; no "no data" empty state shown

**BB-WD-03: Switching drills updates the chart**  
Seed: above  
Action: open dashboard → select Spot Shooting (12 makes) → capture chart → select Stationary Crossover (3 sets) → capture chart  
Observe: two chart snapshots  
Expected: the two snapshots show different starting values (12 vs 3); chart updates on selection change

**BB-WD-04: Session history table matches seeded data**  
Seed: above  
Action: open dashboard, select Euro Step Layup  
Observe: session history table rows  
Expected: 8 rows visible; most recent row shows ~15 makes (8 + 7); oldest row shows ~8 makes; rows are newest-first

**BB-WD-05: Chart trend is visibly upward**  
Seed: above (linear increase per drill)  
Action: open dashboard, select each drill in turn, capture chart description  
Observe: first and last data point values for each drill  
Expected: for every drill, the last data point value is greater than the first data point value

---

## Suite 7: Jumping Exercise Cycle Scheduling (6 Months)

### Goal

Verify that a 6-month cycle of different jumping exercises (plyometric and strength variants) is stored and displayed correctly across 8 weeks and multiple durations.

### Fixture Data

Generate a cycle of jumping exercises distributed across 8 weeks. Example exercises:

| Week | Plyo | Strength |
|---|---|---|
| 1 | Countermovement Jump (5), Jump Rope (1min) | Bilateral Squat (3x6-8) |
| 2 | Countermovement Jump (5), Broad Jump (4) | Bilateral Squat (3x6-8) |
| ... | ... | ... |
| 8 | Single-Leg Hop (6/leg), Depth Jump (5) | Bilateral Squat (4x6-8) |

Jumping exercises use the standard Exercise format (id, phase, name, setsReps, tempo, rest).

### Test Cases

**JP-ST-01: Future date shows correct jumping exercises**  
Seed: full 8-week schedule  
Action: set selected day to +8 weeks from today  
Observe: exercise names rendered in WorkoutTable  
Expected: exercises match week 9 with Countermovement Jump, Jump Rope, and Broad Jump

**JP-ST-02: Current week shows current jumping exercises**  
Seed: same  
Action: set selected day to today  
Observe: exercise names rendered  
Expected: exercises match week 1 of the cycle (Countermovement Jump, Jump Rope)

**JP-ST-03: Schedule does not bleed between weeks**  
Seed: same  
Action: set selected day to +3 weeks, then +4 weeks, capture both  
Observe: two separate DOM snapshots  
Expected: the two exercise lists are different (different week = different reps/tempos)

**JP-ST-04: All 8 weeks have at least 2 jumping exercises**  
Seed: same  
Action: iterate all 8 week offsets programmatically, capture exercise count each time  
Observe: array of { week, count }  
Expected: every week count ≥ 2, with increasing complexity in later weeks

---

## Suite 8: Jumping Exercise Historical Navigation (1 Month Back)

### Goal

Verify that jumping exercises and logged session data from ~1 month ago are still visible and correctly displayed when navigating to past dates.

### Fixture Data

Seed weight/performance logs dated 28–32 days ago. Use 3 jumping exercises, 3 sessions each, logged across 5 different past dates:

```ts
const pastDates = [-28, -29, -30, -31, -32].map(d => {
  const date = new Date()
  date.setDate(date.getDate() + d)
  return formatDateKey(date)
})

const exercises = [
  { id: "jp-cmj", name: "Countermovement Jump" },
  { id: "jp-rope", name: "Jump Rope" },
  { id: "jp-squat", name: "Bilateral Squat", weightKg: 75 }
]

// For each date × exercise × session:
// wt:log:{exerciseId}:{date}:{setNumber} = { ...SetLog }
```

Session weights/reps increase slightly across dates to simulate progression (e.g. squat: 75kg → 77.5kg → 80kg across 5 dates).

### Test Cases

**JP-HN-01: Past date shows logged exercises**  
Seed: above  
Action: navigate to 30 days ago  
Observe: workout view content  
Expected: Countermovement Jump, Jump Rope, and Bilateral Squat all appear

**JP-HN-02: Logged weights are visible in the correct session**  
Seed: above  
Action: navigate to 30 days ago  
Observe: any weight values rendered for Bilateral Squat  
Expected: a weight value near 77.5kg (or ~171 lbs) is visible somewhere in the card

**JP-HN-03: Navigating forward from past returns to current exercises**  
Seed: above  
Action: navigate to 30 days ago, then navigate to today  
Observe: exercise list for today  
Expected: exercise names match today's scheduled cycle (not the past entries)

**JP-HN-04: Past dates outside the seeded range show no logged data**  
Seed: above  
Action: navigate to 60 days ago  
Observe: workout view  
Expected: no weight values are shown (cards show empty/no-data state, not an error)

---

## Suite 9: Jumping Exercise Performance Dashboard

### Goal

Verify that the ProgressionDashboard correctly displays per-exercise weight trends on a chart for jumping exercises, and that the exercise selector switches between exercises.

### Fixture Data

Seed 3 jumping exercises with 8 sessions each, spread over 8 weeks (one session per week per exercise). Weight increases linearly:

```ts
const exercises = [
  { id: "jp-cmj", name: "Countermovement Jump", baseKg: 0 },
  { id: "jp-broad", name: "Broad Jump", baseKg: 0 },
  { id: "jp-squat", name: "Bilateral Squat", baseKg: 75, stepKg: 2.5 }
]

// For Countermovement Jump and Broad Jump, track reps progression (5 → 12 reps)
// For Bilateral Squat, track weight progression: week 0 = 75kg, week 7 = 92.5kg
```

### Test Cases

**JP-WD-01: Dashboard opens and shows exercise selector**  
Seed: above  
Action: open ProgressionDashboard  
Observe: full panel content  
Expected: an exercise selector/dropdown is visible containing "Countermovement Jump", "Broad Jump", and "Bilateral Squat"

**JP-WD-02: Default selected exercise shows a chart with 8 data points**  
Seed: above  
Action: open dashboard, observe default state  
Observe: chart area content  
Expected: chart contains 8 data points; values increase over time; no "no data" empty state shown

**JP-WD-03: Switching exercises updates the chart**  
Seed: above  
Action: open dashboard → select Countermovement Jump → capture chart → select Bilateral Squat → capture chart  
Observe: two chart snapshots  
Expected: the two snapshots show different values (5 reps vs 75kg); chart updates on selection change

**JP-WD-04: Session history table matches seeded data**  
Seed: above  
Action: open dashboard, select Bilateral Squat  
Observe: session history table rows  
Expected: 8 rows visible; most recent row shows weight near 92.5kg (75 + 7×2.5); oldest row shows ~75kg; rows are newest-first

**JP-WD-05: Chart trend is visibly upward**  
Seed: above (linear increase per exercise)  
Action: open dashboard, select each exercise in turn, capture chart description  
Observe: first and last data point values for each exercise  
Expected: for every exercise, the last data point value is greater than the first data point value

---

## Test Runner UI

### File: `client/src/components/TestRunner.tsx`

A dev-only panel (never shown in production builds, gated by `import.meta.env.DEV`).

Layout:
- Three suite buttons: "Run Schedule Tests", "Run History Tests", "Run Dashboard Tests"
- "Run All" button
- Results table: columns are Test ID, Description, Verdict (color-coded chip), Reason
- PASS = green, FAIL = red, WARN = yellow
- A "Clear localStorage & Reset" button that wipes all `wt:*` keys including test fixtures
- Loading state per test: spinner with the test description while Haiku is evaluating

Accessible via a hidden route `/test-runner` in development only.

### Verdict summary bar

At the top of results: `N passed · N failed · N warnings` in a single line. If any test fails, the bar is red. All pass = green. Any warn with no fail = yellow.

---

## Files Created

- `client/src/testing/test-runner.ts` — core runner, Haiku API call, result types
- `client/src/testing/seed-utils.ts` — localStorage seeding utilities (weight and drill logging)
- `client/src/testing/suite-basketball.ts` — Basketball drill cycle, historical, and performance tests (18 tests total)
- `client/src/testing/suite-jumping.ts` — Jumping exercise cycle, historical, and performance tests (18 tests total)
- `client/src/components/TestRunner.tsx` — dev UI panel with suite buttons and results table

## Files Modified

- `client/src/App.tsx` — add `/test-runner` route, dev-only (conditional import)

## Test Coverage Summary

| Sport | Cycle | Historical | Performance | Total |
|-------|-------|-----------|-------------|-------|
| Basketball | 4 drills | 4 drills | 5 drills | 13 |
| Jumping | 4 exercises | 4 exercises | 5 exercises | 13 |

**Total Test Cases: 26**

## Untouched

- All production app logic
- `use-weight-log.ts`, `use-rest-timer.ts`
- Production builds exclude test files

---

## Setup & Configuration

### Environment

Create a `.env` file in the project root:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from [https://console.anthropic.com/account/keys](https://console.anthropic.com/account/keys).

For development, the tests only run in dev mode (`import.meta.env.DEV`), so the `.env` file is only needed when running `npm run dev`.

### Accessing the Test Runner

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5000/test-runner` (or `/athlete-dashboard/test-runner` on GitHub Pages)
3. Click suite buttons to run tests individually or "Run All Tests"

## API Call Configuration

```ts
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey
  },
  body: JSON.stringify({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,          // verdicts are short
    messages: [{ role: "user", content: evaluationPrompt }]
  })
})
```

`max_tokens: 200` is sufficient for all evaluation responses. Keep it low to minimize latency per test.

### Cost Estimation

- Total test cases: 26 (13 basketball, 13 jumping)
- Tokens per test: ~150 (varies by observed DOM length)
- Cost per full run: ~$0.02 (26 tests × 150 tokens × Haiku pricing)

---

## Verification Checklist

- [ ] `/test-runner` route is unreachable in production build
- [ ] "Run All" executes all 26 test cases in sequence (13 basketball, 13 jumping)
- [ ] Each test seeds localStorage, observes, then evaluates — in that order
- [ ] Seeded data does not persist after "Clear localStorage & Reset"
- [ ] All 26 tests pass on a clean localStorage with the seeded fixtures
- [ ] Basketball drills properly distinguished by sub-category in tests
- [ ] Jumping exercises treated as standard Exercise format (same as weightlifting)
- [ ] Switching drills/exercises in WD-03 / JP-WD-03 triggers re-render before second observation
- [ ] Unit toggle in WD-06 is reset to kg after the test completes (don't leave the app in lbs)
- [ ] API key is required; tests return WARN if `VITE_ANTHROPIC_API_KEY` is not set
- [ ] Test results display with color-coded verdicts (green=PASS, red=FAIL, yellow=WARN)
