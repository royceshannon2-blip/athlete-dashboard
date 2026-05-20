# PRD: Weight Tracking, Progression Dashboard & Customizable Rest Timer

**Status:** Draft  
**Last updated:** 2026-05-19

---

## Goals

1. After each set in the weightlifting category, automatically prompt the user to log the weight used — the number of prompts matches the number of sets in the exercise (e.g. 4 sets = 4 prompts).
2. Persist all logged weight data locally so it survives page refreshes and browser closes.
3. Show a progression dashboard per exercise — charting weight over time across sessions so the user can see strength gains at a glance.
4. Provide a customizable rest timer within the lifting view that the user can set per exercise or globally, start/pause/reset manually, and that auto-starts after a set is logged.
5. Everything runs on GitHub Pages — no backend, no user accounts, no server.

---

## Constraints

- GitHub Pages is a static host — no server, no database. All persistence must use browser-native storage.
- Weight data belongs to the device/browser it was entered on. Cross-device sync is out of scope.
- The weight tracking prompt must not block the UI — it should feel like a quick log, not a form.
- The dashboard is read-only; users cannot edit past entries from the dashboard view (they can clear all data as a reset option).
- Timer must work correctly if the browser tab is backgrounded (use `Date` timestamps, not `setInterval` counts alone).
- `use-workouts.ts` remains unmodified.
- Weight tracking applies only to the weightlifting category. Basketball and jumping categories are unaffected.

---

## Storage Strategy

### Why `localStorage`?

GitHub Pages has no server. The realistic options are:

| Option | Verdict |
|---|---|
| `localStorage` | Best fit — simple key/value, ~5MB per origin, survives refresh and browser close, no auth needed |
| `sessionStorage` | Lost on tab close — not suitable for long-term tracking |
| IndexedDB | More capacity and query power, but significant complexity overhead for this use case |
| Google Sheets via API | Requires OAuth, API keys exposed client-side — not suitable for a static site |
| GitHub Gist via API | Requires a personal access token stored client-side — not suitable |

`localStorage` is the right call. At roughly 200 bytes per set log, a user logging 20 sets per session 3x per week would take about 8 years to approach the 5MB limit.

### Data Model

All keys are namespaced under `wt:` to avoid collisions with anything else the app stores.

**Set log entry** — one entry per completed set:

```json
{
  "id": "log-1716144000000-abc12",
  "exerciseId": "mon-wl-w1-30-1",
  "exerciseName": "Back Squat",
  "date": "2026-05-19",
  "sessionTs": 1716144000000,
  "setNumber": 2,
  "targetReps": 5,
  "weightKg": 102.5,
  "unit": "lbs"
}
```

**localStorage key:** `wt:log:{exerciseId}:{date}:{setNumber}`  
**Index key:** `wt:index` — a JSON array of all log entry keys, used to enumerate history without scanning all localStorage keys.

**Timer preferences** — persisted separately:

```json
{
  "defaultDurationSecs": 120,
  "autoStart": true,
  "soundEnabled": true,
  "unit": "lbs"
}
```

**localStorage key:** `wt:prefs`

---

## File Structure

```
client/
  src/
    hooks/
      use-workouts.ts                  ← existing, untouched
      use-weekly-rotation.ts           ← from rotation PRD
      use-schedule-browser.ts          ← from daily variation PRD
      use-weight-log.ts                ← NEW: read/write set logs to localStorage
      use-rest-timer.ts                ← NEW: timer state, auto-start, sound
    components/
      WeekSelector.tsx                 ← from rotation PRD
      ScheduleBrowserButton.tsx        ← from daily variation PRD
      ScheduleBrowserPanel.tsx         ← from daily variation PRD
      SetLogPrompt.tsx                 ← NEW: per-set weight entry prompt
      RestTimer.tsx                    ← NEW: countdown display + controls
      TimerSettings.tsx                ← NEW: customize duration, auto-start, sound
      DashboardButton.tsx              ← NEW: nav entry point to the dashboard
      ProgressionDashboard.tsx         ← NEW: full dashboard panel
      ExerciseProgressChart.tsx        ← NEW: per-exercise weight-over-time chart
      ExerciseSelector.tsx             ← NEW: dropdown/search to pick exercise in dashboard
```

---

## Data Schema

### Set Log (`use-weight-log.ts`)

```typescript
interface SetLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;           // "YYYY-MM-DD"
  sessionTs: number;      // Unix ms — groups sets from the same session
  setNumber: number;      // 1-indexed
  targetReps: number;     // from the exercise definition
  weightKg: number;       // always stored in kg internally
  unit: "lbs" | "kg";     // user's display preference at time of entry
}
```

