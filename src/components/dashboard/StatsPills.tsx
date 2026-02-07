"use client";

import { motion } from "framer-motion";

interface StatPill {
  value: number | string;
  label: string;
  icon: React.ReactNode;
}

interface StatsPillsProps {
  stats: StatPill[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

export function StatsPills({ stats }: StatsPillsProps) {
  return (
    <motion.div 
      className="grid grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="stat-pill p-4 flex flex-col"
        >
          {/* Value - Cal AI bold typography */}
          <p className="text-xl font-semibold text-text-primary tracking-tight">
            {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
          </p>
          {/* Label */}
          <p className="text-xs text-text-secondary mt-0.5">
            {stat.label}
          </p>
          {/* Icon in circular container - Cal AI style */}
          <div className="mt-3 w-10 h-10 rounded-full bg-surface-secondary border border-border-light flex items-center justify-center">
            {stat.icon}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Pre-configured icons for common workout stats
export const StatIcons = {
  sets: (
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  reps: (
    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  ),
  workouts: (
    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
    </svg>
  ),
};
