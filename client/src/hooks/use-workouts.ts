import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type DayWorkout } from "@shared/schema";

// Fallback data reflecting Elite Sports Science programming
const FALLBACK_WORKOUTS: DayWorkout[] = [
  {
    id: "mon",
    day: "Monday",
    focus: "Linear/Glutes",
    exercises: [
      { id: "m1", phase: "Plyo", name: "DB Countermovement Jump", setsReps: "3x5", tempo: "3-0-X-1", rest: "90s" },
      { id: "m2", phase: "Strength", name: "Smith Squat", setsReps: "3x6-8", tempo: "3-0-X-1", rest: "120s" },
      { id: "m3", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
    ]
  },
  {
    id: "tue",
    day: "Tuesday",
    focus: "Lateral/Shoulders",
    exercises: [
      { id: "t1", phase: "Plyo", name: "Heiden Bounds", setsReps: "4x6/side", tempo: "X-0-X-1", rest: "90s" },
      { id: "t2", phase: "Strength", name: "Smith OHP", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
      { id: "t3", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
    ]
  },
  {
    id: "wed",
    day: "Wednesday",
    focus: "Vertical/Posterior",
    exercises: [
      { id: "w1", phase: "Plyo", name: "Broad Jumps", setsReps: "4x4", tempo: "X-0-X-1", rest: "90s" },
      { id: "w2", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "120s" },
      { id: "w3", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
    ]
  },
  {
    id: "thu",
    day: "Thursday",
    focus: "COD/Core",
    exercises: [
      { id: "th1", phase: "Plyo", name: "Med Ball Wall Tosses", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
      { id: "th2", phase: "Strength", name: "Smith Bent Over Row", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
      { id: "th3", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "3x20", tempo: "1-0-1-0", rest: "60s" }
    ]
  }
];

export function useWorkouts() {
  return useQuery({
    queryKey: [api.workouts.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.workouts.list.path, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch workouts");
        const data = await res.json();
        
        // Parse and return if data exists, otherwise throw to fallback
        const parsed = api.workouts.list.responses[200].parse(data);
        if (parsed.length === 0) throw new Error("Empty workouts");
        
        return parsed;
      } catch (err) {
        console.warn("[API] Falling back to local data:", err);
        return FALLBACK_WORKOUTS;
      }
    },
  });
}
