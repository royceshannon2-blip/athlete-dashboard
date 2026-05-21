# TESTING.md

Testing infrastructure for APEX: unit tests (Vitest) and E2E tests (Playwright).

---

## Quick Start

```bash
npm run test:unit          # All unit tests — fast, no browser
npm run test:unit:watch    # Watch mode (re-runs on file changes)
npm run test:e2e           # Playwright E2E (starts dev server automatically)
npm run test               # Unit + E2E combined
```

---

## Stack

| Layer | Tool | Why |
|---|---|---|
| Unit + integration | Vitest + React Testing Library | Same transform pipeline as Vite, fast |
| Component render | `@testing-library/react` + `happy-dom` | Lightweight DOM, Node 26 compatible |
| localStorage | IIFE mock in `test-setup.ts` | Node 26 experimental localStorage conflicts with DOM environments |
| E2E cross-browser | Playwright | Free WebKit (Safari engine), iPhone device emulation |
| Assertions | Vitest `expect` + `@testing-library/jest-dom` | Standard DOM matchers |

---

## Unit Tests

### Configuration

`vitest.config.ts` — at the project root. Key settings:

- `environment: 'happy-dom'` — DOM environment compatible with Node 26
- `setupFiles: ['./client/src/test-setup.ts']` — loads `@testing-library/jest-dom` matchers + localStorage polyfill
- `include: ['client/src/**/*.test.{ts,tsx}']` — picks up only unit test files (excludes `e2e/`)

**Note on Node 26 + localStorage**: Node 26 adds an experimental `localStorage` global that is `undefined` without `--localstorage-file`. This property is non-configurable, blocking DOM environments from overriding it. The `test-setup.ts` provides a reliable in-memory mock via `Object.defineProperty`.

### File Layout

Test files live alongside the source files they test:

```
client/src/
  utils/
    parse-sets-reps.ts
    parse-sets-reps.test.ts
    weight-convert.ts
    weight-convert.test.ts
  hooks/
    use-weight-log.ts
    use-weight-log.test.ts
    use-rest-timer.ts
    use-rest-timer.test.ts
  components/
    SetLogPrompt.tsx
    SetLogPrompt.test.tsx
    RestTimer.tsx
    RestTimer.test.tsx
    ProgressionDashboard.tsx
    ProgressionDashboard.test.tsx
```

### Running a Single File

```bash
npx vitest run --config vitest.config.ts client/src/hooks/use-weight-log.test.ts
```

### Writing New Unit Tests

1. Create `[filename].test.ts(x)` next to the source file.
2. Add `// @vitest-environment happy-dom` if your test needs `localStorage`, `window`, or React rendering.
3. Import test utilities:
   ```typescript
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   ```
4. For localStorage tests, clear in `beforeEach`:
   ```typescript
   beforeEach(() => localStorage.clear());
   ```
5. For hook tests, use `renderHook` + `act`:
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   const { result } = renderHook(() => useMyHook());
   act(() => result.current.someAction());
   ```

### Mocking External Components

Components that use vaul `Drawer` need a mock to render in test environments:

```typescript
vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({ open, children }: any) => open ? <div>{children}</div> : null,
  DrawerContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DrawerHeader: ({ children }: any) => <div>{children}</div>,
  DrawerTitle: ({ children }: any) => <h2>{children}</h2>,
}));
```

---

## E2E Tests (Playwright)

### Configuration

`playwright.config.ts` — at the project root. Browser matrix:

| Project | Device |
|---|---|
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `webkit` | Desktop Safari (WebKit engine) |
| `iphone-14` | iPhone 14 portrait |
| `iphone-14-landscape` | iPhone 14 landscape |

The `webServer` config auto-starts `npm run dev` for local runs. In CI, the server is started manually.

### File Layout

```
e2e/
  weight-logging.spec.ts    — Full log flow: prompt, save, pre-fill, skip, reload
  timer.spec.ts             — Rest timer: visible after log, pause, reset, +30s
  dashboard.spec.ts         — Progression dashboard: seeded data, chart, table, clear
  schedule-browser.spec.ts  — Schedule panel: open/close, week selection, day tabs
  mobile-ui.spec.ts         — iPhone 14: tap targets, viewport, decimal input
```

### Running E2E Tests

```bash
# All browsers
npm run test:e2e

# Specific browser
npx playwright test --project=chromium

# Specific file
npx playwright test e2e/weight-logging.spec.ts

# Debug mode (headed)
npx playwright test --headed --project=chromium

# Interactive UI
npm run test:e2e:ui
```

### Writing New E2E Tests

Use `data-testid` attributes already in place:

| Element | Attribute |
|---|---|
| RestTimer container | `data-testid="rest-timer"` |
| Timer display | `data-testid="timer-display"` |
| Timer running indicator | `data-testid="timer-running-indicator"` |
| Settings button | `data-testid="timer-settings-button"` |
| SetLogPrompt content | `data-testid="set-log-prompt"` |
| Schedule panel | `data-testid="schedule-panel"` |
| Day tab row | `data-testid="day-tab-row"` |
| Current week | `data-testid="current-week-row"` |
| Past week | `data-testid="past-week-row"` |
| Upcoming week | `data-testid="upcoming-week-row"` |
| Main workout view | `data-testid="main-workout-view"` |
| Exercise list | `data-testid="exercise-list"` |
| Category content | `data-testid="weightlifting-content"` |
| Progression chart | `data-testid="progression-chart"` |
| Session row | `data-testid="session-row"` |

To seed localStorage data in E2E tests without going through the UI:

```typescript
await page.evaluate(() => {
  const entry = { id: 'log-1', exerciseId: 'ex-squat', ... };
  localStorage.setItem(`wt:log:ex-squat:2026-05-01:1`, JSON.stringify(entry));
  localStorage.setItem('wt:index', JSON.stringify([`wt:log:ex-squat:2026-05-01:1`]));
});
```

---

## CI

`.github/workflows/test.yml` runs on every push and pull request to `main`:

- **unit job**: `npm run test:unit` on ubuntu-latest with Node 20
- **e2e job**: builds the app, runs `playwright test`, uploads traces on failure

Playwright traces are stored as artifacts on failure for remote debugging.

---

## Key Design Decisions

### Why happy-dom over jsdom?

jsdom can't override Node 26's native (but undefined) `localStorage` property. happy-dom avoids this conflict. The `test-setup.ts` localStorage mock is a belt-and-suspenders guard.

### Why not use Playwright for unit tests?

Unit tests run in milliseconds and don't need a browser. Playwright is reserved for cross-browser validation, mobile viewport testing, and the full weight-logging stack.

### Why seed data via `page.evaluate()` in E2E?

It's faster and more reliable than navigating through the UI for setup. The actual weight-logging UI is still tested in `weight-logging.spec.ts`.

### Why `inputmode="decimal"` on the weight input?

On iOS, `<input type="number">` shows a number pad **without** a decimal point on some versions. `inputmode="decimal"` forces the decimal keyboard. The E2E and unit tests enforce this attribute is present.
