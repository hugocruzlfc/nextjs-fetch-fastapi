import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const createWorkoutSchema = z.object({
  name: requiredString,
  description: requiredString,
});
export type CreateWorkoutValues = z.infer<typeof createWorkoutSchema>;

export const createRoutineSchema = z.object({
  name: requiredString,
  description: requiredString,
  workouts: requiredString,
});
export type CreateRoutineValues = z.infer<typeof createRoutineSchema>;
