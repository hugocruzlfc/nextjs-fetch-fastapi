"use client";
import { useAuth } from "@/components/auth-context";
import ProtectedRoute from "@/components/protected-routes";
import { API_ROUTES } from "@/lib/constants";

import { Routine, Workout } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";
import { useState } from "react";

export default function Home() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  console.log(user);

  const userId = user?.access_token;

  const queryWorkouts = useQuery({
    queryKey: ["workouts", userId],
    queryFn: () =>
      ky
        .get(API_ROUTES.WORKOUTS, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
        })
        .json<Workout[]>(),
    enabled: !!userId,
    staleTime: Infinity,
  });

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

  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  const queryKeyWorkouts: QueryKey = ["workouts", userId];
  const queryKeyRoutines: QueryKey = ["routines", userId];

  const { mutate: createWorkout } = useMutation({
    mutationFn: async (newWorkout) => {
      const response = await ky.post(API_ROUTES.WORKOUTS, {
        json: newWorkout,
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

  const { mutate: createRoutine } = useMutation({
    mutationFn: async (newRoutine) => {
      const response = await ky.post(API_ROUTES.ROUTINES, {
        json: newRoutine,
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

  return (
    <ProtectedRoute>
      <div className="container">
        <h1>Welcome!</h1>
        <button onClick={logout} className="btn btn-danger">
          Logout
        </button>

        <div className="accordion mt-5 mb-5" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Create Workout
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse show collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <form onSubmit={() => createWorkout()}>
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">
                      Workout Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutName"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">
                      Workout Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutDescription"
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Workout
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Create Routine
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <form onSubmit={() => createRoutine()}>
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineName"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">
                      Routine Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineDescription"
                      value={routineDescription}
                      onChange={(e) => setRoutineDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">
                      Select Workouts
                    </label>
                    {/* <select
                      multiple
                      className="form-control"
                      id="workoutSelect"
                      value={selectedWorkouts}
                      onChange={(e) =>
                        setSelectedWorkouts(
                          [...e.target.selectedOptions].map(
                            (option) => option.value,
                          ),
                        )
                      }
                    >
                      {workouts.map((workout) => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select> */}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Routine
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Your routines:</h3>

          <ul>
            {/* {routines.map((routine) => (
              <div className="card" key={routine.id}>
                <div className="card-body">
                  <h5 className="card-title">{routine.name}</h5>
                  <p className="card-text">{routine.description}</p>
                  <ul className="card-text">
                    {routine.workouts &&
                      routine.workouts.map((workout) => (
                        <li key={workout.id}>
                          {workout.name}: {workout.description}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))} */}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
