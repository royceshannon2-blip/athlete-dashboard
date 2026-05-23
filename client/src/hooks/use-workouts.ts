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
              drills: [
                { id: "mon-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "medium", name: "Spot Shooting", description: "5 spots around the arc, move after each make", reps: { type: "makes", makes: 15 } },
                { id: "mon-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "medium", name: "Stationary Crossover", description: "Low and tight, eyes up", reps: { type: "setsPerHand", sets: 3, rightReps: 25 } },
                { id: "mon-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "medium", name: "Euro Step Layup", description: "Full speed from the wing, attack the rim", reps: { type: "makesPerHand", rightMakes: 10 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "mon-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Spot Shooting", description: "5 spots around the arc, move after each make", reps: { type: "makes", makes: 15 } },
                { id: "mon-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "high", name: "Catch and Shoot", description: "Pass from elbow, catch and shoot in one motion", reps: { type: "makes", makes: 20 } },
                { id: "mon-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "Stationary Crossover", description: "Low and tight, eyes up", reps: { type: "setsPerHand", sets: 3, rightReps: 25 } },
                { id: "mon-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "Figure-8 Dribble", description: "Around legs in figure-8 pattern, switch hands", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "mon-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "medium", name: "Euro Step Layup", description: "Full speed from the wing, attack the rim", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "mon-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "high", name: "Reverse Layup", description: "Off-hand finish at the rim", reps: { type: "makesPerHand", rightMakes: 8 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "mon-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Spot Shooting", description: "5 spots around the arc, move after each make", reps: { type: "makes", makes: 15 } },
                { id: "mon-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Catch and Shoot", description: "Pass from elbow, catch and shoot in one motion", reps: { type: "makes", makes: 20 } },
                { id: "mon-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Pull-Up Jumper", description: "Off the dribble from various spots", reps: { type: "makes", makes: 18 } },
                { id: "mon-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Deep Three", description: "NBA range attempts", reps: { type: "makes", makes: 10 } },
                { id: "mon-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Stationary Crossover", description: "Low and tight, eyes up", reps: { type: "setsPerHand", sets: 3, rightReps: 25 } },
                { id: "mon-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Figure-8 Dribble", description: "Around legs in figure-8 pattern, switch hands", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "mon-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Between the Legs", description: "Hard crossover between legs", reps: { type: "setsPerHand", sets: 3, rightReps: 15 } },
                { id: "mon-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "Speed Crossover", description: "Maximum speed crossover drills", reps: { type: "setsPerHand", sets: 5, rightReps: 10 } },
                { id: "mon-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Euro Step Layup", description: "Full speed from the wing, attack the rim", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "mon-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Reverse Layup", description: "Off-hand finish at the rim", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "mon-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Floater", description: "Mid-range floater from both sides", reps: { type: "makesPerHand", rightMakes: 12 } },
                { id: "mon-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Contested Layup", description: "Defenders present, finish through contact", reps: { type: "makesPerHand", rightMakes: 9 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "mon-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Spot Shooting", description: "5 spots around the arc, move after each make", reps: { type: "makes", makes: 15 } },
                { id: "mon-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Catch and Shoot", description: "Pass from elbow, catch and shoot in one motion", reps: { type: "makes", makes: 20 } },
                { id: "mon-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Pull-Up Jumper", description: "Off the dribble from various spots", reps: { type: "makes", makes: 18 } },
                { id: "mon-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Deep Three", description: "NBA range attempts", reps: { type: "makes", makes: 10 } },
                { id: "mon-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Trailing Three", description: "Running catch and shoot", reps: { type: "makes", makes: 12 } },
                { id: "mon-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Free Throw", description: "From the line, consistency focus", reps: { type: "makes", makes: 25 } },
                { id: "mon-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Stationary Crossover", description: "Low and tight, eyes up", reps: { type: "setsPerHand", sets: 3, rightReps: 25 } },
                { id: "mon-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Figure-8 Dribble", description: "Around legs in figure-8 pattern, switch hands", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "mon-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Between the Legs", description: "Hard crossover between legs", reps: { type: "setsPerHand", sets: 3, rightReps: 15 } },
                { id: "mon-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Speed Crossover", description: "Maximum speed crossover drills", reps: { type: "setsPerHand", sets: 5, rightReps: 10 } },
                { id: "mon-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Half-Court Dribble", description: "Full court handling, pressure defense", reps: { type: "setsPerHand", sets: 4, rightReps: 30 } },
                { id: "mon-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Retreat Dribble", description: "Escape and advance patterns", reps: { type: "setsPerHand", sets: 3, rightReps: 20 } },
                { id: "mon-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Euro Step Layup", description: "Full speed from the wing, attack the rim", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "mon-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Reverse Layup", description: "Off-hand finish at the rim", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "mon-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Floater", description: "Mid-range floater from both sides", reps: { type: "makesPerHand", rightMakes: 12 } },
                { id: "mon-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Contested Layup", description: "Defenders present, finish through contact", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "mon-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Driving Layup", description: "Full speed drive and finish", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "mon-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Hammer", description: "One-handed finish down the line", reps: { type: "makesPerHand", rightMakes: 8 } }
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
              drills: [
                { id: "tue-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "high", name: "Quick Release", description: "Fast catch and shoot, minimal footwork", reps: { type: "makes", makes: 18 } },
                { id: "tue-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "medium", name: "Push Pull Dribble", description: "Rapid hand switches, low bounce", reps: { type: "setsPerHand", sets: 4, rightReps: 15 } },
                { id: "tue-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "high", name: "Drop Step", description: "Use a drop step to create space", reps: { type: "makesPerHand", rightMakes: 9 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "tue-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "high", name: "Quick Release", description: "Fast catch and shoot, minimal footwork", reps: { type: "makes", makes: 18 } },
                { id: "tue-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Wing Threes", description: "Off-the-wing three-point range", reps: { type: "makes", makes: 16 } },
                { id: "tue-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "Push Pull Dribble", description: "Rapid hand switches, low bounce", reps: { type: "setsPerHand", sets: 4, rightReps: 15 } },
                { id: "tue-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "high", name: "Jab Step", description: "Deceive defender with shoulder feints", reps: { type: "setsPerHand", sets: 3, rightReps: 12 } },
                { id: "tue-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "high", name: "Drop Step", description: "Use a drop step to create space", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "tue-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "medium", name: "Spin Move", description: "Rotate around defender, finish", reps: { type: "makesPerHand", rightMakes: 7 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "tue-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Quick Release", description: "Fast catch and shoot, minimal footwork", reps: { type: "makes", makes: 18 } },
                { id: "tue-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Wing Threes", description: "Off-the-wing three-point range", reps: { type: "makes", makes: 16 } },
                { id: "tue-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Baseline Corner", description: "Baseline and corner three attempts", reps: { type: "makes", makes: 14 } },
                { id: "tue-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Top of Key", description: "Three-point line extended top", reps: { type: "makes", makes: 13 } },
                { id: "tue-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Push Pull Dribble", description: "Rapid hand switches, low bounce", reps: { type: "setsPerHand", sets: 4, rightReps: 15 } },
                { id: "tue-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "Jab Step", description: "Deceive defender with shoulder feints", reps: { type: "setsPerHand", sets: 3, rightReps: 12 } },
                { id: "tue-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Full Court Handling", description: "Dribble full court, change pace", reps: { type: "setsPerHand", sets: 5, rightReps: 25 } },
                { id: "tue-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Hesitation Move", description: "Pause and accelerate patterns", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "tue-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Drop Step", description: "Use a drop step to create space", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "tue-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Spin Move", description: "Rotate around defender, finish", reps: { type: "makesPerHand", rightMakes: 7 } },
                { id: "tue-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Jump Shot Off Screen", description: "Come off pick and shoot", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "tue-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "High-Low Finish", description: "Deep position finishes at rim", reps: { type: "makesPerHand", rightMakes: 10 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "tue-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Quick Release", description: "Fast catch and shoot, minimal footwork", reps: { type: "makes", makes: 18 } },
                { id: "tue-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Wing Threes", description: "Off-the-wing three-point range", reps: { type: "makes", makes: 16 } },
                { id: "tue-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Baseline Corner", description: "Baseline and corner three attempts", reps: { type: "makes", makes: 14 } },
                { id: "tue-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Top of Key", description: "Three-point line extended top", reps: { type: "makes", makes: 13 } },
                { id: "tue-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Step-Back Three", description: "Create space with step back", reps: { type: "makes", makes: 12 } },
                { id: "tue-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Rhythm Shooting", description: "Get in rhythm with spot-ups", reps: { type: "makes", makes: 21 } },
                { id: "tue-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Push Pull Dribble", description: "Rapid hand switches, low bounce", reps: { type: "setsPerHand", sets: 4, rightReps: 15 } },
                { id: "tue-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Jab Step", description: "Deceive defender with shoulder feints", reps: { type: "setsPerHand", sets: 3, rightReps: 12 } },
                { id: "tue-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Full Court Handling", description: "Dribble full court, change pace", reps: { type: "setsPerHand", sets: 5, rightReps: 25 } },
                { id: "tue-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Hesitation Move", description: "Pause and accelerate patterns", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "tue-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Tight Handle Drills", description: "Small tight handles under pressure", reps: { type: "setsPerHand", sets: 6, rightReps: 8 } },
                { id: "tue-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Combination Moves", description: "String multiple moves together", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "tue-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Drop Step", description: "Use a drop step to create space", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "tue-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Spin Move", description: "Rotate around defender, finish", reps: { type: "makesPerHand", rightMakes: 7 } },
                { id: "tue-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Jump Shot Off Screen", description: "Come off pick and shoot", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "tue-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "High-Low Finish", description: "Deep position finishes at rim", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "tue-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Tough Finish", description: "Finish against physical defense", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "tue-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Quick Feet", description: "Speed work, footwork patterns", reps: { type: "makesPerHand", rightMakes: 13 } }
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
              drills: [
                { id: "wed-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "low", name: "Bank Shot", description: "Off glass from various spots", reps: { type: "makes", makes: 14 } },
                { id: "wed-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "high", name: "One-Dribble Pull-Up", description: "Single dribble into shot", reps: { type: "setsPerHand", sets: 5, rightReps: 8 } },
                { id: "wed-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "low", name: "Contact Finish", description: "Finish through defender", reps: { type: "makesPerHand", rightMakes: 8 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "wed-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "low", name: "Bank Shot", description: "Off glass from various spots", reps: { type: "makes", makes: 14 } },
                { id: "wed-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Elbow Threes", description: "Mid-range extended threes", reps: { type: "makes", makes: 17 } },
                { id: "wed-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "high", name: "One-Dribble Pull-Up", description: "Single dribble into shot", reps: { type: "setsPerHand", sets: 5, rightReps: 8 } },
                { id: "wed-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "In-and-Out", description: "Head and shoulder fakes", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "wed-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "low", name: "Contact Finish", description: "Finish through defender", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "wed-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "high", name: "Acrobatic Finish", description: "Creative finishing away from basket", reps: { type: "makesPerHand", rightMakes: 6 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "wed-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Bank Shot", description: "Off glass from various spots", reps: { type: "makes", makes: 14 } },
                { id: "wed-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Elbow Threes", description: "Mid-range extended threes", reps: { type: "makes", makes: 17 } },
                { id: "wed-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Off-The-Dribble Three", description: "Pull up three off dribble", reps: { type: "makes", makes: 12 } },
                { id: "wed-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Mid-Range", description: "High percentage mid-range", reps: { type: "makes", makes: 19 } },
                { id: "wed-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "One-Dribble Pull-Up", description: "Single dribble into shot", reps: { type: "setsPerHand", sets: 5, rightReps: 8 } },
                { id: "wed-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "In-and-Out", description: "Head and shoulder fakes", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "wed-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "Behind-the-Back", description: "Behind-the-back dribble transitions", reps: { type: "setsPerHand", sets: 4, rightReps: 10 } },
                { id: "wed-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Pound Dribble", description: "Aggressive ground control", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "wed-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Contact Finish", description: "Finish through defender", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "wed-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Acrobatic Finish", description: "Creative finishing away from basket", reps: { type: "makesPerHand", rightMakes: 6 } },
                { id: "wed-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Tear Drop", description: "Short soft touch floaters", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "wed-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Alley-Oop Ready", description: "Vertical finishes preparation", reps: { type: "makesPerHand", rightMakes: 7 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "wed-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Bank Shot", description: "Off glass from various spots", reps: { type: "makes", makes: 14 } },
                { id: "wed-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Elbow Threes", description: "Mid-range extended threes", reps: { type: "makes", makes: 17 } },
                { id: "wed-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Off-The-Dribble Three", description: "Pull up three off dribble", reps: { type: "makes", makes: 12 } },
                { id: "wed-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Mid-Range", description: "High percentage mid-range", reps: { type: "makes", makes: 19 } },
                { id: "wed-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Transition Three", description: "Three on the break", reps: { type: "makes", makes: 11 } },
                { id: "wed-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Game Speed", description: "Simulated game situation shooting", reps: { type: "makes", makes: 20 } },
                { id: "wed-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "One-Dribble Pull-Up", description: "Single dribble into shot", reps: { type: "setsPerHand", sets: 5, rightReps: 8 } },
                { id: "wed-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "In-and-Out", description: "Head and shoulder fakes", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "wed-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Behind-the-Back", description: "Behind-the-back dribble transitions", reps: { type: "setsPerHand", sets: 4, rightReps: 10 } },
                { id: "wed-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Pound Dribble", description: "Aggressive ground control", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "wed-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Crossover Combination", description: "Multiple crossovers in sequence", reps: { type: "setsPerHand", sets: 6, rightReps: 10 } },
                { id: "wed-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Live Defense", description: "Handle against live defender", reps: { type: "setsPerHand", sets: 5, rightReps: 15 } },
                { id: "wed-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Contact Finish", description: "Finish through defender", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "wed-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Acrobatic Finish", description: "Creative finishing away from basket", reps: { type: "makesPerHand", rightMakes: 6 } },
                { id: "wed-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Tear Drop", description: "Short soft touch floaters", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "wed-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Alley-Oop Ready", description: "Vertical finishes preparation", reps: { type: "makesPerHand", rightMakes: 7 } },
                { id: "wed-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Transition Finish", description: "Full speed outlet to layup", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "wed-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Game Situation", description: "Offensive moves under game pressure", reps: { type: "makesPerHand", rightMakes: 12 } }
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
              drills: [
                { id: "thu-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "medium", name: "Rhythm Shooter", description: "Get in a zone, rhythm and timing", reps: { type: "makes", makes: 17 } },
                { id: "thu-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "medium", name: "High Dribble", description: "Head up, control at waist", reps: { type: "setsPerHand", sets: 3, rightReps: 18 } },
                { id: "thu-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "medium", name: "Pick and Roll", description: "Come off screen, attack lane", reps: { type: "makesPerHand", rightMakes: 10 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "thu-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Rhythm Shooter", description: "Get in a zone, rhythm and timing", reps: { type: "makes", makes: 17 } },
                { id: "thu-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "high", name: "Transition", description: "Three on the break situations", reps: { type: "makes", makes: 13 } },
                { id: "thu-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "High Dribble", description: "Head up, control at waist", reps: { type: "setsPerHand", sets: 3, rightReps: 18 } },
                { id: "thu-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "Retreat Dribble", description: "Fall back with the ball", reps: { type: "setsPerHand", sets: 4, rightReps: 16 } },
                { id: "thu-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "medium", name: "Pick and Roll", description: "Come off screen, attack lane", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "thu-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "high", name: "Cutting Lanes", description: "V-cuts and back screens", reps: { type: "makesPerHand", rightMakes: 9 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "thu-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Rhythm Shooter", description: "Get in a zone, rhythm and timing", reps: { type: "makes", makes: 17 } },
                { id: "thu-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Transition", description: "Three on the break situations", reps: { type: "makes", makes: 13 } },
                { id: "thu-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Pin Down", description: "Come off pin screen and shoot", reps: { type: "makes", makes: 15 } },
                { id: "thu-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Game Tempo", description: "Regular game speed shooting", reps: { type: "makes", makes: 18 } },
                { id: "thu-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "High Dribble", description: "Head up, control at waist", reps: { type: "setsPerHand", sets: 3, rightReps: 18 } },
                { id: "thu-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Retreat Dribble", description: "Fall back with the ball", reps: { type: "setsPerHand", sets: 4, rightReps: 16 } },
                { id: "thu-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "Attacking Dribble", description: "Aggressive drive and attack", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "thu-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Pass and Move", description: "Cut and reposition after pass", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "thu-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Pick and Roll", description: "Come off screen, attack lane", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "thu-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Cutting Lanes", description: "V-cuts and back screens", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "thu-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Post Moves", description: "Footwork near the basket", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "thu-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Timing and Spacing", description: "Arrival timing drills", reps: { type: "makesPerHand", rightMakes: 10 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "thu-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Rhythm Shooter", description: "Get in a zone, rhythm and timing", reps: { type: "makes", makes: 17 } },
                { id: "thu-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Transition", description: "Three on the break situations", reps: { type: "makes", makes: 13 } },
                { id: "thu-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Pin Down", description: "Come off pin screen and shoot", reps: { type: "makes", makes: 15 } },
                { id: "thu-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Game Tempo", description: "Regular game speed shooting", reps: { type: "makes", makes: 18 } },
                { id: "thu-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Moving Off Ball", description: "Shooting while on the move", reps: { type: "makes", makes: 12 } },
                { id: "thu-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Pressure Situations", description: "Last second shot attempts", reps: { type: "makes", makes: 14 } },
                { id: "thu-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "High Dribble", description: "Head up, control at waist", reps: { type: "setsPerHand", sets: 3, rightReps: 18 } },
                { id: "thu-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Retreat Dribble", description: "Fall back with the ball", reps: { type: "setsPerHand", sets: 4, rightReps: 16 } },
                { id: "thu-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Attacking Dribble", description: "Aggressive drive and attack", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "thu-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Pass and Move", description: "Cut and reposition after pass", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "thu-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Two Ball", description: "Alternating ball dribbles", reps: { type: "setsPerHand", sets: 6, rightReps: 10 } },
                { id: "thu-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Pressure Defense", description: "Handle under defensive pressure", reps: { type: "setsPerHand", sets: 5, rightReps: 14 } },
                { id: "thu-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Pick and Roll", description: "Come off screen, attack lane", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "thu-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Cutting Lanes", description: "V-cuts and back screens", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "thu-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Post Moves", description: "Footwork near the basket", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "thu-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Timing and Spacing", description: "Arrival timing drills", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "thu-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Penetration and Pass", description: "Drive, then kick out assist", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "thu-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Assisted Scoring", description: "Screen assistance and reads", reps: { type: "makesPerHand", rightMakes: 11 } }
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
      day: "Friday",
      focus: "Upper/Arms Recovery",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "fri-wl-30-1", phase: "Strength", name: "Dumbbell Curls", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-wl-30-2", phase: "Aesthetic", name: "Tricep Rope Pushdown", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "fri-wl-1h-1", phase: "Strength", name: "Barbell Curl", setsReps: "3x6-8", tempo: "2-0-X-1", rest: "120s" },
                { id: "fri-wl-1h-2", phase: "Strength", name: "Dumbbell Curls", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-wl-1h-3", phase: "Aesthetic", name: "Tricep Rope Pushdown", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "fri-wl-2h-1", phase: "Strength", name: "Barbell Curl", setsReps: "4x6-8", tempo: "2-0-X-1", rest: "120s" },
                { id: "fri-wl-2h-2", phase: "Strength", name: "Dumbbell Curls", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-wl-2h-3", phase: "Strength", name: "Skull Crushers", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-wl-2h-4", phase: "Aesthetic", name: "Tricep Rope Pushdown", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" },
                { id: "fri-wl-2h-5", phase: "Aesthetic", name: "Hammer Curls", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "fri-wl-3h-1", phase: "Strength", name: "Barbell Curl", setsReps: "5x6-8", tempo: "2-0-X-1", rest: "120s" },
                { id: "fri-wl-3h-2", phase: "Strength", name: "Dumbbell Curls", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-wl-3h-3", phase: "Strength", name: "Skull Crushers", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-wl-3h-4", phase: "Strength", name: "Close-Grip Bench", setsReps: "3x6-8", tempo: "2-0-X-1", rest: "120s" },
                { id: "fri-wl-3h-5", phase: "Aesthetic", name: "Tricep Rope Pushdown", setsReps: "4x12-15", tempo: "2-0-1-1", rest: "60s" },
                { id: "fri-wl-3h-6", phase: "Aesthetic", name: "Hammer Curls", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "fri-wl-3h-7", phase: "Aesthetic", name: "Machine Dip", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              drills: [
                { id: "fri-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "high", name: "Transition Shooting", description: "Fast break shooting drills", reps: { type: "makes", makes: 16 } },
                { id: "fri-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "low", name: "Passing Drills", description: "Various passing techniques", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "fri-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "medium", name: "Penetration", description: "Drive hard to the basket", reps: { type: "makesPerHand", rightMakes: 10 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "fri-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "high", name: "Transition Shooting", description: "Fast break shooting drills", reps: { type: "makes", makes: 16 } },
                { id: "fri-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Assisted Shots", description: "Get open for others' passes", reps: { type: "makes", makes: 14 } },
                { id: "fri-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "low", name: "Passing Drills", description: "Various passing techniques", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "fri-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "No-Look Dribbles", description: "Deceive with eyes while handling", reps: { type: "setsPerHand", sets: 3, rightReps: 16 } },
                { id: "fri-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "medium", name: "Penetration", description: "Drive hard to the basket", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "fri-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "high", name: "Layup Packages", description: "Various layup finishes", reps: { type: "makesPerHand", rightMakes: 12 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "fri-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Transition Shooting", description: "Fast break shooting drills", reps: { type: "makes", makes: 16 } },
                { id: "fri-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Assisted Shots", description: "Get open for others' passes", reps: { type: "makes", makes: 14 } },
                { id: "fri-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Spot Up", description: "Stand and shoot ready position", reps: { type: "makes", makes: 17 } },
                { id: "fri-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Movement Off Ball", description: "Shoot while in motion", reps: { type: "makes", makes: 13 } },
                { id: "fri-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "low", name: "Passing Drills", description: "Various passing techniques", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "fri-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "No-Look Dribbles", description: "Deceive with eyes while handling", reps: { type: "setsPerHand", sets: 3, rightReps: 16 } },
                { id: "fri-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "Quick Outlet", description: "Fast break transition handling", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "fri-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Catch and Go", description: "Receive and immediately attack", reps: { type: "setsPerHand", sets: 4, rightReps: 18 } },
                { id: "fri-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Penetration", description: "Drive hard to the basket", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "fri-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Layup Packages", description: "Various layup finishes", reps: { type: "makesPerHand", rightMakes: 12 } },
                { id: "fri-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Kick Out Passes", description: "Drive and dish to open shooters", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "fri-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Transition Lanes", description: "Three-on-two drills", reps: { type: "makesPerHand", rightMakes: 11 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "fri-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Transition Shooting", description: "Fast break shooting drills", reps: { type: "makes", makes: 16 } },
                { id: "fri-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Assisted Shots", description: "Get open for others' passes", reps: { type: "makes", makes: 14 } },
                { id: "fri-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Spot Up", description: "Stand and shoot ready position", reps: { type: "makes", makes: 17 } },
                { id: "fri-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Movement Off Ball", description: "Shoot while in motion", reps: { type: "makes", makes: 13 } },
                { id: "fri-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Catch and Shoot", description: "One motion catch and shoot", reps: { type: "makes", makes: 19 } },
                { id: "fri-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Game Situations", description: "Scripted game scenario shooting", reps: { type: "makes", makes: 22 } },
                { id: "fri-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Passing Drills", description: "Various passing techniques", reps: { type: "setsPerHand", sets: 4, rightReps: 20 } },
                { id: "fri-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "No-Look Dribbles", description: "Deceive with eyes while handling", reps: { type: "setsPerHand", sets: 3, rightReps: 16 } },
                { id: "fri-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Quick Outlet", description: "Fast break transition handling", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "fri-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Catch and Go", description: "Receive and immediately attack", reps: { type: "setsPerHand", sets: 4, rightReps: 18 } },
                { id: "fri-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Advance and Retreat", description: "Different pace handling", reps: { type: "setsPerHand", sets: 6, rightReps: 10 } },
                { id: "fri-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Ball Movement", description: "Team passing patterns", reps: { type: "setsPerHand", sets: 5, rightReps: 16 } },
                { id: "fri-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Penetration", description: "Drive hard to the basket", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "fri-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Layup Packages", description: "Various layup finishes", reps: { type: "makesPerHand", rightMakes: 12 } },
                { id: "fri-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Kick Out Passes", description: "Drive and dish to open shooters", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "fri-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Transition Lanes", description: "Three-on-two drills", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "fri-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Strong Finishes", description: "Physical contact finishes", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "fri-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Flow Offense", description: "Continuous offensive patterns", reps: { type: "makesPerHand", rightMakes: 13 } }
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
                { id: "fri-jp-30-1", phase: "Strength", name: "Double-Leg Squat", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-30-2", phase: "Aesthetic", name: "Calf Stretch Hold", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "fri-jp-1h-1", phase: "Strength", name: "Double-Leg Squat", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-1h-2", phase: "Strength", name: "Single-Leg Squat", setsReps: "3x6/leg", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-1h-3", phase: "Aesthetic", name: "Calf Raise", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "fri-jp-2h-1", phase: "Strength", name: "Double-Leg Squat", setsReps: "5x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-2h-2", phase: "Strength", name: "Single-Leg Squat", setsReps: "4x6/leg", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-2h-3", phase: "Strength", name: "Leg Press", setsReps: "3x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-2h-4", phase: "Aesthetic", name: "Calf Raise", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "fri-jp-2h-5", phase: "Aesthetic", name: "Couch Stretch", setsReps: "3x45s/side", tempo: "1-0-1-0", rest: "30s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "fri-jp-3h-1", phase: "Strength", name: "Double-Leg Squat", setsReps: "6x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-3h-2", phase: "Strength", name: "Single-Leg Squat", setsReps: "5x6/leg", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-3h-3", phase: "Strength", name: "Leg Press", setsReps: "4x8-10", tempo: "2-0-1-1", rest: "90s" },
                { id: "fri-jp-3h-4", phase: "Strength", name: "Nordic Curl", setsReps: "3x5", tempo: "3-0-2-0", rest: "90s" },
                { id: "fri-jp-3h-5", phase: "Aesthetic", name: "Calf Raise", setsReps: "4x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "fri-jp-3h-6", phase: "Aesthetic", name: "Couch Stretch", setsReps: "4x45s/side", tempo: "1-0-1-0", rest: "30s" },
                { id: "fri-jp-3h-7", phase: "Aesthetic", name: "Hip Flexor Stretch", setsReps: "3x45s/side", tempo: "1-0-1-0", rest: "30s" }
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
              drills: [
                { id: "sat-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "medium", name: "Accuracy Focus", description: "High percentage looks", reps: { type: "makes", makes: 20 } },
                { id: "sat-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "medium", name: "Defensive Pressure", description: "Handle with defense", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "sat-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "medium", name: "Power Moves", description: "Dominant finishes", reps: { type: "makesPerHand", rightMakes: 11 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "sat-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Accuracy Focus", description: "High percentage looks", reps: { type: "makes", makes: 20 } },
                { id: "sat-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "low", name: "Game Simulation", description: "Simulated game conditions", reps: { type: "makes", makes: 15 } },
                { id: "sat-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "Defensive Pressure", description: "Handle with defense", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "sat-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "high", name: "Speed Handling", description: "Maximum velocity drills", reps: { type: "setsPerHand", sets: 5, rightReps: 10 } },
                { id: "sat-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "medium", name: "Power Moves", description: "Dominant finishes", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "sat-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "low", name: "Footwork", description: "Footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 13 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "sat-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Accuracy Focus", description: "High percentage looks", reps: { type: "makes", makes: 20 } },
                { id: "sat-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Game Simulation", description: "Simulated game conditions", reps: { type: "makes", makes: 15 } },
                { id: "sat-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Under Pressure", description: "Closing shooters drills", reps: { type: "makes", makes: 13 } },
                { id: "sat-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "high", name: "Rapid Fire", description: "Quick succession shots", reps: { type: "makes", makes: 16 } },
                { id: "sat-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Defensive Pressure", description: "Handle with defense", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "sat-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "high", name: "Speed Handling", description: "Maximum velocity drills", reps: { type: "setsPerHand", sets: 5, rightReps: 10 } },
                { id: "sat-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Decision Making", description: "Read and react drills", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "sat-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "low", name: "Flow State", description: "Continuous motion drills", reps: { type: "setsPerHand", sets: 6, rightReps: 12 } },
                { id: "sat-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Power Moves", description: "Dominant finishes", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "sat-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Footwork", description: "Footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 13 } },
                { id: "sat-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "high", name: "Explosiveness", description: "Quick explosive finishes", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "sat-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Composure", description: "Calm, controlled finishes", reps: { type: "makesPerHand", rightMakes: 12 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "sat-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Accuracy Focus", description: "High percentage looks", reps: { type: "makes", makes: 20 } },
                { id: "sat-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Game Simulation", description: "Simulated game conditions", reps: { type: "makes", makes: 15 } },
                { id: "sat-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Under Pressure", description: "Closing shooters drills", reps: { type: "makes", makes: 13 } },
                { id: "sat-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "high", name: "Rapid Fire", description: "Quick succession shots", reps: { type: "makes", makes: 16 } },
                { id: "sat-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Clutch Situations", description: "Late game clutch shots", reps: { type: "makes", makes: 12 } },
                { id: "sat-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "High Volume", description: "High volume shooting day", reps: { type: "makes", makes: 25 } },
                { id: "sat-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Defensive Pressure", description: "Handle with defense", reps: { type: "setsPerHand", sets: 4, rightReps: 12 } },
                { id: "sat-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Speed Handling", description: "Maximum velocity drills", reps: { type: "setsPerHand", sets: 5, rightReps: 10 } },
                { id: "sat-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Decision Making", description: "Read and react drills", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "sat-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Flow State", description: "Continuous motion drills", reps: { type: "setsPerHand", sets: 6, rightReps: 12 } },
                { id: "sat-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "high", name: "Game Pace", description: "Game tempo handling", reps: { type: "setsPerHand", sets: 5, rightReps: 16 } },
                { id: "sat-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Confidence Building", description: "Comfortable zone drills", reps: { type: "setsPerHand", sets: 6, rightReps: 15 } },
                { id: "sat-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Power Moves", description: "Dominant finishes", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "sat-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Footwork", description: "Footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 13 } },
                { id: "sat-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Explosiveness", description: "Quick explosive finishes", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "sat-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Composure", description: "Calm, controlled finishes", reps: { type: "makesPerHand", rightMakes: 12 } },
                { id: "sat-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Variety", description: "Multiple finishing styles", reps: { type: "makesPerHand", rightMakes: 14 } },
                { id: "sat-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "high", name: "Game Prep", description: "Pre-game finishing prep", reps: { type: "makesPerHand", rightMakes: 15 } }
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
    },
    {
      day: "Sunday",
      focus: "Active Recovery / Mobility",
      categoryWorkouts: [
        {
          category: "weightlifting",
          workouts: [
            {
              duration: "30m",
              exercises: [
                { id: "sun-wl-30-1", phase: "Strength", name: "Light DB Rows", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-30-2", phase: "Aesthetic", name: "Foam Roll Thoracic Spine", setsReps: "3x10", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "sun-wl-1h-1", phase: "Strength", name: "Light DB Bench Press", setsReps: "3x8", tempo: "2-0-1-1", rest: "90s" },
                { id: "sun-wl-1h-2", phase: "Strength", name: "Light DB Rows", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-1h-3", phase: "Aesthetic", name: "Foam Roll Thoracic Spine", setsReps: "3x10", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "sun-wl-2h-1", phase: "Strength", name: "Light DB Bench Press", setsReps: "3x8", tempo: "2-0-1-1", rest: "90s" },
                { id: "sun-wl-2h-2", phase: "Strength", name: "Light DB Rows", setsReps: "4x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-2h-3", phase: "Strength", name: "Scapular Push-Ups", setsReps: "3x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-2h-4", phase: "Aesthetic", name: "Foam Roll Thoracic Spine", setsReps: "3x10", tempo: "1-0-1-0", rest: "45s" },
                { id: "sun-wl-2h-5", phase: "Aesthetic", name: "Lat Stretch", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "30s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "sun-wl-3h-1", phase: "Strength", name: "Light DB Bench Press", setsReps: "4x8", tempo: "2-0-1-1", rest: "90s" },
                { id: "sun-wl-3h-2", phase: "Strength", name: "Light DB Rows", setsReps: "5x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-3h-3", phase: "Strength", name: "Scapular Push-Ups", setsReps: "4x12", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-3h-4", phase: "Strength", name: "Light DB Curls", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-wl-3h-5", phase: "Aesthetic", name: "Foam Roll Thoracic Spine", setsReps: "3x10", tempo: "1-0-1-0", rest: "45s" },
                { id: "sun-wl-3h-6", phase: "Aesthetic", name: "Lat Stretch", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "30s" },
                { id: "sun-wl-3h-7", phase: "Aesthetic", name: "Pec Stretch", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "30s" }
              ]
            }
          ]
        },
        {
          category: "basketball",
          workouts: [
            {
              duration: "30m",
              drills: [
                { id: "sun-bb-30-shooting-1", category: "basketball", subCategory: "shooting", duration: "30m", intensity: "low", name: "Recovery Shooting", description: "Light, low intensity shooting", reps: { type: "makes", makes: 12 } },
                { id: "sun-bb-30-bh-1", category: "basketball", subCategory: "ballHandling", duration: "30m", intensity: "low", name: "Light Handling", description: "Easy, relaxed ball work", reps: { type: "setsPerHand", sets: 2, rightReps: 15 } },
                { id: "sun-bb-30-finishing-1", category: "basketball", subCategory: "finishing", duration: "30m", intensity: "low", name: "Footwork Drills", description: "Basic footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 8 } }
              ]
            },
            {
              duration: "1h",
              drills: [
                { id: "sun-bb-1h-shooting-1", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "low", name: "Recovery Shooting", description: "Light, low intensity shooting", reps: { type: "makes", makes: 12 } },
                { id: "sun-bb-1h-shooting-2", category: "basketball", subCategory: "shooting", duration: "1h", intensity: "medium", name: "Form Work", description: "Focus on shooting form", reps: { type: "makes", makes: 14 } },
                { id: "sun-bb-1h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "low", name: "Light Handling", description: "Easy, relaxed ball work", reps: { type: "setsPerHand", sets: 2, rightReps: 15 } },
                { id: "sun-bb-1h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "1h", intensity: "medium", name: "Fundamentals", description: "Basic ball handling skills", reps: { type: "setsPerHand", sets: 3, rightReps: 10 } },
                { id: "sun-bb-1h-finishing-1", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "low", name: "Footwork Drills", description: "Basic footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "sun-bb-1h-finishing-2", category: "basketball", subCategory: "finishing", duration: "1h", intensity: "medium", name: "Touch Work", description: "Soft touch around the basket", reps: { type: "makesPerHand", rightMakes: 10 } }
              ]
            },
            {
              duration: "2h",
              drills: [
                { id: "sun-bb-2h-shooting-1", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Recovery Shooting", description: "Light, low intensity shooting", reps: { type: "makes", makes: 12 } },
                { id: "sun-bb-2h-shooting-2", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Form Work", description: "Focus on shooting form", reps: { type: "makes", makes: 14 } },
                { id: "sun-bb-2h-shooting-3", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "low", name: "Spot Shooting", description: "Comfortable range spots", reps: { type: "makes", makes: 13 } },
                { id: "sun-bb-2h-shooting-4", category: "basketball", subCategory: "shooting", duration: "2h", intensity: "medium", name: "Confidence Building", description: "Get feeling back", reps: { type: "makes", makes: 15 } },
                { id: "sun-bb-2h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "low", name: "Light Handling", description: "Easy, relaxed ball work", reps: { type: "setsPerHand", sets: 2, rightReps: 15 } },
                { id: "sun-bb-2h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Fundamentals", description: "Basic ball handling skills", reps: { type: "setsPerHand", sets: 3, rightReps: 10 } },
                { id: "sun-bb-2h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "low", name: "Muscle Memory", description: "Repetitive basic moves", reps: { type: "setsPerHand", sets: 3, rightReps: 12 } },
                { id: "sun-bb-2h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "2h", intensity: "medium", name: "Flow Drills", description: "Natural continuous movement", reps: { type: "setsPerHand", sets: 4, rightReps: 10 } },
                { id: "sun-bb-2h-finishing-1", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Footwork Drills", description: "Basic footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "sun-bb-2h-finishing-2", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Touch Work", description: "Soft touch around the basket", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "sun-bb-2h-finishing-3", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "low", name: "Finishing Basics", description: "Simple finish attempts", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "sun-bb-2h-finishing-4", category: "basketball", subCategory: "finishing", duration: "2h", intensity: "medium", name: "Rim Feel", description: "Get comfortable at the basket", reps: { type: "makesPerHand", rightMakes: 11 } }
              ]
            },
            {
              duration: "3h",
              drills: [
                { id: "sun-bb-3h-shooting-1", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Recovery Shooting", description: "Light, low intensity shooting", reps: { type: "makes", makes: 12 } },
                { id: "sun-bb-3h-shooting-2", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Form Work", description: "Focus on shooting form", reps: { type: "makes", makes: 14 } },
                { id: "sun-bb-3h-shooting-3", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Spot Shooting", description: "Comfortable range spots", reps: { type: "makes", makes: 13 } },
                { id: "sun-bb-3h-shooting-4", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Confidence Building", description: "Get feeling back", reps: { type: "makes", makes: 15 } },
                { id: "sun-bb-3h-shooting-5", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "low", name: "Groove Shooting", description: "Get into a rhythm", reps: { type: "makes", makes: 17 } },
                { id: "sun-bb-3h-shooting-6", category: "basketball", subCategory: "shooting", duration: "3h", intensity: "medium", name: "Mental Reset", description: "Relax and reset mentally", reps: { type: "makes", makes: 16 } },
                { id: "sun-bb-3h-bh-1", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Light Handling", description: "Easy, relaxed ball work", reps: { type: "setsPerHand", sets: 2, rightReps: 15 } },
                { id: "sun-bb-3h-bh-2", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Fundamentals", description: "Basic ball handling skills", reps: { type: "setsPerHand", sets: 3, rightReps: 10 } },
                { id: "sun-bb-3h-bh-3", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Muscle Memory", description: "Repetitive basic moves", reps: { type: "setsPerHand", sets: 3, rightReps: 12 } },
                { id: "sun-bb-3h-bh-4", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Flow Drills", description: "Natural continuous movement", reps: { type: "setsPerHand", sets: 4, rightReps: 10 } },
                { id: "sun-bb-3h-bh-5", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "low", name: "Comfortable Pace", description: "Relaxed, easy pace", reps: { type: "setsPerHand", sets: 4, rightReps: 14 } },
                { id: "sun-bb-3h-bh-6", category: "basketball", subCategory: "ballHandling", duration: "3h", intensity: "medium", name: "Connection", description: "Feel connection with ball", reps: { type: "setsPerHand", sets: 5, rightReps: 12 } },
                { id: "sun-bb-3h-finishing-1", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Footwork Drills", description: "Basic footwork fundamentals", reps: { type: "makesPerHand", rightMakes: 8 } },
                { id: "sun-bb-3h-finishing-2", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Touch Work", description: "Soft touch around the basket", reps: { type: "makesPerHand", rightMakes: 10 } },
                { id: "sun-bb-3h-finishing-3", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Finishing Basics", description: "Simple finish attempts", reps: { type: "makesPerHand", rightMakes: 9 } },
                { id: "sun-bb-3h-finishing-4", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Rim Feel", description: "Get comfortable at the basket", reps: { type: "makesPerHand", rightMakes: 11 } },
                { id: "sun-bb-3h-finishing-5", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "low", name: "Rhythm Finishes", description: "Get rhythm at the basket", reps: { type: "makesPerHand", rightMakes: 12 } },
                { id: "sun-bb-3h-finishing-6", category: "basketball", subCategory: "finishing", duration: "3h", intensity: "medium", name: "Recovery Week", description: "Low stress finishing work", reps: { type: "makesPerHand", rightMakes: 10 } }
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
                { id: "sun-jp-30-1", phase: "Strength", name: "Light Mobility Work", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-30-2", phase: "Aesthetic", name: "Foam Roll Quads", setsReps: "3x10/side", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "1h",
              exercises: [
                { id: "sun-jp-1h-1", phase: "Strength", name: "Bodyweight Squat", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-1h-2", phase: "Strength", name: "Light Mobility Work", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-1h-3", phase: "Aesthetic", name: "Foam Roll Quads", setsReps: "3x10/side", tempo: "1-0-1-0", rest: "45s" }
              ]
            },
            {
              duration: "2h",
              exercises: [
                { id: "sun-jp-2h-1", phase: "Strength", name: "Bodyweight Squat", setsReps: "4x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-2h-2", phase: "Strength", name: "Light Mobility Work", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-2h-3", phase: "Strength", name: "Inchworm", setsReps: "3x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-2h-4", phase: "Aesthetic", name: "Foam Roll Quads", setsReps: "3x10/side", tempo: "1-0-1-0", rest: "45s" },
                { id: "sun-jp-2h-5", phase: "Aesthetic", name: "Quad Stretch", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "30s" }
              ]
            },
            {
              duration: "3h",
              exercises: [
                { id: "sun-jp-3h-1", phase: "Strength", name: "Bodyweight Squat", setsReps: "5x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-3h-2", phase: "Strength", name: "Light Mobility Work", setsReps: "4x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-3h-3", phase: "Strength", name: "Inchworm", setsReps: "4x10", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-3h-4", phase: "Strength", name: "Glute Bridge", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" },
                { id: "sun-jp-3h-5", phase: "Aesthetic", name: "Foam Roll Quads", setsReps: "3x10/side", tempo: "1-0-1-0", rest: "45s" },
                { id: "sun-jp-3h-6", phase: "Aesthetic", name: "Quad Stretch", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "30s" },
                { id: "sun-jp-3h-7", phase: "Aesthetic", name: "Hip Flexor Stretch", setsReps: "3x30s/side", tempo: "1-0-1-0", rest: "30s" }
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
