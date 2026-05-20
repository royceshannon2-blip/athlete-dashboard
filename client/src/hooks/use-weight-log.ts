import { useState, useCallback } from "react";

const KG_TO_LBS = 2.20462;

export interface SetLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  sessionTs: number;
  setNumber: number;
  targetReps: string;
  weightKg: number;
  unit: "lbs" | "kg";
}

export interface WeightPrefs {
  defaultDurationSecs: number;
  autoStart: boolean;
  soundEnabled: boolean;
  unit: "lbs" | "kg";
}

export interface SessionSummary {
  date: string;
  sessionTs: number;
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  maxWeightKg: number;
  totalVolumeKg: number;
}

function parseSetsReps(setsReps: string): { sets: number; reps: string } {
  const match = setsReps.match(/^(\d+)x(.+)$/);
  if (!match) return { sets: 1, reps: setsReps };
  return { sets: parseInt(match[1]), reps: match[2] };
}

function toDisplayWeight(kg: number, unit: "lbs" | "kg"): number {
  return unit === "lbs" ? kg * KG_TO_LBS : kg;
}

function toKg(val: number, unit: "lbs" | "kg"): number {
  return unit === "lbs" ? val / KG_TO_LBS : val;
}

function getStorageIndex(): string[] {
  const index = localStorage.getItem("wt:index");
  return index ? JSON.parse(index) : [];
}

function setStorageIndex(keys: string[]): void {
  localStorage.setItem("wt:index", JSON.stringify(keys));
}

function loadPrefs(): WeightPrefs {
  const stored = localStorage.getItem("wt:prefs");
  return stored
    ? JSON.parse(stored)
    : {
        defaultDurationSecs: 120,
        autoStart: true,
        soundEnabled: true,
        unit: "lbs",
      };
}

function savePrefs(prefs: WeightPrefs): void {
  localStorage.setItem("wt:prefs", JSON.stringify(prefs));
}

export function useWeightLog() {
  const [prefs, setPrefs] = useState<WeightPrefs>(loadPrefs);

  const getAllLogs = useCallback((): SetLog[] => {
    const index = getStorageIndex();
    return index
      .map((key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      })
      .filter((log): log is SetLog => log !== null);
  }, []);

  const getLogsForExercise = useCallback(
    (exerciseId: string): SetLog[] => {
      return getAllLogs().filter((log) => log.exerciseId === exerciseId);
    },
    [getAllLogs]
  );

  const getLastWeight = useCallback(
    (exerciseId: string): { weightKg: number; unit: "lbs" | "kg" } | null => {
      const logs = getLogsForExercise(exerciseId);
      if (logs.length === 0) return null;
      const last = logs[logs.length - 1];
      return { weightKg: last.weightKg, unit: last.unit };
    },
    [getLogsForExercise]
  );

  const getSessionSummaries = useCallback(
    (exerciseId: string): SessionSummary[] => {
      const logs = getLogsForExercise(exerciseId);
      const byDate = new Map<string, SetLog[]>();
      logs.forEach((log) => {
        const list = byDate.get(log.date) ?? [];
        list.push(log);
        byDate.set(log.date, list);
      });

      return Array.from(byDate.entries())
        .map(([date, sets]) => {
          const sessionTs = sets[0].sessionTs;
          const maxWeightKg = Math.max(...sets.map((s) => s.weightKg));
          const totalVolumeKg = sets.reduce((sum, s) => {
            const reps = parseFloat(s.targetReps.split("-")[0]);
            return sum + s.weightKg * reps;
          }, 0);
          return {
            date,
            sessionTs,
            exerciseId,
            exerciseName: sets[0].exerciseName,
            sets,
            maxWeightKg,
            totalVolumeKg,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    [getLogsForExercise]
  );

  const logSet = useCallback(
    (
      exerciseId: string,
      exerciseName: string,
      setNumber: number,
      targetReps: string,
      weightKg: number,
      unit: "lbs" | "kg"
    ): void => {
      const date = new Date().toISOString().split("T")[0];
      let sessionTs = Date.now();

      const existing = getLogsForExercise(exerciseId);
      const sameDay = existing.find((log) => log.date === date);
      if (sameDay) {
        sessionTs = sameDay.sessionTs;
      }

      const id = `log-${sessionTs}-${Math.random().toString(36).substr(2, 9)}`;
      const entry: SetLog = {
        id,
        exerciseId,
        exerciseName,
        date,
        sessionTs,
        setNumber,
        targetReps,
        weightKg: toKg(weightKg, unit),
        unit,
      };

      const index = getStorageIndex();
      const key = `wt:log:${exerciseId}:${date}:${setNumber}`;
      localStorage.setItem(key, JSON.stringify(entry));
      if (!index.includes(key)) {
        index.push(key);
        setStorageIndex(index);
      }
    },
    [getLogsForExercise]
  );

  const clearExerciseLogs = useCallback((exerciseId: string): void => {
    const index = getStorageIndex();
    const keysToRemove = index.filter(
      (key) => key.includes(`wt:log:${exerciseId}:`)
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setStorageIndex(index.filter((key) => !keysToRemove.includes(key)));
  }, []);

  const exportCSV = useCallback((): void => {
    const logs = getAllLogs();
    if (logs.length === 0) {
      alert("No weight data to export");
      return;
    }

    const headers = [
      "Exercise Name",
      "Date",
      "Set Number",
      "Target Reps",
      "Weight (kg)",
      "Weight (lbs)",
    ];
    const rows = logs.map((log) => [
      log.exerciseName,
      log.date,
      log.setNumber,
      log.targetReps,
      log.weightKg.toFixed(2),
      toDisplayWeight(log.weightKg, "lbs").toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weight-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getAllLogs]);

  const exercisesWithLogs = useCallback((): { exerciseId: string; exerciseName: string }[] => {
    const logs = getAllLogs();
    const seen = new Set<string>();
    const exercises: { exerciseId: string; exerciseName: string }[] = [];
    logs.forEach((log) => {
      if (!seen.has(log.exerciseId)) {
        seen.add(log.exerciseId);
        exercises.push({ exerciseId: log.exerciseId, exerciseName: log.exerciseName });
      }
    });
    return exercises;
  }, [getAllLogs]);

  const updatePrefs = useCallback(
    (partial: Partial<WeightPrefs>): void => {
      const updated = { ...prefs, ...partial };
      setPrefs(updated);
      savePrefs(updated);
    },
    [prefs]
  );

  return {
    prefs,
    updatePrefs,
    logSet,
    getLastWeight,
    getAllLogs,
    getLogsForExercise,
    getSessionSummaries,
    clearExerciseLogs,
    exportCSV,
    exercisesWithLogs,
  };
}

export { toDisplayWeight, toKg, parseSetsReps };
