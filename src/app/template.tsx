"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_DRAFT } from "@/lib/motion";

/**
 * Route transition. A fresh template remounts on every navigation, so the
 * drafting grid redraws itself for each page — the board is re-set rather
 * than cross-faded. The sheet wipe underneath is deliberately quick; the
 * grid drawing is what carries the moment.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ clipPath: "inset(0% 0% 7% 0%)", opacity: 0.4 }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_DRAFT }}
    >
      {children}
    </motion.div>
  );
}
