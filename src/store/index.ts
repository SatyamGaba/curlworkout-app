import { configureStore, combineReducers } from "@reduxjs/toolkit";
import workoutReducer, { WorkoutState } from "./workoutSlice";
import routinesReducer, { RoutinesState } from "./routinesSlice";
import historyReducer, { HistoryState } from "./historySlice";
import { saveWorkoutToStorage } from "./persistence";

// Explicitly define root state interface to avoid type inference issues
export interface RootState {
  workout: WorkoutState;
  routines: RoutinesState;
  history: HistoryState;
}

const rootReducer = combineReducers({
  workout: workoutReducer,
  routines: routinesReducer,
  history: historyReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

// Subscribe to store changes and persist workout state
let previousWorkout = store.getState().workout;
store.subscribe(() => {
  const currentWorkout = store.getState().workout;
  
  // Only persist if workout state has changed
  if (currentWorkout !== previousWorkout) {
    saveWorkoutToStorage(currentWorkout);
    previousWorkout = currentWorkout;
  }
});

export type AppDispatch = typeof store.dispatch;
