"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWorkout, selectWorkoutProgress, workoutActions } from "@/store/workoutSlice";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

/**
 * Floating banner that shows when a workout is active.
 * Displays on all pages except the workout page itself.
 * Shows routine name, live timer, progress, and action buttons.
 */
export function ActiveWorkoutBanner() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const workout = useAppSelector(selectWorkout);
  const progress = useAppSelector(selectWorkoutProgress, shallowEqual);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Keep timer ticking even when not on workout page
  useWorkoutTimer();

  // Don't show if no active workout
  if (!workout.isActive) {
    return null;
  }

  // Don't show on workout pages (they have their own UI)
  if (pathname?.startsWith("/workout/")) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCancel = () => {
    dispatch(workoutActions.cancelWorkout());
    setCancelModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-600 text-white shadow-lg border-t border-primary-500">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Workout Info */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Pulsing indicator */}
              <div className="flex-shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>

              {/* Routine name and stats */}
              <div className="min-w-0">
                <p className="font-medium truncate">{workout.routineName}</p>
                <p className="text-sm text-primary-100">
                  <span className="font-mono">{formatTime(workout.elapsedSeconds)}</span>
                  <span className="mx-2">•</span>
                  <span>{progress.completedSets}/{progress.totalSets} sets</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3 py-1.5 text-sm text-primary-100 hover:text-white hover:bg-primary-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <Link
                href={`/workout/${workout.routineId}`}
                className="px-4 py-1.5 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Workout?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel your <strong>{workout.routineName}</strong> workout? 
            Your progress ({progress.completedSets}/{progress.totalSets} sets completed) will not be saved.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Keep Workout
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Cancel Workout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
