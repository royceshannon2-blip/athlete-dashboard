# Data Structure

Detailed reference for APEX's data format and TypeScript schemas.

---

## Overview

All workout data is defined in `client/src/hooks/use-workouts.ts` as a single `WORKOUTS_DATA` object. The structure is validated with Zod schemas in `shared/schema.ts`.

**Hierarchy**: Days → Categories → Durations → Exercises

---

## Zod Schemas

Located in `shared/schema.ts`. All schemas are exported as TypeScript types.

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

```typescript
export const categoryWorkoutSchema = z.object({
  category: z.enum(["basketball", "weightlifting", "jumping"]),
  workouts: z.array(durationWorkoutSchema),
});

export type CategoryWorkout = z.infer<typeof categoryWorkoutSchema>;
```

**Fields**:
- `category` (enum): Training style: "basketball", "weightlifting", "jumping"
- `workouts` (array): List of DurationWorkout objects for each duration

**Example**:
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

## Phase Types

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

```json
{
  "weekNumber": 1,
  "days": [
    {
      "day": "Monday",
      "focus": "Linear/Glutes",
      "categoryWorkouts": [
        {
          "category": "weightlifting",
          "workouts": [
            {
              "duration": "1h",
              "exercises": [
                {
                  "id": "w1-mon-wl-1h-1",
                  "phase": "Strength",
                  "name": "Smith Squat",
                  "setsReps": "4x5",
                  "tempo": "3-0-X-1",
                  "rest": "120s"
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

**Fields**:
- `weekNumber` (integer): Week identifier (1, 2, etc.)
- `days` (array): List of day workouts, same structure as Dashboard data
  - Each day has all categories and durations available

**Purpose**: Static JSON files served as public assets. No code changes needed — just edit JSON and update manifest.

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