Stored in kg internally so the dashboard math is unit-consistent. Display converts on the fly based on `wt:prefs`.

### Aggregated per-session view (computed, not stored)

```typescript
interface SessionSummary {
  date: string;
  sessionTs: number;
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  maxWeightKg: number;    // heaviest set that session
  totalVolumeKg: number;  // sum of (weight × reps) across all sets
}
```

---

## Key Decisions

### How does the set prompt trigger?

When the user taps "Done" or "Completed" on a set within the weightlifting exercise view, `SetLogPrompt` appears as a small bottom sheet or inline card — not a full modal — with:

- Exercise name and set number ("Back Squat — Set 2 of 4")
- A numeric input pre-filled with the last weight used for this exercise (from localStorage), so repeat sessions require just a confirmation tap
- A unit toggle (lbs / kg) that persists to `wt:prefs`
- "Log it" button — saves the entry, dismisses the sheet, and auto-starts the rest timer if `autoStart` is true

The number of prompts equals the number of sets declared in the exercise's `setsReps` field. A `4x5` exercise triggers 4 sequential prompts, one after each set completion.

### How is `setsReps` parsed to get the set count?

```typescript
function parseSetsReps(setsReps: string): { sets: number; reps: string } {
  const match = setsReps.match(/^(\d+)x(.+)$/);
  if (!match) return { sets: 1, reps: setsReps };
  return { sets: parseInt(match[1]), reps: match[2] };
}
// "4x5"    → { sets: 4, reps: "5" }
// "3x8-10" → { sets: 3, reps: "8-10" }
// "4x30s"  → { sets: 4, reps: "30s" }  ← still parsed but skipped for non-lifting categories
```

### What if the user skips logging a set?

A "Skip" option is always available on the prompt. Skipped sets are not logged. The timer still auto-starts (if enabled). Skipping is not penalized or flagged in the dashboard — partial session data is valid.

### How does the rest timer work correctly when backgrounded?

`setInterval` drifts when the tab is hidden. The timer stores `endTime = Date.now() + durationMs` in state (and optionally in `sessionStorage` for tab-restore resilience), then computes remaining time as `endTime - Date.now()` on each tick. The UI update interval can be 500ms — actual accuracy is timestamp-based, not tick-based.

```typescript
// use-rest-timer.ts core
const [endTime, setEndTime] = useState<number | null>(null);
const remaining = endTime ? Math.max(0, endTime - Date.now()) : duration;
```

### How is the dashboard data structured for charting?

Each exercise gets its own time-series: x-axis = session date, y-axis = max weight that session. Total volume (sets × reps × weight) is shown as a secondary line. This gives two meaningful signals: peak strength and total work done.

The chart library must be zero-dependency or already bundled. **Recharts** is already listed as available in the React artifact environment and is a natural fit.

### Can the user set a different rest timer per exercise?

Yes. The timer duration can be:
1. **Global default** — set in `TimerSettings`, stored in `wt:prefs`.
2. **Exercise override** — if the exercise definition's `rest` field is present (e.g. `"rest": "180s"`), the timer pre-loads that value when the exercise is active. The user can still adjust it manually before starting.

Priority: manual adjustment > exercise `rest` field > global default.

### Why not use the `rest` field from the exercise JSON automatically?

The `rest` field is already in the schema (`"rest": "90s"`). Parsing it and pre-loading the timer is a quality-of-life feature that requires no schema changes — just a parser:

```typescript
function parseRestSecs(rest: string): number {
  const match = rest.match(/^(\d+)s$/);
  return match ? parseInt(match[1]) : 120; // fallback to 2 min
}
```

---

## Component Behavior

### `SetLogPrompt`

- Appears after user marks a set complete.
- Shows: exercise name, "Set N of M", numeric weight input (pre-filled with last known weight), unit toggle, "Log it" and "Skip" buttons.
- On "Log it": writes to localStorage via `use-weight-log`, dismisses, triggers timer auto-start.
- On "Skip": dismisses, triggers timer auto-start.
- Input accepts decimal values (e.g. 102.5 lbs).

### `RestTimer`

- Persistent strip at the bottom of the lifting view when active.
- Shows: countdown in MM:SS, progress ring or bar, Play/Pause, Reset, and a +/−30s nudge button.
- When time reaches zero: plays a short chime (Web Audio API, no file dependency) and flashes the display.
- Collapsed/hidden when no exercise is active.

### `TimerSettings`

- Accessible via a gear icon on the `RestTimer` strip.
- Controls: default duration (number input in seconds, or MM:SS), auto-start toggle, sound toggle, unit preference (lbs / kg).
- Changes persist immediately to `wt:prefs`.

### `ProgressionDashboard`

