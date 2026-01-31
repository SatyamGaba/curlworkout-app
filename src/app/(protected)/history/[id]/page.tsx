"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useWorkoutDetail } from "@/hooks/useHistory";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WorkoutDetail } from "@/components/history/WorkoutDetail";
import { formatDate } from "@/lib/utils/helpers";

export default function HistoryDetailPage() {
  const params = useParams();
  const workoutId = params.id as string;

  const { workout, loading, error } = useWorkoutDetail(workoutId);
  const { userProfile } = useAuthContext();

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-3xl space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </PageContainer>
    );
  }

  if (error || !workout) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || "Workout not found"}
            </p>
            <Link href="/history">
              <Button variant="outline">Back to History</Button>
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/history"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-2"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to History
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {workout.routineName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {formatDate(workout.startTime)}
          </p>
        </div>

        <WorkoutDetail
          workout={workout}
          unitPreference={userProfile?.unitPreference || "kg"}
        />
      </div>
    </PageContainer>
  );
}
