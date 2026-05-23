# Weekly Workout Rotation

This document explains the automatic weekly workout rotation system that allows you to cycle through different weekly plans without code changes or redeployment.

---

## Overview

The rotation system enables:
- **Automatic weekly rotation** based on date, with no code changes needed
- **Static hosting compatibility** — works on GitHub Pages with no server or database
- **Browsable history** — users can view any past or future week
- **Deterministic scheduling** — the same week always shows the same plan

---

## How Rotation Works

### The Concept

Instead of organizing workouts by day (Monday, Tuesday, etc.), the rotation system organizes them by **week blocks**. Each week has a complete plan covering all 3 categories (Basketball, Weightlifting, Jumping) and 4 durations (30m, 1h, 2h, 3h).

```
Week 1 Plan (Jan 1–7, 2026)
├─ Basketball (30m, 1h, 2h, 3h)
├─ Weightlifting (30m, 1h, 2h, 3h)
└─ Jumping (30m, 1h, 2h, 3h)

Week 2 Plan (Jan 8–14, 2026)
├─ Basketball (30m, 1h, 2h, 3h)
├─ Weightlifting (30m, 1h, 2h, 3h)
└─ Jumping (30m, 1h, 2h, 3h)
```

### The Math

The system calculates which week to display using simple date arithmetic:

```
weekIndex = floor((today - startDate) / 7 days)
planIndex = weekIndex % totalWeeks
```

**Example**:
- `startDate` = 2026-01-01
- Today = 2026-05-19
- `weekIndex` = 19 (19 weeks since start)
- With 2 available weeks: `planIndex` = 19 % 2 = 1 → show **week-002.json**
- Next week: `weekIndex` = 20, `planIndex` = 20 % 2 = 0 → show **week-001.json** (wrap around)

This means the rotation repeats every `totalWeeks` weeks automatically.

---

## File Structure

```
client/public/workouts/
├── manifest.json       ← Lists weeks and start date
├── week-001.json       ← Week 1 plan
├── week-002.json       ← Week 2 plan
└── week-NNN.json       ← Add more as needed
```

### manifest.json

```json
{
  "startDate": "2026-01-01",
  "weeks": [
    "week-001.json",
    "week-002.json"
  ]
}
```

- **startDate**: The reference date (never change this after deployment — it shifts all week assignments)
- **weeks**: Array of filenames in rotation order

### week-NNN.json Schema

```json
{
  "label": "Block 1 – Week 1",
  "categories": {
    "basketball": {
      "workouts": [
        {
          "duration": "30m",
          "drills": [
            {
              "id": "unique-id",
              "intensity": "medium",
              "name": "Cold Start Threes",
              "description": "Game-Speed: Cold start threes at game tempo",
              "subCategory": "shooting",
              "reps": { "type": "makes", "makes": 20 }
            }
          ]
        },
        { "duration": "1h", "drills": [ /* ... */ ] },
        { "duration": "2h", "drills": [ /* ... */ ] },
        { "duration": "3h", "drills": [ /* ... */ ] }
      ]
    },
    "weightlifting": { /* same structure */ },
    "jumping": { /* same structure */ }
  }
}
```

**Requirements**:
- All 3 categories must be present
- Each category must have exactly 4 durations: `30m`, `1h`, `2h`, `3h`
- Exercise format matches the existing schema (id, phase, name, setsReps, tempo, rest, note)

---

## Accessing the Rotation UI

The rotation system is accessed via the **"Rotation"** page:

- **URL**: `/rotation` (or `/#/rotation` on GitHub Pages)
- **Tabs**:
  - **"This Week"**: Shows the current week's plan with week number
  - **"History"**: Dropdown to browse any week (past or future)

---

## How to Update Workouts

### Add a New Week

1. Create a new file: `client/public/workouts/week-003.json`
   - Copy an existing week file as a template
   - Edit exercises for the new week

2. Update `client/public/workouts/manifest.json`:
   ```json
   {
     "startDate": "2026-01-01",
     "weeks": [
       "week-001.json",
       "week-002.json",
       "week-003.json"
     ]
   }
   ```

