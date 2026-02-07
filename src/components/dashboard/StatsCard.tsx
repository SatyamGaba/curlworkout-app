"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useInView } from "framer-motion";

interface StatsCardProps {
  value: number;
  label: string;
  unit?: string;
  progress?: number; // 0-100
  icon?: React.ReactNode;
  subtitle?: string;
}

export function StatsCard({ value, label, unit = "", progress = 0, subtitle }: StatsCardProps) {
  const circumference = 2 * Math.PI * 38; // radius = 38
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Animated counter
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="neumorphic-card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Main value - Animated counter */}
          <p className="text-[42px] font-semibold text-text-primary leading-tight tracking-tight tabular-nums">
            {displayValue.toLocaleString()}
          </p>
          {/* Label and unit row */}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-text-secondary">
              {label}
            </p>
            {subtitle && (
              <>
                <span className="text-text-tertiary">·</span>
                <p className="text-sm text-text-tertiary">{subtitle}</p>
              </>
            )}
          </div>
        </div>
        
        {/* Circular Progress Ring - Animated */}
        <div className="relative w-[84px] h-[84px] flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="42"
              cy="42"
              r="38"
              fill="none"
              strokeWidth="5"
              className="progress-ring-bg"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="42"
              cy="42"
              r="38"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              className="progress-ring-fill"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={isInView ? { 
                strokeDashoffset: circumference - (progress / 100) * circumference 
              } : { strokeDashoffset: circumference }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.2 }}
            />
          </svg>
          {/* Center icon - dumbbell */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <svg
              className="w-6 h-6 text-text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
