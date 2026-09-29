"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Rule } from "@/components/blueprint/rule";
import { EASE_DRAFT, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  title?: string;
  /** Right-aligned meta in the heading row — status, counts, filters. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Extra space above the plot line. */
  spacing?: string;
  contentClassName?: string;
};

/**
 * A plot-line framed section.
 *
 * Replaces the copy-pasted "top rule + heading + bottom rule + four
 * intersection dots" block that appeared in nine places. The heading reveals
 * with a clip-path wipe (a line being drawn) rather than the fade-and-rise
 * that every other block was using.
 */
export function Section({
  id,
  title,
  aside,
  children,
  className,
  spacing = "mt-6",
  contentClassName,
}: SectionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      variants={staggerParent(0.05)}
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className={cn("relative z-10 scroll-mt-24", spacing, className)}
    >
      <Rule side="top" bleed nodes={["start", "end"]} draw />

      {title ? (
        // The heading cell: a ruled band, exactly like a table header on a
        // drafting sheet. The rule belongs directly under the heading, not at
        // the foot of the whole section.
        <div className="relative py-2">
          <motion.div
            variants={{
              hidden: reduce ? {} : { opacity: 0, clipPath: "inset(0% 0% 105% 0%)" },
              visible: {
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                transition: { duration: 0.6, ease: EASE_DRAFT },
              },
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h2>
            {aside && <div className="shrink-0">{aside}</div>}
          </motion.div>

          <Rule side="bottom" bleed nodes={["start", "end"]} draw />
        </div>
      ) : (
        aside && <div className="relative pb-2">{aside}</div>
      )}

      <div className={cn("relative", contentClassName)}>{children}</div>
    </motion.section>
  );
}

/**
 * A list row. Rows wipe in from the left with a short blur, like a plotter
 * arm pulling each line across the sheet. Stagger is capped by the caller
 * via `index`/`total`.
 */
export function SectionRow({
  children,
  className,
  index = 0,
  total = 1,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  total?: number;
}) {
  const reduce = useReducedMotion();
  const per = Math.min(0.05, 0.4 / Math.max(total, 1));

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -14, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: EASE_DRAFT, delay: index * per }}
    >
      {children}
    </motion.div>
  );
}
