"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  formatRelativeDate,
  formatDuration,
  formatTime,
  getWorkoutTypeColor,
  calculateTotalVolume,
  calculateCompletedSets,
} from "@/lib/utils/helpers";
import type { WorkoutHistory } from "@/types";

interface WorkoutHistoryCardProps {
  workout: WorkoutHistory;
  unitPreference: string;
}

export function WorkoutHistoryCard({
  workout,
  unitPreference,
}: WorkoutHistoryCardProps) {
  const { completed, total } = calculateCompletedSets(workout.exercises);
  const volume = calculateTotalVolume(workout.exercises);

  return (
    <Link href={`/history/${workout.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {workout.routineName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatRelativeDate(workout.startTime)} at{" "}
                {formatTime(workout.startTime)}
              </p>
            </div>
            <Badge className={getWorkoutTypeColor(workout.workoutType)}>
              {workout.workoutType}
            </Badge>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatDuration(workout.duration)}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {completed}/{total} sets
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
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
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              <span>
                {volume.toLocaleString()} {unitPreference}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
