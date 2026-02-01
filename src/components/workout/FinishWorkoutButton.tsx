"use client";

import { Button } from "@/components/ui/Button";

interface FinishWorkoutButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  progress: { completedSets: number; totalSets: number; percentage: number };
}

export function FinishWorkoutButton({
  onClick,
  isLoading,
  progress,
}: FinishWorkoutButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {progress.completedSets} / {progress.totalSets} sets
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        <Button
          onClick={onClick}
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          Finish Workout
        </Button>
      </div>
    </div>
  );
}
