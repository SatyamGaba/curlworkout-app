import type { WorkoutState } from "./workoutSlice";

const STORAGE_KEY = "curlworkout_active_workout";
const STORAGE_VERSION = 1;

interface PersistedWorkout {
  version: number;
  data: WorkoutState;
  timestamp: string;
}

/**
 * Save workout state to localStorage
 */
export function saveWorkoutToStorage(workoutState: WorkoutState): void {
  if (typeof window === "undefined") return;

  try {
    if (workoutState.isActive) {
      const persisted: PersistedWorkout = {
        version: STORAGE_VERSION,
        data: workoutState,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } else {
      // Clear storage when workout is not active
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save workout to storage:", error);
  }
}

/**
 * Load workout state from localStorage
 */
export function loadWorkoutFromStorage(): WorkoutState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const persisted: PersistedWorkout = JSON.parse(stored);

    // Version check - if version is different, discard
    if (persisted.version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Basic validation
    if (!persisted.data || !persisted.data.isActive) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return persisted.data;
  } catch (error) {
    console.error("Failed to load workout from storage:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * Clear workout state from localStorage
 */
export function clearWorkoutFromStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear workout from storage:", error);
  }
}

/**
 * Check if there's a stored workout for a specific user
 */
export function hasStoredWorkoutForUser(userId: string): boolean {
  const stored = loadWorkoutFromStorage();
  return stored !== null && stored.userId === userId;
}
