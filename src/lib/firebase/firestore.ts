import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Exercise,
  Routine,
  RoutineExercise,
  WorkoutHistory,
  WorkoutExercise,
  WorkoutType,
  Intensity,
} from "@/types";

// ============ Exercises ============

export async function getExercises(): Promise<Exercise[]> {
  const exercisesRef = collection(db, "exercises");
  const snapshot = await getDocs(exercisesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Exercise));
}

export async function getExerciseById(exerciseId: string): Promise<Exercise | null> {
  const exerciseRef = doc(db, "exercises", exerciseId);
  const snapshot = await getDoc(exerciseRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Exercise;
  }
  return null;
}

// ============ Routines ============

export async function getUserRoutines(userId: string): Promise<Routine[]> {
  const routinesRef = collection(db, "users", userId, "routines");
  const q = query(routinesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Routine));
}

export async function getRoutineById(
  userId: string,
  routineId: string
): Promise<Routine | null> {
  const routineRef = doc(db, "users", userId, "routines", routineId);
  const snapshot = await getDoc(routineRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Routine;
  }
  return null;
}

export async function createRoutine(
  userId: string,
  data: {
    name: string;
    workoutType: WorkoutType;
    intensity: Intensity;
    estimatedDuration: number;
    exercises: RoutineExercise[];
  }
): Promise<string> {
  const routinesRef = collection(db, "users", userId, "routines");
  const docRef = await addDoc(routinesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateRoutine(
  userId: string,
  routineId: string,
  data: Partial<{
    name: string;
    exercises: RoutineExercise[];
  }>
): Promise<void> {
  const routineRef = doc(db, "users", userId, "routines", routineId);
  await updateDoc(routineRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRoutine(
  userId: string,
  routineId: string
): Promise<void> {
  const routineRef = doc(db, "users", userId, "routines", routineId);
  await deleteDoc(routineRef);
}

// ============ Workout History ============

export async function getUserWorkoutHistory(
  userId: string,
  filters?: {
    workoutType?: WorkoutType;
    limit?: number;
  }
): Promise<WorkoutHistory[]> {
  const historyRef = collection(db, "users", userId, "workoutHistory");
  let q = query(historyRef, orderBy("createdAt", "desc"));

  if (filters?.workoutType) {
    q = query(
      historyRef,
      where("workoutType", "==", filters.workoutType),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WorkoutHistory));
}

export async function getWorkoutHistoryById(
  userId: string,
  workoutId: string
): Promise<WorkoutHistory | null> {
  const workoutRef = doc(db, "users", userId, "workoutHistory", workoutId);
  const snapshot = await getDoc(workoutRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as WorkoutHistory;
  }
  return null;
}

export async function saveWorkoutToHistory(
  userId: string,
  data: {
    routineId: string;
    routineName: string;
    workoutType: WorkoutType;
    startTime: Date;
    endTime: Date;
    duration: number;
    exercises: WorkoutExercise[];
  }
): Promise<string> {
  const historyRef = collection(db, "users", userId, "workoutHistory");
  const docRef = await addDoc(historyRef, {
    ...data,
    startTime: Timestamp.fromDate(data.startTime),
    endTime: Timestamp.fromDate(data.endTime),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRecentWorkouts(
  userId: string,
  limit: number = 5
): Promise<WorkoutHistory[]> {
  const historyRef = collection(db, "users", userId, "workoutHistory");
  const q = query(historyRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .slice(0, limit)
    .map((doc) => ({ id: doc.id, ...doc.data() } as WorkoutHistory));
}
