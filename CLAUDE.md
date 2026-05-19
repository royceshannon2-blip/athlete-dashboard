# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (Express + Vite HMR on localhost:5000) |
| `npm run build` | Production build: outputs to `dist/` |
| `npm run start` | Run production build: `node dist/index.cjs` |
| `npm run check` | TypeScript type check |

**No tests or lint commands are configured.**

## Architecture

**Stack**: React 18 + TypeScript SPA, served by Express 5. Originally scaffolded on Replit with GitHub Pages static deployment support.

**Frontend**:
- Router: `wouter` (lightweight; single route `"/"` → `Dashboard`)
- Data fetching: `@tanstack/react-query` with `staleTime: Infinity`
- UI: shadcn/ui + Radix UI primitives + Tailwind CSS v3
- Styling: dark theme (`bg-[#0f172a]`) with neon accents (green `#39ff14`, cyan `#00f0ff`, yellow `#ffea00`)
- Motion: `framer-motion` (used in Sidebar)
- Forms: `react-hook-form` + Zod (present, not currently active)
- Icons: `lucide-react`

**Backend**:
- Express 5 with single route: `GET /api/workouts`
- In-memory storage (no persistence; Drizzle/pg/passport deps are unused scaffolding from the Replit template)

**Path aliases** (vite.config.ts):
- `@` → `client/src`
- `@shared` → `shared`
- `@assets` → `attached_assets`

## Data Flow & JSON Format

Workout data is **category/duration-based** to support multiple training styles:

1. **Data source**: `client/src/hooks/use-workouts.ts`
   - Reads from hardcoded `WORKOUTS_DATA` object
   - The `useWorkouts()` hook returns this directly via React Query with `staleTime: Infinity`

2. **Data structure** (Zod schemas in `shared/schema.ts`):
   ```typescript
   Exercise: { id, phase (Plyo|Strength|Aesthetic), name, setsReps, tempo, rest, note? }
   DurationWorkout: { duration (30m|1h|2h|3h), exercises[] }
   CategoryWorkout: { category (basketball|weightlifting|jumping), workouts: DurationWorkout[] }
   DayWorkoutV2: { day, focus?, categoryWorkouts: CategoryWorkout[] }
   WorkoutsData: { categories, durations, workouts: DayWorkoutV2[] }
   ```

3. **Display flow**:
   - `Dashboard.tsx` manages state: `selectedDay`, `selectedCategory`, `selectedDuration`
   - `Sidebar.tsx` provides day buttons, category dropdown, and duration dropdown
   - When user picks day + category + duration, finds matching exercises
   - `WorkoutTable` renders exercises as color-coded cards with phase, sets/reps, tempo, rest, notes

4. **Editing workouts**:
   - Update exercise data directly in `client/src/hooks/use-workouts.ts` (search for `WORKOUTS_DATA`)
   - Template file at `client/src/data/workouts.json` shows the JSON schema structure
   - To add more days/categories/durations, update the respective arrays and nested structures
   - Phase colors: Plyo=green `#39ff14`, Strength=cyan `#00f0ff`, Aesthetic=yellow `#ffea00`

## Deployment

- **GitHub Pages**: Vite `base` path is set via `GITHUB_PAGES` + `REPO_NAME` env vars in build script
- The app runs as a pure static site; Express backend is optional (present for potential future features)
