import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getUserRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from "@/lib/firebase/firestore";
import type { Routine, RoutineExercise, WorkoutType, Intensity } from "@/types";

// ============ State Shape ============

export interface RoutinesState {
  items: Routine[];
  currentRoutine: Routine | null;
  loading: boolean;
  loadingCurrent: boolean;
  error: string | null;
}

const initialState: RoutinesState = {
  items: [],
  currentRoutine: null,
  loading: false,
  loadingCurrent: false,
  error: null,
};

// ============ Async Thunks ============

export const loadRoutines = createAsyncThunk<
  Routine[],
  string, // userId
  { rejectValue: string }
>("routines/loadRoutines", async (userId, { rejectWithValue }) => {
  try {
    const routines = await getUserRoutines(userId);
    return routines;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load routines"
    );
  }
});

export const loadRoutineById = createAsyncThunk<
  Routine | null,
  { userId: string; routineId: string },
  { rejectValue: string }
>("routines/loadRoutineById", async ({ userId, routineId }, { rejectWithValue }) => {
  try {
    const routine = await getRoutineById(userId, routineId);
    return routine;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load routine"
    );
  }
});

export const addRoutine = createAsyncThunk<
  string, // returns new routine ID
  {
    userId: string;
    data: {
      name: string;
      workoutType: WorkoutType;
      intensity: Intensity;
      estimatedDuration: number;
      exercises: RoutineExercise[];
    };
  },
  { rejectValue: string }
>("routines/addRoutine", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const id = await createRoutine(userId, data);
    return id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create routine"
    );
  }
});

export const editRoutine = createAsyncThunk<
  void,
  {
    userId: string;
    routineId: string;
    data: Partial<{ name: string; exercises: RoutineExercise[] }>;
  },
  { rejectValue: string }
>("routines/editRoutine", async ({ userId, routineId, data }, { rejectWithValue }) => {
  try {
    await updateRoutine(userId, routineId, data);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update routine"
    );
  }
});

export const removeRoutine = createAsyncThunk<
  string, // returns deleted routine ID
  { userId: string; routineId: string },
  { rejectValue: string }
>("routines/removeRoutine", async ({ userId, routineId }, { rejectWithValue }) => {
  try {
    await deleteRoutine(userId, routineId);
    return routineId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete routine"
    );
  }
});

// ============ Slice ============

const routinesSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    clearRoutines: () => initialState,
    clearCurrentRoutine: (state) => {
      state.currentRoutine = null;
      state.loadingCurrent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadRoutines
      .addCase(loadRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRoutines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load routines";
      })
      // loadRoutineById
      .addCase(loadRoutineById.pending, (state) => {
        state.loadingCurrent = true;
        state.error = null;
      })
      .addCase(loadRoutineById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentRoutine = action.payload;
      })
      .addCase(loadRoutineById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload || "Failed to load routine";
      })
      // addRoutine - reload after adding
      .addCase(addRoutine.fulfilled, (state) => {
        // Routines will be reloaded after adding
      })
      // editRoutine - reload after editing
      .addCase(editRoutine.fulfilled, (state) => {
        // Routines will be reloaded after editing
      })
      // removeRoutine
      .addCase(removeRoutine.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const routinesActions = routinesSlice.actions;
export default routinesSlice.reducer;

// ============ Selectors ============

export const selectRoutines = (state: { routines: RoutinesState }) =>
  state.routines.items;
export const selectRoutinesLoading = (state: { routines: RoutinesState }) =>
  state.routines.loading;
export const selectCurrentRoutine = (state: { routines: RoutinesState }) =>
  state.routines.currentRoutine;
export const selectCurrentRoutineLoading = (state: { routines: RoutinesState }) =>
  state.routines.loadingCurrent;
export const selectRoutinesError = (state: { routines: RoutinesState }) =>
  state.routines.error;
