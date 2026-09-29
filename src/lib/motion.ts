import type { Transition, Variants } from "framer-motion";

/* Easings. No bounce, no elastic — exponential deceleration only. */
export const EASE_DRAFT = [0.16, 1, 0.3, 1] as const;
export const EASE_SNAP = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

/* 100 / 300 / 500 discipline. */
export const DUR = {
  instant: 0.1,
  fast: 0.16,
  base: 0.24,
  slow: 0.42,
  reveal: 0.72,
} as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.7,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.6,
};

/**
 * The drafting load sequence.
 *
 * One orchestrated entrance, not a scattered set of fades. The blueprint
 * rules are drawn first (the drawing board being set up), the hero art
 * develops on top of them, and only then does body copy settle. The whole
 * thing lands in ~1.5s, well under the threshold where entrance motion
 * starts to read as latency.
 */
export const INTRO = {
  ruleLeft: 0.0,
  ruleRight: 0.08,
  ruleTop: 0.16,
  ruleHeader: 0.24,
  node: 0.34,
  banner: 0.1,
  portrait: 0.42,
  name: 0.5,
  lead: 0.6,
  actions: 0.68,
} as const;

/* ---- Reveal vocabulary -------------------------------------------------
   Each section gets the reveal that fits what it reveals. A uniform
   fade-and-rise applied to every section is the thing to avoid. */

export const revealFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE_DRAFT },
  },
};

export const revealFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: EASE_DRAFT } },
};

/** Rows wipe in from the left, like a plotter arm pulling a line. */
export const revealRow: Variants = {
  hidden: { opacity: 0, x: -12, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.slow, ease: EASE_DRAFT },
  },
};

/** Cards lift out of the tray. */
export const revealCard: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.reveal, ease: EASE_DRAFT },
  },
};

/** Chips settle. */
export const revealChip: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE_DRAFT },
  },
};

export const staggerParent = (stagger = 0.045, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Keeps total stagger bounded no matter how many children there are. */
export function staggerFor(count: number, per = 0.045, max = 0.42) {
  if (count <= 0) return per;
  return Math.min(per, max / count);
}
