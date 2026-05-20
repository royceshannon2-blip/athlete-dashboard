# PRD: Per-Day Exercise Variation & Full Schedule Browser

**Status:** Draft  
**Last updated:** 2026-05-19

---

## Goals

1. Support a distinct set of exercises for every day of the week, per category, per duration — so Monday weightlifting is never the same as Thursday weightlifting within the same week.
2. Add a schedule browser button accessible from the main UI that lets users view any past or upcoming week's full plan, broken down by day and category.
3. Keep the one-JSON-replacement update workflow from the rotation PRD intact.
4. History and future previews both respect the per-day structure — browsing week 3 shows Monday through Sunday for week 3, not a collapsed summary.

---

## Constraints

- GitHub Pages static host — no server, no runtime data generation.
- Existing category separation (basketball, weightlifting, jumping) and duration tiers (30m, 1h, 2h, 3h) are unchanged.
- `use-workouts.ts` remains unmodified.
- Exercise schema stays the same (id, phase, name, setsReps, tempo, rest, note).
- The schedule browser is additive — a button that opens a panel/modal — it does not replace the current day-focused workout view.
- Future weeks are read-only previews; users cannot edit from the browser UI.

---

## File Structure

```
client/
  src/
    hooks/
      use-workouts.ts              ← existing, untouched
      use-weekly-rotation.ts       ← from rotation PRD (week index + fetch)
      use-schedule-browser.ts      ← NEW: fetch any week by index, expose past + upcoming
    components/
      WeekSelector.tsx             ← from rotation PRD (current / history tabs)
      ScheduleBrowserButton.tsx    ← NEW: trigger button rendered in the main nav/header
      ScheduleBrowserPanel.tsx     ← NEW: full panel — week list on left, day detail on right

public/
  workouts/
    manifest.json                  ← startDate + ordered week file list
    week-001.json                  ← full 7-day plan for rotation slot 1
    week-002.json
    week-003.json
    ...
```

---

## Data Schema

### `manifest.json`

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

`startDate` is set once, never changed. Altering it shifts every historical assignment.

---

### `week-NNN.json` — expanded to 7 days

Each week file now has a `days` array with an entry per day of the week. Every day carries its own full category and duration tree, independent of every other day.

```json
{
  "label": "Block 1 – Week 1",
  "days": [
    {
      "day": "Monday",
      "focus": "Lower body power",
      "categories": {
        "basketball": {
          "workouts": [
            {
              "duration": "30m",
              "exercises": [
                {
                  "id": "mon-bball-w1-30-1",
                  "phase": "Plyo",
                  "name": "Defensive Slides",
                  "setsReps": "4x30s",
                  "tempo": "X-0-X-0",
                  "rest": "60s",
                  "note": "Stay low, push off outside foot"
                }
              ]
            },
            { "duration": "1h",  "exercises": [] },
            { "duration": "2h",  "exercises": [] },
            { "duration": "3h",  "exercises": [] }
          ]
        },
        "weightlifting": {
          "workouts": [
            {
              "duration": "30m",
              "exercises": [
                {
                  "id": "mon-wl-w1-30-1",
                  "phase": "Strength",
                  "name": "Back Squat",
                  "setsReps": "4x5",
                  "tempo": "3-0-X-1",
                  "rest": "180s",
                  "note": "Hit depth, brace hard"
                }
              ]
            },
            { "duration": "1h",  "exercises": [] },
            { "duration": "2h",  "exercises": [] },
            { "duration": "3h",  "exercises": [] }
          ]
        },
        "jumping": {
          "workouts": [
            { "duration": "30m", "exercises": [] },
            { "duration": "1h",  "exercises": [] },
            { "duration": "2h",  "exercises": [] },
            { "duration": "3h",  "exercises": [] }
          ]
        }
      }
    },
    {
      "day": "Tuesday",
      "focus": "Upper body + conditioning",
      "categories": {}
    },
    { "day": "Wednesday", "focus": "Recovery",           "categories": {} },
    { "day": "Thursday",  "focus": "Vertical + speed",   "categories": {} },
    { "day": "Friday",    "focus": "Full body strength",  "categories": {} },
    { "day": "Saturday",  "focus": "Skills + agility",   "categories": {} },
    { "day": "Sunday",    "focus": "Rest / mobility",    "categories": {} }
  ]
}
```

**Convention:** exercise IDs should include the day prefix (`mon-`, `tue-`, etc.) so they remain globally unique across the whole week file.

---

## Key Decisions

### Why move from a flat category structure to a `days` array?

The existing `use-workouts.ts` already has a `day` key on each workout object — the app is already day-aware. The week JSON mirrors that shape so the same rendering logic works without changes. Wrapping categories inside a day entry is the natural extension of what already exists.

### How does the schedule browser know what is past vs upcoming?

```typescript
// use-schedule-browser.ts
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const startDate = new Date(manifest.startDate);
const currentSlot = Math.floor((Date.now() - startDate.getTime()) / WEEK_MS);

// slotIndex < currentSlot  → past
// slotIndex === currentSlot → current
// slotIndex > currentSlot  → upcoming (preview)

function getWeekDateRange(slotIndex: number) {
  const from = new Date(startDate.getTime() + slotIndex * WEEK_MS);
  const to   = new Date(from.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { from, to };
}
```