3. Commit and push — no code changes needed!

### Edit an Existing Week

1. Open `client/public/workouts/week-NNN.json`
2. Edit the exercises, durations, or labels
3. Commit and push — changes appear on the next page load

### Add/Remove a Category or Duration

**Not recommended** — changes the schema and will break the rotation. If needed:
- Update all week files to match the new structure
- Update `DATA_STRUCTURE.md` to document the change

---

## Integration with Existing Dashboard

The rotation system is completely separate from the existing day-based Dashboard:

- **Dashboard** (`/`): Shows workouts by day (Monday, Tuesday, etc.) using `use-workouts.ts`
- **Rotation** (`/rotation`): Shows workouts by week using `use-weekly-rotation.ts` hook

Both systems coexist without interfering. The Dashboard remains untouched and fully functional.

---

## Technical Details

### Hook: `use-weekly-rotation.ts`

```typescript
const { plan, weekIndex, totalWeeks, loading, error } = useWeeklyRotation(overrideWeekIndex?);
```

**Parameters**:
- `overrideWeekIndex` (optional): If provided, fetches that specific week instead of current

**Returns**:
- `plan`: The week plan object (null while loading)
- `weekIndex`: Current or specified week index
- `totalWeeks`: Total number of weeks available
- `loading`: Boolean indicating fetch status
- `error`: Error message if fetch failed

**Example Usage**:
```typescript
// Get current week
const current = useWeeklyRotation();

// Get specific past week
const week0 = useWeeklyRotation(0);  // First week
const week5 = useWeeklyRotation(5);  // Sixth week
```

### Component: `WeekSelector.tsx`

The component provides a tabbed UI for viewing rotation plans:
- Fetches from hook via `/workouts/manifest.json` and `/workouts/week-NNN.json`
- Reuses `WorkoutTable` component for exercise display
- Displays category/duration hierarchy
- Handles loading and error states

---

## Common Tasks

### Change the Start Date

⚠️ **Warning**: Changing `startDate` shifts all week assignments. Only do this if you're restarting the rotation entirely.

1. Edit `client/public/workouts/manifest.json`
2. Change `startDate` to the new date
3. Push — all week assignments update immediately

### Add a Week Halfway Through

1. Create `week-003.json` with the plan
2. Add to `manifest.json` weeks array
3. Push — Week 3 becomes available on rotation day automatically

### Skip a Week

To skip a week in the rotation (e.g., break week):
- Add a copy of the previous week: `week-002-repeat.json`
- Insert it in the right position in `manifest.json`
- The rotation will cycle through the updated list

---

## Frequently Asked Questions

### Q: What happens after the last week?
**A**: The rotation wraps around. If you have 2 weeks, week 3 shows week 1's plan, week 4 shows week 2's plan, etc.

### Q: Can I change the start date after launch?
**A**: Technically yes, but it shifts all week assignments. **Don't do this** unless restarting from scratch.

### Q: Can I add weeks dynamically (without deployment)?
**A**: On GitHub Pages, no — static hosting can't execute dynamic logic. You must commit the new file and let GitHub Pages rebuild.

### Q: What if I want day-based workouts and rotation-based workouts?
**A**: Both are available simultaneously. Use Dashboard for day-based, Rotation for week-based.

---

## Troubleshooting

### "Failed to fetch manifest"
- Check that `client/public/workouts/manifest.json` exists
- Verify JSON syntax with `jq . manifest.json`
- Check network tab in browser DevTools

### "Week file not found"
- Verify the filename in `manifest.json` matches actual files
- Check that `client/public/workouts/week-NNN.json` exists
- Verify JSON syntax: `jq . week-NNN.json`

### Week doesn't update on the right day
- Verify `startDate` is correct (UTC timezone)
- Check that week calculation: `Math.floor((today - startDate) / (7 * 24 * 60 * 60 * 1000))`
- Remember: wrapping uses modulo, not simple comparison

