"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loadHistory as loadHistoryThunk,
  loadWorkoutById,
  loadRecentWorkouts as loadRecentWorkoutsThunk,
  historyActions,
  selectHistory,
  selectHistoryLoading,
  selectCurrentWorkout,
  selectCurrentWorkoutLoading,
  selectRecentWorkouts,
  selectRecentWorkoutsLoading,
  selectHistoryError,
} from "@/store/historySlice";
import type { WorkoutType } from "@/types";

export function useWorkoutHistory(filters?: { workoutType?: WorkoutType }) {
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();

  const history = useAppSelector(selectHistory);
  const loading = useAppSelector(selectHistoryLoading);
  const error = useAppSelector(selectHistoryError);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters?.workoutType]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    await dispatch(
      loadHistoryThunk({ userId: user.uid, filters: memoizedFilters })
    );
  }, [user, memoizedFilters, dispatch]);

  // Load history when user or filters change
  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      dispatch(historyActions.clearHistory());
    }
  }, [user, loadHistory, dispatch]);

  return {
    history,
    loading,
    error,
    refresh: loadHistory,
  };
}

export function useWorkoutDetail(workoutId: string) {
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();

  const workout = useAppSelector(selectCurrentWorkout);
  const loading = useAppSelector(selectCurrentWorkoutLoading);
  const error = useAppSelector(selectHistoryError);

  const loadWorkout = useCallback(async () => {
    if (!user || !workoutId) return;
    await dispatch(loadWorkoutById({ userId: user.uid, workoutId }));
  }, [user, workoutId, dispatch]);

  // Load workout when user or workoutId changes
  useEffect(() => {
    if (user && workoutId) {
      loadWorkout();
    }

    // Clear current workout when unmounting
    return () => {
      dispatch(historyActions.clearCurrentWorkout());
    };
  }, [user, workoutId, loadWorkout, dispatch]);

  return {
    workout,
    loading,
    error,
    refresh: loadWorkout,
  };
}

export function useRecentWorkouts(limit: number = 5) {
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();

  const recentWorkouts = useAppSelector(selectRecentWorkouts);
  const loading = useAppSelector(selectRecentWorkoutsLoading);
  const error = useAppSelector(selectHistoryError);

  const loadRecentWorkouts = useCallback(async () => {
    if (!user) return;
    await dispatch(loadRecentWorkoutsThunk({ userId: user.uid, limit }));
  }, [user, limit, dispatch]);

  // Load recent workouts when user changes
  useEffect(() => {
    if (user) {
      loadRecentWorkouts();
    }
  }, [user, loadRecentWorkouts]);

  return {
    recentWorkouts,
    loading,
    error,
    refresh: loadRecentWorkouts,
  };
}
