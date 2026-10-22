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

export const HERO_CELL = "top-0 h-[22vh]";
export const HEADER_CELL = "top-[22vh] h-[112px]";
export const CONTENT_OFFSET = "pt-[calc(22vh+112px)]";

type PageShellProps = {
  /** Rendered inside the 22vh hero cell. */
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
  /** Rendered centred in the left 30% lane, on the header rule. */
  leftRail?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Right-hand index rail. */
  rail?: React.ReactNode;
};

/**
 * The frame every route sits inside: the hero cell, the 112px header cell and
 * the 30/40/30 content column, plus the drafting grid behind it all.
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
      <div className={cn("pointer-events-auto absolute left-0 right-0 z-0 md:left-[30%] md:right-[30%]", HERO_CELL)}>
        {hero}
      </div>

      {/* Cell 2 — header */}
      <header
        className={cn(
          "absolute left-0 right-0 z-50 flex items-center px-4 md:left-[30%] md:right-[30%]",
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
            className="flex h-20 shrink-0 items-start justify-end gap-2 py-1 sm:h-24 sm:gap-3"
          >
            {controls}
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </motion.div>
        </div>
      </header>

      {/* Left lane — the 30% column beside the header cell */}
      {leftRail && (
        <div
          className={cn(
            "pointer-events-none absolute left-0 z-50 hidden items-center justify-center md:flex",
            HEADER_CELL,
            "w-[30%]",
          )}
        >
          <div className="pointer-events-auto">{leftRail}</div>
        </div>
      )}

      {/* Content column */}
      <main
        id="main"
        className={cn(
          "relative z-10 ml-0 mr-0 flex flex-col px-4 pb-16 md:ml-[30%] md:mr-[30%]",
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
