"use client";
import { useAuth } from "@/components/auth-context";
import CreateRoutineForm from "@/components/create-routine-form";
import CreateWorkoutForm from "@/components/create-workout-form";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import ProtectedRoute from "@/components/protected-routes";
import RoutineTile from "@/components/routine-tile";
import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/constants";

import { RoutinesPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import ky from "ky";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();

  const userId = user?.access_token;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["routines", userId],
    queryFn: () =>
      ky
        .get(API_ROUTES.ROUTINES, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
        })
        .json<RoutinesPage>(),
    enabled: !!userId,
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const routines = data?.pages.flatMap((page) => page.routines) || [];

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "success" && !routines.length && !hasNextPage) {
    return (
      <p className="text-muted-foreground text-center">
        You don&apos;t have any routines yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading routines.
      </p>
    );
  }

  return (
    <ProtectedRoute>
      <>
        <h1>Welcome!</h1>
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
        <div className="space-y-5 p-2 md:p-10">
          <CreateWorkoutForm />
          <CreateRoutineForm />
        </div>

        <div className="space-y-5 p-2 md:p-10">
          <h3>Your routines:</h3>

          <InfiniteScrollContainer
            className="flex flex-col gap-2 md:flex-row"
            onBottomReached={() =>
              hasNextPage && !isFetching && fetchNextPage()
            }
          >
            {routines.map((routine) => (
              <RoutineTile key={routine.id} routine={routine} />
            ))}
            {isFetchingNextPage && (
              <Loader2 className="mx-auto my-3 animate-spin" />
            )}
          </InfiniteScrollContainer>
        </div>
      </>
    </ProtectedRoute>
  );
}
