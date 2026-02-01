"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  formatDate,
  formatTime,
  formatDuration,
  getWorkoutTypeColor,
  calculateTotalVolume,
  calculateCompletedSets,
  cn,
} from "@/lib/utils/helpers";
import type { WorkoutHistory } from "@/types";

interface WorkoutDetailProps {
  workout: WorkoutHistory;
  unitPreference: string;
}

export function WorkoutDetail({ workout, unitPreference }: WorkoutDetailProps) {
  const { completed, total } = calculateCompletedSets(workout.exercises);
  const volume = calculateTotalVolume(workout.exercises);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDuration(workout.duration)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sets Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completed}/{total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {volume.toLocaleString()}
              <span className="text-sm font-normal ml-1">{unitPreference}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exercises */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Exercises ({workout.exercises.length})
            </h2>
            <Badge className={getWorkoutTypeColor(workout.workoutType)}>
              {workout.workoutType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {workout.exercises.map((exercise, exerciseIndex) => {
            const exerciseCompleted = exercise.sets.filter(
              (s) => s.completed
            ).length;
            const exerciseTotal = exercise.sets.length;
            const isComplete = exerciseCompleted === exerciseTotal;

            return (
              <div
                key={`${exercise.exerciseId}-${exerciseIndex}`}
                className={cn(
                  "p-4 rounded-lg",
                  isComplete
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-gray-50 dark:bg-gray-800"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                        isComplete
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      )}
                    >
                      {isComplete ? (
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        exerciseIndex + 1
                      )}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exercise.exerciseName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {exerciseCompleted}/{exerciseTotal} sets
                  </span>
                </div>

                <div className="space-y-1">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className={cn(
                        "flex items-center gap-4 text-sm py-1 px-2 rounded",
                        set.completed
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-white dark:bg-gray-700"
                      )}
                    >
                      <span className="w-8 text-gray-500 dark:text-gray-400">
                        Set {setIndex + 1}
                      </span>
                      <span className="flex-1">
                        {set.reps} reps × {set.weight} {unitPreference}
                      </span>
                      {set.completed ? (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-400"
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
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Workout Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Workout Info
          </h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400">Date</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {formatDate(workout.startTime)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400">
                Start Time
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {formatTime(workout.startTime)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400">
                End Time
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {formatTime(workout.endTime)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600 dark:text-gray-400">
                Routine
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {workout.routineName}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
