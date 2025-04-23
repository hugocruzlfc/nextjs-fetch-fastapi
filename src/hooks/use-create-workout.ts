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
  const queryKeyWorkouts: QueryKey = ["workouts", userId];

  const mutation = useMutation({
    mutationFn: async (workout: CreateWorkoutValues) => {
      const response = await ky.post(API_ROUTES.WORKOUTS, {
        json: workout,
        headers: { Authorization: `Bearer ${user?.access_token}` },
      });
      return response.json();
    },
    onMutate: async () => {
      // toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);

      await queryClient.cancelQueries({ queryKey: queryKeyWorkouts });

      const previousState = queryClient.getQueryData<Workout>(queryKeyWorkouts);

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKeyWorkouts, context?.previousState);
      console.error(error);
      // toast.error("Something went wrong. Please try again.");
    },
  });

  return mutation;
}
