# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## TL;DR

**APEX** is a 7-day athlete workout dashboard. Select a day → category (Basketball/Weightlifting/Jumping) → duration (30m/1h/2h/3h) to view personalized exercises with sets, tempo, rest periods, and coaching notes.

---

## Quick Start

```bash
npm run dev       # Dev server on localhost:5000 (Express + Vite HMR)
npm run build     # Production build → dist/
npm run start     # Run production build
npm run check     # TypeScript type check
```

---

## High-Level Architecture

```
React 18 SPA (Vite)
    ↓
React Query (data fetching) → Static WORKOUTS_DATA
    ↓
Dashboard (day/category/duration state) → Sidebar (navigation) → WorkoutTable (render)
    ↓
Express 5 (serves static assets; backend unused)
```

**In plain terms**: A client-side app that selects exercises from a nested data structure based on user choices and renders them with color-coded phases.

---

## Frontend Stack & Key Components

<details>
<summary><b>Router & State</b></summary>

- **Router**: `wouter` (single route `"/"` → `Dashboard`)
- **State management**: React hooks + URL bar not in use (all state in component tree)
- **Data fetching**: `@tanstack/react-query` with `staleTime: Infinity` (static data, no refetch)

</details>

<details>
<summary><b>UI & Styling</b></summary>

- **Component library**: shadcn/ui (Radix UI primitives)
- **CSS framework**: Tailwind CSS v3
- **Theme**: Dark (`bg-[#0f172a]` base) with neon accents:
  - Plyo (explosive): green `#39ff14`
  - Strength (heavy): cyan `#00f0ff`
  - Aesthetic (hypertrophy): yellow `#ffea00`
- **Motion**: `framer-motion` (Sidebar animations)
- **Icons**: `lucide-react`

</details>

<details>
<summary><b>Component Tree</b></summary>

```
Dashboard (manages selectedDay, selectedCategory, selectedDuration)
  ├─ Sidebar
  │  ├─ Day buttons (Mon-Sun)
  │  ├─ Category dropdown
  │  └─ Duration dropdown
  └─ Main area
     └─ WorkoutTable
        └─ ExerciseCard × N (colored by phase, expandable notes)
```

</details>

<details>
<summary><b>Forms & Validation (Unused)</b></summary>

- `react-hook-form` + Zod resolvers present but not active
- Available if future mutations/user input validation is needed

</details>

---

## Backend

<details>
<summary><b>Express Server</b></summary>

- **Purpose**: Serve static assets from Vite build
- **API**: Single unused route `GET /api/workouts` (client uses static data instead)
- **Storage**: In-memory `MemStorage` class in `server/storage.ts`
- **Unused deps**: Drizzle ORM, PostgreSQL adapter, Passport auth (scaffolding from Replit template)

</details>

---

## Data Structure & Workout Customization

<details>
<summary><b>Type System (Zod Schemas)</b></summary>

Located in `shared/schema.ts`:

```typescript
Exercise
  id: string
  phase: "Plyo" | "Strength" | "Aesthetic"
  name: string
  setsReps: string          // e.g., "3x6-8"
  tempo: string             // e.g., "3-0-X-1" (eccentric-pause-concentric-pause)
  rest: string              // e.g., "120s"
  note?: string             // Optional coaching cue

DurationWorkout
  duration: "30m" | "1h" | "2h" | "3h"
  exercises: Exercise[]

CategoryWorkout
  category: "basketball" | "weightlifting" | "jumping"
  workouts: DurationWorkout[]

DayWorkoutV2
  day: string               // "Monday", "Tuesday", etc.
  focus?: string            // e.g., "Linear/Glutes"
  categoryWorkouts: CategoryWorkout[]

WorkoutsData
  categories: string[]      // ["basketball", "weightlifting", "jumping"]
  durations: string[]       // ["30m", "1h", "2h", "3h"]
  workouts: DayWorkoutV2[]
```

</details>

<details>
<summary><b>How to Edit Workouts</b></summary>

1. **File**: `client/src/hooks/use-workouts.ts` (search for `WORKOUTS_DATA`)
2. **Change exercises**: Edit exercise objects directly (name, sets/reps, tempo, rest, note)
3. **Add exercises**: Append to any `exercises[]` array with a unique `id`
4. **Add days**: Add new object to `workouts[]` array (copies existing day pattern)
5. **Add categories**: Add string to `categories[]` array, then add `CategoryWorkout` object for each day
6. **Add durations**: Add string to `durations[]` array, then add `DurationWorkout` object for each category

**Example**: To change Monday's 1h weightlifting squat from 3x6-8 to 4x5:
```typescript
// In WORKOUTS_DATA.workouts[0].categoryWorkouts[0].workouts[1].exercises[1]
{ id: "mon-wl-1h-2", phase: "Strength", name: "Smith Squat", setsReps: "4x5", ... }
```

</details>

<details>
<summary><b>Tempo Notation</b></summary>

Format: `eccentric-pause-concentric-pause` (all in seconds)

| Notation | Meaning |
|----------|---------|
| `3` | 3 seconds |
| `0` | No pause |
| `X` | Explosive (max velocity, fast-twitch recruitment) |

