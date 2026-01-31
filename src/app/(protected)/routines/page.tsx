"use client";

import Link from "next/link";
import { useRoutines } from "@/hooks/useRoutines";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getWorkoutTypeColor, getIntensityColor } from "@/lib/utils/helpers";

export default function RoutinesPage() {
  const { routines, loading, error } = useRoutines();

  return (
    <PageContainer
      title="My Routines"
      description="Manage your workout routines"
      action={
        <Link href="/routines/new">
          <Button>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Routine
          </Button>
        </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : routines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines.map((routine) => (
            <Link key={routine.id} href={`/routines/${routine.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {routine.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getWorkoutTypeColor(routine.workoutType)}>
                        {routine.workoutType}
                      </Badge>
                      <Badge className={getIntensityColor(routine.intensity)}>
                        {routine.intensity}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{routine.exercises.length} exercises</span>
                      <span>~{routine.estimatedDuration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No routines yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first AI-powered workout routine to get started.
            </p>
            <Link href="/routines/new">
              <Button>Create Your First Routine</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
