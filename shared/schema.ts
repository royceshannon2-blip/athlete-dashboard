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

export const basketballRepSchema = z.union([
  z.object({ type: z.literal("makes"), makes: z.number() }),
  z.object({ type: z.literal("setsPerHand"), sets: z.number(), rightReps: z.number() }),
  z.object({ type: z.literal("makesPerHand"), rightMakes: z.number() }),
]);

export const basketballDrillSchema = z.object({
  id: z.string(),
  category: z.literal("basketball"),
  subCategory: z.enum(["shooting", "ballHandling", "finishing"]),
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  name: z.string(),
  description: z.string(),
  phase: z.enum(["Plyo", "Strength", "Aesthetic"]),
  reps: basketballRepSchema,
});

export const durationWorkoutSchema = z.object({
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  exercises: z.array(exerciseSchema),
});

export const basketballDurationWorkoutSchema = z.object({
  duration: z.enum(["30m", "1h", "2h", "3h"]),
  drills: z.array(basketballDrillSchema),
});

export const categoryWorkoutSchema = z.union([
  z.object({
    category: z.literal("basketball"),
    workouts: z.array(basketballDurationWorkoutSchema),
  }),
  z.object({
    category: z.enum(["weightlifting", "jumping"]),
    workouts: z.array(durationWorkoutSchema),
  }),
]);

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
export type BasketballRep = z.infer<typeof basketballRepSchema>;
export type BasketballDrill = z.infer<typeof basketballDrillSchema>;
export type DurationWorkout = z.infer<typeof durationWorkoutSchema>;
export type BasketballDurationWorkout = z.infer<typeof basketballDurationWorkoutSchema>;
export type CategoryWorkout = z.infer<typeof categoryWorkoutSchema>;
export type DayWorkoutV2 = z.infer<typeof dayWorkoutV2Schema>;
export type WorkoutsData = z.infer<typeof workoutsDataSchema>;
export type DayWorkout = z.infer<typeof dayWorkoutSchema>;
