"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { getRecentWorkouts, getWeeklyStats, getDailyStats, type DailyStats } from "@/lib/firebase/firestore";
import {
  CalendarWeekView,
  StreakBadge,
  StatsCard,
  StatsPills,
  StatIcons,
  RecentWorkouts,
} from "@/components/dashboard";
import type { WorkoutHistory } from "@/types";

interface WeeklyStats {
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  workoutCount: number;
  workoutDates: Date[];
}

// Helper to format date for display
function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return "today";
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (compareDate.getTime() === yesterday.getTime()) {
    return "yesterday";
  }
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { user, userProfile } = useAuthContext();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutHistory[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalVolume: 0,
    totalSets: 0,
    totalReps: 0,
    workoutCount: 0,
    workoutDates: [],
  });
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(false);
  
  // Stats view mode: 0 = day/selected, 1 = week
  const [statsViewIndex, setStatsViewIndex] = useState(1); // Start with week view
  const statsContainerRef = useRef<HTMLDivElement>(null);

  // Load initial weekly data
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const [workoutsData, statsData] = await Promise.all([
          getRecentWorkouts(user.uid, 5),
          getWeeklyStats(user.uid),
        ]);
        setRecentWorkouts(workoutsData);
        setWeeklyStats(statsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Load daily stats when a date is selected
  useEffect(() => {
    async function loadDailyStats() {
      if (!user || !selectedDate) {
        setDailyStats(null);
        return;
      }

      setLoadingDaily(true);
      try {
        const stats = await getDailyStats(user.uid, selectedDate);
        setDailyStats(stats);
        // Switch to day view when a date is selected
        setStatsViewIndex(0);
      } catch (error) {
        console.error("Error loading daily stats:", error);
      } finally {
        setLoadingDaily(false);
      }
    }

    loadDailyStats();
  }, [user, selectedDate]);

  // Handle date selection from calendar
  const handleSelectDate = useCallback((date: Date | null) => {
    setSelectedDate(date);
    if (date === null) {
      // When deselecting, go back to week view
      setStatsViewIndex(1);
    }
  }, []);

  // Handle stats swipe/scroll
  const handleStatsScroll = useCallback(() => {
    if (!statsContainerRef.current) return;
    const { scrollLeft, clientWidth } = statsContainerRef.current;
    const newIndex = Math.round(scrollLeft / clientWidth);
    setStatsViewIndex(newIndex);
  }, []);

  const weeklyGoal = userProfile?.weeklyGoal || 4;
  const progressPercent = Math.min(
    (weeklyStats.workoutCount / weeklyGoal) * 100,
    100
  );

  // Current display stats (either daily or weekly based on view)
  const displayStats = useMemo(() => {
    if (statsViewIndex === 0 && dailyStats) {
      return {
        volume: dailyStats.totalVolume,
        sets: dailyStats.totalSets,
        reps: dailyStats.totalReps,
        workouts: dailyStats.workoutCount,
        label: `Volume on ${formatDateLabel(dailyStats.date)}`,
        isDaily: true,
      };
    }
    return {
      volume: weeklyStats.totalVolume,
      sets: weeklyStats.totalSets,
      reps: weeklyStats.totalReps,
      workouts: weeklyStats.workoutCount,
      label: "Volume this week",
      isDaily: false,
    };
  }, [statsViewIndex, dailyStats, weeklyStats]);

  const statsPillsData = useMemo(() => [
    {
      value: displayStats.sets,
      label: "Sets done",
      icon: StatIcons.sets,
    },
    {
      value: displayStats.reps,
      label: "Reps done",
      icon: StatIcons.reps,
    },
    {
      value: displayStats.isDaily 
        ? displayStats.workouts 
        : `${weeklyStats.workoutCount}/${weeklyGoal}`,
      label: "Workouts",
      icon: StatIcons.workouts,
    },
  ], [displayStats, weeklyStats.workoutCount, weeklyGoal]);

  return (
    <div className="min-h-screen bg-gradient-page pb-28">
      {/* Header - Cal AI style */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-text-primary rounded-xl flex items-center justify-center shadow-cal-sm">
              <span className="text-background font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-xl text-text-primary tracking-tight">
              CurlAI
            </span>
          </div>
          <StreakBadge streak={userProfile?.currentStreak || 0} />
        </div>
      </div>

      {/* Calendar Week View - Now with selection */}
      <div className="px-4">
        <CalendarWeekView 
          workoutDates={weeklyStats.workoutDates}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      </div>

      {/* Swipeable Stats Container */}
      <div className="mt-4 overflow-hidden">
        <div 
          ref={statsContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          onScroll={handleStatsScroll}
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Day Stats View (Page 1) */}
          <div className="w-full flex-shrink-0 snap-center px-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate?.toDateString() || "no-selection"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {loadingDaily ? (
                  <div className="neumorphic-card p-6">
                    <div className="animate-pulse">
                      <div className="h-10 bg-surface-secondary rounded-xl w-24 mb-2" />
                      <div className="h-4 bg-surface-secondary rounded w-32" />
                    </div>
                  </div>
                ) : dailyStats ? (
                  <>
                    <StatsCard
                      value={dailyStats.totalVolume}
                      label={`Volume on ${formatDateLabel(dailyStats.date)}`}
                      unit={userProfile?.unitPreference || "kg"}
                      progress={dailyStats.workoutCount > 0 ? 100 : 0}
                    />
                    <div className="mt-4">
                      <StatsPills stats={[
                        { value: dailyStats.totalSets, label: "Sets done", icon: StatIcons.sets },
                        { value: dailyStats.totalReps, label: "Reps done", icon: StatIcons.reps },
                        { value: dailyStats.workoutCount, label: "Workouts", icon: StatIcons.workouts },
                      ]} />
                    </div>
                  </>
                ) : (
                  <div className="neumorphic-card p-6 text-center">
                    <p className="text-text-secondary text-sm">
                      Select a day to view stats
                    </p>
                    <p className="text-text-tertiary text-xs mt-1">
                      Swipe right for weekly stats
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Week Stats View (Page 2) */}
          <div className="w-full flex-shrink-0 snap-center px-5">
            <StatsCard
              value={weeklyStats.totalVolume}
              label="Volume this week"
              unit={userProfile?.unitPreference || "kg"}
              progress={progressPercent}
            />
            <div className="mt-4">
              <StatsPills stats={[
                { value: weeklyStats.totalSets, label: "Sets done", icon: StatIcons.sets },
                { value: weeklyStats.totalReps, label: "Reps done", icon: StatIcons.reps },
                { value: `${weeklyStats.workoutCount}/${weeklyGoal}`, label: "Workouts", icon: StatIcons.workouts },
              ]} />
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => {
              statsContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              statsViewIndex === 0 ? "bg-text-primary" : "bg-border"
            }`}
            aria-label="Day stats"
          />
          <button
            onClick={() => {
              if (statsContainerRef.current) {
                statsContainerRef.current.scrollTo({ 
                  left: statsContainerRef.current.clientWidth, 
                  behavior: "smooth" 
                });
              }
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              statsViewIndex === 1 ? "bg-text-primary" : "bg-border"
            }`}
            aria-label="Week stats"
          />
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="px-5 mt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Recently logged
        </h2>
        <RecentWorkouts workouts={recentWorkouts} loading={loading} />
      </div>
    </div>
  );
}
