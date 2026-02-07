import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import type { User as AppUser } from "@/types";

export interface AuthDisplayInfo {
  displayName: string;
  photoURL: string | null;
  email: string;
  avatarInitial: string;
}

/**
 * Derives display name, photo, email, and avatar initial from Firebase Auth user
 * and/or Firestore profile. Use Auth as fallback when profile is not yet loaded
 * (e.g. new user right after sign-in) to avoid showing "User" / "U" briefly.
 */
export function getAuthDisplayInfo(
  user: FirebaseUser | null,
  userProfile: AppUser | null
): AuthDisplayInfo {
  const displayName =
    user?.displayName ?? userProfile?.displayName ?? "User";
  const photoURL = user?.photoURL ?? userProfile?.photoURL ?? null;
  const email = user?.email ?? userProfile?.email ?? "";
  const avatarInitial = (
    user?.displayName ?? userProfile?.displayName ?? "U"
  ).charAt(0);

  return { displayName, photoURL, email, avatarInitial };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(date: Date | Timestamp): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | Timestamp): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeDate(date: Date | Timestamp): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return formatDate(d);
  }
}

export function durationOptionToMinutes(
  option: string,
  customMinutes?: number
): number {
  switch (option) {
    case "30min":
      return 30;
    case "1hr":
      return 60;
    case "2hr":
      return 120;
    case "custom":
      return customMinutes || 60;
    default:
      return 60;
  }
}

export function calculateTotalVolume(
  exercises: { sets: { reps: number; weight: number; completed: boolean }[] }[]
): number {
  return exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((exerciseTotal, set) => {
        if (set.completed) {
          return exerciseTotal + set.reps * set.weight;
        }
        return exerciseTotal;
      }, 0)
    );
  }, 0);
}

export function calculateCompletedSets(
  exercises: { sets: { completed: boolean }[] }[]
): { completed: number; total: number } {
  let completed = 0;
  let total = 0;

  exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      total++;
      if (set.completed) {
        completed++;
      }
    });
  });

  return { completed, total };
}

export function getWorkoutTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Push: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Pull: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Legs: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Upper: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Lower: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    FullBody: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  };
  return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
}

export function getIntensityColor(intensity: string): string {
  const colors: Record<string, string> = {
    Heavy: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Light: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };
  return colors[intensity] || "bg-gray-100 text-gray-800";
}
