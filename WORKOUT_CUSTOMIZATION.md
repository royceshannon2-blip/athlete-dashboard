# Workout Customization Guide

This guide explains how to customize workouts in two systems: the day-based Dashboard and the week-based Rotation.

## The Two Systems

### 1. Day-Based Dashboard (Default)
Located at `/` — Shows workouts organized by day of the week.

**Organization**:
1. **Day** (Monday, Tuesday, etc.)
2. **Category** (Basketball, Weightlifting, Jumping)
3. **Duration** (30m, 1h, 2h, 3h)

Each day/category/duration combo has its own set of exercises.

### 2. Weekly Rotation
Located at `/rotation` — Shows workouts organized by week blocks that rotate automatically.

**Organization**:
1. **Week** (1, 2, 3, ... rotating)
2. **Category** (Basketball, Weightlifting, Jumping)
3. **Duration** (30m, 1h, 2h, 3h)

Each week cycles through the list automatically based on the date.

---

## Customizing the Day-Based Dashboard

### File Location
Edit workout data in: `client/src/hooks/use-workouts.ts`

Look for the `WORKOUTS_DATA` object (starts around line 5).

### Basketball vs. Other Categories

**Weightlifting & Jumping** use standard exercises with sets/reps.  
**Basketball** uses drills with three sub-categories and specialized rep models.

---

## Weightlifting and Jumping Workouts

### Data Structure (Exercises)

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

---

## Basketball Workouts

### Sub-Categories and Rep Models

Basketball drills are organized into **three sub-categories**, each with its own rep model:

| Sub-category | Rep Model | Display | Example |
|---|---|---|---|
| **Shooting** | Makes | `15 makes` | Spot shooting, pull-ups, threes |
| **Ball Handling** | Sets × reps per hand (left skewed) | `3 sets — 25 reps (R) / 28 reps (L)` | Crossovers, dribble drills |
| **Finishing** | Makes per hand (left skewed) | `10 makes (R) / 11 makes (L)` | Layups, eurosteps, contested finishes |

**Left Skew Rule**: Left-hand reps/makes are auto-computed: `left = ceil(right * 1.1)`. Never hardcode the left value.

### Data Structure (Basketball Drills)

```typescript
{
  category: "basketball",
  workouts: [
    {
      duration: "30m",
      drills: [
        {
          id: "mon-bb-30-shooting-1",
          category: "basketball",
          subCategory: "shooting",  // "shooting", "ballHandling", "finishing"
          duration: "30m",
          name: "Spot Shooting",
          description: "5 spots around the arc, move after each make",
          phase: "Strength",  // "Plyo", "Strength", or "Aesthetic"
          reps: { type: "makes", makes: 15 }
        },
        {
          id: "mon-bb-30-bh-1",
          category: "basketball",
          subCategory: "ballHandling",
          duration: "30m",
          name: "Stationary Crossover",
          description: "Low and tight, eyes up",
          phase: "Strength",
          // Left reps auto-computed: ceil(25 * 1.1) = 28
          reps: { type: "setsPerHand", sets: 3, rightReps: 25 }
        },
        {
          id: "mon-bb-30-finishing-1",
          category: "basketball",
          subCategory: "finishing",
          duration: "30m",
          name: "Euro Step Layup",
          description: "Full speed from the wing, attack the rim",
          phase: "Strength",
          // Left makes auto-computed: ceil(10 * 1.1) = 11
          reps: { type: "makesPerHand", rightMakes: 10 }
        }
      ]
    }
  ]
}
```

### Adding a Basketball Drill

1. Find the correct day, category (basketball), and duration
2. Determine the sub-category: shooting, ballHandling, or finishing
3. Choose the rep model for that sub-category
4. Add a drill object:

```typescript
{
  id: "unique-id",  // e.g., "tue-bb-1h-shooting-2"
  category: "basketball",
  subCategory: "ballHandling",  // "shooting", "ballHandling", or "finishing"
  duration: "1h",
  name: "Between the Legs",
  description: "Hard crossover between legs",
  phase: "Plyo",  // "Plyo", "Strength", or "Aesthetic"
  reps: { type: "setsPerHand", sets: 3, rightReps: 15 }
  // Left reps auto-computed: ceil(15 * 1.1) = 17
}
```

### Drill Counts by Duration

