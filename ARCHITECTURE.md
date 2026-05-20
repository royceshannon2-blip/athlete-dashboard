# Architecture

Detailed breakdown of the APEX application structure.

---

## System Overview

The app has two independent workout systems:

### 1. Day-Based Dashboard (Original)

```
React 18 SPA (Vite)
    ↓
React Query (static data hook) → WORKOUTS_DATA
    ↓
Dashboard (state: day/category/duration)
    ├─ Sidebar (day buttons, category dropdown, duration dropdown)
    └─ WorkoutTable (ExerciseCard components)
    ↓
Express 5 (serves static assets; backend unused)
```

### 2. Week Rotation (New)

```
React 18 SPA (Vite)
    ↓
WeekSelector component
    ├─ "This Week" tab (current week)
    └─ "History" tab (week picker)
        ↓
        use-weekly-rotation hook
            ├─ Fetches /workouts/manifest.json
            └─ Fetches /workouts/week-NNN.json
                ↓
                WorkoutTable (exercise display)

---

## Component Hierarchy

### Dashboard
- **File**: `client/src/pages/Dashboard.tsx`
- **Purpose**: Main app container, state management
- **State**:
  - `selectedDay` (string, default "Monday")
  - `selectedCategory` (string, default "weightlifting")
  - `selectedDuration` (string, default "1h")
- **Logic**: Finds matching exercises from WORKOUTS_DATA based on selected day/category/duration
- **Renders**: Sidebar + WorkoutTable

### Sidebar
- **File**: `client/src/components/layout/Sidebar.tsx`
- **Purpose**: Navigation and filtering
- **Props**: 
  - `selectedDay`, `onSelectDay` (callback)
  - `selectedCategory`, `onSelectCategory` (callback)
  - `selectedDuration`, `onSelectDuration` (callback)
  - `days` (array of day/focus pairs)
  - `categories` (array of category strings)
  - `durations` (array of duration strings)
- **Features**:
  - Day buttons (horizontal scroll on mobile, vertical on desktop)
  - Category dropdown (Select component from shadcn/ui)
  - Duration dropdown (Select component from shadcn/ui)
  - Radar stats display (hidden on mobile)

### WorkoutTable
- **File**: `client/src/components/workout/WorkoutTable.tsx`
- **Purpose**: Display exercises for selected workout
- **Props**:
  - `exercises` (array of Exercise objects)
- **Renders**: ExerciseCard for each exercise

### ExerciseCard (sub-component of WorkoutTable)
- **Purpose**: Individual exercise display
- **Features**:
  - Color-coded by phase (Plyo/Strength/Aesthetic)
  - Shows: name, phase, sets/reps, tempo, rest
  - Expandable: reveals coaching note on chevron click
  - Tempo display: X is highlighted in cyan for visibility
  - Tooltip: explains what "X" means (max velocity)

### ScheduleBrowserButton
- **File**: `client/src/components/ScheduleBrowserButton.tsx`
- **Purpose**: Button in Dashboard header to open schedule browser panel
- **Props**: `onClick` (callback to open panel)
- **Features**: Calendar icon, responsive text label (hidden on mobile)
- **Location**: Dashboard header, next to category/duration selectors

### ScheduleBrowserPanel
- **File**: `client/src/components/ScheduleBrowserPanel.tsx`
- **Purpose**: Side panel showing cached weekly rotation schedules
- **Props**: `isOpen` (boolean), `onClose` (callback)
- **Features**:
  - Week list (left column): Shows all available weeks with current week marked
  - Day selector (top): Tabs for each training day
  - Workout display (right): Shows exercises for selected week/day
  - Lazy loading: Fetches week data on demand via `use-schedule-browser` hook
  - Color-coded by phase (same as main exercise cards)
- **Data flow**: Fetches manifest → Lists weeks → Fetches individual week JSON on selection

---

## Weekly Rotation System

### WeekSelector
- **File**: `client/src/components/WeekSelector.tsx`
- **Purpose**: Display workout rotation with weekly cycle
- **Features**:
  - Tabbed interface: "This Week" and "History"
  - "This Week" tab: Shows current week's plan
  - "History" tab: Dropdown selector for any week (past or future)
  - Displays full plan organized by category and duration
  - Reuses WorkoutTable for exercise rendering
- **Route**: `/rotation`

### use-weekly-rotation Hook
- **File**: `client/src/hooks/use-weekly-rotation.ts`
- **Purpose**: Fetch and manage weekly rotation data
- **Logic**:
  1. Fetch `manifest.json` to get startDate and week list
  2. Calculate week index: `floor((today - startDate) / 7 days)`
  3. Map to plan file: `weekIndex % totalWeeks`
  4. Fetch corresponding week JSON file
- **Parameters**: `overrideWeekIndex` (optional) to fetch specific week
- **Returns**: `{ plan, weekIndex, totalWeeks, loading, error }`

### Rotation Data Files
- **Location**: `client/public/workouts/`
- **manifest.json**: Lists available week files and startDate
- **week-NNN.json**: Week plan with all categories and durations
- **Format**: Static JSON files served as public assets
- **Updates**: No code changes required — just edit JSON files and update manifest

---

## State Flow

### Dashboard (Day-Based)


1. **User clicks day button** → Sidebar calls `onSelectDay(day)` → Dashboard updates `selectedDay`
2. **User selects category** → Sidebar calls `onSelectCategory(category)` → Dashboard updates `selectedCategory`
3. **User selects duration** → Sidebar calls `onSelectDuration(duration)` → Dashboard updates `selectedDuration`
4. **Dashboard re-renders** → Finds exercises from WORKOUTS_DATA:
   ```
   workouts[selectedDay]
     → categoryWorkouts[selectedCategory]
     → workouts[selectedDuration]
     → exercises[]
   ```
5. **WorkoutTable re-renders** with new exercises
6. **User expands note** → ExerciseCard local state toggles (no parent state change)

---

## Frontend Stack Details

### Router
- **Library**: `wouter`
- **Routes**: Single route `"/"` → Dashboard
- **No URL state**: Navigation state is in component tree, not URL bar
- **Future enhancement**: Could add URL routing for sharable links (e.g., `/?day=Monday&category=weightlifting&duration=1h`)

### Data Fetching
- **Library**: `@tanstack/react-query`
- **Hook**: `useWorkouts()` in `client/src/hooks/use-workouts.ts`
- **Behavior**: Returns static WORKOUTS_DATA directly
- **Cache**: `staleTime: Infinity` (data never refetches)
- **Why**: App is static; no backend API calls needed

### UI Components
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Dropdowns**: shadcn Select component for category/duration
- **Buttons**: shadcn Button for day selection
- **Tooltips**: shadcn Tooltip for tempo explanation

### Styling
- **Framework**: Tailwind CSS v3
- **Theme**: Custom dark theme
  - **Base**: `bg-[#0f172a]` (very dark blue)
  - **Text**: Slate-200 (light gray)
- **Phase Colors**:
  - **Plyo** (explosive): `#39ff14` (neon green)
  - **Strength** (heavy): `#00f0ff` (neon cyan)
  - **Aesthetic** (hypertrophy): `#ffea00` (neon yellow)
- **Accent**: Primary color is cyan for highlights/borders
- **Responsive**: Mobile-first design using Tailwind breakpoints (`md:`, `lg:`)

### Motion
- **Library**: `framer-motion`
- **Used in**: Sidebar animations on day button interactions
- **Import**: Motion components for smooth transitions

### Icons
- **Library**: `lucide-react`
- **Phase Icons**:
  - Plyo: Zap ⚡
  - Strength: Dumbbell 🏋️
  - Aesthetic: Sparkles ✨
- **Other**: ChevronDown, Activity, Crosshair, etc.

---

## Backend (Mostly Unused)

### Express Server
- **File**: `server/index.ts`
- **Purpose**: Serve static assets from Vite build
- **Dev**: Integrated with Vite dev middleware for HMR
- **Prod**: Serves `dist/public/` directory

### API Route (Unused)
- **Route**: `GET /api/workouts`
- **Handler**: Returns data from `MemStorage` in `server/storage.ts`
- **Status**: Never called by client (client uses static WORKOUTS_DATA hook)
- **Kept for**: Potential future backend integration

### Storage (Unused)
- **File**: `server/storage.ts`
- **Class**: `MemStorage` implements `IStorage` interface
- **Data**: Duplicate copy of old WORKOUTS data (stale, not used)
- **Purpose**: Placeholder if backend needs to serve workout data

---

## Unused Dependencies (Scaffolding)

From Replit template, not used in this app:
- `drizzle-orm` — ORM for databases
- `pg` — PostgreSQL driver
- `passport` — Authentication library
- `connect-pg-simple` — Passport session store

These can be removed if desired. They don't affect the app's functionality.

---

## Path Aliases

Defined in `vite.config.ts`:

```typescript
@ → client/src
@shared → shared
@assets → attached_assets
```

Examples:
```typescript
import { Dashboard } from "@/pages/Dashboard"
import { Exercise } from "@shared/schema"
```

---

## Key Design Decisions

### Why Static Data?
The app is designed to work as a pure static site on GitHub Pages. No backend, no API calls. All workout data is hardcoded in the hook.

### Why No URL Routing?
Navigation state is simpler to manage in the component tree. No need for URL persistence. Future enhancement: add URL routing for sharable links.

### Why React Query for Static Data?
Consistency with typical React patterns. Could be simplified to just useState, but React Query handles loading/error states if needed in future.

### Why Nested Data Structure?
Reflects the user's mental model: "Pick a day, then a category, then a duration." Nested structure makes filtering straightforward.

---

## Responsive Design

### Mobile (default)
- Sidebar is horizontal with scrolling day buttons
- Category/duration selectors below day buttons
- Full-width main area

### Desktop (md+ breakpoint)
- Sidebar is vertical on left side
- Day buttons stack vertically
- Radar stats visible on lg+ screens
- Main area takes up remaining space

---

## Color System

| Element | Light Mode | Dark Mode (Current) |
|---------|-----------|-------------------|
| Background | — | `#0f172a` |
| Text | — | `slate-200` |
| Borders | — | `white/5` |
| Plyo Phase | — | `#39ff14` (neon green) |
| Strength Phase | — | `#00f0ff` (neon cyan) |
| Aesthetic Phase | — | `#ffea00` (neon yellow) |
| Primary Accent | — | Cyan (same as Strength) |

---

## Future Enhancements

- **URL routing**: Add day/category/duration to URL for sharable links
- **Dark/light mode toggle**: Switch theme preference
- **Search**: Filter exercises by name
- **Favorites**: Mark favorite workouts
- **Custom notes**: User-added coaching notes
- **Workout timer**: In-app rest timer with audio cues
- **Export**: Download workout as PDF
