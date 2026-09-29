"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_DRAFT } from "@/lib/motion";

type Node = "start" | "end" | "center";

type RuleProps = {
  /** Which edge of the positioned parent the rule sits on. */
  side?: "top" | "bottom";
  /** Extend the rule past the viewport so it reads as a full-width plot line. */
  bleed?: boolean;
  /** Horizontal inset when not bleeding. */
  inset?: string;
  /** Intersection markers to draw. */
  nodes?: readonly Node[];
  /** Draw the rule when it scrolls into view instead of on mount. */
  draw?: boolean;
  delay?: number;
  className?: string;
  strong?: boolean;
};

/**
 * A horizontal plot line plus its intersection markers.
 *
 * The rule is a zero-height box carrying a 1px border, so the reveal has to
 * wipe along X. Clipping on Y would clip the border out of existence — the
 * dash pattern lives in a mask, so a horizontal inset reveals it without
 * distorting the 1px-on / 5px-off rhythm.
 */
export function Rule({
  side = "bottom",
  bleed = false,
  inset = "inset-x-0",
  nodes = [],
  draw = false,
  delay = 0,
  className,
  strong = false,
}: RuleProps) {
  const reduce = useReducedMotion();
  const animated = !reduce;

  return (
    <>
      <motion.div
        aria-hidden
        className={cn(
          "bp-rule-h pointer-events-none absolute h-0",
          side === "top" ? "top-0 border-t" : "bottom-0 border-b",
          bleed ? "-inset-x-[100vw]" : inset,
          strong && "opacity-90",
          className,
        )}
        style={{ transformOrigin: "left center" }}
        initial={animated && draw ? { clipPath: "inset(0% 100% 0% 0%)" } : undefined}
        animate={draw ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        whileInView={animated && draw ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: animated ? 0.8 : 0, ease: EASE_DRAFT, delay: animated ? delay : 0 }}
      />

      {nodes.map((node) => (
        <motion.span
          key={node}
          aria-hidden
          className={cn(
            "bp-node pointer-events-none absolute z-20 h-[2px] w-[2px]",
            side === "top" ? "-translate-y-1/2" : "translate-y-1/2",
            node === "start" && "left-0 -translate-x-1/2",
            node === "end" && "right-0 translate-x-1/2",
            node === "center" && "left-1/2 -translate-x-1/2",
            strong && "bp-node-strong",
          )}
          style={{
            top: side === "top" ? 0 : undefined,
            bottom: side === "bottom" ? 0 : undefined,
          }}
          initial={animated && draw ? { scale: 0, opacity: 0 } : undefined}
          animate={draw ? undefined : { scale: 1, opacity: 1 }}
          whileInView={animated && draw ? { scale: 1, opacity: 1 } : undefined}
          viewport={{ once: true, amount: 0 }}
          transition={{
            duration: animated ? 0.32 : 0,
            ease: EASE_DRAFT,
            delay: animated ? delay + 0.55 : 0,
          }}
        />
      ))}
    </>
  );
}
