# PRD: Basketball Sub-Categories, Finishing, & Jumping Timer

**Status:** Draft  
**Scope:** JSON schema changes, display logic, and timer behavior for basketball and jumping categories

---

## Overview

Basketball becomes a reference card with three visible sub-category sections: Shooting, Ball Handling, and Finishing. Jumping stays a reference card but gets the rest timer. Neither category gets per-set Done buttons or weight logging. Duration selects a completely different set of drills — no scaling multipliers.

---

## Rep Model Per Sub-Category

Each sub-category has its own rep unit. The `setsReps` string is replaced by a structured field per drill type.

| Sub-category | Rep model | Display example |
|---|---|---|
| Shooting | Makes | `15 makes` |
| Ball Handling | Sets × reps, per hand, left skewed | `3 sets — 25 reps (R) / 28 reps (L)` |
| Finishing | Makes per hand, left skewed | `10 makes (R) / 11 makes (L)` |

**Ball Handling left skew rule:** `leftReps = Math.ceil(rightReps * 1.1)`. Always computed from the right-hand value. Never authored manually in JSON — derived at render time.

**Finishing left skew rule:** Same. `leftMakes = Math.ceil(rightMakes * 1.1)`.

---

## JSON Schema

### Top-level workout entry (basketball)

```json
{
  "id": "bball-30m-shooting-1",
  "category": "basketball",
  "subCategory": "shooting" | "ballHandling" | "finishing",
  "duration": 30 | 60 | 120 | 180,
  "name": "Spot Shooting",
  "description": "5 spots around the arc, move after each make",
  "reps": {
    "type": "makes",
    "makes": 15
  }
}
```

```json
{
  "id": "bball-60m-bh-1",
  "category": "basketball",
  "subCategory": "ballHandling",
  "duration": 60,
  "name": "Stationary Crossover",
  "description": "Low and tight, eyes up",
  "reps": {
    "type": "setsPerHand",
    "sets": 3,
    "rightReps": 25
    // leftReps derived: Math.ceil(25 * 1.1) = 28
  }
}
```

```json
{
  "id": "bball-60m-finishing-1",
  "category": "basketball",
  "subCategory": "finishing",
  "duration": 60,
  "name": "Euro Step Layup",
  "description": "Full speed from the wing, attack the rim",
  "reps": {
    "type": "makesPerHand",
    "rightMakes": 10
    // leftMakes derived: Math.ceil(10 * 1.1) = 11
  }
}
```

### Jumping entry (unchanged structure, shown for reference)

```json
{
  "id": "jump-30m-1",
  "category": "jumping",
  "duration": 30,
  "name": "Depth Jumps",
  "description": "Step off box, land and explode immediately",
  "setsReps": "4x6",
  "rest": "120s"
}
```

Jumping keeps its existing flat structure. No sub-categories.

---

## Drill Count Requirements

### Basketball (per duration, per sub-category)

| Duration | Drills per sub-category | Total basketball drills |
|---|---|---|
| 30 min | 1 | 3 |
| 60 min | 2 | 6 |
| 120 min | 4 | 12 |
| 180 min | 6 | 18 |

180min count: linear extrapolation from 120min (4 → 6, +2 per hour added).

Each duration's drills are entirely independent entries in the JSON. No drill is reused or referenced across durations.

### Jumping (existing count behavior — no change)

Jumping drill counts are not modified by this PRD.

---

## UI Changes

### Basketball Display

**No Done buttons. No weight logging. No timer.**

The basketball workout view renders three labeled sections in order:

1. **Shooting**
2. **Ball Handling**
3. **Finishing**

Each section has a heading styled consistently with the app's phase-color system. Drills within each section are displayed as reference cards — name, description, and rep display only.

#### Rep display per type

**Shooting:**
```
15 makes
```

**Ball Handling:**
```
3 sets
25 reps (R)  ·  28 reps (L)
```
Left reps are computed at render: `Math.ceil(rightReps * 1.1)`. Never stored in JSON.

