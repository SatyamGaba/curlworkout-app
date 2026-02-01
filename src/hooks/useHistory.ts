"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  getUserWorkoutHistory,
  getWorkoutHistoryById,
} from "@/lib/firebase/firestore";
import type { WorkoutHistory, WorkoutType } from "@/types";

export function useWorkoutHistory(filters?: { workoutType?: WorkoutType }) {
  const { user } = useAuthContext();
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserWorkoutHistory(user.uid, filters);
      setHistory(data);
    } catch (err) {
      setError("Failed to load workout history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    loading,
    error,
    refresh: loadHistory,
  };
}

export function useWorkoutDetail(workoutId: string) {
  const { user } = useAuthContext();
  const [workout, setWorkout] = useState<WorkoutHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkout = useCallback(async () => {
    if (!user || !workoutId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getWorkoutHistoryById(user.uid, workoutId);
      setWorkout(data);
    } catch (err) {
      setError("Failed to load workout");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, workoutId]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  return {
    workout,
    loading,
    error,
    refresh: loadWorkout,
  };
}
