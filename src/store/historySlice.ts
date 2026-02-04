import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getUserWorkoutHistory,
  getWorkoutHistoryById,
  getRecentWorkouts,
} from "@/lib/firebase/firestore";
import type { WorkoutHistory, WorkoutType } from "@/types";

// ============ State Shape ============

export interface HistoryState {
  items: WorkoutHistory[];
  currentWorkout: WorkoutHistory | null;
  recentWorkouts: WorkoutHistory[];
  loading: boolean;
  loadingCurrent: boolean;
  loadingRecent: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  items: [],
  currentWorkout: null,
  recentWorkouts: [],
  loading: false,
  loadingCurrent: false,
  loadingRecent: false,
  error: null,
};

// ============ Async Thunks ============

export const loadHistory = createAsyncThunk<
  WorkoutHistory[],
  { userId: string; filters?: { workoutType?: WorkoutType } },
  { rejectValue: string }
>("history/loadHistory", async ({ userId, filters }, { rejectWithValue }) => {
  try {
    const history = await getUserWorkoutHistory(userId, filters);
    return history;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load workout history"
    );
  }
});

export const loadWorkoutById = createAsyncThunk<
  WorkoutHistory | null,
  { userId: string; workoutId: string },
  { rejectValue: string }
>("history/loadWorkoutById", async ({ userId, workoutId }, { rejectWithValue }) => {
  try {
    const workout = await getWorkoutHistoryById(userId, workoutId);
    return workout;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load workout"
    );
  }
});

export const loadRecentWorkouts = createAsyncThunk<
  WorkoutHistory[],
  { userId: string; limit?: number },
  { rejectValue: string }
>("history/loadRecentWorkouts", async ({ userId, limit = 5 }, { rejectWithValue }) => {
  try {
    const workouts = await getRecentWorkouts(userId, limit);
    return workouts;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load recent workouts"
    );
  }
});

// ============ Slice ============

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: () => initialState,
    clearCurrentWorkout: (state) => {
      state.currentWorkout = null;
      state.loadingCurrent = false;
    },
    // Add a workout to history (used after finishing a workout)
    addWorkoutToHistory: (state, action: PayloadAction<WorkoutHistory>) => {
      state.items.unshift(action.payload);
      state.recentWorkouts.unshift(action.payload);
      // Keep only the most recent 5 in recentWorkouts
      if (state.recentWorkouts.length > 5) {
        state.recentWorkouts = state.recentWorkouts.slice(0, 5);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // loadHistory
      .addCase(loadHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load history";
      })
      // loadWorkoutById
      .addCase(loadWorkoutById.pending, (state) => {
        state.loadingCurrent = true;
        state.error = null;
      })
      .addCase(loadWorkoutById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentWorkout = action.payload;
      })
      .addCase(loadWorkoutById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload || "Failed to load workout";
      })
      // loadRecentWorkouts
      .addCase(loadRecentWorkouts.pending, (state) => {
        state.loadingRecent = true;
        state.error = null;
      })
      .addCase(loadRecentWorkouts.fulfilled, (state, action) => {
        state.loadingRecent = false;
        state.recentWorkouts = action.payload;
      })
      .addCase(loadRecentWorkouts.rejected, (state, action) => {
        state.loadingRecent = false;
        state.error = action.payload || "Failed to load recent workouts";
      });
  },
});

export const historyActions = historySlice.actions;
export default historySlice.reducer;

// ============ Selectors ============

export const selectHistory = (state: { history: HistoryState }) =>
  state.history.items;
export const selectHistoryLoading = (state: { history: HistoryState }) =>
  state.history.loading;
export const selectCurrentWorkout = (state: { history: HistoryState }) =>
  state.history.currentWorkout;
export const selectCurrentWorkoutLoading = (state: { history: HistoryState }) =>
  state.history.loadingCurrent;
export const selectRecentWorkouts = (state: { history: HistoryState }) =>
  state.history.recentWorkouts;
export const selectRecentWorkoutsLoading = (state: { history: HistoryState }) =>
  state.history.loadingRecent;
export const selectHistoryError = (state: { history: HistoryState }) =>
  state.history.error;
