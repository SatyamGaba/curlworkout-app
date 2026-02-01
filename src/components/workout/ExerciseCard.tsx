"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SetRow } from "./SetRow";
import { cn } from "@/lib/utils/helpers";
import type { WorkoutExercise, WorkoutSet } from "@/types";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseIndex: number;
  unitPreference: string;
  onToggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
  onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: keyof WorkoutSet,
    value: number | boolean
  ) => void;
}

export function ExerciseCard({
  exercise,
  exerciseIndex,
  unitPreference,
  onToggleSetComplete,
  onUpdateSet,
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSets = exercise.sets.filter((s) => s.completed).length;
  const totalSets = exercise.sets.length;
  const isComplete = completedSets === totalSets;

  // Get summary for collapsed view
  const firstSet = exercise.sets[0];
  const summary = `${totalSets} × ${firstSet?.reps} @ ${firstSet?.weight} ${unitPreference}`;

  return (
    <Card
      className={cn(
        "transition-all",
        isComplete && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      )}
    >
      <CardContent className="p-0">
        {/* Collapsed Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isComplete
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              )}
            >
              {isComplete ? (
                <svg
                  className="w-5 h-5"
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
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {exercise.exerciseName}
              </h3>
              {!isExpanded && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {summary} • {completedSets}/{totalSets} sets done
                </p>
              )}
            </div>
          </div>

          <svg
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform",
              isExpanded && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
              <div className="col-span-2">Set</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-4">Weight ({unitPreference})</div>
              <div className="col-span-3 text-right">Done</div>
            </div>

            {exercise.sets.map((set, setIndex) => (
              <SetRow
                key={setIndex}
                set={set}
                setIndex={setIndex}
                exerciseIndex={exerciseIndex}
                onToggleComplete={() =>
                  onToggleSetComplete(exerciseIndex, setIndex)
                }
                onUpdateSet={(field, value) =>
                  onUpdateSet(exerciseIndex, setIndex, field, value)
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
