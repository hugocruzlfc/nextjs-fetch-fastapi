import { env } from "@/env";

export const API_ROUTES = {
  WORKOUTS: `${env.NEXT_PUBLIC_BACKEND_URL}/workouts`,
  ROUTINES: `${env.NEXT_PUBLIC_BACKEND_URL}/routines`,
  LOGIN: `${env.NEXT_PUBLIC_BACKEND_URL}/auth/token`,
  AUTH: `${env.NEXT_PUBLIC_BACKEND_URL}/auth`,
};
