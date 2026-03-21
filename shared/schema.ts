import { z } from "zod";

export const exerciseSchema = z.object({
  id: z.string(),
  phase: z.enum(["Plyo", "Strength", "Aesthetic"]),
  name: z.string(),
  setsReps: z.string(),
  tempo: z.string(),
  rest: z.string(),
  note: z.string().optional(),
});

export const dayWorkoutSchema = z.object({
  id: z.string(),
  day: z.string(),
  focus: z.string(),
  exercises: z.array(exerciseSchema),
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type DayWorkout = z.infer<typeof dayWorkoutSchema>;
