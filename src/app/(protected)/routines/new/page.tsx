"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useRoutines } from "@/hooks/useRoutines";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { getExercises } from "@/lib/firebase/firestore";
import { durationOptionToMinutes, getWorkoutTypeColor } from "@/lib/utils/helpers";
import type {
  Exercise,
  WorkoutType,
  Intensity,
  DurationOption,
  GeneratedRoutine,
  RoutineExercise,
} from "@/types";
import {
  WORKOUT_TYPES,
  INTENSITY_LEVELS,
  DURATION_OPTIONS,
} from "@/types";

import exercisesData from "@/../../data/exercises.json";

export default function NewRoutinePage() {
  const router = useRouter();
  const { userProfile } = useAuthContext();
  const { addRoutine } = useRoutines();

  // Form state
  const [workoutType, setWorkoutType] = useState<WorkoutType>("Push");
  const [intensity, setIntensity] = useState<Intensity>("Medium");
  const [duration, setDuration] = useState<DurationOption>("1hr");
  const [customDuration, setCustomDuration] = useState<string>("45");

  // Generation state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [generatedRoutine, setGeneratedRoutine] = useState<GeneratedRoutine | null>(null);
  const [routineName, setRoutineName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load exercises on mount
  useEffect(() => {
    async function loadExercises() {
      try {
        // Try to load from Firestore first
        const firestoreExercises = await getExercises();
        if (firestoreExercises.length > 0) {
          setExercises(firestoreExercises);
        } else {
          // Fallback to local JSON
          setExercises(exercisesData.exercises as Exercise[]);
        }
      } catch (err) {
        // Fallback to local JSON
        setExercises(exercisesData.exercises as Exercise[]);
      }
    }
    loadExercises();
  }, []);

  const handleGenerate = async () => {
    if (exercises.length === 0) {
      setError("No exercises available");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const durationMinutes = durationOptionToMinutes(
        duration,
        duration === "custom" ? parseInt(customDuration) : undefined
      );

      const response = await fetch("/api/generate-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          params: {
            userWeight: userProfile?.weight || null,
            userHeight: userProfile?.height || null,
            unitPreference: userProfile?.unitPreference || "kg",
            workoutType,
            intensity,
            duration: durationMinutes,
          },
          exercises,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate routine");
      }

      const data = await response.json();
      setGeneratedRoutine(data.routine);
      setRoutineName(data.routine.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate routine");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedRoutine) return;

    setSaving(true);
    setError(null);

    try {
      const durationMinutes = durationOptionToMinutes(
        duration,
        duration === "custom" ? parseInt(customDuration) : undefined
      );

      const routineExercises: RoutineExercise[] = generatedRoutine.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
      }));

      const routineId = await addRoutine({
        name: routineName || generatedRoutine.name,
        workoutType,
        intensity,
        estimatedDuration: durationMinutes,
        exercises: routineExercises,
      });

      router.push(`/routines/${routineId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save routine");
    } finally {
      setSaving(false);
    }
  };

  const updateExercise = (index: number, field: keyof RoutineExercise, value: number) => {
    if (!generatedRoutine) return;

    const updatedExercises = [...generatedRoutine.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };

    setGeneratedRoutine({
      ...generatedRoutine,
      exercises: updatedExercises,
    });
  };

  return (
    <PageContainer
      title="Create New Routine"
      description="Generate a personalized workout with AI"
      gradient
    >
      <div className="space-y-5">
        {/* Configuration Form - Cal AI neumorphic card */}
        <Card variant="neumorphic">
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Workout Configuration
            </h2>
            
            <Select
              id="workoutType"
              label="Workout Type"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
              options={WORKOUT_TYPES.map((type) => ({
                value: type,
                label: type === "FullBody" ? "Full Body" : type,
              }))}
            />

            <Select
              id="intensity"
              label="Intensity"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as Intensity)}
              options={INTENSITY_LEVELS.map((level) => ({
                value: level,
                label: level,
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                id="duration"
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value as DurationOption)}
                options={DURATION_OPTIONS.map((opt) => ({
                  value: opt,
                  label:
                    opt === "30min"
                      ? "30 minutes"
                      : opt === "1hr"
                      ? "1 hour"
                      : opt === "2hr"
                      ? "2 hours"
                      : "Custom",
                }))}
              />

              {duration === "custom" && (
                <Input
                  id="customDuration"
                  label="Minutes"
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  min={15}
                  max={180}
                />
              )}
            </div>

            {!userProfile?.weight && (
              <p className="text-sm text-cal-peach-600 dark:text-cal-peach-400">
                Tip: Add your weight and height in Settings for better workout recommendations.
              </p>
            )}

            <Button
              onClick={handleGenerate}
              isLoading={generating}
              disabled={generating}
              className="w-full mt-2"
              size="lg"
            >
              {generating ? "Generating..." : "Generate Routine with AI"}
            </Button>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card variant="neumorphic-sm" className="border-l-4 border-l-red-500">
            <CardContent className="py-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Generated Routine Preview */}
        {generatedRoutine && (
          <Card variant="neumorphic">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">
                  Generated Routine
                </h2>
                <Badge className={getWorkoutTypeColor(workoutType)}>
                  {workoutType}
                </Badge>
              </div>
              
              <Input
                id="routineName"
                label="Routine Name"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="Enter a name for this routine"
              />

              <div className="space-y-3">
                <h3 className="font-medium text-text-primary">
                  Exercises ({generatedRoutine.exercises.length})
                </h3>

                {generatedRoutine.exercises.map((exercise, index) => (
                  <div
                    key={`${exercise.exerciseId}-${index}`}
                    className="p-4 bg-surface-secondary rounded-2xl border border-border-light"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-text-primary">
                        {exercise.exerciseName}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-text-tertiary mb-1">
                          Sets
                        </label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) =>
                            updateExercise(index, "sets", parseInt(e.target.value) || 1)
                          }
                          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-text-primary/20"
                          min={1}
                          max={10}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-tertiary mb-1">
                          Reps
                        </label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) =>
                            updateExercise(index, "reps", parseInt(e.target.value) || 1)
                          }
                          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-text-primary/20"
                          min={1}
                          max={50}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-tertiary mb-1">
                          Weight ({userProfile?.unitPreference || "kg"})
                        </label>
                        <input
                          type="number"
                          value={exercise.weight}
                          onChange={(e) =>
                            updateExercise(index, "weight", parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-text-primary/20"
                          min={0}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  isLoading={saving}
                  disabled={saving}
                  className="flex-1"
                  size="lg"
                >
                  Save Routine
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generating}
                  size="lg"
                >
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
