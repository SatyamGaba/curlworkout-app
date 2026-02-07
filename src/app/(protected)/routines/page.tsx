"use client";

import Link from "next/link";
import { useRoutines } from "@/hooks/useRoutines";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getWorkoutTypeColor, getIntensityColor } from "@/lib/utils/helpers";

export default function RoutinesPage() {
  const { routines, loading: routinesLoading, error: routinesError } = useRoutines();

  return (
    <div className="min-h-screen bg-gradient-page">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Routines
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Manage your workouts
        </p>
      </div>

      <div className="px-5">
        {routinesError && (
          <Card className="mb-6 border-l-4 border-l-red-500">
            <CardContent className="py-4">
              <p className="text-red-600 dark:text-red-400">{routinesError}</p>
            </CardContent>
          </Card>
        )}

        {routinesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 bg-surface-secondary rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : routines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.map((routine) => (
              <Link key={routine.id} href={`/routines/${routine.id}`}>
                <Card variant="neumorphic" className="h-full hover:shadow-cal-lg transition-shadow cursor-pointer">
                  <CardContent className="py-5">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-text-primary line-clamp-2">
                        {routine.name}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={getWorkoutTypeColor(routine.workoutType)}>
                          {routine.workoutType}
                        </Badge>
                        <Badge className={getIntensityColor(routine.intensity)}>
                          {routine.intensity}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-text-secondary">
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
          <Card variant="neumorphic">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-text-tertiary"
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
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No routines yet
              </h3>
              <p className="text-text-secondary text-sm">
                Tap the + button to create your first AI-powered routine.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
