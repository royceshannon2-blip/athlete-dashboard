# Mobile Optimization & Timer Chime Update

This document covers the mobile-specific UI/UX improvements and timer enhancements implemented to ensure the weightlifting features work comfortably on a phone held in one hand.

---

## Overview

All interactive elements now meet the **44×44px minimum tap size** requirement (Apple HIG / WCAG 2.5.5). The rest timer now chimes three times on completion, and several UI components have been redesigned with mobile-first responsive layouts.

---

## Changes by Component

### 1. Triple Chime on Timer Completion

**File**: `client/src/hooks/use-rest-timer.ts`

When the rest timer reaches zero (`isFinished` becomes `true`), a Web Audio oscillator fires three chimes in rapid succession:

- **Timing**: t=0s, t=0.35s, t=0.70s from trigger
- **Total duration**: ~0.9s
- **Frequency**: 440 Hz (A note)
- **Volume**: 0.6 initial gain, exponential ramp to 0.001 over 0.2s per chime

The chimes play only once per timer completion (guarded by `didPlayRef`). No other logic changes — the hook behavior is otherwise identical.

---

### 2. Set Button Layout (Mobile 2-Column Grid)

**File**: `client/src/components/workout/WorkoutTable.tsx` → `ExerciseCard`

Set buttons now render in a responsive 2-column grid on mobile, expanding to a single row on wider screens:

- **Button sizing**: `min-h-[44px] px-4 text-sm flex-1 basis-[calc(50%-4px)]`
- **Layout**: `flex flex-wrap gap-2` container
- **Completed state**: solid phase-color background, white text, reduced opacity, no pointer events
- **Active state**: semi-transparent phase-color border with phase-color text

On desktop (`sm` and above), buttons naturally expand to fit available space without explicit constraint.

---

### 3. SetLogPrompt Mobile Drawer

**File**: `client/src/components/SetLogPrompt.tsx`

The weight logging drawer now optimizes for a phone keyboard-open viewport (~350px tall available):

- **Snap points**: `[0.5, 0.92]` — half-screen default, expandable to near-full when keyboard opens
- **Weight input**: `text-4xl font-bold text-center` with `inputMode="decimal"` — large, tappable, ≥16px font (no browser zoom)
- **Unit toggle**: two full-width buttons stacked horizontally, each `min-h-[44px] flex-1`
- **Primary action** ("Log it"): `w-full min-h-[56px] text-base font-semibold` — full width, prominent
- **Secondary action** ("Skip"): `w-full min-h-[44px] text-sm` — full width, below primary, reduced visual weight
- **Auto-focus**: weight input receives `autoFocus` so numeric keyboard opens immediately on drawer open

---

### 4. RestTimer Mobile Layout

**File**: `client/src/components/RestTimer.tsx`

The fixed bottom timer bar now respects safe areas and groups controls responsively:

- **Total bar height**: `min-h-[72px]` — tall enough for comfortable tap targets
- **Safe area**: `paddingBottom: 'max(8px, env(safe-area-inset-bottom))'` clears iPhone home indicator
- **Layout** (mobile):
  - Progress bar (thin strip): order-first, full width
  - Time display (MM:SS): centered, order-1
  - Controls (buttons): order-2, grouped into clusters
- **Control grouping** (on `sm` screens and narrower):
  - Left cluster: −30s, +30s (nudge)
  - Right cluster: Play/Pause, Reset
  - Settings gear: far right, always visible
- **Desktop layout** (`sm` and above): controls expand horizontally with flex-row
- **All buttons**: `min-h-[44px] min-w-[44px]` for tap safety
- **Play button pulse**: animates (`animate-pulse`) when timer is idle (waiting for user to start); stops once running or finished

**Visibility**: Timer no longer hides when idle. After logging/skipping a set, the timer bar appears (opacity-0 → opacity-100 transition) and waits for the user to press Play.

---

### 5. ProgressionDashboard Mobile Bottom Sheet

**File**: `client/src/components/ProgressionDashboard.tsx` + `ExerciseProgressChart.tsx`

The progression panel now renders as a bottom sheet on mobile, retaining the side panel on desktop:

**Mobile** (`< sm`):
- Uses Vaul Drawer with `snapPoints={[0.92]}` (near full-screen)
- `ExerciseSelector`: full-width Select, `min-h-[44px]`
- `ExerciseProgressChart`: `height={220}` (reduced from desktop 300px) to leave room for table
- Session history table: `overflow-x-auto` for horizontal scroll; columns: Date, Sets, Max, Volume (all four visible)
- Footer buttons ("Clear Data" and "Export CSV"): stack vertically, each `w-full min-h-[44px]`; "Clear Data" remains visually distinct (destructive styling)

