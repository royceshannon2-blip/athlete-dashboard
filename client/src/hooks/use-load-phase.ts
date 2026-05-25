import { useEffect, useState } from "react";
import { useScheduleBrowser } from "./use-schedule-browser";

export function useLoadPhase() {
  const { currentWeekIndex, weekPlans, fetchWeekPlan } = useScheduleBrowser();
  const [loadPhase, setLoadPhase] = useState<1 | 2 | 3 | 4 | "deload" | null>(null);

  useEffect(() => {
    const currentPlan = weekPlans[currentWeekIndex];

    if (currentPlan?.loadPhase) {
      setLoadPhase(currentPlan.loadPhase);
    } else {
      // Fetch current week plan if not cached
      fetchWeekPlan(currentWeekIndex).then(plan => {
        if (plan?.loadPhase) {
          setLoadPhase(plan.loadPhase);
        }
      });
    }
  }, [currentWeekIndex, weekPlans, fetchWeekPlan]);

  return loadPhase;
}
