"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatRelativeDate, formatDuration } from "@/lib/utils/helpers";
import type { WorkoutHistory } from "@/types";

interface RecentWorkoutsProps {
  workouts: WorkoutHistory[];
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function RecentWorkouts({ workouts, loading }: RecentWorkoutsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-surface-secondary rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="neumorphic-card p-6 rounded-2xl"
      >
        <p className="font-semibold text-text-primary">
          You haven&apos;t logged any workouts
        </p>
        <p className="text-sm text-text-secondary mt-1">
          Start your first workout by tapping the + button.
        </p>
        <div className="flex justify-end mt-2">
          <svg
            className="w-8 h-8 text-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {workouts.map((workout) => (
        <motion.div key={workout.id} variants={itemVariants}>
          <Link href={`/history/${workout.id}`}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="neumorphic-card p-4 rounded-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">
                    {workout.routineName}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {formatRelativeDate(workout.createdAt)} • {formatDuration(workout.duration)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 bg-surface-secondary rounded-full text-text-secondary">
                    {workout.workoutType}
                  </span>
                  <svg
                    className="w-5 h-5 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
