"use client";

import React, { useEffect, useMemo, useState } from "react";

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
  text: string;
}

interface TooltipState {
  count: number;
  date: string;
  x: number;
  y: number;
}

export function GithubGraph() {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [months, setMonths] = useState<ContributionMonth[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

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
          user(login: "Ashutoshx7") {
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
        cell: "bg-zinc-100 dark:bg-zinc-950",
        text: "text-zinc-500 dark:text-zinc-500",
      },
      {
        cell: "bg-zinc-300 dark:bg-zinc-800",
        text: "text-zinc-700 dark:text-zinc-300",
      },
      {
        cell: "bg-zinc-500 dark:bg-zinc-600",
        text: "text-white dark:text-white",
      },
      {
        cell: "bg-zinc-700 dark:bg-zinc-300",
        text: "text-white dark:text-zinc-950",
      },
      {
        cell: "bg-zinc-950 dark:bg-white",
        text: "text-white dark:text-zinc-950",
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

  const showTooltip = (
    day: ContributionDay,
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.FocusEvent<HTMLDivElement>
  ) => {
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

  return (
    <section className="mt-6 flex w-full justify-center" aria-labelledby="github-activity-title">
      <div className="relative w-full rounded-[8px] border border-dashed border-black/30 bg-white/75 p-2 shadow-[0_8px_28px_rgba(2,6,23,0.04)] dark:border-white/[0.15] dark:bg-black/35 dark:shadow-none">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <h2 id="github-activity-title" className="text-[12px] font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            GitHub Activity
          </h2>
          <p className="text-[11px] text-zinc-500" aria-live="polite">
            {graphStatus}
          </p>
        </div>

        <p className="sr-only">
          Calendar heatmap showing daily GitHub contribution counts for Ashutoshx7 over the last year. Scroll horizontally to inspect all weeks.
        </p>

        <div className="overflow-x-auto overflow-y-visible rounded-[5px] border border-black/5 bg-zinc-50/60 p-1 [scrollbar-width:thin] [scrollbar-color:rgb(82_82_91)_transparent] dark:border-white/5 dark:bg-zinc-950/50">
          <div className="min-w-[742px]">
            <div className="mb-2 flex w-full justify-between pr-[15px] pl-[1px] text-[10px] text-zinc-500 dark:text-zinc-500">
              {displayMonths.map((month, index) => (
                <span key={`${month}-${index}`}>{month}</span>
              ))}
            </div>

            <div className="grid grid-cols-[repeat(53,12px)] gap-x-[2px]" role="list" aria-label={graphStatus}>
              {loading && weeks.length === 0
                ? Array.from({ length: 53 }).map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }).map((__, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="size-3 animate-pulse rounded-[2px] bg-zinc-100 dark:bg-zinc-950"
                        />
                      ))}
                    </div>
                  ))
                : graphWeeks.map((week, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-[2px]">
                      {colIndex === 0 &&
                        Array.from({ length: 7 - week.contributionDays.length }).map((_, i) => (
                          <div key={`empty-top-${i}`} className="size-3 rounded-[2px] bg-transparent" />
                        ))}

                      {week.contributionDays.map((day) => {
                        const level = getLevel(day.contributionCount);
                        const color = contributionLevels[level];

                        return (
                          <div
                            key={day.date}
                            role="listitem"
                            aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                            className={`grid size-3 place-items-center rounded-[2px] text-[7px] font-semibold leading-none outline-none ring-offset-1 ring-offset-white transition-transform hover:scale-125 focus-visible:scale-125 focus-visible:ring-1 focus-visible:ring-zinc-500 dark:ring-offset-black ${color.cell} ${color.text}`}
                            onMouseEnter={(event) => showTooltip(day, event)}
                            onMouseLeave={() => setTooltip(null)}
                          >
                            {day.contributionCount > 0 ? day.contributionCount : null}
                          </div>
                        );
                      })}

                      {colIndex !== 0 &&
                        week.contributionDays.length < 7 &&
                        Array.from({ length: 7 - week.contributionDays.length }).map((_, i) => (
                          <div key={`empty-bottom-${i}`} className="size-3 rounded-[2px] bg-transparent" />
                        ))}
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <span className="text-[11px] text-zinc-500">Less active</span>
          <div className="flex shrink-0 items-center gap-1.5">
            {contributionLevels.map((level, index) => (
              <div
                key={index}
                aria-hidden="true"
                className={`size-2.5 rounded-[2px] ${level.cell}`}
              />
            ))}
            <span className="text-[11px] text-zinc-500">More active</span>
          </div>
        </div>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 shadow-lg shadow-zinc-950/10 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:shadow-black/40"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.count} contributions on {tooltip.date}
          </div>
        )}
      </div>
    </section>
  );
}
