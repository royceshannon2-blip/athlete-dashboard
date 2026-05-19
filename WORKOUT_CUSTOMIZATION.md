# Workout Customization Guide

This guide explains how to customize your workouts using the category/duration system.

## Overview

The workout system is organized by:
1. **Day** (Monday, Tuesday, etc.)
2. **Category** (Basketball, Weightlifting, Jumping)
3. **Duration** (30m, 1h, 2h, 3h)

Each combination has its own set of exercises.

## How to Customize Workouts

### File Location
Edit workout data in: `client/src/hooks/use-workouts.ts`

Look for the `WORKOUTS_DATA` object (starts around line 5).

### Data Structure

```typescript
WORKOUTS_DATA: WorkoutsData = {
  categories: ["basketball", "weightlifting", "jumping"],
  durations: ["30m", "1h", "2h", "3h"],
  workouts: [
    {
      day: "Monday",
      focus: "Linear/Glutes",  // Optional: brief description
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                {
                  id: "unique-id",
                  phase: "Strength",  // "Plyo", "Strength", or "Aesthetic"
                  name: "Exercise Name",
                  setsReps: "3x6-8",
                  tempo: "3-0-X-1",  // X = execute concentrically with max velocity
                  rest: "120s",
                  note: "Optional coaching cue"  // Can be omitted
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Adding a New Exercise

1. Navigate to the specific day/category/duration combo
2. Add a new exercise object to the `exercises` array:

```typescript
{
  id: "mon-wl-30-3",  // Must be unique
  phase: "Plyo",       // Choose: "Plyo", "Strength", "Aesthetic"
  name: "Leg Press",
  setsReps: "4x8-10",
  tempo: "2-0-1-1",    // eccentric-pause-concentric-pause
  rest: "90s",
  note: "Keep feet high on platform"  // Optional
}
```

## Changing Duration

To add/remove durations:
1. Update the `durations` array: `durations: ["30m", "1h", "2h", "3h"]`
2. Add/remove corresponding duration blocks in each category's workouts

## Changing Categories

To add/remove categories:
1. Update the `categories` array: `categories: ["basketball", "weightlifting", "jumping"]`
2. Add/remove corresponding category blocks in each day's categoryWorkouts

## Phase Colors

The UI auto-colors exercises by phase:
- **Plyo** (Explosive): Neon Green `#39ff14`
- **Strength** (Heavy): Cyan `#00f0ff`
- **Aesthetic** (Hypertrophy): Yellow `#ffea00`

## Tempo Notation

Tempo is written as: `eccentric-pause-concentric-pause`
- `3` = 3 seconds
- `0` = no pause
- `X` = explosively (max velocity)
- `1` = 1 second

Examples:
- `3-0-X-1`: 3sec eccentric, explode up, 1sec pause
- `2-0-1-1`: 2sec down, 1sec up, 1sec pause

## Full Example

Here's how to modify a 1-hour weightlifting workout for Monday:

```typescript
{
  duration: "1h",
  exercises: [
    {
      id: "mon-wl-1h-1",
      phase: "Plyo",
      name: "Med Ball Chest Pass",
      setsReps: "3x5",
      tempo: "X-0-X-1",
      rest: "90s",
      note: "Drive explosive power from chest"
    },
    {
      id: "mon-wl-1h-2",
      phase: "Strength",
      name: "Barbell Squat",
      setsReps: "4x5",
      tempo: "3-0-X-1",
      rest: "180s",
      note: "Hit depth, pause 1sec at bottom"
    },
    {
      id: "mon-wl-1h-3",
      phase: "Aesthetic",
      name: "Leg Curl Machine",
      setsReps: "3x12",
      tempo: "2-0-1-1",
      rest: "60s"
    }
  ]
}
```

## Saving Changes

After editing `use-workouts.ts`:
1. Save the file
2. The dev server will hot-reload (if running `npm run dev`)
3. Refresh your browser to see changes

## Deploying Changes

To deploy your custom workouts:
1. Run `npm run build` to build for production
2. Commit your changes: `git add -A && git commit -m "Update workouts"`
3. Push to GitHub or your hosting platform
4. The static site will deploy with your new workouts

## Tips

- Keep exercise IDs unique and consistent (they don't need to follow a pattern)
- Coaching notes are optional but helpful for form cues
- You can add more days by adding to the `workouts` array
- Test in dev mode with `npm run dev` before deploying
- The UI will automatically handle new categories/durations once added to the arrays
