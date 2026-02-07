"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/helpers";
import type { WorkoutSet } from "@/types";

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  exerciseIndex: number;
  onToggleComplete: () => void;
  onUpdateSet: (field: keyof WorkoutSet, value: number | boolean) => void;
}

export function SetRow({
  set,
  setIndex,
  onToggleComplete,
  onUpdateSet,
}: SetRowProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: set.completed ? "rgba(34, 197, 94, 0.1)" : "var(--surface-secondary)",
      }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl"
    >
      {/* Set Number */}
      <div className="col-span-2">
        <motion.span
          initial={false}
          animate={{
            color: set.completed ? "rgb(22, 163, 74)" : "var(--text-secondary)",
          }}
          className="text-sm font-medium"
        >
          {setIndex + 1}
        </motion.span>
      </div>

      {/* Reps Input */}
      <div className="col-span-3">
        <input
          type="number"
          value={set.reps}
          onChange={(e) => onUpdateSet("reps", parseInt(e.target.value) || 0)}
          className={cn(
            "w-full px-2 py-1.5 text-sm border border-border rounded-xl text-center bg-surface text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-text-primary/20 transition-colors duration-200",
            set.completed && "bg-green-500/5 border-green-500/30"
          )}
          min={0}
        />
      </div>

      {/* Weight Input */}
      <div className="col-span-4">
        <input
          type="number"
          value={set.weight}
          onChange={(e) =>
            onUpdateSet("weight", parseFloat(e.target.value) || 0)
          }
          className={cn(
            "w-full px-2 py-1.5 text-sm border border-border rounded-xl text-center bg-surface text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-text-primary/20 transition-colors duration-200",
            set.completed && "bg-green-500/5 border-green-500/30"
          )}
          min={0}
          step={0.5}
        />
      </div>

      {/* Complete Checkbox with Animation */}
      <div className="col-span-3 flex justify-end">
        <motion.button
          onClick={onToggleComplete}
          whileTap={{ scale: 0.9 }}
          animate={set.completed ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] as const }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
            set.completed
              ? "bg-green-500 text-white shadow-cal-sm"
              : "bg-surface-secondary border border-border-light text-text-tertiary hover:border-text-tertiary"
          )}
        >
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={false}
            animate={{ 
              opacity: set.completed ? 1 : 0.4,
              scale: set.completed ? 1 : 0.8 
            }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
