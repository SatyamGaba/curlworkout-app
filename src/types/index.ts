import { Timestamp } from "firebase/firestore";

// ============ Enums & Constants ============

export const WORKOUT_TYPES = ["Push", "Pull", "Legs", "Upper", "Lower", "FullBody"] as const;
export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export const INTENSITY_LEVELS = ["Heavy", "Medium", "Light"] as const;
export type Intensity = (typeof INTENSITY_LEVELS)[number];

export const DURATION_OPTIONS = ["30min", "1hr", "2hr", "custom"] as const;
export type DurationOption = (typeof DURATION_OPTIONS)[number];

export const UNIT_OPTIONS = ["kg", "lbs"] as const;
export type UnitPreference = (typeof UNIT_OPTIONS)[number];

export const EQUIPMENT_TYPES = ["Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Other"] as const;
export type Equipment = (typeof EQUIPMENT_TYPES)[number];

export const EXERCISE_CATEGORIES = ["Push", "Pull", "Legs", "Core"] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

// ============ User ============

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  weight: number | null;
  height: number | null;
  unitPreference: UnitPreference;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: Timestamp | null;
  weeklyGoal: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserFormData {
  weight: number | null;
  height: number | null;
  unitPreference: UnitPreference;
}

// ============ Exercise ============

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  equipment: Equipment;
}

// ============ Routine ============

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Routine {
  id: string;
  name: string;
  workoutType: WorkoutType;
  intensity: Intensity;
  estimatedDuration: number; // in minutes
  exercises: RoutineExercise[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RoutineFormData {
  workoutType: WorkoutType;
  intensity: Intensity;
  duration: DurationOption;
  customDuration?: number;
}

// ============ Workout Session ============

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutHistory {
  id: string;
  routineId: string;
  routineName: string;
  workoutType: WorkoutType;
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number; // in seconds
  exercises: WorkoutExercise[];
  createdAt: Timestamp;
}

// ============ AI Generation ============

export interface RoutineGenerationParams {
  userWeight: number | null;
  userHeight: number | null;
  unitPreference: UnitPreference;
  workoutType: WorkoutType;
  intensity: Intensity;
  duration: number; // in minutes
}

export interface GeneratedRoutine {
  name: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
}

// ============ API Responses ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
