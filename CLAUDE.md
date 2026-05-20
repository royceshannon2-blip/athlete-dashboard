# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Overview

**APEX** is an athlete workout platform with two independent systems:

1. **Dashboard** (main view at `/`): Users select a day of week, training category (Basketball/Weightlifting/Jumping), and duration (30m/1h/2h/3h) to view personalized exercises. Data is hardcoded in `use-workouts.ts`.

2. **Schedule Browser** (side panel from Dashboard): Click "Schedule" button to view cached weekly rotation plans. Shows all available weeks with on-demand JSON fetching. Zero code changes to add new weeks—just add JSON files and update manifest.

**Tech Stack**: React 18 + Vite (frontend), Express 5 (static serving), Tailwind CSS (styling), shadcn/ui (components)

**Architecture**: Client-side SPA with static workout data. Dashboard and WeekSelector components manage independent navigation flows. Both use WorkoutTable for exercise display.

---

## Documentation Index

| File | Purpose |
|------|---------|
| **ARCHITECTURE.md** | Detailed component tree, state flow, system breakdown (including rotation) |
| **DEVELOPMENT.md** | Commands (dev/build/start), setup, local development |
| **DATA_STRUCTURE.md** | Zod schemas, tempo notation, data format reference |
| **WORKOUT_CUSTOMIZATION.md** | How to add/edit exercises for both Dashboard and Rotation systems |
| **WORKOUT_ROTATION.md** | Complete guide to the weekly rotation feature (new) |
| **MOBILE_OPTIMIZATION.md** | Mobile UI/UX improvements, touch targets, timer chime, responsive layouts |
| **DEPLOYMENT.md** | GitHub Pages setup, static site hosting, build process |

---

## Getting Started

```bash
npm install        # Install dependencies
npm run dev        # Start dev server on localhost:5000
npm run build      # Production build
npm run check      # TypeScript type check
```

For detailed commands and development workflow, see **DEVELOPMENT.md**.

---

## File Structure

```
client/src/
  ├─ pages/Dashboard.tsx               # Dashboard main page (day-based)
  ├─ components/
  │  ├─ ScheduleBrowserButton.tsx      # "Schedule" button in Dashboard header
  │  ├─ ScheduleBrowserPanel.tsx       # Side panel with weekly rotation browser
  │  ├─ WeekSelector.tsx               # Rotation main component (alternate view)
  │  ├─ Sidebar.tsx                    # Day/category/duration navigation
  │  ├─ WorkoutTable.tsx               # Exercise display (shared)
  │  └─ ...                            # Other UI components
  └─ hooks/
     ├─ use-workouts.ts                # WORKOUTS_DATA (Dashboard)
     ├─ use-weekly-rotation.ts          # Week data fetching (alternate)
     └─ use-schedule-browser.ts         # Schedule browser state (panel)

client/public/workouts/
  ├─ manifest.json                 # Week list and start date
  ├─ week-001.json                 # Week 1 plan
  ├─ week-002.json                 # Week 2 plan
  └─ ...                           # More weeks

shared/schema.ts                   # TypeScript type definitions (Zod)

server/index.ts                    # Express app (serves static assets)
```

---

## Key Concepts

**Two Systems**: Dashboard (day-based, user-selected) and Rotation (week-based, date-driven) coexist independently.

**Dashboard Data**: Hardcoded in `client/src/hooks/use-workouts.ts`. Nested: Day → Category → Duration → Exercises.

**Rotation Data**: JSON files in `client/public/workouts/`. Manifest lists weeks; each week file has all categories and durations.

**State Management**: 
- Dashboard: React hooks manage `selectedDay`, `selectedCategory`, `selectedDuration`
- Rotation: `use-weekly-rotation` hook fetches from static JSON based on date math

**Styling**: Tailwind CSS + shadcn/ui. Phase colors: Plyo (green), Strength (cyan), Aesthetic (yellow).

---

## Common Tasks

- **Add/edit exercises (Dashboard)**: See **WORKOUT_CUSTOMIZATION.md** (Day-Based section)
- **Add/update weeks (Rotation)**: See **WORKOUT_CUSTOMIZATION.md** (Weekly Rotation section)
- **Understand rotation system**: See **WORKOUT_ROTATION.md**
- **Understand the architecture**: See **ARCHITECTURE.md**
- **Change colors or styling**: See **ARCHITECTURE.md** (UI & Styling section)
- **Deploy to GitHub Pages**: See **DEPLOYMENT.md**
- **Understand data types**: See **DATA_STRUCTURE.md**

---

## Related Files

- **WORKOUT_CUSTOMIZATION.md** — Practical guide for editing workout data
- **package.json** — Dependencies and scripts
- **vite.config.ts** — Vite configuration (path aliases)
- **tailwind.config.ts** — Tailwind CSS customization
