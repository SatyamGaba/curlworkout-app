"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRoutine } from "@/hooks/useRoutines";
import { useWorkout } from "@/hooks/useWorkout";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { WorkoutTimer } from "@/components/workout/WorkoutTimer";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { FinishWorkoutButton } from "@/components/workout/FinishWorkoutButton";

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.routineId as string;
  
  const { routine, loading: routineLoading, error: routineError } = useRoutine(routineId);
  const { userProfile } = useAuthContext();
  
  const {
    isActive,
    elapsedSeconds,
    exercises,
    saving,
    startWorkout,
    toggleSetComplete,
    updateSet,
    finishWorkout,
    getProgress,
  } = useWorkout(routine);

  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Auto-start workout when routine loads
  useEffect(() => {
    if (routine && !isActive && exercises.length > 0) {
      startWorkout();
    }
  }, [routine, isActive, exercises.length, startWorkout]);

  const handleFinish = async () => {
    const workoutId = await finishWorkout();
    if (workoutId) {
      router.push(`/history/${workoutId}`);
    }
  };

  const handleCancel = () => {
    router.push("/routines");
  };

  const progress = getProgress();

  if (routineLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-primary-600 text-white px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="h-6 w-48 bg-primary-500 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (routineError || !routine) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {routineError || "Routine not found"}
            </p>
            <Link href="/routines">
              <Button variant="outline">Back to Routines</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Timer Header */}
      <WorkoutTimer elapsedSeconds={elapsedSeconds} routineName={routine.name} />

      {/* Cancel Button */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <button
          onClick={() => setCancelModalOpen(true)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel Workout
        </button>
      </div>

      {/* Exercise Cards */}
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={`${exercise.exerciseId}-${index}`}
            exercise={exercise}
            exerciseIndex={index}
            unitPreference={userProfile?.unitPreference || "kg"}
            onToggleSetComplete={toggleSetComplete}
            onUpdateSet={updateSet}
          />
        ))}
      </div>

      {/* Finish Button */}
      <FinishWorkoutButton
        onClick={() => setFinishModalOpen(true)}
        isLoading={saving}
        progress={progress}
      />

      {/* Finish Confirmation Modal */}
      <Modal
        isOpen={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        title="Finish Workout?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            You've completed {progress.completedSets} of {progress.totalSets} sets
            ({Math.round(progress.percentage)}%).
          </p>
          
          {progress.percentage < 100 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              You haven't completed all sets. Are you sure you want to finish?
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setFinishModalOpen(false)}>
              Continue Workout
            </Button>
            <Button onClick={handleFinish} isLoading={saving}>
              Finish & Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Workout?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel this workout? Your progress will not
            be saved.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Continue Workout
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Cancel Workout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
