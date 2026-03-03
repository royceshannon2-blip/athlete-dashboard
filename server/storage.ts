import { type DayWorkout } from "@shared/schema";

export interface IStorage {
  getWorkouts(): Promise<DayWorkout[]>;
}

export class MemStorage implements IStorage {
  private workouts: DayWorkout[] = [
    {
      id: "mon",
      day: "Monday",
      focus: "Linear/Glutes",
      exercises: [
        { id: "mon-1", phase: "Plyo", name: "DB Countermovement Jump", setsReps: "3x5", tempo: "3-0-X-1", rest: "90s" },
        { id: "mon-2", phase: "Strength", name: "Smith Squat", setsReps: "3x6-8", tempo: "3-0-X-1", rest: "120s" },
        { id: "mon-3", phase: "Aesthetic", name: "Cable Glute Kickbacks", setsReps: "3x12-15", tempo: "2-0-1-1", rest: "60s" }
      ]
    },
    {
      id: "tue",
      day: "Tuesday",
      focus: "Lateral/Shoulders",
      exercises: [
        { id: "tue-1", phase: "Plyo", name: "Heiden Bounds", setsReps: "4x6/side", tempo: "X-0-X-1", rest: "90s" },
        { id: "tue-2", phase: "Strength", name: "Smith OHP", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
        { id: "tue-3", phase: "Aesthetic", name: "DB Lateral Raises", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
      ]
    },
    {
      id: "wed",
      day: "Wednesday",
      focus: "Vertical/Posterior",
      exercises: [
        { id: "wed-1", phase: "Plyo", name: "Broad Jumps", setsReps: "4x4", tempo: "X-0-X-1", rest: "90s" },
        { id: "wed-2", phase: "Strength", name: "DB RDLs", setsReps: "3x8-10", tempo: "3-0-X-1", rest: "120s" },
        { id: "wed-3", phase: "Aesthetic", name: "Cable Pull-Throughs", setsReps: "3x15", tempo: "2-0-1-1", rest: "60s" }
      ]
    },
    {
      id: "thu",
      day: "Thursday",
      focus: "COD/Core",
      exercises: [
        { id: "thu-1", phase: "Plyo", name: "Med Ball Wall Tosses", setsReps: "3x6/side", tempo: "X-0-X-1", rest: "90s" },
        { id: "thu-2", phase: "Strength", name: "Smith Bent Over Row", setsReps: "3x8", tempo: "3-0-X-1", rest: "120s" },
        { id: "thu-3", phase: "Aesthetic", name: "Plank with Hip Dips", setsReps: "3x20", tempo: "1-0-1-0", rest: "60s" }
      ]
    }
  ];

  async getWorkouts(): Promise<DayWorkout[]> {
    return this.workouts;
  }
}

export const storage = new MemStorage();
