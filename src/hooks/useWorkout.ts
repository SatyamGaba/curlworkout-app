"use client";

import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  workoutActions,
  selectWorkout,
  selectWorkoutProgress,
  finishWorkout as finishWorkoutThunk,
} from "@/store/workoutSlice";
import { useWorkoutTimer } from "./useWorkoutTimer";
import type { Routine, WorkoutSet } from "@/types";

/**
 * Hook to manage workout session state using Redux.
 * No longer takes a routine parameter - use startWorkout(routine, userId) to initialize.
 */
export function useWorkout() {
  const dispatch = useAppDispatch();
  const workout = useAppSelector(selectWorkout);
  const progress = useAppSelector(selectWorkoutProgress, shallowEqual);

  // Start the timer when workout is active
  useWorkoutTimer();

  const startWorkout = useCallback(
    (routine: Routine, userId: string) => {
      dispatch(workoutActions.startWorkout({ userId, routine }));
    },
    [dispatch]
  );

  const toggleSetComplete = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      dispatch(workoutActions.toggleSetComplete({ exerciseIndex, setIndex }));
    },
    [dispatch]
  );

  const updateSet = useCallback(
    (
      exerciseIndex: number,
      setIndex: number,
      field: keyof WorkoutSet,
      value: number | boolean
    ) => {
      dispatch(workoutActions.updateSet({ exerciseIndex, setIndex, field, value }));
    },
    [dispatch]
  );

  const finishWorkout = useCallback(async (): Promise<string | null> => {
    try {
      const result = await dispatch(finishWorkoutThunk()).unwrap();
      return result;
    } catch (error) {
      console.error("Error saving workout:", error);
      return null;
    }
  }, [dispatch]);

  const cancelWorkout = useCallback(() => {
    dispatch(workoutActions.cancelWorkout());
  }, [dispatch]);

  const getProgress = useCallback(() => {
    return progress;
  }, [progress]);

  return {
    // State
    isActive: workout.isActive,
    restoreAttempted: workout.restoreAttempted,
    routineId: workout.routineId,
    routineName: workout.routineName,
    workoutType: workout.workoutType,
    startTime: workout.startTime ? new Date(workout.startTime) : null,
    elapsedSeconds: workout.elapsedSeconds,
    exercises: workout.exercises,
    saving: workout.saving,
    error: workout.error,
    // Actions
    startWorkout,
    toggleSetComplete,
    updateSet,
    finishWorkout,
    cancelWorkout,
    getProgress,
  };
}
