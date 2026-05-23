# Data Structure

Detailed reference for APEX's data format and TypeScript schemas.

---

## Overview

All workout data is defined in `client/src/hooks/use-workouts.ts` as a single `WORKOUTS_DATA` object. The structure is validated with Zod schemas in `shared/schema.ts`.

**Hierarchy**: Days → Categories → Durations → Exercises (or Basketball Drills)

---

## Zod Schemas

Located in `shared/schema.ts`. All schemas are exported as TypeScript types.

### BasketballRep

Basketball drills use a different rep model than standard exercises. Three types are supported:

```typescript
export const basketballRepSchema = z.union([
  z.object({ type: z.literal("makes"), makes: z.number() }),
  z.object({ type: z.literal("setsPerHand"), sets: z.number(), rightReps: z.number() }),
  z.object({ type: z.literal("makesPerHand"), rightMakes: z.number() }),
]);

export type BasketballRep = z.infer<typeof basketballRepSchema>;
```

**Types**:
- `makes` (number): Simple count of makes, e.g., 15 makes
- `setsPerHand` (sets + rightReps): Sets with asymmetrical reps for left/right. Left reps auto-computed: `ceil(rightReps * 1.1)`
- `makesPerHand` (rightMakes): Asymmetrical makes per hand. Left makes auto-computed: `ceil(rightMakes * 1.1)`

**Example**:
```typescript
// Makes: 15 makes
{ type: "makes", makes: 15 }

// Sets per hand: 3 sets, 25 reps right, 28 reps left (auto-computed)
{ type: "setsPerHand", sets: 3, rightReps: 25 }

// Makes per hand: 10 right, 11 left (auto-computed)
{ type: "makesPerHand", rightMakes: 10 }
```

---

### BasketballDrill

```typescript
export const basketballDrillSchema = z.object({
  id: z.string(),
  category: z.literal("basketball"),
  subCategory: z.enum(["shooting", "ballHandling", "finishing"]),
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  name: z.string(),
  description: z.string(),
  intensity: z.enum(["low", "medium", "high"]),
  reps: basketballRepSchema,
});

export type BasketballDrill = z.infer<typeof basketballDrillSchema>;
```

**Fields**:
- `id` (string): Unique identifier, format `{day-abbrev}-bb-{duration}-{number}`, e.g., "mon-bb-30-1"
- `category` (literal): Always "basketball"
- `subCategory` (enum): "shooting", "ballHandling", or "finishing"
- `duration` (enum): "30m", "1h", "2h", "3h"
- `name` (string): Drill name, e.g., "Cold Start Threes"
- `description` (string): Actionable coaching cue starting with intensity prefix (Form/Game-Speed/Pressured)
- `intensity` (enum): "low" (recovery/technique), "medium" (game-speed), or "high" (maximum pressure)
- `reps` (BasketballRep): One of the three rep models

**Example**:
```typescript
{
  id: "mon-bb-30-1",
  category: "basketball",
  subCategory: "shooting",
  duration: "30m",
  name: "Cold Start Threes",
  description: "Game-Speed: Cold start threes at game tempo, off-the-bench readiness",
  intensity: "medium",
  reps: { type: "makes", makes: 16 }
}
```

---

### BasketballDurationWorkout

```typescript
export const basketballDurationWorkoutSchema = z.object({
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  drills: z.array(basketballDrillSchema),
});

export type BasketballDurationWorkout = z.infer<typeof basketballDurationWorkoutSchema>;
```

**Fields**:
- `duration` (enum): Workout length: "30m", "1h", "2h", "3h"
- `drills` (array): List of BasketballDrill objects, organized by sub-category at display time

---

### Exercise

```typescript
export const exerciseSchema = z.object({
  id: z.string(),
  phase: z.enum(["Plyo", "Strength", "Aesthetic"]),
  name: z.string(),
  setsReps: z.string(),
  tempo: z.string(),
  rest: z.string(),
  note: z.string().optional(),
});

export type Exercise = z.infer<typeof exerciseSchema>;
```

