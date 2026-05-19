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

export const durationWorkoutSchema = z.object({
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  exercises: z.array(exerciseSchema),
});

export const categoryWorkoutSchema = z.object({
  category: z.enum(["basketball", "weightlifting", "jumping"]),
  workouts: z.array(durationWorkoutSchema),
});

export const dayWorkoutV2Schema = z.object({
  day: z.string(),
  focus: z.string().optional(),
  categoryWorkouts: z.array(categoryWorkoutSchema),
});

export const workoutsDataSchema = z.object({
  categories: z.array(z.string()),
  durations: z.array(z.string()),
  workouts: z.array(dayWorkoutV2Schema),
});

// Legacy schema (kept for backwards compatibility reference)
export const dayWorkoutSchema = z.object({
  id: z.string(),
  day: z.string(),
  focus: z.string(),
  exercises: z.array(exerciseSchema),
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type DurationWorkout = z.infer<typeof durationWorkoutSchema>;
export type CategoryWorkout = z.infer<typeof categoryWorkoutSchema>;
export type DayWorkoutV2 = z.infer<typeof dayWorkoutV2Schema>;
export type WorkoutsData = z.infer<typeof workoutsDataSchema>;
export type DayWorkout = z.infer<typeof dayWorkoutSchema>;
