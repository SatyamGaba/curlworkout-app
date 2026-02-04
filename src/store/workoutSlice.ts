import { createSlice, createAsyncThunk, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { saveWorkoutToHistory } from "@/lib/firebase/firestore";
import type { WorkoutExercise, WorkoutSet, WorkoutType, Routine } from "@/types";

// ============ State Shape ============

export interface WorkoutState {
  isActive: boolean;
  restoreAttempted: boolean;
  userId: string | null;
  routineId: string | null;
  routineName: string | null;
  workoutType: WorkoutType | null;
  startTime: string | null; // ISO string for persistence
  elapsedSeconds: number;
  exercises: WorkoutExercise[];
  saving: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  isActive: false,
  restoreAttempted: false,
  userId: null,
  routineId: null,
  routineName: null,
  workoutType: null,
  startTime: null,
  elapsedSeconds: 0,
  exercises: [],
  saving: false,
  error: null,
};

// ============ Async Thunks ============

export const finishWorkout = createAsyncThunk<
  string, // Return type (workout ID)
  void, // Argument type (none needed, we read from state)
  { state: { workout: WorkoutState }; rejectValue: string }
>("workout/finishWorkout", async (_, { getState, rejectWithValue }) => {
  const state = getState().workout;

  if (!state.userId || !state.routineId || !state.startTime || !state.workoutType || !state.routineName) {
    return rejectWithValue("Missing required workout data");
  }

  try {
    const endTime = new Date();
    const startTime = new Date(state.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const workoutId = await saveWorkoutToHistory(state.userId, {
      routineId: state.routineId,
      routineName: state.routineName,
      workoutType: state.workoutType,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      exercises: state.exercises,
    });

    return workoutId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to save workout"
    );
  }
});

// ============ Slice ============

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    startWorkout: (
      state,
      action: PayloadAction<{ userId: string; routine: Routine }>
    ) => {
      const { userId, routine } = action.payload;
      
      // Map routine exercises to workout exercises with sets
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

      state.isActive = true;
      state.userId = userId;
      state.routineId = routine.id;
      state.routineName = routine.name;
      state.workoutType = routine.workoutType;
      state.startTime = new Date().toISOString();
      state.elapsedSeconds = 0;
      state.exercises = workoutExercises;
      state.saving = false;
      state.error = null;
    },

    toggleSetComplete: (
      state,
      action: PayloadAction<{ exerciseIndex: number; setIndex: number }>
    ) => {
      const { exerciseIndex, setIndex } = action.payload;
      const exercise = state.exercises[exerciseIndex];
      if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex].completed = !exercise.sets[setIndex].completed;
      }
    },

    updateSet: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        setIndex: number;
        field: keyof WorkoutSet;
        value: number | boolean;
      }>
    ) => {
      const { exerciseIndex, setIndex, field, value } = action.payload;
      const exercise = state.exercises[exerciseIndex];
      if (exercise && exercise.sets[setIndex]) {
        (exercise.sets[setIndex] as Record<string, number | boolean>)[field] = value;
      }
    },

    tick: (state) => {
      if (state.isActive && state.startTime) {
        const startMs = new Date(state.startTime).getTime();
        state.elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);
      }
    },

    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    finishWorkoutSuccess: (state) => {
      // Reset to initial state after successful save
      return initialState;
    },

    cancelWorkout: (state) => {
      // Reset to initial state without saving
      return initialState;
    },

    setRestoreAttempted: (state, action: PayloadAction<boolean>) => {
      state.restoreAttempted = action.payload;
    },

    restore: (state, action: PayloadAction<WorkoutState>) => {
      // Restore workout state from storage, mark restore as attempted
      return { ...action.payload, restoreAttempted: true };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(finishWorkout.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(finishWorkout.fulfilled, () => {
        // Reset to initial state after successful save
        return initialState;
      })
      .addCase(finishWorkout.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save workout";
      });
  },
});

export const workoutActions = workoutSlice.actions;
export default workoutSlice.reducer;

// ============ Selectors ============

// Type for selector state - matches store structure without circular import
interface RootState {
  workout: WorkoutState;
}

export const selectWorkout = (state: RootState) => state.workout;
export const selectIsWorkoutActive = (state: RootState) => state.workout.isActive;
export const selectRestoreAttempted = (state: RootState) => state.workout.restoreAttempted;

// Memoized selector to prevent unnecessary re-renders
const selectExercises = (state: RootState) => state.workout.exercises;

export const selectWorkoutProgress = createSelector(
  [selectExercises],
  (exercises) => {
    let completedSets = 0;
    let totalSets = 0;

    exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        totalSets++;
        if (set.completed) completedSets++;
      });
    });

    return {
      completedSets,
      totalSets,
      percentage: totalSets > 0 ? (completedSets / totalSets) * 100 : 0,
    };
  }
);
