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
  limit,
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
  User,
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
  
  // Update user streak after saving workout
  await updateUserStreak(userId);
  
  return docRef.id;
}

export async function getRecentWorkouts(
  userId: string,
  limitCount: number = 5
): Promise<WorkoutHistory[]> {
  const historyRef = collection(db, "users", userId, "workoutHistory");
  const q = query(
    historyRef,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WorkoutHistory));
}

// ============ Weekly Stats ============

export interface WeeklyStats {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  workoutCount: number;
  workoutDates: Date[];
}

export async function getWeeklyStats(userId: string): Promise<WeeklyStats> {
  // Get start of current week (Monday)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  const historyRef = collection(db, "users", userId, "workoutHistory");
  const q = query(
    historyRef,
    where("createdAt", ">=", Timestamp.fromDate(weekStart)),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const workouts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutHistory[];

  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;
  const workoutDates: Date[] = [];

  workouts.forEach((workout) => {
    // Add workout date
    if (workout.createdAt) {
      workoutDates.push(workout.createdAt.toDate());
    }

    // Calculate volume from exercises
    workout.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        if (set.completed) {
          totalSets += 1;
          totalReps += set.reps || 0;
          totalVolume += (set.weight || 0) * (set.reps || 0);
        }
      });
    });
  });

  return {
    totalVolume: Math.round(totalVolume),
    totalSets,
    totalReps,
    workoutCount: workouts.length,
    workoutDates,
  };
}

// ============ Daily Stats ============

export interface DailyStats {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  workoutCount: number;
  date: Date;
}

export async function getDailyStats(userId: string, date: Date): Promise<DailyStats> {
  // Set up date range for the specific day
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const historyRef = collection(db, "users", userId, "workoutHistory");
  const q = query(
    historyRef,
    where("createdAt", ">=", Timestamp.fromDate(dayStart)),
    where("createdAt", "<=", Timestamp.fromDate(dayEnd)),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  const workouts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutHistory[];

  let totalVolume = 0;
  let totalSets = 0;
  let totalReps = 0;

  workouts.forEach((workout) => {
    // Calculate volume from exercises
    workout.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        if (set.completed) {
          totalSets += 1;
          totalReps += set.reps || 0;
          totalVolume += (set.weight || 0) * (set.reps || 0);
        }
      });
    });
  });

  return {
    totalVolume: Math.round(totalVolume),
    totalSets,
    totalReps,
    workoutCount: workouts.length,
    date,
  };
}

export async function getWorkoutsForWeek(
  userId: string,
  weekStart: Date
): Promise<WorkoutHistory[]> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const historyRef = collection(db, "users", userId, "workoutHistory");
  const q = query(
    historyRef,
    where("createdAt", ">=", Timestamp.fromDate(weekStart)),
    where("createdAt", "<", Timestamp.fromDate(weekEnd)),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutHistory[];
}

// ============ Streak Management ============

export async function updateUserStreak(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const userData = userSnap.data() as Omit<User, "id">;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWorkoutDate = userData.lastWorkoutDate?.toDate();
  let newStreak = userData.currentStreak || 0;
  let longestStreak = userData.longestStreak || 0;

  if (lastWorkoutDate) {
    const lastWorkoutDay = new Date(lastWorkoutDate);
    lastWorkoutDay.setHours(0, 0, 0, 0);

    if (lastWorkoutDay.getTime() === today.getTime()) {
      // Already worked out today, no change
      return;
    } else if (lastWorkoutDay.getTime() === yesterday.getTime()) {
      // Worked out yesterday, increment streak
      newStreak += 1;
    } else {
      // Missed a day, reset streak
      newStreak = 1;
    }
  } else {
    // First workout ever
    newStreak = 1;
  }

  // Update longest streak if needed
  if (newStreak > longestStreak) {
    longestStreak = newStreak;
  }

  await updateDoc(userRef, {
    currentStreak: newStreak,
    longestStreak,
    lastWorkoutDate: Timestamp.fromDate(today),
    updatedAt: serverTimestamp(),
  });
}