**Desktop** (`sm` and above):
- Fixed side panel (existing behavior)
- Chart height remains 256px (h-64)
- Table does not require horizontal scroll

---

### 6. TimerSettings Mobile Drawer

**File**: `client/src/components/TimerSettings.tsx`

Standardized as a Vaul Drawer with mobile-friendly controls:

- **Drawer snap**: `snapPoints={[0.5]}` — half-screen, scrollable if needed
- **Duration input**: `inputMode="numeric"`, `min-h-[44px]`, full-width, with label "Rest duration (seconds)" above
- **Sound toggle**: large checkbox (`w-6 h-6`), `min-h-[44px]` clickable area
- **Unit toggle**: same button pair as SetLogPrompt (lbs / kg), each `min-h-[44px] flex-1`
- **Save button**: `w-full min-h-[56px]` at bottom, primary action, closes drawer on tap
- **Auto-start toggle removed**: The UI no longer surfaces the auto-start preference (concept deprecated)

---

### 7. Dashboard Header Buttons

**Files**: `DashboardButton.tsx`, `ScheduleBrowserButton.tsx`

Both header buttons now meet the 44×44px minimum tap target:

- **Size**: `min-h-[44px] min-w-[44px]`
- **Padding**: `px-2` on mobile, `sm:px-4` on desktop
- **Layout**: `flex items-center justify-center` for proper alignment
- **Text**: hidden on mobile (`hidden sm:inline`), visible on desktop

---

### 8. Timer Auto-Start Removed

**Files**: `Dashboard.tsx`, (UI only — preference removed from `TimerSettings.tsx`)

The timer **never auto-starts** after logging or skipping a set:

- `handleLog()` and `handleSkip()`: call `restTimer.reset()` instead of checking `autoStart` preference
- Timer resets to full duration and becomes visible, but remains **paused**
- User must explicitly press Play to begin countdown
- Play button pulses gently when idle to signal it's ready (pulse stops once timer runs)

The `autoStart` preference persists in `WeightPrefs` interface (defaults to `false`) to avoid breaking localStorage, but is no longer surfaced in the UI.

---

## Verification Checklist

Before shipping, verify on a real device or browser devtools at **390×844** (iPhone 14 viewport):

- [ ] All set Done buttons are tappable without zooming; completed sets clearly distinguished
- [ ] Tapping a Done button opens SetLogPrompt; numeric keyboard appears immediately
- [ ] Weight input text is ≥16px (no browser zoom triggered)
- [ ] "Log it" is reachable above the keyboard without scrolling
- [ ] Timer appears after logging/skipping but does not start automatically
- [ ] Play button pulses gently when timer is idle/waiting; pulse stops once running
- [ ] Timer bar does not cover the last exercise card; safe area respected on iPhone
- [ ] All five timer controls are tappable; +30s/−30s work correctly
- [ ] Timer completes → three beeps fire in sequence (~0.9s total)
- [ ] ProgressionDashboard opens as bottom sheet on mobile; chart and table both visible
- [ ] Export CSV downloads correctly on mobile Safari (uses `<a download>`)
- [ ] Header button group does not overflow on 390px width
- [ ] No horizontal page scroll introduced anywhere

---

## Testing Mobile Audio

The triple-chime Web Audio API requires user interaction to work in browsers. Test on a real device or with audio context granted in devtools:

1. Navigate to the app
2. Start a weightlifting workout
3. Log a set
4. Start the timer
5. Wait for it to complete → listen for three beeps (~0.9s apart)

If sound doesn't play, check:
- Sound preference is enabled in TimerSettings
- Browser/tab audio is not muted
- Web Audio Context is initialized (try in browser console: `new AudioContext()`)

---

## Design Rationale

**Touch Targets**: The 44×44px minimum ensures users can tap buttons accurately on small screens without zooming or repeated attempts.

**Drawer Snap Points**: Mobile apps use half-screen default so the drawer doesn't block 100% of workout content; users can expand to 92% when the keyboard opens.

**Safe Area Inset**: iPhones have notches/home indicators at screen edges; the safe area padding ensures UI doesn't overlap them.

**Timer Visibility**: Showing the timer but keeping it paused puts the user in control. The gentle Play button pulse draws attention without being intrusive.

**No Auto-Start**: Gives users explicit control over when rest begins. They may log multiple sets, review form, adjust weight, etc., before starting rest.

---

## Related Files

- **ARCHITECTURE.md** — Component hierarchy and state flow (includes RestTimer, SetLogPrompt, ProgressionDashboard)
- **WORKOUT_CUSTOMIZATION.md** — How to add/edit exercises (no changes)
- **DEVELOPMENT.md** — Build and dev commands
