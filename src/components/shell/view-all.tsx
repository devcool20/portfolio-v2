"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ViewAllProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
  /** `out` = diagonal arrow (navigate), `down` = down arrow (expand). */
  direction?: "out" | "down";
  external?: boolean;
};

function Arrow({ direction }: { direction: "out" | "down" }) {
  const common = {
    className:
      "h-3.5 w-3.5 shrink-0 text-zinc-500 transition-[transform,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-zinc-900 dark:group-hover:text-zinc-100",
  };

  if (direction === "down") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <polyline
          points="19 12 12 19 5 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-rotate-90 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" {...common} fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="7" y1="17" x2="17" y2="7" strokeLinecap="round" />
      <polyline points="7 7 17 7 17 17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The "View All" affordance, used in five places. Consolidated so the press
 * feedback and arrow nudge are consistent instead of re-typed each time.
 */
export function ViewAll({ href, children = "View All", className, direction = "out", external }: ViewAllProps) {
  const inner = (
    <>
      <span
        aria-hidden
        className="absolute -inset-[5px] rounded-[11px] border border-black/5 transition-colors duration-200 group-hover:border-black/10 dark:border-white/5 dark:group-hover:border-white/15"
      />
      <span className="relative flex items-center gap-1.5 rounded-[6px] border border-black/5 bg-ink-sunken px-4 py-2 text-[13px] font-medium text-zinc-600 shadow-sm shadow-black/5 transition-[background-color,color,transform,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-px group-hover:border-black/10 group-hover:bg-ink-raised group-hover:text-zinc-900 group-active:translate-y-0 group-active:duration-75 dark:border-white/5 dark:bg-ink-sunken dark:text-zinc-400 dark:shadow-lg dark:shadow-black/40 dark:group-hover:border-white/15 dark:group-hover:bg-ink-raised dark:group-hover:text-zinc-100">
        {children}
        <Arrow direction={direction} />
      </span>
    </>
  );

  const classes = cn("group relative block", className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
