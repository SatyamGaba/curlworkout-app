"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { selectWorkout } from "@/store/workoutSlice";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";

/**
 * Ultra-compact floating pill banner that shows when a workout is active.
 * Positioned in the top-right corner, notification-style.
 * Shows only: pulsing dot + timer + "Go back" link.
 */
export function ActiveWorkoutBanner() {
  const pathname = usePathname();
  const workout = useAppSelector(selectWorkout);

  // Keep timer ticking even when not on workout page
  useWorkoutTimer();

  // Don't show on workout pages (they have their own UI)
  const isWorkoutPage = pathname?.startsWith("/workout/");
  
  // Determine if banner should be visible
  const shouldShow = workout.isActive && !isWorkoutPage;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            mass: 0.6
          }}
          className="fixed top-3 right-4 z-50"
        >
          {/* Ultra-compact pill */}
          <Link
            href={`/workout/${workout.routineId}`}
            className="bg-text-primary text-background rounded-full px-3 py-1.5 shadow-cal flex items-center gap-2 hover:shadow-cal-lg transition-shadow"
          >
            {/* Pulsing live indicator */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
            </span>
            
            {/* Timer */}
            <span className="font-mono font-medium text-xs tabular-nums">
              {formatTime(workout.elapsedSeconds)}
            </span>
            
            {/* Go back text */}
            <span className="text-xs text-background/80 font-medium">
              Go back
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
