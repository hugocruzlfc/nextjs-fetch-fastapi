export interface Workout {
  id: string;
  name: string;
  description: string;
  routines: Routine[];
  userId: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
  userId: string;
}

export interface User {
  id: string;
  username: string;
}
