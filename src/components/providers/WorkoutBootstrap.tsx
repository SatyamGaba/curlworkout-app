"use client";

import { useEffect, useRef } from "react";
import { useAuthContext } from "./AuthProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { workoutActions, selectWorkout } from "@/store/workoutSlice";
import { loadRoutines } from "@/store/routinesSlice";
import { loadRecentWorkouts } from "@/store/historySlice";
import { loadWorkoutFromStorage, clearWorkoutFromStorage } from "@/store/persistence";

/**
 * Component that:
 * 1. Restores workout state from localStorage on app load
 * 2. Preloads user data (routines, recent workouts) when user signs in
 * Should be placed inside AuthProvider and ReduxProvider.
 */
export function WorkoutBootstrap() {
  const { user, loading: authLoading } = useAuthContext();
  const dispatch = useAppDispatch();
  const workout = useAppSelector(selectWorkout);
  const lastUserId = useRef<string | null>(null);

  // Restore workout from localStorage
  useEffect(() => {
    // Wait for auth to finish loading before attempting restore
    if (authLoading) return;

    // Only attempt restore once per session (check Redux state)
    if (workout.restoreAttempted) return;

    // If there's already an active workout, just mark restore as attempted
    if (workout.isActive) {
      dispatch(workoutActions.setRestoreAttempted(true));
      return;
    }

    const storedWorkout = loadWorkoutFromStorage();
    
    // If no stored workout, mark restore as attempted and return
    if (!storedWorkout) {
      dispatch(workoutActions.setRestoreAttempted(true));
      return;
    }

    // If user is logged in, verify the stored workout belongs to them
    if (user) {
      if (storedWorkout.userId === user.uid) {
        // Restore the workout (this also sets restoreAttempted to true)
        dispatch(workoutActions.restore(storedWorkout));
      } else {
        // Stored workout belongs to a different user, clear it
        clearWorkoutFromStorage();
        dispatch(workoutActions.setRestoreAttempted(true));
      }
    } else {
      // No user logged in, clear stored workout
      clearWorkoutFromStorage();
      dispatch(workoutActions.setRestoreAttempted(true));
    }
  }, [user, authLoading, workout.restoreAttempted, workout.isActive, dispatch]);

  // Preload user data when user signs in
  useEffect(() => {
    if (authLoading) return;

    // If user changed (including signing in)
    if (user && user.uid !== lastUserId.current) {
      lastUserId.current = user.uid;
      
      // Preload routines and recent workouts
      dispatch(loadRoutines(user.uid));
      dispatch(loadRecentWorkouts({ userId: user.uid, limit: 5 }));
    } else if (!user && lastUserId.current) {
      // User signed out
      lastUserId.current = null;
    }
  }, [user, authLoading, dispatch]);

  // This component doesn't render anything
  return null;
}