**Finishing:**
```
10 makes (R)  ·  11 makes (L)
```
Left makes computed at render: `Math.ceil(rightMakes * 1.1)`.

The `(L)` value should be visually distinct — slightly bolder or accented — to signal intentional asymmetry, not a typo.

---

### Jumping Display

Jumping keeps its existing card layout. The rest timer is **enabled** for jumping, identical behavior to lifting:

- RestTimer bar appears at the bottom when jumping is the selected category
- Timer does **not** auto-start (per mobile PRD Change 8)
- Play button pulses when idle
- Triple chime on completion
- TimerSettings accessible via gear icon

Jumping has **no** Done-per-set buttons. It is a reference card. The timer is purely manual — the user reads the card, does the set, then hits Play themselves.

---

### Category Routing — What Gets What

| Category | Reference card | Rest timer | Done buttons | Weight logging |
|---|---|---|---|---|
| Weightlifting | — | ✓ | ✓ | ✓ |
| Basketball | ✓ | — | — | — |
| Jumping | ✓ | ✓ | — | — |

---

## Files Changed

**Modified:**
- `client/src/pages/Dashboard.tsx` — pass `category` to RestTimer conditional; include `"jumping"` alongside `"weightlifting"` in the timer render condition
- `client/src/components/workout/WorkoutTable.tsx` — add sub-category section rendering for basketball; add per-type rep display components; Done buttons remain weightlifting-only
- Workout JSON data files — new drill entries per the count table above

**Created:**
- `client/src/components/workout/BasketballSection.tsx` — renders one labeled sub-category block (heading + drill cards); used three times in the basketball workout view
- `client/src/components/workout/RepDisplay.tsx` — pure display component; accepts a `reps` object and renders the correct format based on `type`; computes left skew inline

**Untouched:**
- `use-weight-log.ts`
- `use-rest-timer.ts`
- `SetLogPrompt.tsx`
- All lifting logic

---

## RepDisplay Component

```tsx
// client/src/components/workout/RepDisplay.tsx

type Reps =
  | { type: "makes"; makes: number }
  | { type: "setsPerHand"; sets: number; rightReps: number }
  | { type: "makesPerHand"; rightMakes: number }

export function RepDisplay({ reps }: { reps: Reps }) {
  if (reps.type === "makes") {
    return <span>{reps.makes} makes</span>
  }
  if (reps.type === "setsPerHand") {
    const leftReps = Math.ceil(reps.rightReps * 1.1)
    return (
      <div>
        <span>{reps.sets} sets</span>
        <span>{reps.rightReps} reps (R) · <strong>{leftReps} reps (L)</strong></span>
      </div>
    )
  }
  if (reps.type === "makesPerHand") {
    const leftMakes = Math.ceil(reps.rightMakes * 1.1)
    return (
      <span>{reps.rightMakes} makes (R) · <strong>{leftMakes} makes (L)</strong></span>
    )
  }
}
```

---

## Verification Checklist

- [ ] Selecting Basketball shows three labeled sections: Shooting, Ball Handling, Finishing
- [ ] Each section shows correct drills for the selected duration
- [ ] 30min: 1 drill per section; 60min: 2; 120min: 4; 180min: 6
- [ ] Shooting cards show `N makes` only
- [ ] Ball handling cards show sets + right reps + computed left reps (left is always `ceil(right * 1.1)`)
- [ ] Finishing cards show right makes + computed left makes, same skew rule
- [ ] Left value is visually distinct (bold) on ball handling and finishing cards
- [ ] No Done buttons appear on any basketball card
- [ ] No timer bar appears when basketball is selected
- [ ] Selecting Jumping shows the rest timer bar
- [ ] Jumping timer does not auto-start; Play button pulses when idle
- [ ] Triple chime fires on jumping timer completion
- [ ] Jumping cards have no Done buttons
- [ ] Switching from jumping to basketball hides the timer bar
- [ ] Switching from basketball to weightlifting shows Done buttons and timer