Each duration requires a specific number of drills **per sub-category**:

| Duration | Per Sub-category | Total Basketball |
|---|---|---|
| 30m | 1 | 3 (1 shooting + 1 BH + 1 finishing) |
| 1h | 2 | 6 (2 each) |
| 2h | 4 | 12 (4 each) |
| 3h | 6 | 18 (6 each) |

### Reps Objects

Only **three formats** are valid for basketball reps:

**1. Shooting (makes only)**
```typescript
{ type: "makes", makes: 15 }
```

**2. Ball Handling (sets + right reps)**
```typescript
{ type: "setsPerHand", sets: 3, rightReps: 25 }
// Left reps computed: Math.ceil(25 * 1.1) = 28
```

**3. Finishing (right makes only)**
```typescript
{ type: "makesPerHand", rightMakes: 10 }
// Left makes computed: Math.ceil(10 * 1.1) = 11
```

---

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

---

## Customizing the Weekly Rotation

The weekly rotation provides an alternative system where workouts cycle automatically every week without touching any TypeScript code.

### File Location
Edit rotation data in: `client/public/workouts/`

- **manifest.json** — Lists available weeks and start date
- **week-NNN.json** — Plans for specific weeks

### Data Structure

Each week file contains all 3 categories with all 4 durations:

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
              "id": "w1-bb-30-1",
              "phase": "Plyo",
              "name": "Vertical Jump Drills",
              "setsReps": "4x5",
              "tempo": "X-0-X-1",
              "rest": "90s",
              "note": "Optional coaching cue"
            }
          ]
        },
        { "duration": "1h", "exercises": [ /* ... */ ] },
        { "duration": "2h", "exercises": [ /* ... */ ] },
        { "duration": "3h", "exercises": [ /* ... */ ] }
      ]
    },
    "weightlifting": { /* same structure */ },
    "jumping": { /* same structure */ }
  }
}
```

**Important**: All 3 categories and all 4 durations must be present in every week file.

### Adding a New Week

1. Create a new file: `client/public/workouts/week-003.json`
   - Copy an existing week as a template
   - Edit the exercises, category, and durations as needed
   - Make sure all 3 categories are present with all 4 durations

2. Update the manifest:
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

### Editing an Existing Week

1. Open `client/public/workouts/week-NNN.json`
2. Edit exercises, sets/reps, tempo, or coaching notes
3. Save and commit — changes appear immediately on next page load

### Exercise Schema in Weeks

The exercise format in week files is identical to the dashboard:

```json
{
  "id": "unique-identifier",
  "phase": "Plyo",              // "Plyo", "Strength", or "Aesthetic"
  "name": "Exercise Name",
  "setsReps": "4x5",
  "tempo": "X-0-X-1",           // eccentric-pause-concentric-pause
  "rest": "90s",
  "note": "Optional coaching cue"
}
```

### How Rotation Works

The system calculates which week to display based on date:

```
weekIndex = floor((today - startDate) / 7 days)
planIndex = weekIndex % totalWeeks
```

**Example**:
- startDate: 2026-01-01
- Today: 2026-05-19
- weekIndex: 19 (19 weeks elapsed)
- With 2 weeks available: 19 % 2 = 1 → show **week-002.json**
- Next week (week 20): 20 % 2 = 0 → show **week-001.json** (wrap around)

### Accessing the Rotation

1. Go to `/rotation` in your app
2. **"This Week" tab**: Shows the current week's plan
3. **"History" tab**: Select any week to view its plan

---

## Comparing Both Systems

| Feature | Dashboard | Rotation |
|---------|-----------|----------|
| Organization | By day of week | By week block |
| Updates | Edit TypeScript code | Edit JSON files only |
| Rotation | Manual (user picks day) | Automatic (date-based) |
| History | Not browsable | Fully browsable |
| Route | `/` | `/rotation` |
| Edit location | `client/src/hooks/use-workouts.ts` | `client/public/workouts/` |

### When to Use Each

**Use Dashboard if**:
- You want workouts tied to specific days (e.g., "Mondays are always leg day")
- Users pick which day to train on

**Use Rotation if**:
- You want week-long cycles that rotate automatically
- You want users to follow a predefined progression
- You want easy browsable history
- You want to update without code changes

Both systems are independent and can coexist!
