"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { BlueprintGrid } from "@/components/blueprint/grid";
import { CommandMenu } from "@/components/command-menu";
import { CurrentTime } from "@/components/CurrentTime";
import { ThemeToggle } from "@/components/theme-toggle";
import { EASE_DRAFT, INTRO } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const HERO_CELL = "top-0 h-[var(--hero-height)]";
export const HEADER_CELL = "top-[var(--hero-height)] h-[var(--header-height)]";
export const CONTENT_OFFSET = "pt-[calc(var(--hero-height)+var(--header-height))]";

type PageShellProps = {
  /** Rendered inside the responsive hero cell. */
  hero: React.ReactNode;
  /** Page title in the header cell. Omit for the home page, which shows the name. */
  title?: string;
  subtitle?: string;
  /** Show the back-to-home affordance. */
  back?: boolean;
  /** Where the back affordance points. */
  backHref?: string;
  /** Extra controls rendered beside the command menu and theme toggle. */
  controls?: React.ReactNode;
  /** Replaces the default title block (home page identity cell). */
  identity?: React.ReactNode;
  /** Rendered in the left rail beside the identity header. */
  leftRail?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Right-hand index rail. */
  rail?: React.ReactNode;
};

/**
 * Shared hero, identity and content frame. CSS tokens also position the
 * drafting rules and side rails, so the pieces cannot drift independently.
 *
 * Previously this was copy-pasted across seven pages, which is why the
 * entrance choreography could never be changed in one place.
 */
export function PageShell({
  hero,
  title,
  subtitle,
  back = false,
  backHref = "/",
  controls,
  identity,
  leftRail,
  children,
  className,
  contentClassName,
  rail,
}: PageShellProps) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? undefined : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.6, ease: EASE_DRAFT, delay: reduce ? 0 : delay },
  });

  return (
    <div className={cn("relative min-h-screen w-full overflow-x-clip", className)}>
      {rail}

      <BlueprintGrid />

      {/* Cell 1 — hero art */}
      <div className={cn("pointer-events-auto absolute left-0 right-0 z-0 md:left-[var(--page-gutter)] md:right-[var(--page-gutter)]", HERO_CELL)}>
        {hero}
      </div>

      {/* Cell 2 — header */}
      <header
        className={cn(
          "absolute left-0 right-0 z-50 flex items-center px-5 md:left-[var(--page-gutter)] md:right-[var(--page-gutter)] md:px-6",
          HEADER_CELL,
        )}
      >        <div className="flex w-full items-center justify-between gap-3">
          <motion.div
            // The custom identity owns its text entrance. Keep its static
            // portrait visible even before hydration or without JavaScript.
            {...(identity ? {} : rise(INTRO.name))}
            className="flex min-w-0 items-center gap-3 sm:gap-5"
          >
            {back && (
              <Link
                href={backHref}
                aria-label="Go back"
                className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/10 bg-ink-raised text-zinc-400 transition-all duration-200 hover:-translate-x-0.5 hover:bg-ink-sunken hover:text-zinc-900 dark:border-white/10 dark:bg-ink-raised dark:hover:bg-ink-sunken dark:hover:text-zinc-100"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </Link>
            )}

            {identity ?? (
              <div className="flex min-w-0 flex-col justify-center">
                <h1 className="bp-title truncate text-[20px] font-bold leading-none tracking-tight text-zinc-800 sm:text-[24px] dark:text-zinc-100">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 truncate text-[12px] text-zinc-500 dark:text-zinc-400">{subtitle}</p>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            {...rise(INTRO.name + 0.06)}
            className="flex shrink-0 items-center justify-end gap-2 sm:gap-3"
          >
            {controls}
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </motion.div>
        </div>
      </header>

      {/* Left rail beside the identity cell */}
      {leftRail && (
        <div
          className={cn(
            "pointer-events-none absolute left-0 z-50 hidden items-center justify-center md:flex",
            HEADER_CELL,
            "w-[var(--page-gutter)]",
          )}
        >
          <div className="pointer-events-auto">{leftRail}</div>
        </div>
      )}

      {/* Content column */}
      <main
        id="main"
        className={cn(
          "relative z-10 ml-0 mr-0 flex flex-col px-5 pb-16 md:ml-[var(--page-gutter)] md:mr-[var(--page-gutter)] md:px-6",
          CONTENT_OFFSET,
          contentClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}

/** The live clock that sits in the bottom-right of every hero cell. */
export function HeroClock() {
  return (
    <div className="absolute bottom-3 right-2 z-10">
      <CurrentTime />
    </div>
  );
}
