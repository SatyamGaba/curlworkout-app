"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  getUserRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from "@/lib/firebase/firestore";
import type { Routine, RoutineExercise, WorkoutType, Intensity } from "@/types";

export function useRoutines() {
  const { user } = useAuthContext();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoutines = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserRoutines(user.uid);
      setRoutines(data);
    } catch (err) {
      setError("Failed to load routines");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const addRoutine = async (data: {
    name: string;
    workoutType: WorkoutType;
    intensity: Intensity;
    estimatedDuration: number;
    exercises: RoutineExercise[];
  }) => {
    if (!user) throw new Error("User not authenticated");
    
    const id = await createRoutine(user.uid, data);
    await loadRoutines();
    return id;
  };

  const editRoutine = async (
    routineId: string,
    data: Partial<{ name: string; exercises: RoutineExercise[] }>
  ) => {
    if (!user) throw new Error("User not authenticated");
    
    await updateRoutine(user.uid, routineId, data);
    await loadRoutines();
  };

  const removeRoutine = async (routineId: string) => {
    if (!user) throw new Error("User not authenticated");
    
    await deleteRoutine(user.uid, routineId);
    await loadRoutines();
  };

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
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoutine = useCallback(async () => {
    if (!user || !routineId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getRoutineById(user.uid, routineId);
      setRoutine(data);
    } catch (err) {
      setError("Failed to load routine");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, routineId]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  return {
    routine,
    loading,
    error,
    refresh: loadRoutine,
  };
}