**Fields**:
- `id` (string): Unique identifier, e.g., "mon-wl-1h-1"
- `phase` (enum): Type of exercise: "Plyo" (explosive), "Strength" (heavy), "Aesthetic" (hypertrophy)
- `name` (string): Exercise name, e.g., "Smith Squat"
- `setsReps` (string): Format like "3x6-8" or "4x5"
- `tempo` (string): Movement speed notation, e.g., "3-0-X-1"
- `rest` (string): Rest period, e.g., "120s" or "2min"
- `note` (string, optional): Coaching cue or form tip

**Example**:
```typescript
{
  id: "mon-wl-1h-1",
  phase: "Plyo",
  name: "DB Countermovement Jump",
  setsReps: "3x5",
  tempo: "3-0-X-1",
  rest: "90s",
  note: "Hold DBs at sides. Dip into a quarter squat, then explode upward."
}
```

---

### DurationWorkout

```typescript
export const durationWorkoutSchema = z.object({
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  exercises: z.array(exerciseSchema),
});

export type DurationWorkout = z.infer<typeof durationWorkoutSchema>;
```

**Fields**:
- `duration` (enum): Workout length: "30m", "1h", "2h", "3h"
- `exercises` (array): List of Exercise objects for this duration

**Example**:
```typescript
{
  duration: "1h",
  exercises: [
    { id: "...", ... },
    { id: "...", ... }
  ]
}
```

---

### CategoryWorkout

CategoryWorkout is a union type: basketball uses drills, while weightlifting and jumping use exercises.

```typescript
export const categoryWorkoutSchema = z.union([
  z.object({
    category: z.literal("basketball"),
    workouts: z.array(basketballDurationWorkoutSchema),
  }),
  z.object({
    category: z.enum(["weightlifting", "jumping"]),
    workouts: z.array(durationWorkoutSchema),
  }),
]);

export type CategoryWorkout = z.infer<typeof categoryWorkoutSchema>;
```

**For Basketball**:
- `category` (literal): "basketball"
- `workouts` (array): List of BasketballDurationWorkout objects with drills

**For Weightlifting/Jumping**:
- `category` (enum): "weightlifting" or "jumping"
- `workouts` (array): List of DurationWorkout objects with exercises

**Example (Basketball)**:
```typescript
{
  category: "basketball",
  workouts: [
    {
      duration: "30m",
      drills: [
        { id: "...", subCategory: "shooting", ... },
        { id: "...", subCategory: "ballHandling", ... },
        { id: "...", subCategory: "finishing", ... }
      ]
    },
    { duration: "1h", drills: [...] },
    { duration: "2h", drills: [...] },
    { duration: "3h", drills: [...] }
  ]
}
```

**Example (Weightlifting)**:
```typescript
{
  category: "weightlifting",
  workouts: [
    { duration: "30m", exercises: [...] },
    { duration: "1h", exercises: [...] },
    { duration: "2h", exercises: [...] },
    { duration: "3h", exercises: [...] }
  ]
}
```

---

### DayWorkoutV2

```typescript
export const dayWorkoutV2Schema = z.object({
  day: z.string(),
  focus: z.string().optional(),
  categoryWorkouts: z.array(categoryWorkoutSchema),
});

export type DayWorkoutV2 = z.infer<typeof dayWorkoutV2Schema>;
```

**Fields**:
- `day` (string): Day name, e.g., "Monday", "Tuesday"
- `focus` (string, optional): Focus area, e.g., "Linear/Glutes", "COD/Core"
- `categoryWorkouts` (array): List of CategoryWorkout objects (one per category)

**Example**:
```typescript
{
  day: "Monday",
  focus: "Linear/Glutes",
  categoryWorkouts: [
    {
      category: "weightlifting",
      workouts: [...]
    },
    {
      category: "basketball",
      workouts: [...]
    },
    {
      category: "jumping",
      workouts: [...]
    }
  ]
}
```

---

### WorkoutsData

```typescript
export const workoutsDataSchema = z.object({
  categories: z.array(z.string()),
  durations: z.array(z.string()),
  workouts: z.array(dayWorkoutV2Schema),
});

export type WorkoutsData = z.infer<typeof workoutsDataSchema>;
```

