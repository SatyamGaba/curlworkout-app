"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { saveWorkoutToHistory } from "@/lib/firebase/firestore";
import type { Routine, WorkoutExercise, WorkoutSet } from "@/types";

interface WorkoutState {
  isActive: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  exercises: WorkoutExercise[];
}

export function useWorkout(routine: Routine | null) {
  const { user } = useAuthContext();
  const [state, setState] = useState<WorkoutState>({
    isActive: false,
    startTime: null,
    elapsedSeconds: 0,
    exercises: [],
  });
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize exercises from routine
  useEffect(() => {
    if (routine && !state.isActive) {
      const workoutExercises: WorkoutExercise[] = routine.exercises.map(
        (exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          sets: Array.from({ length: exercise.sets }, () => ({
            reps: exercise.reps,
            weight: exercise.weight,
            completed: false,
          })),
        })
      );
      setState((prev) => ({ ...prev, exercises: workoutExercises }));
    }
  }, [routine, state.isActive]);

  // Timer effect
  useEffect(() => {
    if (state.isActive && state.startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - state.startTime!.getTime()) / 1000
        );
        setState((prev) => ({ ...prev, elapsedSeconds: elapsed }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isActive, state.startTime]);

  const startWorkout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      startTime: new Date(),
      elapsedSeconds: 0,
    }));
  }, []);

  const toggleSetComplete = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      setState((prev) => {
        const newExercises = [...prev.exercises];
        const exercise = { ...newExercises[exerciseIndex] };
        const sets = [...exercise.sets];
        sets[setIndex] = { ...sets[setIndex], completed: !sets[setIndex].completed };
        exercise.sets = sets;
        newExercises[exerciseIndex] = exercise;
        return { ...prev, exercises: newExercises };
      });
    },
    []
  );

  const updateSet = useCallback(
    (
      exerciseIndex: number,
      setIndex: number,
      field: keyof WorkoutSet,
      value: number | boolean
    ) => {
      setState((prev) => {
        const newExercises = [...prev.exercises];
        const exercise = { ...newExercises[exerciseIndex] };
        const sets = [...exercise.sets];
        sets[setIndex] = { ...sets[setIndex], [field]: value };
        exercise.sets = sets;
        newExercises[exerciseIndex] = exercise;
        return { ...prev, exercises: newExercises };
      });
    },
    []
  );

  const finishWorkout = useCallback(async (): Promise<string | null> => {
    if (!user || !routine || !state.startTime) return null;

    setSaving(true);
    try {
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - state.startTime.getTime()) / 1000
      );

      const workoutId = await saveWorkoutToHistory(user.uid, {
        routineId: routine.id,
        routineName: routine.name,
        workoutType: routine.workoutType,
        startTime: state.startTime,
        endTime,
        duration,
        exercises: state.exercises,
      });

      // Reset state
      setState({
        isActive: false,
        startTime: null,
        elapsedSeconds: 0,
        exercises: [],
      });

      return workoutId;
    } catch (error) {
      console.error("Error saving workout:", error);
      return null;
    } finally {
      setSaving(false);
    }
  }, [user, routine, state.startTime, state.exercises]);

  const getProgress = useCallback(() => {
    let completedSets = 0;
    let totalSets = 0;

    state.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        totalSets++;
        if (set.completed) completedSets++;
      });
    });

    return { completedSets, totalSets, percentage: totalSets > 0 ? (completedSets / totalSets) * 100 : 0 };
  }, [state.exercises]);

  return {
    isActive: state.isActive,
    startTime: state.startTime,
    elapsedSeconds: state.elapsedSeconds,
    exercises: state.exercises,
    saving,
    startWorkout,
    toggleSetComplete,
    updateSet,
    finishWorkout,
    getProgress,
  };
}
