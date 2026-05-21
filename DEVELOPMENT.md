# Development

How to set up, run, and build APEX locally.

---

## Prerequisites

- **Node.js**: v18+ (includes npm)
- **Git**: For version control

---

## Setup

```bash
# Clone the repository
git clone https://github.com/your-username/athlete-dashboard.git
cd athlete-dashboard

# Install dependencies
npm install
```

---

## Commands

### Development

```bash
npm run dev
```

- Starts dev server on `http://localhost:5000`
- Express + Vite HMR enabled
- Auto-reloads on file changes
- Watches client and server code

### Production Build

```bash
npm run build
```

- Compiles TypeScript
- Builds React app with Vite
- Outputs to `dist/` directory
- Optimizes assets for production
- Handles GitHub Pages base path if `GITHUB_PAGES=true` env var is set

### Run Production Build Locally

```bash
npm run build
npm run start
```

- Builds the app first
- Runs the built version on `http://localhost:5000`
- Useful for testing production build locally

### TypeScript Type Check

```bash
npm run check
```

- Runs `tsc` (TypeScript compiler)
- Checks for type errors without building
- Useful for quick validation before commit

---

## Project Structure

```
athlete-dashboard/
├─ client/                # Frontend React app
│  ├─ src/
│  │  ├─ main.tsx
│  │  ├─ App.tsx
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ lib/
│  └─ index.html
├─ server/                # Express backend
│  ├─ index.ts
│  ├─ routes.ts
│  └─ storage.ts
├─ shared/                # Shared code
│  ├─ schema.ts           # TypeScript types (Zod)
│  └─ routes.ts
├─ script/
│  └─ build.ts            # Build script
├─ vite.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

---

## Common Development Tasks

### Adding a New Component

1. Create file in `client/src/components/` (or subdirectory)
2. Export from component's index if using barrel exports
3. Import in parent component
4. Use TypeScript for type safety

Example:
```typescript
// client/src/components/NewComponent.tsx
export function NewComponent() {
  return <div>Hello</div>
}

// In parent:
import { NewComponent } from "@/components/NewComponent"
```

### Adding a New Hook

1. Create file in `client/src/hooks/`
2. Export function starting with `use`
3. Use in components with `import`

Example:
```typescript
// client/src/hooks/useMyHook.ts
export function useMyHook() {
  return "data"
}
```

### Modifying Workout Data (Dashboard)

1. Open `client/src/hooks/use-workouts.ts`
2. Find `WORKOUTS_DATA` object
3. Edit exercise objects, add/remove days, etc.
4. Dev server auto-reloads

### Adding Weekly Rotation Plans

1. Create new JSON file: `client/public/workouts/week-NNN.json`
2. Follow week structure from existing week files
3. Update `client/public/workouts/manifest.json` to list new week
4. Access via "Schedule" button in Dashboard

See **WORKOUT_CUSTOMIZATION.md** for detailed editing guide.

### Changing Styling

**Tailwind CSS**:
- Edit `tailwind.config.ts` for theme changes
- Use utility classes directly in JSX

**Component Styles**:
- Most styling is inline Tailwind classes
- Colors are defined in component files (see `WorkoutTable.tsx` for phase colors)

**Dark Mode**:
- Currently always dark theme
- Theme toggle would require adding state and CSS variables

---

## Debugging

### Browser DevTools
- Right-click → Inspect to open DevTools
- Console tab shows errors
- React DevTools extension useful for component inspection

### TypeScript Errors
```bash
npm run check
```
Shows type errors before building.

### Server Logs
When running `npm run dev`, Express logs appear in the terminal:
```
10:37:01 PM [express] serving on port 5000
```

### Network Requests
Use Browser DevTools Network tab to inspect API calls (though client doesn't call backend in current setup).

---

## Git Workflow

```bash
# Create a branch for your feature
git checkout -b feature/my-feature

# Make changes, test locally with npm run dev

# Check types
npm run check

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
```

---

## Performance Tips

- Use React DevTools Profiler to identify slow renders
- `@tanstack/react-query` DevTools available if installed
- Vite's dev server is fast; full rebuilds rarely needed
- Production builds use code splitting and minification automatically

---

## Troubleshooting

### Port 5000 Already in Use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port by modifying server/index.ts
```

### Module Not Found
- Ensure path aliases in `vite.config.ts` match actual paths
- Check import paths use correct casing
- Run `npm install` if dependencies are missing

### TypeScript Errors
```bash
npm run check
```
Shows detailed type errors with line numbers.

### Build Fails
- Check `npm run check` for TypeScript errors first
- Verify all imports resolve
- Check `vite.config.ts` for configuration issues

---

## Environment Variables

For GitHub Pages deployment:
```bash
GITHUB_PAGES=true REPO_NAME=athlete-dashboard npm run build
```

This sets the Vite base path correctly for subdirectory hosting.

For local development, no env vars needed (defaults to `/`).

---

## Testing

See **TESTING.md** for the full guide. Quick reference:

```bash
npm run test:unit          # Run all Vitest unit tests (fast, no browser)
npm run test:unit:watch    # Watch mode
npm run test:e2e           # Run Playwright E2E tests (requires dev server or build)
npm run test               # Unit + E2E
```

Unit tests live alongside source files as `.test.ts(x)` colocated files.
E2E tests live in `e2e/`.

---

## Production Deployment

See **DEPLOYMENT.md** for GitHub Pages setup and deployment instructions.
