import { useQuery } from "@tanstack/react-query";
import { type WorkoutsData } from "@shared/schema";

// Static workout data — used directly so this app works as a pure static site
// (GitHub Pages, no backend required).
const WORKOUTS_DATA: WorkoutsData = {
  categories: ["basketball", "weightlifting", "jumping"],
  durations: ["30m", "1h", "2h", "3h"],
  workouts: [
    {
      day: "Monday",
      focus: "Linear/Glutes",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "mon-wl-30-1", phase: "Strength", name: "Smith Squat", setsReps: "3x6-8", tempo: "3-0-X-1", rest: "120s" },
                { id: "mon-wl-30-2", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "mon-wl-1h-1", phase: "Plyo", name: "DB Countermovement Jump", setsReps: "3x5", tempo: "3-0-X-1", rest: "90s", note: "Hold DBs at sides. Dip into a quarter squat, then explode upward with full hip extension." },
                { id: "mon-wl-1h-2", phase: "Strength", name: "Smith Squat", setsReps: "3x6-8", tempo: "3-0-X-1", rest: "120s" },
                { id: "mon-wl-1h-3", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "mon-wl-2h-1", phase: "Plyo", name: "DB Countermovement Jump", setsReps: "3x5", tempo: "3-0-X-1", rest: "90s" },
                { id: "mon-wl-2h-2", phase: "Strength", name: "Smith Squat", setsReps: "4x6-8", tempo: "3-0-X-1", rest: "120s" },
                { id: "mon-wl-2h-3", phase: "Strength", name: "Leg Press", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "mon-wl-2h-4", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" },
                { id: "mon-wl-2h-5", phase: "Aesthetic", name: "Leg Curl Machine", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "mon-wl-3h-1", phase: "Plyo", name: "DB Countermovement Jump", setsReps: "3x5", tempo: "3-0-X-1", rest: "90s" },
                { id: "mon-wl-3h-2", phase: "Strength", name: "Smith Squat", setsReps: "5x6-8", tempo: "3-0-X-1", rest: "120s" },
                { id: "mon-wl-3h-3", phase: "Strength", name: "Leg Press", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "mon-wl-3h-4", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "90s" },
                { id: "mon-wl-3h-5", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "4x12-15", tempo: "2-0-1-1", rest: "60s" },
                { id: "mon-wl-3h-6", phase: "Aesthetic", name: "Leg Curl Machine", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "mon-wl-3h-7", phase: "Aesthetic", name: "Leg Extension", setsReps: "3x15", tempo: "2-0-1-0", rest: "45s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "mon-bb-30-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-bb-30-2", phase: "Strength", name: "Lateral Shuffles", setsReps: "3x30s", tempo: "1-0-1-0", rest: "30s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "mon-bb-1h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-bb-1h-2", phase: "Strength", name: "Lateral Shuffles", setsReps: "4x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "mon-bb-1h-3", phase: "Strength", name: "Defensive Slide", setsReps: "3x20m", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "mon-bb-2h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-bb-2h-2", phase: "Plyo", name: "Broad Jump", setsReps: "4x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "mon-bb-2h-3", phase: "Strength", name: "Lateral Shuffles", setsReps: "4x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "mon-bb-2h-4", phase: "Strength", name: "Defensive Slide", setsReps: "4x20m", tempo: "1-0-1-0", rest: "45s" },
                { id: "mon-bb-2h-5", phase: "Aesthetic", name: "Core Stability", setsReps: "3x30s", tempo: "1-0-1-0", rest: "30s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "mon-bb-3h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-bb-3h-2", phase: "Plyo", name: "Broad Jump", setsReps: "5x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "mon-bb-3h-3", phase: "Strength", name: "Lateral Shuffles", setsReps: "5x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "mon-bb-3h-4", phase: "Strength", name: "Defensive Slide", setsReps: "5x20m", tempo: "1-0-1-0", rest: "45s" },
                { id: "mon-bb-3h-5", phase: "Strength", name: "Agility Cone Drills", setsReps: "3x5", tempo: "X-0-X-1", rest: "60s" },
                { id: "mon-bb-3h-6", phase: "Aesthetic", name: "Core Stability", setsReps: "4x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "mon-bb-3h-7", phase: "Aesthetic", name: "Cardiovascular Conditioning", setsReps: "2x3min", tempo: "1-0-1-0", rest: "90s" }
              ]
            }
          ]
        },
        {
          category: "jumping",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "mon-jp-30-1", phase: "Plyo", name: "Countermovement Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-jp-30-2", phase: "Plyo", name: "Jump Rope", setsReps: "3x1min", tempo: "X-0-X-1", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "mon-jp-1h-1", phase: "Plyo", name: "Countermovement Jump", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-jp-1h-2", phase: "Plyo", name: "Jump Rope", setsReps: "4x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "mon-jp-1h-3", phase: "Plyo", name: "Broad Jump", setsReps: "3x4", tempo: "X-0-X-1", rest: "2min" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "mon-jp-2h-1", phase: "Plyo", name: "Countermovement Jump", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-jp-2h-2", phase: "Plyo", name: "Jump Rope", setsReps: "5x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "mon-jp-2h-3", phase: "Plyo", name: "Broad Jump", setsReps: "4x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "mon-jp-2h-4", phase: "Plyo", name: "Depth Jump", setsReps: "3x5", tempo: "X-0-X-0", rest: "2min" },
                { id: "mon-jp-2h-5", phase: "Strength", name: "Bilateral Squat", setsReps: "3x6-8", tempo: "3-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "mon-jp-3h-1", phase: "Plyo", name: "Countermovement Jump", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-jp-3h-2", phase: "Plyo", name: "Jump Rope", setsReps: "6x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "mon-jp-3h-3", phase: "Plyo", name: "Broad Jump", setsReps: "5x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "mon-jp-3h-4", phase: "Plyo", name: "Depth Jump", setsReps: "4x5", tempo: "X-0-X-0", rest: "2min" },
                { id: "mon-jp-3h-5", phase: "Plyo", name: "Single-Leg Hop", setsReps: "3x6/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "mon-jp-3h-6", phase: "Strength", name: "Bilateral Squat", setsReps: "4x6-8", tempo: "3-0-X-1", rest: "90s" },
                { id: "mon-jp-3h-7", phase: "Aesthetic", name: "Calf Raise", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            }
          ]
        }
      ]
    },
    {
      day: "Tuesday",
      focus: "Lateral/Shoulders",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "tue-wl-30-1", phase: "Strength", name: "Smith OHP", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "tue-wl-30-2", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "tue-wl-1h-1", phase: "Plyo", name: "Med Ball Chest Pass", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-wl-1h-2", phase: "Strength", name: "Smith OHP", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "tue-wl-1h-3", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "tue-wl-2h-1", phase: "Plyo", name: "Med Ball Chest Pass", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-wl-2h-2", phase: "Strength", name: "Smith OHP", setsReps: "4x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "tue-wl-2h-3", phase: "Strength", name: "DB Floor Press", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "tue-wl-2h-4", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "tue-wl-2h-5", phase: "Aesthetic", name: "DB Reverse Flyes", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "tue-wl-3h-1", phase: "Plyo", name: "Med Ball Chest Pass", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-wl-3h-2", phase: "Strength", name: "Smith OHP", setsReps: "5x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "tue-wl-3h-3", phase: "Strength", name: "DB Floor Press", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "tue-wl-3h-4", phase: "Strength", name: "Incline DB Press", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "tue-wl-3h-5", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "4x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "tue-wl-3h-6", phase: "Aesthetic", name: "DB Reverse Flyes", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "tue-wl-3h-7", phase: "Aesthetic", name: "Face Pulls", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "tue-bb-30-1", phase: "Plyo", name: "Multi-Directional Sprint", setsReps: "4x20m", tempo: "X-0-X-0", rest: "90s" },
                { id: "tue-bb-30-2", phase: "Strength", name: "Lateral Lunge", setsReps: "3x8/side", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "tue-bb-1h-1", phase: "Plyo", name: "Multi-Directional Sprint", setsReps: "4x20m", tempo: "X-0-X-0", rest: "90s" },
                { id: "tue-bb-1h-2", phase: "Strength", name: "Lateral Lunge", setsReps: "4x8/side", tempo: "2-0-1-1", rest: "60s" },
                { id: "tue-bb-1h-3", phase: "Strength", name: "Crossover Step Drill", setsReps: "3x6/side", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "tue-bb-2h-1", phase: "Plyo", name: "Multi-Directional Sprint", setsReps: "5x20m", tempo: "X-0-X-0", rest: "90s" },
                { id: "tue-bb-2h-2", phase: "Plyo", name: "Side Shuffle", setsReps: "4x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "tue-bb-2h-3", phase: "Strength", name: "Lateral Lunge", setsReps: "4x8/side", tempo: "2-0-1-1", rest: "60s" },
                { id: "tue-bb-2h-4", phase: "Strength", name: "Crossover Step Drill", setsReps: "4x6/side", tempo: "1-0-1-0", rest: "45s" },
                { id: "tue-bb-2h-5", phase: "Aesthetic", name: "Lateral Flexion", setsReps: "3x12/side", tempo: "2-0-1-1", rest: "45s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "tue-bb-3h-1", phase: "Plyo", name: "Multi-Directional Sprint", setsReps: "6x20m", tempo: "X-0-X-0", rest: "90s" },
                { id: "tue-bb-3h-2", phase: "Plyo", name: "Side Shuffle", setsReps: "5x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "tue-bb-3h-3", phase: "Plyo", name: "Lateral Bound", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-bb-3h-4", phase: "Strength", name: "Lateral Lunge", setsReps: "5x8/side", tempo: "2-0-1-1", rest: "60s" },
                { id: "tue-bb-3h-5", phase: "Strength", name: "Crossover Step Drill", setsReps: "5x6/side", tempo: "1-0-1-0", rest: "45s" },
                { id: "tue-bb-3h-6", phase: "Aesthetic", name: "Lateral Flexion", setsReps: "4x12/side", tempo: "2-0-1-1", rest: "45s" },
                { id: "tue-bb-3h-7", phase: "Aesthetic", name: "Transverse Rotation", setsReps: "3x12/side", tempo: "2-0-1-1", rest: "45s" }
              ]
            }
          ]
        },
        {
          category: "jumping",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "tue-jp-30-1", phase: "Plyo", name: "Single-Leg Hop", setsReps: "3x5/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-30-2", phase: "Plyo", name: "Skip for Distance", setsReps: "3x50m", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "tue-jp-1h-1", phase: "Plyo", name: "Single-Leg Hop", setsReps: "4x5/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-1h-2", phase: "Plyo", name: "Skip for Distance", setsReps: "4x50m", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-1h-3", phase: "Plyo", name: "Lateral Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "tue-jp-2h-1", phase: "Plyo", name: "Single-Leg Hop", setsReps: "5x5/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-2h-2", phase: "Plyo", name: "Skip for Distance", setsReps: "5x50m", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-2h-3", phase: "Plyo", name: "Lateral Jump", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-2h-4", phase: "Plyo", name: "Box Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "2min" },
                { id: "tue-jp-2h-5", phase: "Strength", name: "Single-Leg Squat", setsReps: "3x5/leg", tempo: "3-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "tue-jp-3h-1", phase: "Plyo", name: "Single-Leg Hop", setsReps: "6x5/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-3h-2", phase: "Plyo", name: "Skip for Distance", setsReps: "6x50m", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-3h-3", phase: "Plyo", name: "Lateral Jump", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "tue-jp-3h-4", phase: "Plyo", name: "Box Jump", setsReps: "4x5", tempo: "X-0-X-1", rest: "2min" },
                { id: "tue-jp-3h-5", phase: "Plyo", name: "Triple Hop", setsReps: "3x3", tempo: "X-0-X-1", rest: "2min" },
                { id: "tue-jp-3h-6", phase: "Strength", name: "Single-Leg Squat", setsReps: "4x5/leg", tempo: "3-0-X-1", rest: "90s" },
                { id: "tue-jp-3h-7", phase: "Aesthetic", name: "Single-Leg Calf Raise", setsReps: "3x12/leg", tempo: "2-0-1-1", rest: "60s" }
              ]
            }
          ]
        }
      ]
    },
    {
      day: "Wednesday",
      focus: "Vertical/Posterior",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "wed-wl-30-1", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "120s" },
                { id: "wed-wl-30-2", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "wed-wl-1h-1", phase: "Plyo", name: "Broad Jumps", setsReps: "4x4", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-wl-1h-2", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "120s" },
                { id: "wed-wl-1h-3", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "wed-wl-2h-1", phase: "Plyo", name: "Broad Jumps", setsReps: "4x4", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-wl-2h-2", phase: "Strength", name: "DB RDLs", setsReps: "4x8-10", tempo: "3-0-X-1", rest: "120s" },
                { id: "wed-wl-2h-3", phase: "Strength", name: "Pendulum Squat", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "wed-wl-2h-4", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "wed-wl-2h-5", phase: "Aesthetic", name: "Back Hyperextension", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "wed-wl-3h-1", phase: "Plyo", name: "Broad Jumps", setsReps: "5x4", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-wl-3h-2", phase: "Strength", name: "DB RDLs", setsReps: "5x8-10", tempo: "3-0-X-1", rest: "120s" },
                { id: "wed-wl-3h-3", phase: "Strength", name: "Pendulum Squat", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "wed-wl-3h-4", phase: "Strength", name: "Smith Bent Over Row", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "wed-wl-3h-5", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "4x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "wed-wl-3h-6", phase: "Aesthetic", name: "Back Hyperextension", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "wed-wl-3h-7", phase: "Aesthetic", name: "Leg Curl", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "wed-bb-30-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-bb-30-2", phase: "Strength", name: "Glute Activation", setsReps: "3x12", tempo: "1-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "wed-bb-1h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-bb-1h-2", phase: "Strength", name: "Glute Activation", setsReps: "4x12", tempo: "1-0-1-0", rest: "60s" },
                { id: "wed-bb-1h-3", phase: "Strength", name: "Bulgarian Split Squat", setsReps: "3x6/leg", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "wed-bb-2h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-bb-2h-2", phase: "Plyo", name: "Broad Jump", setsReps: "4x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-bb-2h-3", phase: "Strength", name: "Glute Activation", setsReps: "4x12", tempo: "1-0-1-0", rest: "60s" },
                { id: "wed-bb-2h-4", phase: "Strength", name: "Bulgarian Split Squat", setsReps: "4x6/leg", tempo: "2-0-1-1", rest: "60s" },
                { id: "wed-bb-2h-5", phase: "Aesthetic", name: "Hip Thrusts", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "wed-bb-3h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-bb-3h-2", phase: "Plyo", name: "Broad Jump", setsReps: "5x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-bb-3h-3", phase: "Plyo", name: "Lateral Bound", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-bb-3h-4", phase: "Strength", name: "Glute Activation", setsReps: "5x12", tempo: "1-0-1-0", rest: "60s" },
                { id: "wed-bb-3h-5", phase: "Strength", name: "Bulgarian Split Squat", setsReps: "5x6/leg", tempo: "2-0-1-1", rest: "60s" },
                { id: "wed-bb-3h-6", phase: "Aesthetic", name: "Hip Thrusts", setsReps: "4x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "wed-bb-3h-7", phase: "Aesthetic", name: "Nordic Curls", setsReps: "3x5", tempo: "3-0-2-0", rest: "90s" }
              ]
            }
          ]
        },
        {
          category: "jumping",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "wed-jp-30-1", phase: "Plyo", name: "Broad Jump", setsReps: "3x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-jp-30-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "wed-jp-1h-1", phase: "Plyo", name: "Broad Jump", setsReps: "4x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-jp-1h-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-jp-1h-3", phase: "Plyo", name: "Triple Hop", setsReps: "3x3", tempo: "X-0-X-1", rest: "2min" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "wed-jp-2h-1", phase: "Plyo", name: "Broad Jump", setsReps: "5x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-jp-2h-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-jp-2h-3", phase: "Plyo", name: "Triple Hop", setsReps: "4x3", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-jp-2h-4", phase: "Plyo", name: "Depth Jump", setsReps: "3x5", tempo: "X-0-X-0", rest: "2min" },
                { id: "wed-jp-2h-5", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "wed-jp-3h-1", phase: "Plyo", name: "Broad Jump", setsReps: "6x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-jp-3h-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "wed-jp-3h-3", phase: "Plyo", name: "Triple Hop", setsReps: "5x3", tempo: "X-0-X-1", rest: "2min" },
                { id: "wed-jp-3h-4", phase: "Plyo", name: "Depth Jump", setsReps: "4x5", tempo: "X-0-X-0", rest: "2min" },
                { id: "wed-jp-3h-5", phase: "Plyo", name: "Box Jump to Landings", setsReps: "3x5", tempo: "X-0-X-2", rest: "2min" },
                { id: "wed-jp-3h-6", phase: "Strength", name: "DB RDLs", setsReps: "4x8-10", tempo: "3-0-X-1", rest: "90s" },
                { id: "wed-jp-3h-7", phase: "Aesthetic", name: "Single-Leg RDL", setsReps: "3x8/leg", tempo: "3-0-1-1", rest: "60s" }
              ]
            }
          ]
        }
      ]
    },
    {
      day: "Thursday",
      focus: "COD/Core",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "thu-wl-30-1", phase: "Strength", name: "Smith Bent Over Row", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "thu-wl-30-2", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "3x20", tempo: "1-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "thu-wl-1h-1", phase: "Plyo", name: "Med Ball Wall Tosses", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-wl-1h-2", phase: "Strength", name: "Smith Bent Over Row", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "thu-wl-1h-3", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "3x20", tempo: "1-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "thu-wl-2h-1", phase: "Plyo", name: "Med Ball Wall Tosses", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-wl-2h-2", phase: "Strength", name: "Smith Bent Over Row", setsReps: "4x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "thu-wl-2h-3", phase: "Strength", name: "Lat Pulldown", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "thu-wl-2h-4", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "3x20", tempo: "1-0-1-0", rest: "60s" },
                { id: "thu-wl-2h-5", phase: "Aesthetic", name: "Pallof Press", setsReps: "3x12/side", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "thu-wl-3h-1", phase: "Plyo", name: "Med Ball Wall Tosses", setsReps: "4x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-wl-3h-2", phase: "Strength", name: "Smith Bent Over Row", setsReps: "5x8", tempo: "3-0-X-1", rest: "120s" },
                { id: "thu-wl-3h-3", phase: "Strength", name: "Lat Pulldown", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "thu-wl-3h-4", phase: "Strength", name: "DB Single Arm Row", setsReps: "3x8/side", tempo: "2-0-1-1", rest: "90s" },
                { id: "thu-wl-3h-5", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "4x20", tempo: "1-0-1-0", rest: "60s" },
                { id: "thu-wl-3h-6", phase: "Aesthetic", name: "Pallof Press", setsReps: "3x12/side", tempo: "2-0-1-1", rest: "60s" },
                { id: "thu-wl-3h-7", phase: "Aesthetic", name: "Hollow Body Hold", setsReps: "3x20s", tempo: "1-0-1-0", rest: "60s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "thu-bb-30-1", phase: "Plyo", name: "Lateral Shuffle", setsReps: "4x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "thu-bb-30-2", phase: "Strength", name: "Rotational Lunges", setsReps: "3x6/side", tempo: "1-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "thu-bb-1h-1", phase: "Plyo", name: "Lateral Shuffle", setsReps: "4x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "thu-bb-1h-2", phase: "Strength", name: "Rotational Lunges", setsReps: "4x6/side", tempo: "1-0-1-0", rest: "60s" },
                { id: "thu-bb-1h-3", phase: "Strength", name: "Rotational Med Ball Throw", setsReps: "3x8/side", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "thu-bb-2h-1", phase: "Plyo", name: "Lateral Shuffle", setsReps: "5x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "thu-bb-2h-2", phase: "Plyo", name: "Rotational Sprint", setsReps: "4x20m", tempo: "X-0-X-0", rest: "90s" },
                { id: "thu-bb-2h-3", phase: "Strength", name: "Rotational Lunges", setsReps: "4x6/side", tempo: "1-0-1-0", rest: "60s" },
                { id: "thu-bb-2h-4", phase: "Strength", name: "Rotational Med Ball Throw", setsReps: "4x8/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-bb-2h-5", phase: "Aesthetic", name: "Core Stability Holds", setsReps: "3x30s", tempo: "1-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "thu-bb-3h-1", phase: "Plyo", name: "Lateral Shuffle", setsReps: "6x30s", tempo: "1-0-1-0", rest: "30s" },
                { id: "thu-bb-3h-2", phase: "Plyo", name: "Rotational Sprint", setsReps: "5x20m", tempo: "X-0-X-0", rest: "90s" },
                { id: "thu-bb-3h-3", phase: "Plyo", name: "Lateral Bound", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-bb-3h-4", phase: "Strength", name: "Rotational Lunges", setsReps: "5x6/side", tempo: "1-0-1-0", rest: "60s" },
                { id: "thu-bb-3h-5", phase: "Strength", name: "Rotational Med Ball Throw", setsReps: "5x8/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-bb-3h-6", phase: "Aesthetic", name: "Core Stability Holds", setsReps: "4x30s", tempo: "1-0-1-0", rest: "60s" },
                { id: "thu-bb-3h-7", phase: "Aesthetic", name: "Dead Bug", setsReps: "3x12/side", tempo: "2-0-1-1", rest: "60s" }
              ]
            }
          ]
        },
        {
          category: "jumping",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "thu-jp-30-1", phase: "Plyo", name: "Jump Rope", setsReps: "3x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "thu-jp-30-2", phase: "Plyo", name: "Rotational Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "thu-jp-1h-1", phase: "Plyo", name: "Jump Rope", setsReps: "4x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "thu-jp-1h-2", phase: "Plyo", name: "Rotational Jump", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-1h-3", phase: "Plyo", name: "Single-Leg Jump", setsReps: "3x5/leg", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "thu-jp-2h-1", phase: "Plyo", name: "Jump Rope", setsReps: "5x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "thu-jp-2h-2", phase: "Plyo", name: "Rotational Jump", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-2h-3", phase: "Plyo", name: "Single-Leg Jump", setsReps: "4x5/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-2h-4", phase: "Plyo", name: "Med Ball Slam", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-2h-5", phase: "Strength", name: "Pallof Press", setsReps: "3x10/side", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "thu-jp-3h-1", phase: "Plyo", name: "Jump Rope", setsReps: "6x1min", tempo: "X-0-X-1", rest: "60s" },
                { id: "thu-jp-3h-2", phase: "Plyo", name: "Rotational Jump", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-3h-3", phase: "Plyo", name: "Single-Leg Jump", setsReps: "5x5/leg", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-3h-4", phase: "Plyo", name: "Med Ball Slam", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "thu-jp-3h-5", phase: "Plyo", name: "Burpee Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "2min" },
                { id: "thu-jp-3h-6", phase: "Strength", name: "Pallof Press", setsReps: "4x10/side", tempo: "2-0-1-1", rest: "60s" },
                { id: "thu-jp-3h-7", phase: "Aesthetic", name: "Plank", setsReps: "3x30s", tempo: "1-0-1-0", rest: "60s" }
              ]
            }
          ]
        }
      ]
    },
    {
      day: "Saturday",
      focus: "Back Squat Depth / Elastic Power",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "sat-wl-30-1", phase: "Strength", name: "Smith Machine Back Squat", setsReps: "3x5", tempo: "3-1-X-1", rest: "150s" },
                { id: "sat-wl-30-2", phase: "Aesthetic", name: "Leg Press (High Foot Position)", setsReps: "3x12", tempo: "2-0-1-1", rest: "75s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "sat-wl-1h-1", phase: "Plyo", name: "Depth Jumps", setsReps: "3x5", tempo: "X-0-X-0", rest: "120s" },
                { id: "sat-wl-1h-2", phase: "Strength", name: "Smith Machine Back Squat", setsReps: "3x5", tempo: "3-1-X-1", rest: "150s" },
                { id: "sat-wl-1h-3", phase: "Aesthetic", name: "Leg Press (High Foot Position)", setsReps: "3x12", tempo: "2-0-1-1", rest: "75s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "sat-wl-2h-1", phase: "Plyo", name: "Depth Jumps", setsReps: "4x5", tempo: "X-0-X-0", rest: "120s" },
                { id: "sat-wl-2h-2", phase: "Plyo", name: "Hurdle Hops", setsReps: "4x6", tempo: "X-0-X-0", rest: "90s" },
                { id: "sat-wl-2h-3", phase: "Strength", name: "Smith Machine Back Squat", setsReps: "4x5", tempo: "3-1-X-1", rest: "150s" },
                { id: "sat-wl-2h-4", phase: "Aesthetic", name: "Leg Press (High Foot Position)", setsReps: "3x12", tempo: "2-0-1-1", rest: "75s" },
                { id: "sat-wl-2h-5", phase: "Aesthetic", name: "DB Walking Lunges", setsReps: "3x10/leg", tempo: "2-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "sat-wl-3h-1", phase: "Plyo", name: "Depth Jumps", setsReps: "4x5", tempo: "X-0-X-0", rest: "120s" },
                { id: "sat-wl-3h-2", phase: "Plyo", name: "Hurdle Hops", setsReps: "4x6", tempo: "X-0-X-0", rest: "90s" },
                { id: "sat-wl-3h-3", phase: "Strength", name: "Smith Machine Back Squat", setsReps: "5x5", tempo: "3-1-X-1", rest: "150s" },
                { id: "sat-wl-3h-4", phase: "Aesthetic", name: "Leg Press (High Foot Position)", setsReps: "4x12", tempo: "2-0-1-1", rest: "75s" },
                { id: "sat-wl-3h-5", phase: "Aesthetic", name: "DB Walking Lunges", setsReps: "3x10/leg", tempo: "2-0-1-0", rest: "60s" },
                { id: "sat-wl-3h-6", phase: "Aesthetic", name: "Cable Seated Leg Curl", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "sat-wl-3h-7", phase: "Aesthetic", name: "Calf Raise", setsReps: "3x15", tempo: "2-0-1-0", rest: "60s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "sat-bb-30-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-bb-30-2", phase: "Strength", name: "Glute Activation", setsReps: "3x12", tempo: "1-0-1-0", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "sat-bb-1h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-bb-1h-2", phase: "Strength", name: "Glute Activation", setsReps: "4x12", tempo: "1-0-1-0", rest: "60s" },
                { id: "sat-bb-1h-3", phase: "Strength", name: "Bulgarian Split Squat", setsReps: "3x6/leg", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "sat-bb-2h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-bb-2h-2", phase: "Plyo", name: "Broad Jump", setsReps: "4x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-bb-2h-3", phase: "Strength", name: "Glute Activation", setsReps: "4x12", tempo: "1-0-1-0", rest: "60s" },
                { id: "sat-bb-2h-4", phase: "Strength", name: "Bulgarian Split Squat", setsReps: "4x6/leg", tempo: "2-0-1-1", rest: "60s" },
                { id: "sat-bb-2h-5", phase: "Aesthetic", name: "Hip Thrusts", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "sat-bb-3h-1", phase: "Plyo", name: "Vertical Jump Drills", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-bb-3h-2", phase: "Plyo", name: "Broad Jump", setsReps: "5x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-bb-3h-3", phase: "Plyo", name: "Lateral Bound", setsReps: "4x6/side", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-bb-3h-4", phase: "Strength", name: "Glute Activation", setsReps: "5x12", tempo: "1-0-1-0", rest: "60s" },
                { id: "sat-bb-3h-5", phase: "Strength", name: "Bulgarian Split Squat", setsReps: "5x6/leg", tempo: "2-0-1-1", rest: "60s" },
                { id: "sat-bb-3h-6", phase: "Aesthetic", name: "Hip Thrusts", setsReps: "4x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "sat-bb-3h-7", phase: "Aesthetic", name: "Nordic Curls", setsReps: "3x5", tempo: "3-0-2-0", rest: "90s" }
              ]
            }
          ]
        },
        {
          category: "jumping",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "sat-jp-30-1", phase: "Plyo", name: "Broad Jump", setsReps: "3x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-jp-30-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "3x5", tempo: "X-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "sat-jp-1h-1", phase: "Plyo", name: "Broad Jump", setsReps: "4x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-jp-1h-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "4x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-jp-1h-3", phase: "Plyo", name: "Triple Hop", setsReps: "3x3", tempo: "X-0-X-1", rest: "2min" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "sat-jp-2h-1", phase: "Plyo", name: "Broad Jump", setsReps: "5x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-jp-2h-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "5x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-jp-2h-3", phase: "Plyo", name: "Triple Hop", setsReps: "4x3", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-jp-2h-4", phase: "Plyo", name: "Depth Jump", setsReps: "3x5", tempo: "X-0-X-0", rest: "2min" },
                { id: "sat-jp-2h-5", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "90s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "sat-jp-3h-1", phase: "Plyo", name: "Broad Jump", setsReps: "6x4", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-jp-3h-2", phase: "Plyo", name: "Countermovement Jump", setsReps: "6x5", tempo: "X-0-X-1", rest: "90s" },
                { id: "sat-jp-3h-3", phase: "Plyo", name: "Triple Hop", setsReps: "5x3", tempo: "X-0-X-1", rest: "2min" },
                { id: "sat-jp-3h-4", phase: "Plyo", name: "Depth Jump", setsReps: "4x5", tempo: "X-0-X-0", rest: "2min" },
                { id: "sat-jp-3h-5", phase: "Plyo", name: "Box Jump to Landings", setsReps: "3x5", tempo: "X-0-X-2", rest: "2min" },
                { id: "sat-jp-3h-6", phase: "Strength", name: "DB RDLs", setsReps: "4x8-10", tempo: "3-0-X-1", rest: "90s" },
                { id: "sat-jp-3h-7", phase: "Aesthetic", name: "Single-Leg RDL", setsReps: "3x8/leg", tempo: "3-0-1-1", rest: "60s" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export function useWorkouts() {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: () => WORKOUTS_DATA,
    staleTime: Infinity,
  });
}