**Fields**:
- `categories` (array of strings): Available categories, e.g., ["basketball", "weightlifting", "jumping"]
- `durations` (array of strings): Available durations, e.g., ["30m", "1h", "2h", "3h"]
- `workouts` (array): List of DayWorkoutV2 objects (one per day)

**Example**:
```typescript
{
  categories: ["basketball", "weightlifting", "jumping"],
  durations: ["30m", "1h", "2h", "3h"],
  workouts: [
    { day: "Monday", focus: "...", categoryWorkouts: [...] },
    { day: "Tuesday", focus: "...", categoryWorkouts: [...] },
    // ... more days
  ]
}
```

---

## Tempo Notation

Tempo describes movement speed for each phase of an exercise.

**Format**: `eccentric-pause-concentric-pause`

Each value is either a number (seconds) or `X` (explosive/max velocity).

### Components

| Position | Name | Meaning |
|----------|------|---------|
| 1 | Eccentric | Lowering phase (resisting gravity) |
| 2 | Bottom Pause | Time held at bottom position |
| 3 | Concentric | Lifting/pushing phase |
| 4 | Top Pause | Time held at top position |

### Values

| Value | Meaning |
|-------|---------|
| `0` | No pause (move immediately) |
| `1-9` | Seconds to hold or take |
| `X` | Explosive (max velocity, recruit fast-twitch fibers) |

### Examples

| Tempo | Meaning |
|-------|---------|
| `3-0-X-1` | 3sec down, no pause, explode up, 1sec pause at top |
| `2-0-1-1` | 2sec down, no pause, 1sec up, 1sec pause at top |
| `X-0-X-1` | Explode down, no pause, explode up, 1sec pause |
| `3-1-X-0` | 3sec down, 1sec pause at bottom, explode up, no pause |
| `1-0-1-0` | 1sec down, no pause, 1sec up, no pause (controlled) |

---

## Exercise ID Naming Convention

IDs are generated with pattern: `{day-abbrev}-{category-abbrev}-{duration-abbrev}-{number}`

### Examples

- `mon-wl-30-1` — Monday, Weightlifting, 30 minutes, Exercise 1
- `tue-bb-1h-3` — Tuesday, Basketball, 1 hour, Exercise 3
- `fri-jp-2h-5` — Friday, Jumping, 2 hours, Exercise 5
- `sun-wl-3h-7` — Sunday, Weightlifting, 3 hours, Exercise 7

### Abbreviations

| Part | Values |
|------|--------|
| Day | mon, tue, wed, thu, fri, sat, sun |
| Category | wl (weightlifting), bb (basketball), jp (jumping) |
| Duration | 30 (30m), 1h, 2h, 3h |
| Number | 1, 2, 3, ... (sequential within duration) |

---

## Basketball Intensity Levels

Basketball drills use `intensity` (not `phase`) with three levels displayed in the UI:

| Value | Label | Color | Meaning |
|-------|-------|-------|---------|
| `"low"` | Low | Blue `#60a5fa` | Recovery/technique — controlled tempo, form focus |
| `"medium"` | Medium | Orange `#fb923c` | Game-speed — standard daily work |
| `"high"` | High | Red `#f87171` | Maximum pressure — peak effort, game scenarios |

Drill descriptions start with the intensity prefix: **Form:** (low), **Game-Speed:** (medium), **Pressured:** (high).

---

## Phase Types (Weightlifting & Jumping)

These phases apply to `exerciseSchema` objects (weightlifting and jumping workouts only).

### Plyo (Explosive Power)

Training explosive movements and rate of force development.

**Characteristics**:
- Short sets (3-6 reps)
- Max velocity
- Long rest (90-120s)
- Compound movements

**Examples**: Jumps, bounds, med ball throws, plyometric drills

**Color**: Neon green `#39ff14`

### Strength

Heavy resistance training for maximum strength gains.

**Characteristics**:
- Low reps (3-8)
- Heavy load
- Long rest (120-180s)
- Focus on form and bar speed

**Examples**: Squats, deadlifts, presses, rows

**Color**: Neon cyan `#00f0ff`

