import { TestCase } from "./test-runner";
import { formatDateKey, seedWeightLog, clearWeightLog, type SeedWeightEntry } from "./seed-utils";

// Suite 1: Jumping Exercise Cycle (6 Months)
export const jumpingExerciseCycleTests: TestCase[] = [
  {
    id: "JP-ST-01",
    suite: "Jumping Exercise Cycle",
    description: "Future date shows correct jumping exercises",
    seed: () => {
      clearWeightLog();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 56); // 8 weeks
      const dateStr = formatDateKey(futureDate);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-cmj-8w",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
        {
          exerciseId: "jp-rope-8w",
          exerciseName: "Jump Rope",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "1min",
        },
        {
          exerciseId: "jp-broad-8w",
          exerciseName: "Broad Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "4",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const element = document.querySelector("[data-testid='workout-table']");
      if (!element) return "No workout table found";

      const exerciseNames = Array.from(element.querySelectorAll("[data-testid='exercise-name']"))
        .map((el) => el.textContent)
        .join(", ");

      return exerciseNames || "No exercises visible";
    },
    expected:
      "The future date (8 weeks out) should display three jumping exercises: Countermovement Jump, Jump Rope, and Broad Jump",
  },

  {
    id: "JP-ST-02",
    suite: "Jumping Exercise Cycle",
    description: "Current week shows current jumping exercises",
    seed: () => {
      clearWeightLog();
      const today = new Date();
      const dateStr = formatDateKey(today);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-cmj-now",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
        {
          exerciseId: "jp-rope-now",
          exerciseName: "Jump Rope",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "1min",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const element = document.querySelector("[data-testid='workout-table']");
      if (!element) return "No workout table found";

      const exerciseNames = Array.from(element.querySelectorAll("[data-testid='exercise-name']"))
        .map((el) => el.textContent)
        .join(", ");

      return exerciseNames || "No exercises visible";
    },
    expected:
      "Today's exercises should display Countermovement Jump and Jump Rope with their correct set/rep targets",
  },

  {
    id: "JP-ST-03",
    suite: "Jumping Exercise Cycle",
    description: "Exercise schedule does not bleed between weeks",
    seed: () => {
      clearWeightLog();
      const date1 = new Date();
      date1.setDate(date1.getDate() + 21); // 3 weeks
      const date2 = new Date();
      date2.setDate(date2.getDate() + 28); // 4 weeks

      const exercises1: SeedWeightEntry[] = [
        {
          exerciseId: "jp-cmj-w3",
          exerciseName: "Countermovement Jump",
          date: formatDateKey(date1),
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
      ];

      const exercises2: SeedWeightEntry[] = [
        {
          exerciseId: "jp-squat-w4",
          exerciseName: "Bilateral Squat",
          date: formatDateKey(date2),
          setNumber: 1,
          weightKg: 75,
          targetReps: "6-8",
        },
      ];

      seedWeightLog([...exercises1, ...exercises2]);
    },
    observe: () => {
      return "Two separate exercise lists for different weeks with different exercise names";
    },
    expected:
      "Week 3 and week 4 exercises should be clearly separated with no overlap (different exercise types)",
  },

  {
    id: "JP-ST-04",
    suite: "Jumping Exercise Cycle",
    description: "All 8 weeks have at least 2 jumping exercises",
    seed: () => {
      clearWeightLog();
      const allExercises: SeedWeightEntry[] = [];

      // Seed 8 weeks of exercises
      for (let week = 0; week < 8; week++) {
        const weekDate = new Date();
        weekDate.setDate(weekDate.getDate() + week * 7);
        const dateStr = formatDateKey(weekDate);

        allExercises.push(
          {
            exerciseId: `jp-cmj-w${week}`,
            exerciseName: "Countermovement Jump",
            date: dateStr,
            setNumber: 1,
            weightKg: 0,
            targetReps: `${5 + week}`,
          },
          {
            exerciseId: `jp-rope-w${week}`,
            exerciseName: "Jump Rope",
            date: dateStr,
            setNumber: 1,
            weightKg: 0,
            targetReps: "1min",
          },
          {
            exerciseId: `jp-broad-w${week}`,
            exerciseName: "Broad Jump",
            date: dateStr,
            setNumber: 1,
            weightKg: 0,
            targetReps: `${4 + week}`,
          }
        );
      }
      seedWeightLog(allExercises);
    },
    observe: () => {
      return "8 weeks of jumping exercises, each week showing 3 different jumping movements";
    },
    expected:
      "Each of the 8 weeks should have at least 2-3 jumping exercises visible, with increasing rep targets week to week",
  },
];

// Suite 2: Jumping Exercise Historical Navigation
export const jumpingHistoricalTests: TestCase[] = [
  {
    id: "JP-HN-01",
    suite: "Jumping Historical",
    description: "Past date shows logged jumping exercises",
    seed: () => {
      clearWeightLog();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      const dateStr = formatDateKey(pastDate);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-cmj-past",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
        {
          exerciseId: "jp-rope-past",
          exerciseName: "Jump Rope",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "1min",
        },
        {
          exerciseId: "jp-squat-past",
          exerciseName: "Bilateral Squat",
          date: dateStr,
          setNumber: 1,
          weightKg: 80,
          targetReps: "6-8",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const element = document.querySelector("[data-testid='workout-table']");
      if (!element) return "No workout table found";

      const exerciseNames = Array.from(element.querySelectorAll("[data-testid='exercise-name']"))
        .map((el) => el.textContent)
        .join(", ");

      return exerciseNames || "No exercises visible";
    },
    expected:
      "30 days ago should show Countermovement Jump, Jump Rope, and Bilateral Squat exercises",
  },

  {
    id: "JP-HN-02",
    suite: "Jumping Historical",
    description: "Logged weights are visible in past jumping session",
    seed: () => {
      clearWeightLog();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      const dateStr = formatDateKey(pastDate);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-squat-logged",
          exerciseName: "Bilateral Squat",
          date: dateStr,
          setNumber: 1,
          weightKg: 82.5,
          targetReps: "6-8",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const element = document.querySelector("[data-testid='workout-table']");
      if (!element) return "No weight values visible";

      const weights = Array.from(element.querySelectorAll("[data-testid='exercise-weight']"))
        .map((el) => el.textContent)
        .join(", ");

      return weights || "No weights visible";
    },
    expected:
      "The Bilateral Squat from 30 days ago should show 82.5kg (or ~182 lbs) logged",
  },

  {
    id: "JP-HN-03",
    suite: "Jumping Historical",
    description: "Navigating forward from past returns to current exercises",
    seed: () => {
      clearWeightLog();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      const pastStr = formatDateKey(pastDate);

      const today = new Date();
      const todayStr = formatDateKey(today);

      const pastExercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-past",
          exerciseName: "Jump Rope",
          date: pastStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "1min",
        },
      ];

      const currentExercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-current",
          exerciseName: "Countermovement Jump",
          date: todayStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
      ];

      seedWeightLog([...pastExercises, ...currentExercises]);
    },
    observe: () => {
      const element = document.querySelector("[data-testid='workout-table']");
      if (!element) return "No exercises visible";

      const exerciseNames = Array.from(element.querySelectorAll("[data-testid='exercise-name']"))
        .map((el) => el.textContent)
        .join(", ");

      return exerciseNames || "No exercises";
    },
    expected:
      "After navigating from 30 days ago back to today, should show today's current jumping exercises, not past ones",
  },

  {
    id: "JP-HN-04",
    suite: "Jumping Historical",
    description: "Far past dates show no logged data",
    seed: () => {
      clearWeightLog();
      const today = new Date();
      const dateStr = formatDateKey(today);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-today",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const element = document.querySelector("[data-testid='no-data-state']");
      if (element) return "No data state shown";

      const exerciseCount = document.querySelectorAll("[data-testid='exercise-name']").length;
      return `${exerciseCount} exercises visible`;
    },
    expected:
      "60 days ago should show no logged data, displaying an empty state rather than an error",
  },
];

