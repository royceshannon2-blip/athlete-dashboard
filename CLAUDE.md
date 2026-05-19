# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Overview

**APEX** is a 7-day athlete workout dashboard built with React 18 + TypeScript. Users select a day, training category (Basketball/Weightlifting/Jumping), and duration (30m/1h/2h/3h) to view personalized exercises with sets, tempo, rest periods, and coaching notes.

**Tech Stack**: React 18 + Vite (frontend), Express 5 (backend/static serving), Tailwind CSS (styling), shadcn/ui (components)

**Architecture**: Client-side SPA with static workout data. Dashboard component manages state for day/category/duration selection, Sidebar provides navigation, WorkoutTable renders exercises.

---

## Documentation Index

| File | Purpose |
|------|---------|
| **ARCHITECTURE.md** | Detailed component tree, state flow, system breakdown |
| **DEVELOPMENT.md** | Commands (dev/build/start), setup, local development |
| **DATA_STRUCTURE.md** | Zod schemas, tempo notation, data format reference |
| **WORKOUT_CUSTOMIZATION.md** | How to add/edit exercises, categories, durations |
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
  ├─ pages/Dashboard.tsx       # Main app (state management)
  ├─ components/
  │  ├─ Sidebar.tsx            # Day/category/duration navigation
  │  └─ WorkoutTable.tsx       # Exercise display
  └─ hooks/use-workouts.ts     # WORKOUTS_DATA (workout definitions)

shared/schema.ts               # TypeScript type definitions (Zod)

server/index.ts                # Express app (serves static assets)
```

---

## Key Concepts

**Static Data**: All workout data is hardcoded in `client/src/hooks/use-workouts.ts`. The backend is unused.

**State Management**: React hooks in Dashboard manage `selectedDay`, `selectedCategory`, `selectedDuration`.

**Data Structure**: Workouts are nested: Day → Category → Duration → Exercises. See **DATA_STRUCTURE.md** for schema details.

**Styling**: Tailwind CSS + shadcn/ui. Phase colors: Plyo (green), Strength (cyan), Aesthetic (yellow).

---

## Common Tasks

- **Add/edit exercises**: See **WORKOUT_CUSTOMIZATION.md**
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
