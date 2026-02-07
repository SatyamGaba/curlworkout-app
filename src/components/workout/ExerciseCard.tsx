"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card
        variant="neumorphic-sm"
        className={cn(
          "transition-all duration-200",
          isComplete && "ring-2 ring-green-500/30"
        )}
      >
        <CardContent className="p-0">
          {/* Collapsed Header - Always visible */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={isComplete ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
                  isComplete
                    ? "bg-green-500 text-white"
                    : "bg-surface-secondary border border-border-light text-text-secondary"
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
              </motion.div>
              <div>
                <h3 className="font-medium text-text-primary">
                  {exercise.exerciseName}
                </h3>
                <AnimatePresence mode="wait">
                  {!isExpanded && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm text-text-secondary"
                    >
                      {summary} · {completedSets}/{totalSets} sets done
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 text-text-tertiary"
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
            </motion.svg>
          </button>

          {/* Expanded Content with Animation */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-text-tertiary px-2">
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
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
