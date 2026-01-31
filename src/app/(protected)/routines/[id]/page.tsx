"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRoutine, useRoutines } from "@/hooks/useRoutines";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { getWorkoutTypeColor, getIntensityColor } from "@/lib/utils/helpers";
import type { RoutineExercise } from "@/types";

export default function RoutineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.id as string;
  
  const { routine, loading, error, refresh } = useRoutine(routineId);
  const { editRoutine, removeRoutine } = useRoutines();
  const { userProfile } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedExercises, setEditedExercises] = useState<RoutineExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEditing = () => {
    if (!routine) return;
    setEditedName(routine.name);
    setEditedExercises([...routine.exercises]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedName("");
    setEditedExercises([]);
  };

  const updateExercise = (
    index: number,
    field: keyof RoutineExercise,
    value: number
  ) => {
    const updated = [...editedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setEditedExercises(updated);
  };

  const handleSave = async () => {
    if (!routine) return;

    setSaving(true);
    try {
      await editRoutine(routineId, {
        name: editedName,
        exercises: editedExercises,
      });
      await refresh();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving routine:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeRoutine(routineId);
      router.push("/routines");
    } catch (err) {
      console.error("Error deleting routine:", err);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-3xl space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </PageContainer>
    );
  }

  if (error || !routine) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || "Routine not found"}
            </p>
            <Link href="/routines">
              <Button variant="outline">Back to Routines</Button>
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const displayName = isEditing ? editedName : routine.name;
  const displayExercises = isEditing ? editedExercises : routine.exercises;

  return (
    <PageContainer>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/routines"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-2"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Routines
            </Link>

            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayName}
              </h1>
            )}

            <div className="flex gap-2 mt-2">
              <Badge className={getWorkoutTypeColor(routine.workoutType)}>
                {routine.workoutType}
              </Badge>
              <Badge className={getIntensityColor(routine.intensity)}>
                {routine.intensity}
              </Badge>
              <Badge variant="default">~{routine.estimatedDuration} min</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={handleSave} isLoading={saving}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={startEditing}>
                  Edit
                </Button>
                <Link href={`/workout/${routineId}`}>
                  <Button>Start Workout</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Exercises */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Exercises ({displayExercises.length})
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayExercises.map((exercise, index) => (
              <div
                key={`${exercise.exerciseId}-${index}`}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {index + 1}. {exercise.exerciseName}
                  </span>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "sets",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "reps",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                        min={1}
                        max={50}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Weight ({userProfile?.unitPreference || "kg"})
                      </label>
                      <input
                        type="number"
                        value={exercise.weight}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "weight",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {exercise.sets} sets × {exercise.reps} reps
                    </span>
                    <span>
                      {exercise.weight} {userProfile?.unitPreference || "kg"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Routine
          </Button>

          {!isEditing && (
            <Link href={`/workout/${routineId}`}>
              <Button size="lg">Start Workout</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Routine"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{routine.name}"? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
