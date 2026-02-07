"use client";

import { formatDuration } from "@/lib/utils/helpers";

interface WorkoutTimerProps {
  elapsedSeconds: number;
  routineName: string;
}

export function WorkoutTimer({ elapsedSeconds, routineName }: WorkoutTimerProps) {
  return (
    <div className="sticky top-0 z-20 px-5 pt-12 pb-4">
      <div className="neumorphic-card p-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-text-tertiary uppercase tracking-wide">Current Workout</p>
            <h1 className="text-lg font-semibold text-text-primary mt-0.5">{routineName}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-tertiary uppercase tracking-wide">Duration</p>
            <p className="text-2xl font-semibold text-text-primary mt-0.5 tabular-nums">
              {formatDuration(elapsedSeconds)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
