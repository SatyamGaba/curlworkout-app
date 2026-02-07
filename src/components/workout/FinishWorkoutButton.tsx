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
    <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 z-40">
      <div className="max-w-3xl mx-auto">
        {/* Cal AI style card container */}
        <div className="neumorphic-card p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Progress</span>
              <span className="font-medium text-text-primary">
                {progress.completedSets} / {progress.totalSets} sets
              </span>
            </div>
            <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-text-primary rounded-full transition-all duration-300"
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
    </div>
  );
}