Examples:
- `3-0-X-1`: 3sec down, explode up, 1sec pause
- `2-0-1-1`: 2sec down, 1sec up, 1sec pause
- `X-0-X-1`: explosive down, explosive up, 1sec pause

</details>

<details>
<summary><b>Sample JSON Structure</b></summary>

See `client/src/data/workouts.json` for a template showing the nested structure ready for copying/editing.

</details>

---

## Navigation & State Flow

<details>
<summary><b>User Interaction</b></summary>

1. User clicks day button in Sidebar → `selectedDay` state updates
2. User selects category from dropdown → `selectedCategory` state updates
3. User selects duration from dropdown → `selectedDuration` state updates
4. `Dashboard` finds matching exercises: `workouts.find(day) → categoryWorkouts.find(category) → workouts.find(duration) → exercises`
5. `WorkoutTable` renders exercises as cards
6. User can expand exercise cards to reveal coaching notes (chevron toggle)

</details>

<details>
<summary><b>State Management Details</b></summary>

- **Where**: React component state in `Dashboard.tsx` (`useState` hooks)
- **What**: `selectedDay`, `selectedCategory`, `selectedDuration` (all strings)
- **Why**: No URL routing; state is isolated to component tree
- **Future**: Could add URL routing (e.g., `/?day=Monday&category=weightlifting&duration=1h`) for sharable links, but not currently implemented

</details>

---

## Path Aliases

<details>
<summary><b>Import Shortcuts</b></summary>

Defined in `vite.config.ts`:

```typescript
@ → client/src
@shared → shared
@assets → attached_assets
```

Example: `import { Exercise } from "@shared/schema"`

</details>

---

## Deployment

<details>
<summary><b>GitHub Pages</b></summary>

- **Build**: `npm run build` outputs to `dist/`
- **Base path**: Vite `base` is set dynamically via `GITHUB_PAGES` and `REPO_NAME` env vars (in `script/build.ts`)
- **Backend**: Not deployed; Express is dev-only
- **Hosting**: Pure static site (HTML + CSS + JS)

</details>

<details>
<summary><b>How Static Deployment Works</b></summary>

1. Build script reads env vars: `GITHUB_PAGES=true` and `REPO_NAME=athlete-dashboard`
2. Vite config sets `base: /athlete-dashboard/` if `process.env.GITHUB_PAGES` is true
3. Build outputs assets with correct relative paths
4. GitHub Pages serves from `/athlete-dashboard/` URL prefix

This allows the SPA to work correctly as a subdirectory on GitHub Pages without a backend.

</details>

---

## File Structure (At a Glance)

```
client/src/
  ├─ main.tsx              # Entry point
  ├─ App.tsx               # Router
  ├─ pages/
  │  └─ Dashboard.tsx      # Main page (day/category/duration state)
  ├─ components/
  │  ├─ layout/Sidebar.tsx # Day/category/duration nav
  │  ├─ workout/
  │  │  └─ WorkoutTable.tsx # Exercise cards (ExerciseCard component)
  │  └─ ui/                # shadcn/ui components
  ├─ hooks/
  │  └─ use-workouts.ts    # WORKOUTS_DATA + useWorkouts() hook
  └─ lib/
     ├─ queryClient.ts     # React Query config
     └─ utils.ts           # Tailwind merge, etc.

shared/
  ├─ schema.ts             # Zod types (Exercise, DayWorkoutV2, etc.)
  └─ routes.ts             # API route definitions (unused)

server/
  ├─ index.ts              # Express entry point
  ├─ routes.ts             # API routes (unused)
  ├─ storage.ts            # In-memory data (unused by client)
  └─ static.ts             # Vite dev middleware

script/
  └─ build.ts              # Build script (handles GitHub Pages base path)
```

---

## Common Tasks

<details>
<summary><b>I want to change the colors</b></summary>

Edit `client/src/components/workout/WorkoutTable.tsx`:

```typescript
const PHASE_CONFIG = {
  Plyo: { icon: Zap, color: "text-[#39ff14]", bg: "bg-[#39ff14]/10", border: "border-[#39ff14]/20" },
  Strength: { icon: Dumbbell, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/20" },
  Aesthetic: { icon: Sparkles, color: "text-[#ffea00]", bg: "bg-[#ffea00]/10", border: "border-[#ffea00]/20" },
};
```

Also update the comment in `CLAUDE.md` documenting the phase colors.

</details>

<details>
<summary><b>I want to add a new phase type</b></summary>

1. Add to Zod enum in `shared/schema.ts`: `phase: z.enum(["Plyo", "Strength", "Aesthetic", "Hypertrophy"])`
2. Add to `PHASE_CONFIG` in `WorkoutTable.tsx`
3. Use in exercises within `use-workouts.ts`

</details>

<details>
<summary><b>I want to prevent unused dependencies warnings</b></summary>

Remove from `package.json`: `drizzle-orm`, `pg`, `passport`, `connect-pg-simple`

These are scaffolding from the Replit template and not used.

</details>

---

## See Also

- **Workout Customization**: `WORKOUT_CUSTOMIZATION.md` (detailed editing guide)
- **Schema Types**: `shared/schema.ts` (authoritative type definitions)
- **Example Workouts**: `client/src/data/workouts.json` (JSON template)
