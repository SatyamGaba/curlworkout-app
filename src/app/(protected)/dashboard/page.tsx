"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getUserRoutines, getRecentWorkouts } from "@/lib/firebase/firestore";
import { formatRelativeDate, formatDuration, getWorkoutTypeColor } from "@/lib/utils/helpers";
import type { Routine, WorkoutHistory } from "@/types";

export default function DashboardPage() {
  const { user, userProfile } = useAuthContext();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        const [routinesData, workoutsData] = await Promise.all([
          getUserRoutines(user.uid),
          getRecentWorkouts(user.uid, 3),
        ]);
        setRoutines(routinesData.slice(0, 4));
        setRecentWorkouts(workoutsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const needsProfileSetup = !userProfile?.weight || !userProfile?.height;

  return (
    <PageContainer>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userProfile?.displayName?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 py-1">
          Ready for your next workout?
        </p>
      </div>

      {/* Profile Setup Alert */}
      {needsProfileSetup && (
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Complete your profile
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your weight and height to get personalized AI workout routines.
                </p>
              </div>
              <Link href="/settings">
                <Button size="sm">Update Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/routines/new">
          <Card className="premium-card text-white">
            <CardContent className="py-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-gradient">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Create New Routine
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate a workout with AI
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/routines">
          <Card className="premium-card-green h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-700 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Start Workout
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose from your routines
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Routines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Routines
            </h2>
            <Link
              href="/routines"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : routines.length > 0 ? (
            <div className="space-y-3">
              {routines.map((routine) => (
                <Link key={routine.id} href={`/routines/${routine.id}`}>
                  <Card className="cool-card hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {routine.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {routine.exercises.length} exercises
                          </p>
                        </div>
                        <Badge className={getWorkoutTypeColor(routine.workoutType)}>
                          {routine.workoutType}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No routines yet. Create your first AI-powered workout!
                </p>
                <Link href="/routines/new">
                  <Button>Create Routine</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Workouts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Workouts
            </h2>
            <Link
              href="/history"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Link key={workout.id} href={`/history/${workout.id}`}>
                  <Card className="cool-card hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {workout.routineName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatRelativeDate(workout.createdAt)} •{" "}
                            {formatDuration(workout.duration)}
                          </p>
                        </div>
                        <Badge className={getWorkoutTypeColor(workout.workoutType)}>
                          {workout.workoutType}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No workouts yet. Start your first session!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
