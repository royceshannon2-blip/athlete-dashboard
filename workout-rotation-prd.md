# PRD: Weekly Workout Rotation

**Status:** Draft  
**Last updated:** 2026-05-19

---

## Goals

1. Rotate workout content automatically each week without code changes or redeployment.
2. Keep the existing category separation (basketball, weightlifting, jumping) and duration tiers (30m, 1h, 2h, 3h) completely intact.
3. Let anyone update a week's workouts by replacing a single JSON file — no TypeScript edits required.
4. Preserve full browsable history so past weeks are always accessible.

---

## Constraints

- GitHub Pages is a static host — no server, no database, no build step on update.
- The existing `use-workouts.ts` hook and UI must remain functional; this feature layers on top, it does not replace it.
- Exercise schema stays the same (id, phase, name, setsReps, tempo, rest, note).
- Categories stay fixed: `basketball`, `weightlifting`, `jumping`.
- Durations stay fixed: `30m`, `1h`, `2h`, `3h`.
- The rotation logic must be deterministic — the same week always returns the same plan.

---

## File Structure

```
client/
  src/
    hooks/
      use-workouts.ts          ← existing hook, untouched
      use-weekly-rotation.ts   ← NEW: week index + fetch logic
    components/
      WeekSelector.tsx         ← NEW: history browser UI (current / past tabs)

public/
  workouts/
    week-001.json              ← plan for rotation week 1
    week-002.json              ← plan for rotation week 2
    week-003.json              ← plan for rotation week 3
    ...                        ← add more as needed
    manifest.json              ← lists available week files + START_DATE
```

### `manifest.json` schema

```json
{
  "startDate": "2024-01-01",
  "weeks": [
    "week-001.json",
    "week-002.json",
    "week-003.json"
  ]
}
```

`startDate` is set once and never changed — changing it shifts all historical assignments.

### `week-NNN.json` schema

```json
{
  "label": "Block 1 – Week 1",
  "categories": {
    "basketball": {
      "workouts": [
        {
          "duration": "30m",
          "exercises": [
            {
              "id": "bball-w1-30-1",
              "phase": "Plyo",
              "name": "Defensive Slides",
              "setsReps": "4x30s",
              "tempo": "X-0-X-0",
              "rest": "60s",
              "note": "Stay low, push off outside foot"
            }
          ]
        },
        { "duration": "1h",  "exercises": [ /* ... */ ] },
        { "duration": "2h",  "exercises": [ /* ... */ ] },
        { "duration": "3h",  "exercises": [ /* ... */ ] }
      ]
    },
    "weightlifting": {
      "workouts": [ /* same duration structure */ ]
    },
    "jumping": {
      "workouts": [ /* same duration structure */ ]
    }
  }
}
```

Each category inside a week file contains the same duration-keyed structure the existing app already understands.

---

## Key Decisions

### Why JSON files in `/public`, not a bigger `WORKOUTS_DATA`?

The goal is *one JSON replacement = one week updated*. Keeping plans as individual files means you edit only the file you need, with zero risk of accidentally touching another week. It also makes diffs in Git clean and reviewable.

### Why not edit `use-workouts.ts` at all?

`use-workouts.ts` already owns the shape of exercise data and the existing day-based workout UI. Touching it risks breaking a working system. The rotation feature is a separate concern — which week's data to display — so it lives in its own hook (`use-weekly-rotation.ts`).

### Why `manifest.json` instead of numbered filenames with auto-detection?

GitHub Pages does not support directory listings. A manifest is the simplest way to enumerate available weeks without a server. Adding a new week = add the file + append one line to `manifest.json`.

### How does rotation work?

```typescript
// use-weekly-rotation.ts (core logic)
const start = new Date(manifest.startDate);
const now   = new Date();
const weekIndex = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
const planIndex = weekIndex % manifest.weeks.length;  // wraps at end of list
const filename  = manifest.weeks[planIndex];
```

Past weeks are recovered by passing a smaller `weekIndex` — the math is deterministic, so no data needs to be stored.

### Category separation

Each `week-NNN.json` file has a top-level key per category. The fetch hook resolves to the full category object; the existing category tabs in the UI consume it unchanged.

---

## Tech Choices

| Concern | Choice | Reason |
|---|---|---|
| Plan storage | JSON files in `/public` | Static-host compatible; one file = one week |
| Week index | Date arithmetic from `startDate` | Deterministic, no server state |
| Fetching | `fetch()` in a React hook | No extra dependencies |
| History UI | Tab component in `WeekSelector.tsx` | Keeps rotation concern out of existing pages |
| Manifest | `manifest.json` | Enumerate files without directory listing |

---

## How to Update a Week's Workouts

1. Open (or create) the file for that week: `public/workouts/week-NNN.json`.
2. Edit the exercises under the relevant category and duration.
3. If it is a new file, add its filename to `manifest.json`'s `weeks` array.
4. Commit and push — GitHub Pages deploys automatically.

No build step, no TypeScript edits, no redeployment trigger needed beyond a `git push`.

---

## Definition of Done

- [ ] `manifest.json` exists at `public/workouts/manifest.json` with `startDate` and at least two week files listed.
- [ ] At least two `week-NNN.json` files exist with valid schema (all three categories, all four durations each).
- [ ] `use-weekly-rotation.ts` resolves the correct week file from the current date and exposes `{ plan, weekIndex, totalWeeks, loading, error }`.
- [ ] `WeekSelector.tsx` renders a "This week" tab showing the current plan and a "History" tab with a week picker for all past weeks.
- [ ] Selecting any past week in history displays that week's full plan, separated by category, without breaking the existing duration/exercise UI.
- [ ] Changing `manifest.json` (adding a new week file) requires zero code changes.
- [ ] `use-workouts.ts` is unmodified.
- [ ] The existing day-based workout pages load and function exactly as before.
- [ ] No week's exercises are visible in history before that week's `startDate` + offset.
- [ ] Tested manually: current week correct, week − 1 correct, wrap-around correct (week N wraps back to week 1 plan after the last week in the list).