### Aesthetic

Muscle hypertrophy and muscular endurance training.

**Characteristics**:
- Moderate to high reps (10-20)
- Moderate weight
- Moderate rest (45-90s)
- Muscle pump and fatigue

**Examples**: Machine work, isolation exercises, curls, leg extensions

**Color**: Neon yellow `#ffea00`

---

## Rotation Data Structure

The weekly rotation system uses JSON files in `client/public/workouts/`.

### manifest.json

```json
{
  "startDate": "2026-01-01",
  "weeks": ["week-001.json", "week-002.json"]
}
```

**Fields**:
- `startDate` (ISO string): Reference date for week calculations
- `weeks` (array): List of week filenames available for cycling

**Purpose**: Defines which weeks exist and their cycle start date. The app calculates the current week using: `weekIndex = floor((today - startDate) / 7 days) % totalWeeks`

### week-NNN.json

Basketball rotation weeks (weeks 001–026). Each file represents one week of the 6-month plan.

```json
{
  "label": "Block 1 – Week 1: Ball Handling Emphasis",
  "days": [
    {
      "day": "Monday",
      "focus": "Ball handling fundamentals and control at game speed",
      "categories": {
        "basketball": {
          "workouts": [
            {
              "duration": "30m",
              "drills": [
                {
                  "id": "mon-bb-30-1",
                  "category": "basketball",
                  "subCategory": "ballHandling",
                  "duration": "30m",
                  "name": "Stationary Crossovers (Wide Base)",
                  "description": "Form: Low wide stance, slow crossovers wider than knees, weight shifts with every cross",
                  "intensity": "low",
                  "reps": { "type": "setsPerHand", "sets": 2, "rightReps": 10 }
                }
              ]
            }
          ]
        }
      }
    }
  ]
}
```

**Fields**:
- `label` (string): Block and week description, e.g., "Block 1 – Week 1: Ball Handling Emphasis"
- `days` (array): Exactly 7 day objects (Monday–Sunday)
  - `day` (string): Day name
  - `focus` (string): Daily training theme
  - `categories.basketball.workouts` (array): Exactly 4 duration objects (30m, 1h, 2h, 3h)
    - `duration` (string): "30m" | "1h" | "2h" | "3h"
    - `drills` (array): Basketball drill objects (see `basketballDrillSchema`)

**Drill counts per duration**: 30m = 4, 1h = 5, 2h = 7, 3h = 10 (no drill repeats within a day across durations)

**Purpose**: Static JSON files served as public assets. The 26-week program runs from 2026-01-01. No code changes needed — just edit JSON or add new weeks to manifest.

---

## Data File Locations

| File | Purpose |
|------|---------|
| `client/src/hooks/use-workouts.ts` | Main WORKOUTS_DATA for Dashboard |
| `client/public/workouts/manifest.json` | Week list and rotation start date |
| `client/public/workouts/week-NNN.json` | Individual week plans (1..N) |
| `shared/schema.ts` | Zod type definitions |

---

## How the App Uses This Data

1. **Hook**: `useWorkouts()` in `use-workouts.ts` returns `WORKOUTS_DATA` via React Query
2. **Dashboard**: Stores selected `day`, `category`, `duration` in state
3. **Lookup**: Finds matching exercises:
   ```typescript
   workouts.find(w => w.day === selectedDay)
     ?.categoryWorkouts.find(cw => cw.category === selectedCategory)
     ?.workouts.find(dw => dw.duration === selectedDuration)
     ?.exercises
   ```
4. **Render**: `WorkoutTable` maps exercises to `ExerciseCard` components
5. **Display**: Each card shows exercise details colored by phase

---

## Adding New Data

See **WORKOUT_CUSTOMIZATION.md** for step-by-step instructions on:
- Adding exercises to existing slots
- Creating new days
- Adding new categories or durations

---

## Validation

Zod schemas in `shared/schema.ts` validate all data:

```typescript
export const workoutsDataSchema = z.object({...});

// Validate at runtime
const data = workoutsDataSchema.parse(WORKOUTS_DATA);
```

This ensures type safety and catches invalid data early.
