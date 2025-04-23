import { useAuth } from "@/components/auth-context";
import { API_ROUTES } from "@/lib/constants";
import { Workout } from "@/lib/types";
import { CreateRoutineValues } from "@/lib/validations";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useCreateRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.access_token;

  const queryKeyRoutines: QueryKey = ["routines", userId];

  const mutation = useMutation({
    mutationFn: async (routine: CreateRoutineValues) => {
      const response = await ky.post(API_ROUTES.ROUTINES, {
        json: {
          ...routine,
          workouts: [routine.workouts],
        },
        headers: { Authorization: `Bearer ${user?.access_token}` },
      });
      return response.json();
    },
    onMutate: async () => {
      // toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);

      await queryClient.cancelQueries({ queryKey: queryKeyRoutines });

      const previousState = queryClient.getQueryData<Workout>(queryKeyRoutines);

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKeyRoutines, context?.previousState);
      console.error(error);
      // toast.error("Something went wrong. Please try again.");
    },
  });

  return mutation;
}
