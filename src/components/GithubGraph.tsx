"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_DRAFT } from "@/lib/motion";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionMonth {
  name: string;
}

interface ContributionLevel {
  cell: string;
}

interface TooltipState {
  count: number;
  date: string;
  x: number;
  y: number;
}

/** Ease a number toward its target so the total counts up rather than snapping. */
function useCountUp(target: number, paused: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (paused) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const start = performance.now();
    const duration = reduce ? 0 : 700;

    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, paused]);

  return value;
}

export function GithubGraph() {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [months, setMonths] = useState<ContributionMonth[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const reduce = useReducedMotion();

  const emptyWeeks = useMemo<ContributionWeek[]>(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 370);

    return Array.from({ length: 53 }, (_, weekIndex) => ({
      contributionDays: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(start);
        date.setDate(start.getDate() + weekIndex * 7 + dayIndex);

        return {
          contributionCount: 0,
          date: date.toISOString().slice(0, 10),
        };
      }),
    }));
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      const cacheKey = "github_contributions";
      const cachedData = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
      
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setWeeks(parsed.weeks);
          setMonths(parsed.months || []);
          setTotalContributions(parsed.totalContributions);
          setLoading(false);
        } catch {
          setLoading(true);
        }
      }

      const query = `
        query {
          user(login: "devcool20") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                months {
                  name
                }
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch("/api/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
        
        if (calendar) {
          setWeeks(calendar.weeks);
          setMonths(calendar.months);
          setTotalContributions(calendar.totalContributions);
          if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, JSON.stringify({
              weeks: calendar.weeks,
              months: calendar.months,
              totalContributions: calendar.totalContributions
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const contributionLevels = useMemo<ContributionLevel[]>(
    () => [
      {
        cell: "bg-zinc-100 dark:bg-zinc-800",
      },
      {
        cell: "bg-zinc-300 dark:bg-zinc-600",
      },
      {
        cell: "bg-zinc-500 dark:bg-zinc-500",
      },
      {
        cell: "bg-zinc-700 dark:bg-zinc-300",
      },
      {
        cell: "bg-zinc-950 dark:bg-zinc-100",
      },
    ],
    []
  );

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const showTooltip = (day: ContributionDay, event: React.SyntheticEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      count: day.contributionCount,
      date: formatDate(day.date),
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const displayMonths = months.length > 0 ? months.map(m => m.name.substring(0, 3)) : defaultMonths;
  const graphWeeks = weeks.length > 0 ? weeks : emptyWeeks;
  const graphStatus =
    loading && totalContributions === 0
      ? "Loading GitHub contribution activity"
      : `${totalContributions} GitHub activities in the last year`;

  // Animate the total up to its real value rather than snapping it in.
  const counter = useCountUp(totalContributions, loading && totalContributions === 0);

  return (
    <section
      className="relative z-10 flex flex-col scroll-mt-24"
      aria-labelledby="github-activity-title"
      aria-describedby="github-activity-summary"
    >
      {/* Top full-width dashed line */}
      <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] top-0 border-t" />
      <div className="bp-node pointer-events-none absolute left-0 top-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
      <div className="bp-node pointer-events-none absolute right-0 top-0 z-20 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2" />

      {/* Heading */}
      <div className="relative py-2">
        <div className="flex items-center justify-between gap-3">
          <h2 id="github-activity-title" className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            GitHub Activity
          </h2>
          <p className="text-right text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400" aria-live="polite">
            {loading && totalContributions === 0
              ? graphStatus
              : `${counter.toLocaleString()} GitHub activities in the last year`}
          </p>
        </div>

        {/* Bottom full-width dashed line under heading */}
        <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] bottom-0 border-b" />
        <div className="bp-node pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
        <div className="bp-node pointer-events-none absolute bottom-0 right-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
      </div>

      <p id="github-activity-summary" className="sr-only">
        Calendar heatmap showing daily GitHub contribution counts for devcool20 over the last year.
      </p>

      {/* Graph content */}
      <motion.div
        className="relative py-4"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE_DRAFT }}
      >
        <div className="w-full">
          <div>
            <div className="mb-2 flex w-full justify-between text-[10px] text-zinc-500 dark:text-zinc-500">
              {displayMonths.map((month, index) => (
                <span key={`${month}-${index}`}>{month}</span>
              ))}
            </div>

            <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-x-[2px]" role="img" aria-label={graphStatus}>
              {loading && weeks.length === 0
                ? Array.from({ length: 53 }).map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }).map((__, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="aspect-square w-full animate-pulse rounded-[2px] bg-zinc-100 dark:bg-zinc-800"
                        />
                      ))}
                    </div>
                  ))
                : graphWeeks.map((week, colIndex) => (
                    <motion.div
                      key={colIndex}
                      className="flex flex-col gap-[2px]"
                      initial={reduce ? undefined : { opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        duration: 0.4,
                        ease: EASE_DRAFT,
                        delay: reduce ? 0 : Math.min(colIndex, 26) * 0.014,
                      }}
                    >
                      {colIndex === 0 &&
                        Array.from({ length: 7 - week.contributionDays.length }).map((_, i) => (
                          <div key={`empty-top-${i}`} className="aspect-square w-full rounded-[2px] bg-transparent" />
                        ))}

                      {week.contributionDays.map((day) => {
                        const level = getLevel(day.contributionCount);
                        const color = contributionLevels[level];

                        return (
                          <button
                            type="button"
                            key={day.date}
                            aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                            className={`aspect-square w-full cursor-pointer rounded-[2px] outline-offset-1 transition-[transform,opacity,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 hover:scale-[1.45] hover:shadow-md ${color.cell} ${
                              day.contributionCount === 0 ? "opacity-60" : "opacity-85 dark:opacity-75"
                            }`}
                            onMouseEnter={(event) => showTooltip(day, event)}
                            onMouseLeave={() => setTooltip(null)}
                            onFocus={(event) => showTooltip(day, event)}
                            onBlur={() => setTooltip(null)}
                          />
                        );
                      })}

                      {colIndex !== 0 &&
                        week.contributionDays.length < 7 &&
                        Array.from({ length: 7 - week.contributionDays.length }).map((_, i) => (
                          <div key={`empty-bottom-${i}`} className="aspect-square w-full rounded-[2px] bg-transparent" />
                        ))}
                    </motion.div>
                  ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Less active</span>
          <div className="flex shrink-0 items-center gap-1.5">
            {contributionLevels.map((level, index) => (
              <div
                key={index}
                aria-hidden="true"
                className={`h-2 w-2 rounded-[2px] opacity-80 dark:opacity-70 ${level.cell}`}
              />
            ))}
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">More active</span>
          </div>
        </div>

        <AnimatePresence>
          {tooltip && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.96 }}
              transition={{ duration: 0.16, ease: EASE_DRAFT }}
              className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 shadow-lg shadow-zinc-950/10 dark:border-white/10 dark:bg-[#12161f] dark:text-zinc-200 dark:shadow-black/50"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.count} {tooltip.count === 1 ? "contribution" : "contributions"} on {tooltip.date}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom full-width dashed line */}
      <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] bottom-0 border-b" />
      <div className="bp-node pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
      <div className="bp-node pointer-events-none absolute bottom-0 right-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
