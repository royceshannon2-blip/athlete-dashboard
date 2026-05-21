export interface SeedWeightEntry {
  exerciseId: string;
  exerciseName: string;
  date: string;
  setNumber: number;
  weightKg: number;
  targetReps: string;
}

export interface ScheduledExercise {
  day: string;
  category: string;
  duration: string;
  exercises: Array<{ id: string; name: string }>;
}

export interface BasketballDrillLog {
  drillId: string;
  drillName: string;
  date: string;
  repsType: string;
  repsValue: number | { makes?: number; sets?: number; reps?: number };
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function seedWeightLog(entries: SeedWeightEntry[]): void {
  // Seed individual entries and update index
  const index = new Set<string>(getStorageIndex());

  for (const entry of entries) {
    const key = `wt:log:${entry.exerciseId}:${entry.date}:${entry.setNumber}`;
    const value = {
      id: `${entry.exerciseId}-${entry.date}-${entry.setNumber}`,
      exerciseId: entry.exerciseId,
      exerciseName: entry.exerciseName,
      date: entry.date,
      sessionTs: new Date(entry.date).getTime(),
      setNumber: entry.setNumber,
      targetReps: entry.targetReps,
      weightKg: entry.weightKg,
      unit: "kg",
    };
    localStorage.setItem(key, JSON.stringify(value));
    index.add(key);
  }

  setStorageIndex(Array.from(index));
}

export function seedBasketballDrillLog(entries: BasketballDrillLog[]): void {
  // Basketball uses a different structure - drill completion tracking
  const index = new Set<string>(getStorageIndex());

  for (const entry of entries) {
    const key = `wt:drill:${entry.drillId}:${entry.date}`;
    const value = {
      drillId: entry.drillId,
      drillName: entry.drillName,
      date: entry.date,
      sessionTs: new Date(entry.date).getTime(),
      repsType: entry.repsType,
      repsValue: entry.repsValue,
    };
    localStorage.setItem(key, JSON.stringify(value));
    index.add(key);
  }

  setStorageIndex(Array.from(index));
}

export function clearWeightLog(): void {
  // Remove all wt:* keys from localStorage
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("wt:"));
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

export function seedWorkoutSchedule(exercises: ScheduledExercise[]): void {
  // Store schedule overrides for testing future/past dates
  const scheduleKey = "wt:test:schedule";
  localStorage.setItem(scheduleKey, JSON.stringify(exercises));
}

function getStorageIndex(): string[] {
  const raw = localStorage.getItem("wt:index");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setStorageIndex(keys: string[]): void {
  localStorage.setItem("wt:index", JSON.stringify(keys));
}
