"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { workoutActions, selectWorkout } from "@/store/workoutSlice";

/**
 * Hook to manage the workout timer.
 * Dispatches tick() every second when a workout is active.
 * Should be used in components that display the timer (e.g., WorkoutPage, WorkoutTimer).
 */
export function useWorkoutTimer() {
  const dispatch = useAppDispatch();
  const { isActive, startTime } = useAppSelector(selectWorkout);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && startTime) {
      // Dispatch immediately to sync elapsed time
      dispatch(workoutActions.tick());

      // Set up interval to update every second
      timerRef.current = setInterval(() => {
        dispatch(workoutActions.tick());
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, startTime, dispatch]);
}
