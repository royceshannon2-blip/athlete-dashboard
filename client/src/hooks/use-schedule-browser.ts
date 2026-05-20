import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  phase: string;
  name: string;
  setsReps: string;
  tempo: string;
  rest: string;
  note?: string;
}

interface DayWorkout {
  day: string;
  focus: string;
  categories: {
    [category: string]: {
      workouts: Array<{
        duration: string;
        exercises: Exercise[];
      }>;
    };
  };
}

interface WeekPlan {
  label: string;
  days: DayWorkout[];
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

function getWeekDateRange(startDate: Date, weekIndex: number) {
  const from = new Date(startDate.getTime() + weekIndex * WEEK_MS);
  const to = new Date(from.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { from, to };
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
        const manifestRes = await fetch("/workouts/manifest.json");
        if (!manifestRes.ok) throw new Error("Failed to fetch manifest");
        const manifest: Manifest = await manifestRes.json();

        // Calculate current week index
        const startDate = new Date(manifest.startDate);
        const now = new Date();
        const diffMs = now.getTime() - startDate.getTime();
        const currentWeekIndex = Math.max(0, Math.floor(diffMs / WEEK_MS));

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

      const res = await fetch(`/workouts/${weekFile}`);
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

  return {
    ...state,
    fetchWeekPlan,
  };
}
