"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_DRAFT, INTRO } from "@/lib/motion";

type RuleProps = {
  className?: string;
  delay?: number;
  duration?: number;
};

/* Each rule reveals with a clip-path inset, growing from the drawing origin.
   clip-path (not scaleX) so the 1px dash rhythm stays exactly 1px and the
   stroke never looks stretched. */

export function VerticalRule({ className = "", delay = 0, duration = 1.1 }: RuleProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`bp-rule-v pointer-events-none absolute top-0 bottom-0 hidden w-0 border-l md:block ${className}`}
      style={{ transformOrigin: "top center" }}
      initial={reduce ? undefined : { clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: reduce ? 0 : duration, ease: EASE_DRAFT, delay: reduce ? 0 : delay }}
    />
  );
}

export function HorizontalRule({ className = "", delay = 0, duration = 1.1 }: RuleProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`bp-rule-h pointer-events-none absolute left-0 right-0 h-0 border-t ${className}`}
      style={{ transformOrigin: "left center" }}
      initial={reduce ? undefined : { clipPath: "inset(0% 100% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: reduce ? 0 : duration, ease: EASE_DRAFT, delay: reduce ? 0 : delay }}
    />
  );
}

/** The 2px intersection markers where rules meet. */
export function IntersectionNodes({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();

  const positions = [
    { top: "22vh", left: "30%" },
    { top: "22vh", right: "30%" },
    { top: "calc(22vh + 112px)", left: "30%" },
    { top: "calc(22vh + 112px)", right: "30%" },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="bp-node pointer-events-none absolute z-10 hidden h-[2px] w-[2px] md:block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            translate: pos.right ? "50% -50%" : "-50% -50%",
          }}
          initial={reduce ? undefined : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: reduce ? 0 : 0.45,
            ease: EASE_DRAFT,
            delay: reduce ? 0 : delay + i * 0.05,
          }}
        />
      ))}
    </>
  );
}

/**
 * The full-page drafting grid. Drawn once on mount — this is the signature
 * moment. It deliberately does not repeat on scroll: the rules are the
 * furniture, not an effect.
 */
export function BlueprintGrid() {
  return (
    <div aria-hidden className="pointer-events-none">
      <VerticalRule className="left-[30%]" delay={INTRO.ruleLeft} />
      <VerticalRule className="right-[30%]" delay={INTRO.ruleRight} />
      <HorizontalRule className="top-[22vh]" delay={INTRO.ruleTop} />
      <HorizontalRule className="top-[calc(22vh+112px)]" delay={INTRO.ruleHeader} />
      <IntersectionNodes delay={INTRO.node} />
    </div>
  );
}
