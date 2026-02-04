"use client";

import { useEffect, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loadRoutines as loadRoutinesThunk,
  loadRoutineById,
  addRoutine as addRoutineThunk,
  editRoutine as editRoutineThunk,
  removeRoutine as removeRoutineThunk,
  routinesActions,
  selectRoutines,
  selectRoutinesLoading,
  selectCurrentRoutine,
  selectCurrentRoutineLoading,
  selectRoutinesError,
} from "@/store/routinesSlice";
import type { RoutineExercise, WorkoutType, Intensity } from "@/types";

export function useRoutines() {
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();
  
  const routines = useAppSelector(selectRoutines);
  const loading = useAppSelector(selectRoutinesLoading);
  const error = useAppSelector(selectRoutinesError);

  const loadRoutines = useCallback(async () => {
    if (!user) return;
    await dispatch(loadRoutinesThunk(user.uid));
  }, [user, dispatch]);

  // Load routines when user changes
  useEffect(() => {
    if (user) {
      loadRoutines();
    } else {
      dispatch(routinesActions.clearRoutines());
    }
  }, [user, loadRoutines, dispatch]);

  const addRoutine = useCallback(
    async (data: {
      name: string;
      workoutType: WorkoutType;
      intensity: Intensity;
      estimatedDuration: number;
      exercises: RoutineExercise[];
    }) => {
      if (!user) throw new Error("User not authenticated");

      const result = await dispatch(
        addRoutineThunk({ userId: user.uid, data })
      ).unwrap();
      
      // Reload routines to get the new one with full data
      await loadRoutines();
      return result;
    },
    [user, dispatch, loadRoutines]
  );

  const editRoutine = useCallback(
    async (
      routineId: string,
      data: Partial<{ name: string; exercises: RoutineExercise[] }>
    ) => {
      if (!user) throw new Error("User not authenticated");

      await dispatch(
        editRoutineThunk({ userId: user.uid, routineId, data })
      ).unwrap();
      
      // Reload routines to get updated data
      await loadRoutines();
    },
    [user, dispatch, loadRoutines]
  );

  const removeRoutine = useCallback(
    async (routineId: string) => {
      if (!user) throw new Error("User not authenticated");

      await dispatch(
        removeRoutineThunk({ userId: user.uid, routineId })
      ).unwrap();
    },
    [user, dispatch]
  );

  return {
    routines,
    loading,
    error,
    refresh: loadRoutines,
    addRoutine,
    editRoutine,
    removeRoutine,
  };
}

export function useRoutine(routineId: string) {
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();
  
  const routine = useAppSelector(selectCurrentRoutine);
  const loading = useAppSelector(selectCurrentRoutineLoading);
  const error = useAppSelector(selectRoutinesError);

  const loadRoutine = useCallback(async () => {
    if (!user || !routineId) return;
    await dispatch(loadRoutineById({ userId: user.uid, routineId }));
  }, [user, routineId, dispatch]);

  // Load routine when user or routineId changes
  useEffect(() => {
    if (user && routineId) {
      loadRoutine();
    }
    
    // Clear current routine when unmounting
    return () => {
      dispatch(routinesActions.clearCurrentRoutine());
    };
  }, [user, routineId, loadRoutine, dispatch]);

  return {
    routine,
    loading,
    error,
    refresh: loadRoutine,
  };
}
