"use client";

import { useState } from "react";
import { useWorkoutHistory } from "@/hooks/useHistory";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { WorkoutHistoryCard } from "@/components/history/WorkoutHistoryCard";
import { formatDate } from "@/lib/utils/helpers";
import type { WorkoutType } from "@/types";
import { WORKOUT_TYPES } from "@/types";

export default function HistoryPage() {
  const [filterType, setFilterType] = useState<WorkoutType | "all">("all");
  const { history, loading, error } = useWorkoutHistory(
    filterType !== "all" ? { workoutType: filterType as WorkoutType } : undefined
  );
  const { userProfile } = useAuthContext();

  // Group workouts by date
  const groupedHistory = history.reduce((groups, workout) => {
    const date = formatDate(workout.startTime);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(workout);
    return groups;
  }, {} as Record<string, typeof history>);

  const filterOptions = [
    { value: "all", label: "All Workouts" },
    ...WORKOUT_TYPES.map((type) => ({
      value: type,
      label: type === "FullBody" ? "Full Body" : type,
    })),
  ];

  return (
    <PageContainer
      title="Workout History"
      description="Review your past workouts"
      action={
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as WorkoutType | "all")}
          options={filterOptions}
          className="w-40"
        />
      }
    >
      {error && (
        <Card className="mb-6 border-l-4 border-l-red-500">
          <CardContent className="py-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : Object.keys(groupedHistory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, workouts]) => (
            <div key={date}>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                {date}
              </h2>
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <WorkoutHistoryCard
                    key={workout.id}
                    workout={workout}
                    unitPreference={userProfile?.unitPreference || "kg"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filterType !== "all"
                ? `No ${filterType} workouts found. Try a different filter.`
                : "Complete your first workout to see it here."}
            </p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
