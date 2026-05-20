import { useEffect, useState } from "react";

interface Manifest {
  startDate: string;
  weeks: string[];
}

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

interface FlattenedWeekPlan {
  label: string;
  categories: {
    [category: string]: {
      workouts: Array<{
        duration: string;
        exercises: Exercise[];
      }>;
    };
  };
}

function getTodayName(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

function flattenWeekPlanForDay(weekPlan: WeekPlan, dayName: string): FlattenedWeekPlan {
  const dayData = weekPlan.days.find(d => d.day === dayName);
  if (!dayData) {
    return { label: weekPlan.label, categories: {} };
  }
  return { label: weekPlan.label, categories: dayData.categories };
}

export function useWeeklyRotation(overrideWeekIndex?: number) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [plan, setPlan] = useState<FlattenedWeekPlan | null>(null);
  const [fullWeekPlan, setFullWeekPlan] = useState<WeekPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekIndex, setWeekIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch manifest
        const manifestRes = await fetch("/workouts/manifest.json");
        if (!manifestRes.ok) throw new Error("Failed to fetch manifest");
        const manifestData: Manifest = await manifestRes.json();
        setManifest(manifestData);

        // Calculate current week index if not overridden
        let targetWeekIndex = overrideWeekIndex;
        if (targetWeekIndex === undefined) {
          const start = new Date(manifestData.startDate);
          const now = new Date();
          const diffMs = now.getTime() - start.getTime();
          const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
          targetWeekIndex = Math.max(0, diffWeeks);
        }

        setWeekIndex(targetWeekIndex);

        // Get the plan file for this week
        const planIndex = targetWeekIndex % manifestData.weeks.length;
        const weekFile = manifestData.weeks[planIndex];

        // Fetch the week plan
        const planRes = await fetch(`/workouts/${weekFile}`);
        if (!planRes.ok) throw new Error(`Failed to fetch ${weekFile}`);
        const weekPlanData: WeekPlan = await planRes.json();
        setFullWeekPlan(weekPlanData);

        // Extract today's data
        const todayName = getTodayName();
        const flattenedPlan = flattenWeekPlanForDay(weekPlanData, todayName);
        setPlan(flattenedPlan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setPlan(null);
        setFullWeekPlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [overrideWeekIndex]);

  return {
    plan,
    fullWeekPlan,
    weekIndex,
    totalWeeks: manifest?.weeks.length ?? 0,
    loading,
    error,
  };
}
