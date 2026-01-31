"use client";

import { cn } from "@/lib/utils/helpers";
import type { WorkoutSet } from "@/types";

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  exerciseIndex: number;
  onToggleComplete: () => void;
  onUpdateSet: (field: keyof WorkoutSet, value: number | boolean) => void;
}

export function SetRow({
  set,
  setIndex,
  onToggleComplete,
  onUpdateSet,
}: SetRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors",
        set.completed
          ? "bg-green-100 dark:bg-green-900/30"
          : "bg-gray-50 dark:bg-gray-800"
      )}
    >
      {/* Set Number */}
      <div className="col-span-2">
        <span
          className={cn(
            "text-sm font-medium",
            set.completed
              ? "text-green-700 dark:text-green-300"
              : "text-gray-600 dark:text-gray-400"
          )}
        >
          {setIndex + 1}
        </span>
      </div>

      {/* Reps Input */}
      <div className="col-span-3">
        <input
          type="number"
          value={set.reps}
          onChange={(e) => onUpdateSet("reps", parseInt(e.target.value) || 0)}
          className={cn(
            "w-full px-2 py-1.5 text-sm border rounded text-center",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            "dark:bg-gray-700 dark:border-gray-600",
            set.completed && "bg-green-50 dark:bg-green-900/50"
          )}
          min={0}
        />
      </div>

      {/* Weight Input */}
      <div className="col-span-4">
        <input
          type="number"
          value={set.weight}
          onChange={(e) =>
            onUpdateSet("weight", parseFloat(e.target.value) || 0)
          }
          className={cn(
            "w-full px-2 py-1.5 text-sm border rounded text-center",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            "dark:bg-gray-700 dark:border-gray-600",
            set.completed && "bg-green-50 dark:bg-green-900/50"
          )}
          min={0}
          step={0.5}
        />
      </div>

      {/* Complete Checkbox */}
      <div className="col-span-3 flex justify-end">
        <button
          onClick={onToggleComplete}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            set.completed
              ? "bg-green-500 text-white"
              : "bg-gray-200 dark:bg-gray-600 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500"
          )}
        >
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
        </button>
      </div>
    </div>
  );
}