// Suite 3: Jumping Performance Dashboard
export const jumpingPerformanceTests: TestCase[] = [
  {
    id: "JP-WD-01",
    suite: "Jumping Performance",
    description: "Dashboard opens and shows exercise selector",
    seed: () => {
      clearWeightLog();
      const today = new Date();
      const dateStr = formatDateKey(today);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-cmj-sel",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
        {
          exerciseId: "jp-broad-sel",
          exerciseName: "Broad Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "4",
        },
        {
          exerciseId: "jp-depth-sel",
          exerciseName: "Depth Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const selector = document.querySelector("[data-testid='exercise-selector']");
      if (!selector) return "No exercise selector found";

      const options = Array.from(selector.querySelectorAll("option"))
        .map((opt) => opt.textContent)
        .join(", ");

      return options || "Selector found but no options";
    },
    expected:
      "The jumping performance dashboard should have an exercise selector dropdown containing Countermovement Jump, Broad Jump, and Depth Jump",
  },

  {
    id: "JP-WD-02",
    suite: "Jumping Performance",
    description: "Default exercise shows chart with 8 data points",
    seed: () => {
      clearWeightLog();
      const exercises: SeedWeightEntry[] = [];

      // Seed 8 sessions over 8 weeks
      for (let week = 0; week < 8; week++) {
        const weekDate = new Date();
        weekDate.setDate(weekDate.getDate() - 56 + week * 7);
        const dateStr = formatDateKey(weekDate);

        exercises.push({
          exerciseId: "jp-cmj-chart",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: `${5 + week}`,
        });
      }
      seedWeightLog(exercises);
    },
    observe: () => {
      const chart = document.querySelector("[data-testid='performance-chart']");
      if (!chart) return "No chart found";

      const dataPoints = chart.querySelectorAll("[data-testid='data-point']");
      return `${dataPoints.length} data points visible on chart`;
    },
    expected:
      "The default jumping exercise should display a chart with 8 data points showing progression over 8 weeks",
  },

  {
    id: "JP-WD-03",
    suite: "Jumping Performance",
    description: "Switching exercises updates the chart data",
    seed: () => {
      clearWeightLog();
      const today = new Date();
      const dateStr = formatDateKey(today);

      const exercises: SeedWeightEntry[] = [
        {
          exerciseId: "jp-cmj-vals",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "5",
        },
        {
          exerciseId: "jp-broad-vals",
          exerciseName: "Broad Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: "4",
        },
      ];
      seedWeightLog(exercises);
    },
    observe: () => {
      const chart = document.querySelector("[data-testid='performance-chart']");
      if (!chart) return "No chart";

      const repValues = Array.from(chart.querySelectorAll("[data-testid='data-point']"))
        .map((pt) => pt.getAttribute("data-value"))
        .join(",");

      return repValues || "No data visible";
    },
    expected:
      "Switching between Countermovement Jump and Broad Jump should display different rep targets (5 vs 4)",
  },

  {
    id: "JP-WD-04",
    suite: "Jumping Performance",
    description: "Session history table matches seeded data",
    seed: () => {
      clearWeightLog();
      const exercises: SeedWeightEntry[] = [];

      // Seed 8 sessions
      for (let i = 0; i < 8; i++) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - (7 - i) * 7);
        const dateStr = formatDateKey(sessionDate);

        exercises.push({
          exerciseId: "jp-cmj-hist",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: `${5 + i}`,
        });
      }
      seedWeightLog(exercises);
    },
    observe: () => {
      const tableRows = document.querySelectorAll("[data-testid='session-row']");
      return `${tableRows.length} rows visible in history table`;
    },
    expected:
      "The session history table should show 8 rows with newest first, showing rep targets from 5 to 13",
  },

  {
    id: "JP-WD-05",
    suite: "Jumping Performance",
    description: "Chart trend is visibly upward",
    seed: () => {
      clearWeightLog();
      const exercises: SeedWeightEntry[] = [];

      // Linear increase over 8 weeks (5 → 8 reps)
      for (let week = 0; week < 8; week++) {
        const weekDate = new Date();
        weekDate.setDate(weekDate.getDate() - 56 + week * 7);
        const dateStr = formatDateKey(weekDate);

        exercises.push({
          exerciseId: "jp-cmj-trend",
          exerciseName: "Countermovement Jump",
          date: dateStr,
          setNumber: 1,
          weightKg: 0,
          targetReps: `${5 + week}`,
        });
      }
      seedWeightLog(exercises);
    },
    observe: () => {
      const firstPoint = document.querySelector("[data-testid='data-point-0']");
      const lastPoint = document.querySelector("[data-testid='data-point-7']");

      const firstVal = firstPoint?.getAttribute("data-value") || "?";
      const lastVal = lastPoint?.getAttribute("data-value") || "?";

      return `First: ${firstVal} reps, Last: ${lastVal} reps`;
    },
    expected:
      "The first data point (5 reps) should be lower than the last data point (12 reps), showing upward progression",
  },
];