Future week files listed in `manifest.json` are fetchable immediately — adding `week-004.json` to the manifest makes it visible as an upcoming preview before its rotation slot arrives.

### How does the browser handle the rotation wrap?

The rotation index wraps (`slotIndex % weeks.length`), but calendar date ranges are always computed from the raw slot index. A repeated plan is correctly labeled "Week 5 — Jan 27–Feb 2" even if it reuses the same JSON as week 1. The `label` field inside the JSON is purely descriptive; the browser always shows the actual calendar date range.

### Why a slide-in panel instead of a separate page?

A panel keeps the user on their current workout view. They can glance at a past or future week without losing their place. A full-page navigation would require the router to carry week and day state, adding complexity with no user benefit.

### Does adding future weeks require a code change?

No. Future week files are data-only. The browser automatically renders any week listed in `manifest.json` regardless of whether its rotation slot has arrived. To add a future week: create the JSON file, append the filename to `manifest.json`, push. Done.

---

## Component Behavior

### `ScheduleBrowserButton`

- Renders in the main nav or header.
- Label: "Schedule" with a calendar icon.
- On click: opens `ScheduleBrowserPanel`.

### `ScheduleBrowserPanel`

**Layout (desktop):** two-column. Left = week list. Right = day and exercise detail.  
**Layout (mobile):** stacked. Week list collapses to a dropdown or scroll strip above the detail area.

**Left column — week list**

- Scrollable list grouped into three sections: **Past**, **Current**, **Upcoming**.
- Each row shows: week number, date range (e.g. "Jan 1–7"), and the plan label from the JSON.
- Current week row is highlighted. Upcoming rows carry a "Preview" badge.
- Clicking any row loads that week's data into the right column.

**Right column — day and exercise detail**

- Day tab row across the top: Mon / Tue / Wed / Thu / Fri / Sat / Sun.
- Each tab label also shows the day's `focus` field as a subtitle (e.g. "Mon — Lower body power").
- Active day shows one card per category (basketball, weightlifting, jumping).
- Each category card is expandable; expanding shows duration tabs (30m / 1h / 2h / 3h) with the exercise list for that duration.
- Phase colors (Plyo = neon green, Strength = cyan, Aesthetic = yellow) are preserved from the existing UI.
- When the panel opens, the current week and today's day are pre-selected.
- Past and current weeks are fully readable. Upcoming weeks are identical in display, with the "Preview" badge on the week row only.

**Closing**

- X button or clicking outside the panel closes it with no effect on the active workout view.

---

## Tech Choices

| Concern | Choice | Reason |
|---|---|---|
| Plan storage | JSON files in `/public/workouts/` | Static-host compatible; one file per rotation week |
| Day structure | `days` array keyed by day name inside each week JSON | Mirrors existing hook shape; same renderer works |
| Week resolution | Date math from `startDate` | Deterministic; no server state |
| Past / upcoming distinction | Slot index vs current slot index | Pure JS, zero dependencies |
| Browser UI entry point | Button → slide-in panel | Non-destructive; user keeps current view |
| Day navigation inside panel | Tab row (Mon–Sun) with focus subtitle | Flat, fast, readable on mobile |
| Fetching | `fetch()` in `use-schedule-browser.ts`, results cached in hook state | No extra dependencies |

---

## How to Update Any Week's Exercises

1. Open `public/workouts/week-NNN.json`.
2. Find the target day in the `days` array.
3. Find the target category and duration block.
4. Replace or edit the `exercises` array.
5. `git push` — live immediately, no build needed.

To add a brand-new rotation week:

1. Create `public/workouts/week-NNN.json` with all 7 days fully populated.
2. Append its filename to `manifest.json`'s `weeks` array.
3. `git push`.

---

## Definition of Done

- [ ] `week-NNN.json` schema supports a `days` array with all 7 days, each containing all three categories and all four durations.
- [ ] At least two `week-NNN.json` files exist with all days fully populated.
- [ ] `use-weekly-rotation.ts` resolves the correct week file and exposes the active day's exercises to the existing workout view.
- [ ] The existing per-day workout UI renders from the new per-day JSON with no visual or functional regressions.
- [ ] `ScheduleBrowserButton` is visible in the main nav and opens `ScheduleBrowserPanel` on click.
- [ ] `ScheduleBrowserPanel` lists all weeks from manifest, correctly grouped as Past / Current / Upcoming.
- [ ] Each week in the panel shows all 7 day tabs; each day shows all three category cards with the correct exercises for that day.
- [ ] Current week and current day are pre-selected when the panel opens.
- [ ] Upcoming weeks show a "Preview" badge and are read-only.
- [ ] Panel closes cleanly with no effect on the active workout view.
- [ ] Adding a new week file + manifest entry requires zero code changes.
- [ ] `use-workouts.ts` is unmodified.
- [ ] Exercise IDs are unique within each week file (day-prefix convention documented and followed).
- [ ] Tested: past week correct; upcoming week correct; rotation wrap shows correct plan with current calendar label; all 7 days navigable in the panel.