- Opened from a "Dashboard" button in the main nav (weightlifting section only, or globally accessible).
- Top: exercise selector — dropdown or searchable list of every exercise that has at least one logged set.
- Chart area: line chart showing max weight per session over time for the selected exercise.
  - X-axis: date.
  - Y-axis: weight in user's preferred unit.
  - Secondary line: total volume per session (right-hand y-axis).
  - Tooltip on hover: date, max weight, total volume, number of sets logged.
- Below chart: session history table — date, sets logged, max weight, total volume — newest first.
- Bottom: "Clear all data for this exercise" and "Export all data as CSV" actions.

### `ExerciseProgressChart`

- Recharts `ComposedChart` with a `Line` for max weight and a `Bar` for volume.
- Responsive container fills available width.
- Empty state: "No sets logged yet for this exercise — complete a session to see your progress."

---

## Tech Choices

| Concern | Choice | Reason |
|---|---|---|
| Persistence | `localStorage` | Only viable option on a static host; sufficient capacity for years of logs |
| Internal weight unit | kg | Consistent math; convert to lbs on display only |
| Set count parsing | Regex on `setsReps` string | No schema change needed; handles all existing formats |
| Timer accuracy | `Date.now()` timestamps | Correct when tab is backgrounded; immune to `setInterval` drift |
| Timer alert sound | Web Audio API (oscillator) | No audio file needed; zero extra assets |
| Chart library | Recharts | Already in the project dependency list; composable; responsive |
| Dashboard entry | Button in nav (lifting section) | Additive; does not affect other categories |
| Data export | Client-side CSV generation via `Blob` + `URL.createObjectURL` | No server; lets users back up their data |

---

## What GitHub Pages Can and Cannot Do Here

| Feature | Feasible on GitHub Pages? | Notes |
|---|---|---|
| Log weights per set | ✅ Yes | `localStorage` |
| Persist data across sessions | ✅ Yes | `localStorage` survives browser close |
| Progression dashboard | ✅ Yes | All computed client-side from localStorage |
| Customizable rest timer | ✅ Yes | Pure JS |
| Cross-device sync | ❌ No | Would need a backend or third-party sync service |
| User accounts | ❌ No | No server |
| Data backup beyond CSV export | ❌ No | User must export manually |
| Push notifications when timer ends | ⚠️ Partial | Web Notifications API works but requires user permission grant |

Cross-device sync and accounts are explicitly out of scope. If they become a requirement later, the localStorage schema is designed to export cleanly to any backend.

---

## How to Update / Maintain

- **Workout data changes:** edit the week JSON as described in prior PRDs — weight logs are keyed to `exerciseId`, so as long as IDs are stable, existing logs remain associated correctly.
- **Exercise renamed but ID unchanged:** logs are unaffected. Dashboard shows the current name from the exercise definition, not the name stored in the log... correction: the log stores `exerciseName` at time of entry, so the dashboard should prefer the stored name with a note if it differs.
- **Exercise ID changes:** logs for the old ID become orphaned. Avoid changing IDs on exercises that have logged data. This is documented as a convention, not enforced in code.

---

## Definition of Done

- [ ] `SetLogPrompt` appears after each set is marked complete in the weightlifting category only.
- [ ] Number of prompts per exercise equals the set count parsed from `setsReps`.
- [ ] Prompt pre-fills with the last logged weight for that exercise.
- [ ] "Skip" dismisses the prompt without logging.
- [ ] All log entries persist to `localStorage` under `wt:log:*` keys and survive page refresh and browser close.
- [ ] `RestTimer` displays and counts down correctly after a set is logged.
- [ ] Timer accuracy is timestamp-based and correct when the tab is backgrounded.
- [ ] Timer pre-loads the `rest` value from the exercise definition if present; falls back to global default.
- [ ] `TimerSettings` allows changing duration, auto-start, sound, and unit; changes persist to `wt:prefs`.
- [ ] +/−30s nudge buttons work on the timer.
- [ ] Timer chime plays at zero using Web Audio API (no audio file required).
- [ ] `ProgressionDashboard` opens from the nav and shows an exercise selector populated with all exercises that have logged data.
- [ ] Chart shows max weight per session as a line and total volume per session as bars, with correct x-axis dates.
- [ ] Session history table lists all sessions for the selected exercise, newest first.
- [ ] "Clear all data for this exercise" removes only that exercise's logs.
- [ ] "Export all data as CSV" downloads a valid CSV of all log entries.
- [ ] Dashboard is empty-stated correctly when no data exists.
- [ ] `use-workouts.ts` is unmodified.
- [ ] Basketball and jumping categories show no weight tracking UI.
- [ ] Tested: log 3 sessions for one exercise across different dates; dashboard chart shows 3 data points with correct values.
