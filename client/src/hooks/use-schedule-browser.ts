import { useEffect, useState } from "react";

type BasketballRep =
  | { type: "makes"; makes: number }
  | { type: "setsPerHand"; sets: number; rightReps: number }
  | { type: "makesPerHand"; rightMakes: number };

interface BasketballDrill {
  id: string;
  category: "basketball";
  subCategory: "shooting" | "ballHandling" | "finishing";
  duration: "30m" | "1h" | "2h" | "3h";
  name: string;
  description: string;
  intensity: "low" | "medium" | "high";
  reps: BasketballRep;
}

interface DayWorkout {
  day: string;
  focus: string;
  categories: {
    [category: string]: {
      workouts: Array<{
        duration: string;
        drills: BasketballDrill[];
      }>;
    };
  };
}

interface WeekPlan {
  label: string;
  days: DayWorkout[];
  loadPhase?: 1 | 2 | 3 | 4 | "deload";
  isDeloadWeek?: boolean;
}

interface Manifest {
  startDate: string;
  weeks: string[];
}

interface ScheduleWeek {
  index: number;
  label: string;
  from: Date;
  to: Date;
  isPast: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  weekFile: string;
}

interface ScheduleBrowserState {
  weeks: ScheduleWeek[];
  weekPlans: Record<number, WeekPlan>;
  manifest: Manifest | null;
  currentWeekIndex: number;
  loading: boolean;
  error: string | null;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const OVERRIDE_KEY = "apex_current_week_override";

function getWeekDateRange(startDate: Date, weekIndex: number) {
  const from = new Date(startDate.getTime() + weekIndex * WEEK_MS);
  const to = new Date(from.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export function getOverriddenWeekIndex(): number | null {
  if (typeof window === "undefined") return null;
  const override = localStorage.getItem(OVERRIDE_KEY);
  return override ? parseInt(override, 10) : null;
}

export function setCurrentWeekOverride(weekIndex: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(OVERRIDE_KEY, weekIndex.toString());
}

export function clearCurrentWeekOverride(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OVERRIDE_KEY);
}

function formatDateRange(from: Date, to: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const fromStr = from.toLocaleDateString("en-US", options);
  const toStr = to.toLocaleDateString("en-US", options);
  return `${fromStr} – ${toStr}`;
}

export function useScheduleBrowser() {
  const [state, setState] = useState<ScheduleBrowserState>({
    weeks: [],
    weekPlans: {},
    manifest: null,
    currentWeekIndex: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch manifest
        const manifestRes = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/workouts/manifest.json`);
        if (!manifestRes.ok) throw new Error("Failed to fetch manifest");
        const manifest: Manifest = await manifestRes.json();

        // Calculate current week index (check for override first)
        const startDate = new Date(manifest.startDate);
        const override = getOverriddenWeekIndex();
        let currentWeekIndex: number;

        if (override !== null) {
          currentWeekIndex = override;
        } else {
          const now = new Date();
          const diffMs = now.getTime() - startDate.getTime();
          currentWeekIndex = Math.max(0, Math.floor(diffMs / WEEK_MS));
        }

        // Build week list with Past / Current / Upcoming grouping
        // Generate past, current, and upcoming weeks
        // Show up to 12 weeks total (4 past + current + 7 upcoming beyond rotation)
        const weeksByIndex = new Map<number, ScheduleWeek>();

        for (let slot = Math.max(0, currentWeekIndex - 4); slot < currentWeekIndex + 12; slot++) {
          const rotationIndex = slot % manifest.weeks.length;
          const rotationWeekFile = manifest.weeks[rotationIndex];
          const { from, to } = getWeekDateRange(startDate, slot);

          weeksByIndex.set(slot, {
            index: slot,
            label: `Week ${slot + 1}`,
            from,
            to,
            isPast: slot < currentWeekIndex,
            isCurrent: slot === currentWeekIndex,
            isUpcoming: slot > currentWeekIndex,
            weekFile: rotationWeekFile,
          });
        }

        const sortedWeeks = Array.from(weeksByIndex.values()).sort((a, b) => a.index - b.index);

        setState(prev => ({
          ...prev,
          weeks: sortedWeeks,
          manifest,
          currentWeekIndex,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : "Unknown error",
          loading: false,
        }));
      }
    };

    fetchData();
  }, []);

  const fetchWeekPlan = async (weekIndex: number): Promise<WeekPlan | null> => {
    if (!state.manifest) return null;

    // Check if already cached
    if (state.weekPlans[weekIndex]) {
      return state.weekPlans[weekIndex];
    }

    try {
      const planIndex = weekIndex % state.manifest.weeks.length;
      const weekFile = state.manifest.weeks[planIndex];

      const res = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/workouts/${weekFile}`);
      if (!res.ok) throw new Error(`Failed to fetch ${weekFile}`);
      const plan: WeekPlan = await res.json();

      setState(prev => ({
        ...prev,
        weekPlans: {
          ...prev.weekPlans,
          [weekIndex]: plan,
        },
      }));

      return plan;
    } catch (err) {
      console.error(`Failed to fetch week ${weekIndex}:`, err);
      return null;
    }
  };

  const setAsCurrentWeek = (weekIndex: number) => {
    setCurrentWeekOverride(weekIndex);
    window.location.reload();
  };

  return {
    ...state,
    fetchWeekPlan,
    setAsCurrentWeek,
  };
}
