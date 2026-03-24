import { useQuery } from "@tanstack/react-query";
import { type DayWorkout } from "@shared/schema";

// Static workout data — used directly so this app works as a pure static site
// (GitHub Pages, no backend required).
const WORKOUTS: DayWorkout[] = [
  {
    id: "mon",
    day: "Monday",
    focus: "Linear/Glutes",
    exercises: [
      {
        id: "mon-1", phase: "Plyo", name: "DB Countermovement Jump",
        setsReps: "3x5", tempo: "3-0-X-1", rest: "90s",
        note: "Hold DBs at sides. Dip into a quarter squat, then explode upward with full hip extension. Land softly on the balls of your feet, immediately absorb force through your knees and hips."
      },
      { id: "mon-2", phase: "Strength", name: "Smith Squat", setsReps: "3x6-8", tempo: "3-0-X-1", rest: "120s" },
      { id: "mon-3", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
    ]
  },
  {
    id: "tue",
    day: "Tuesday",
    focus: "Lateral/Shoulders",
    exercises: [
      {
        id: "tue-1", phase: "Plyo", name: "Heiden Bounds",
        setsReps: "4x6/side", tempo: "X-0-X-1", rest: "90s",
        note: "Single-leg lateral bounds mimicking a speed skater. Push off aggressively, stick the landing on one leg for 1 second. Develops frontal-plane power and ankle/hip stability."
      },
      { id: "tue-2", phase: "Strength", name: "Smith OHP", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
      { id: "tue-3", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
    ]
  },
  {
    id: "wed",
    day: "Wednesday",
    focus: "Vertical/Posterior",
    exercises: [
      {
        id: "wed-1", phase: "Plyo", name: "Broad Jumps",
        setsReps: "4x4", tempo: "X-0-X-1", rest: "90s",
        note: "Max horizontal distance per rep. Swing arms aggressively, drive hips forward. Land in athletic stance, absorb immediately, then reset. Trains horizontal power transfer."
      },
      { id: "wed-2", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "120s" },
      { id: "wed-3", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
    ]
  },
  {
    id: "thu",
    day: "Thursday",
    focus: "COD/Core",
    exercises: [
      {
        id: "thu-1", phase: "Plyo", name: "Med Ball Wall Tosses",
        setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s",
        note: "Rotational throw from hip-level. Drive power from the ground through hips, not arms. Catch the rebound and immediately re-throw. Builds rotational rate of force development."
      },
      { id: "thu-2", phase: "Strength", name: "Smith Bent Over Row", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
      { id: "thu-3", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "3x20", tempo: "1-0-1-0", rest: "60s" }
    ]
  },
  {
    id: "sat",
    day: "Saturday",
    focus: "Back Squat Depth / Elastic Power",
    exercises: [
      {
        id: "sat-1", phase: "Plyo", name: "Depth Jumps",
        setsReps: "4x5", tempo: "X-0-X-0", rest: "120s",
        note: "Step (do NOT jump) off a box 12–18\". The instant your feet hit the floor, rebound immediately with max vertical effort — ground contact time should be under 0.25s. This trains the stretch-shortening cycle (SSC) and builds elite elastic strength. The floor is a springboard, not a landing pad."
      },
      {
        id: "sat-2", phase: "Plyo", name: "Hurdle Hops",
        setsReps: "4x6", tempo: "X-0-X-0", rest: "90s",
        note: "Use cones or plates stacked on a barbell sleeve as hurdle subs. Focus on minimal ground contact between hops — think of your ankles as stiff springs. Drives tendon stiffness in the Achilles and patellar tendon, critical for quick take-offs and reactive running speed. Knees stay soft, hips drive forward."
      },
      {
        id: "sat-3", phase: "Strength", name: "Smith Machine Back Squat",
        setsReps: "4x5", tempo: "3-1-X-1", rest: "150s",
        note: "Elevate heels on small plates to improve depth and quad drive. Hit depth — hips must break parallel. Pause 1 second at the bottom to eliminate elastic rebound and build raw strength."
      },
      {
        id: "sat-4", phase: "Aesthetic", name: "Leg Press (High Foot Position)",
        setsReps: "3x12", tempo: "2-0-1-1", rest: "75s",
        note: "Feet high on platform to target glutes and hamstrings as accessories to the squat pattern."
      },
      {
        id: "sat-5", phase: "Aesthetic", name: "DB Walking Lunges",
        setsReps: "3x10/leg", tempo: "2-0-1-0", rest: "60s",
        note: "Slow eccentric, full knee drop to just above floor. Drives single-leg strength and glute hypertrophy."
      },
      {
        id: "sat-6", phase: "Aesthetic", name: "Cable Seated Leg Curl (or DB Hamstring Curl on Bench)",
        setsReps: "3x15", tempo: "2-0-1-1", rest: "60s",
        note: "Use the cable low-pulley with an ankle cuff if no leg curl machine. Slow eccentric to protect and develop hamstring tissue."
      }
    ]
  }
];

export function useWorkouts() {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: () => WORKOUTS,
    staleTime: Infinity,
  });
}
