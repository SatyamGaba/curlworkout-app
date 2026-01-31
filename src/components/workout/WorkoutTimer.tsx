"use client";

import { formatDuration } from "@/lib/utils/helpers";

interface WorkoutTimerProps {
  elapsedSeconds: number;
  routineName: string;
}

export function WorkoutTimer({ elapsedSeconds, routineName }: WorkoutTimerProps) {
  return (
    <div className="sticky top-0 z-20 bg-primary-600 text-white px-4 py-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-100">Current Workout</p>
          <h1 className="text-lg font-semibold">{routineName}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-primary-100">Duration</p>
          <p className="text-2xl font-mono font-bold">
            {formatDuration(elapsedSeconds)}
          </p>
        </div>
      </div>
    </div>
  );
}
