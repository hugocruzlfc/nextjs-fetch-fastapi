import { useAuth } from "@/components/auth-context";
import { API_ROUTES } from "@/lib/constants";
import { RoutinesPage } from "@/lib/types";
import { CreateRoutineValues } from "@/lib/validations";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";

export function useCreateRoutine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.access_token;

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
    onSuccess: async (newRoutine) => {
      const queryKey: QueryKey = ["routines", userId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<RoutinesPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  ...firstPage,
                  routines: [...firstPage.routines, newRoutine],
                },
                ...oldData.pages.slice(1),
              ],
            } as InfiniteData<RoutinesPage, string | null>;
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      // toast.success("Comment created");
    },
    onError(error) {
      console.error(error);
      // toast.error("Failed to submit comment. Please try again.");
    },
  });

  return mutation;
}
