"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "@/components/providers/NavigationProvider";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const variants = {
  enter: (direction: "left" | "right" | "none") => ({
    x: direction === "right" ? 50 : direction === "left" ? -50 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right" | "none") => ({
    x: direction === "right" ? -50 : direction === "left" ? 50 : 0,
    opacity: 0,
  }),
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const { direction } = useNavigation();

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "tween", duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
