"use client";

import { ReactNode } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

// Subtle animation presets following Apple/Cal AI guidelines
const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
};

const EASE = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  out: [0, 0, 0.2, 1],
};

// ============================================
// Fade In Animation
// ============================================
interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  ...props 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: EASE.smooth }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Slide Up Animation
// ============================================
interface SlideUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function SlideUp({ 
  children, 
  delay = 0, 
  duration = DURATION.normal,
  distance = 16,
  ...props 
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ duration, delay, ease: EASE.smooth }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Scale In Animation
// ============================================
interface ScaleInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = DURATION.fast,
  ...props 
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration, delay, ease: EASE.smooth }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Stagger Container - Parent for staggered children
// ============================================
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
}

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.08,
  delayChildren = 0.1,
  ...props 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Stagger Item - Child of StaggerContainer
// ============================================
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE.smooth,
    },
  },
};

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

// ============================================
// Press Scale - Button/interactive press animation
// ============================================
interface PressScaleProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  scale?: number;
}

export function PressScale({ 
  children, 
  scale = 0.98,
  ...props 
}: PressScaleProps) {
  return (
    <motion.div
      whileTap={{ scale }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Hover Lift - Subtle lift on hover
// ============================================
interface HoverLiftProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  lift?: number;
}

export function HoverLift({ 
  children, 
  lift = -2,
  ...props 
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: lift }}
      transition={{ duration: DURATION.fast, ease: EASE.smooth }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// Checkmark Animation - For completion states
// ============================================
interface CheckmarkAnimationProps {
  isComplete: boolean;
  className?: string;
}

export function CheckmarkAnimation({ isComplete, className = "" }: CheckmarkAnimationProps) {
  return (
    <motion.div
      initial={false}
      animate={isComplete ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: EASE.bounce }}
      className={className}
    >
      <motion.svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={false}
        animate={isComplete ? { pathLength: 1 } : { pathLength: 0 }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isComplete ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}

// ============================================
// Number Counter Animation
// ============================================
import { useEffect, useState } from "react";
import { useSpring } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  duration = 1,
  className = "" 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  useEffect(() => {
    spring.set(value);
    
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return () => unsubscribe();
  }, [value, spring]);

  return (
    <span className={className}>
      {displayValue.toLocaleString()}
    </span>
  );
}

// ============================================
// Progress Ring Animation
// ============================================
interface AnimatedProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: ReactNode;
}

export function AnimatedProgressRing({
  progress,
  size = 84,
  strokeWidth = 5,
  className = "",
  children,
}: AnimatedProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="progress-ring-bg"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="progress-ring-fill"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: circumference - (progress / 100) * circumference 
          }}
          transition={{ duration: 0.8, ease: EASE.smooth }}
        />
      </svg>
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
