"use client";
import { useAuth } from "@/components/auth-context";
import CreateRoutineForm from "@/components/create-routine-form";
import CreateWorkoutForm from "@/components/create-workout-form";
import ProtectedRoute from "@/components/protected-routes";
import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/constants";

import { Routine } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export default function Home() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const userId = user?.access_token;

  const queryRoutines = useQuery({
    queryKey: ["routines", userId],
    queryFn: () =>
      ky
        .get(API_ROUTES.ROUTINES, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
        })
        .json<Routine[]>(),
    enabled: !!userId,
    staleTime: Infinity,
  });

  return (
    <ProtectedRoute>
      <>
        <h1>Welcome!</h1>
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
        <div className="space-y-5 p-10">
          <CreateWorkoutForm />
          <CreateRoutineForm />
        </div>

        <div>
          <h3>Your routines:</h3>

          <ul>
            {queryRoutines.data?.map((routine) => (
              <li key={routine.id} className="p-2">
                <h4 className="text-sm font-semibold">{routine.name}</h4>
                <p>{routine.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    </ProtectedRoute>
  );
}
