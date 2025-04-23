import { useAuth } from "@/components/auth-context";
import { API_ROUTES } from "@/lib/constants";
import { Workout } from "@/lib/types";
import { CreateWorkoutValues } from "@/lib/validations";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useCreateWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.access_token;

  const mutation = useMutation({
    mutationFn: async (workout: CreateWorkoutValues) => {
      const response = await ky.post(API_ROUTES.WORKOUTS, {
        json: workout,
        headers: { Authorization: `Bearer ${user?.access_token}` },
      });
      return response.json<Workout>();
    },
    onSuccess: async (newWorkout) => {
      // toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);

      const queryKey: QueryKey = ["workouts", userId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Workout[]>(queryKey, (oldData) => {
        if (oldData) {
          return [...oldData, newWorkout];
        }
      });

      queryClient.invalidateQueries({
        queryKey: queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
    },
    onError(error) {
      console.error(error);
      //toast.error("Failed to submit comment. Please try again.");
    },
  });

  return mutation;
}
