"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_DRAFT } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number;
  blur?: number;
  /** `mount` runs on load, `view` waits for the element to scroll into frame. */
  trigger?: "mount" | "view";
  duration?: number;
};

/**
 * Entrance wrapper for content that lives in a Server Component. Renders as a
 * plain element when the user prefers reduced motion, so nothing is ever
 * gated behind a class that might not fire.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  scale,
  blur = 0,
  trigger = "mount",
  duration = 0.7,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const hidden = {
    opacity: 0,
    y,
    ...(scale !== undefined ? { scale } : {}),
    ...(blur ? { filter: `blur(${blur}px)` } : {}),
  };

  const visible = {
    opacity: 1,
    y: 0,
    ...(scale !== undefined ? { scale: 1 } : {}),
    ...(blur ? { filter: "blur(0px)" } : {}),
  };

  const transition = { duration, ease: EASE_DRAFT, delay };

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(trigger === "view"
        ? { whileInView: visible, viewport: { once: true, amount: 0.2 } }
        : { animate: visible })}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
