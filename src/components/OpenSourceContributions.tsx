"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_DRAFT, springSoft } from "@/lib/motion";
import { ViewAll } from "@/components/shell/view-all";

interface PR {
  id: number;
  title: string;
  url: string;
  repository: { nameWithOwner: string };
  state: string;
  createdAt: string;
  mergedAt?: string;
  closedAt?: string;
}

type SearchEdge = { node: PR };

type GitHubSearchResponse = {
  data?: { search?: { edges?: Array<SearchEdge | null> } };
  message?: string;
  error?: unknown;
};

type FilterType = "merged" | "open" | "closed";

const FILTERS: FilterType[] = ["merged", "open", "closed"];

const SEARCH_QUERIES: Record<FilterType, string> = {
  merged: "author:devcool20 type:pr is:merged",
  open: "author:devcool20 type:pr is:open",
  closed: "author:devcool20 type:pr is:closed is:unmerged",
};

const STATE_STYLE: Record<string, { dot: string; label: string }> = {
  MERGED: { dot: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]", label: "Merged" },
  OPEN: { dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]", label: "Open" },
  CLOSED: { dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]", label: "Closed" },
};

function buildGraphQLQuery(searchQuery: string) {
  return `query {
    search(query: "${searchQuery}", type: ISSUE, first: 100) {
      edges {
        node {
          ... on PullRequest {
            id title url state createdAt mergedAt closedAt
            repository { nameWithOwner }
          }
        }
      }
    }
  }`;
}

export function OpenSourceContributions({ isFullPage = false }: { isFullPage?: boolean }) {
  const [prsByType, setPrsByType] = useState<Record<FilterType, PR[]>>({
    merged: [],
    open: [],
    closed: [],
  });
  const [loadedTypes, setLoadedTypes] = useState<Set<FilterType>>(new Set());
  const [filterType, setFilterType] = useState<FilterType>("merged");
  const reduce = useReducedMotion();

  const initialCount = 4;
  const fetchedRef = useRef(false);

  const fetchPRsForType = useCallback(async (type: FilterType) => {
    const cacheKey = `github_prs_${type}`;
    const cachedData = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setPrsByType((prev) => ({ ...prev, [type]: parsed }));
        setLoadedTypes((prev) => new Set(prev).add(type));
      } catch {
        /* invalid cache — fall through to a fresh fetch */
      }
    }

    try {
      const query = buildGraphQLQuery(SEARCH_QUERIES[type]);
      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = (await response.json()) as GitHubSearchResponse;
      if (data.data?.search?.edges) {
        const fetchedPRs = data.data.search.edges
          .flatMap((edge) => (edge?.node ? [edge.node] : []))
          .sort(
            (a, b) =>
              new Date(b.mergedAt || b.closedAt || b.createdAt).getTime() -
              new Date(a.mergedAt || a.closedAt || a.createdAt).getTime(),
          );
        setPrsByType((prev) => ({ ...prev, [type]: fetchedPRs }));
        setLoadedTypes((prev) => new Set(prev).add(type));
        if (typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify(fetchedPRs));
        }
      } else {
        if (data.message === "Bad credentials" || data.error) {
          console.warn("GitHub API: missing GITHUB_TOKEN. Showing cached state.");
        }
        setLoadedTypes((prev) => new Set(prev).add(type));
      }
    } catch (error) {
      console.error("Failed to fetch PRs:", error);
      setLoadedTypes((prev) => new Set(prev).add(type));
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    FILTERS.forEach(fetchPRsForType);
  }, [fetchPRsForType]);

  // A real crossfade: the outgoing list leaves, the incoming one enters.
  // The previous version used a setTimeout(120) with no coordination, which
  // dropped frames on slow connections.
  const handleFilterChange = useCallback(
    (type: FilterType) => {
      if (type === filterType) return;
      setFilterType(type);
    },
    [filterType],
  );

  const currentPrs = prsByType[filterType];
  const isLoaded = loadedTypes.has(filterType);
  const visible = isFullPage ? currentPrs : currentPrs.slice(0, initialCount);
  const overflow = currentPrs.length - initialCount;

  return (
    <div className="flex w-full flex-col">
      {/* Ruled heading band — this component owns its own plot lines so it
          reads the same on the home page and on /pull-requests. */}
      <div className="relative">
        <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] top-0 border-t" />
        <span className="bp-node pointer-events-none absolute left-0 top-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
        <span className="bp-node pointer-events-none absolute right-0 top-0 z-20 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="flex flex-col items-start justify-between gap-3 py-2 sm:flex-row sm:items-center">
        <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Open Source Contributions
        </h2>

        <div
          role="tablist"
          aria-label="Pull request state"
          className="group relative z-20 mr-[8px] flex items-center"
        >
          <span
            aria-hidden
            className="absolute -inset-[5px] rounded-[11px] border border-black/5 transition-colors duration-200 group-hover:border-black/10 dark:border-white/5 dark:group-hover:border-white/15"
          />
          <div className="relative grid w-fit grid-cols-3 select-none rounded-[6px] border border-black/5 bg-ink-sunken p-1 shadow-sm shadow-black/5 dark:border-white/5 dark:shadow-lg dark:shadow-black/40">
            {FILTERS.map((type) => {
              const active = filterType === type;
              return (
                <button
                  key={type}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => handleFilterChange(type)}
                  className={`relative z-10 cursor-pointer px-3 py-1.5 text-center text-[12px] font-medium capitalize transition-colors duration-200 ${
                    active
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pr-filter-pill"
                      className="absolute inset-0 -z-10 rounded-[4px] border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-700/60 dark:bg-[#1b202b]"
                      transition={springSoft}
                    />
                  )}
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] bottom-0 border-b" />
        <span className="bp-node pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
        <span className="bp-node pointer-events-none absolute bottom-0 right-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative pb-2 pt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filterType}
            initial={reduce ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.24, ease: EASE_DRAFT }}
            className="flex flex-col"
          >
            {!isLoaded && currentPrs.length === 0 ? (
              <div className="flex flex-col">
                {Array.from({ length: initialCount }).map((_, idx) => (
                  <div key={idx} className="relative flex flex-col gap-1.5 py-4">
                    {idx < initialCount - 1 && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
                        <div className="bp-rule-h absolute inset-x-4 bottom-0 border-b" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
                    </div>
                    <div className="ml-4.5 pl-0.5">
                      <div className="mt-0.5 h-3 w-1/3 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/40" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visible.length > 0 ? (
              <>
                {visible.map((pr, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  const style = STATE_STYLE[pr.state] ?? STATE_STYLE.CLOSED;
                  return (
                    <a
                      key={pr.id}
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative -mx-4 flex flex-col gap-1.5 rounded-lg px-4 py-3.5 transition-colors duration-200 hover:bg-ink-sunken"
                    >
                      {!isLast && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
                          <div className="bp-rule-h absolute inset-x-4 bottom-0 border-b" />
                        </div>
                      )}
                      <span className="relative z-20 flex min-w-0 items-center gap-2.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                        <span className="truncate text-[14px] font-medium text-zinc-800 transition-colors duration-200 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-100">
                          {pr.title}
                        </span>
                      </span>
                      <span className="relative z-20 ml-4.5 pl-0.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                        {pr.repository.nameWithOwner}
                        <span className="sr-only"> — {style.label}</span>
                      </span>
                    </a>
                  );
                })}

                {!isFullPage && overflow > 0 && (
                  <div className="relative z-20 mt-3 flex justify-center">
                    <ViewAll href="/pull-requests" direction="down">
                      View All ({overflow} more)
                    </ViewAll>
                  </div>
                )}
              </>
            ) : (
              <p className="py-4 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
                No pull requests found.{" "}
                <span className="text-zinc-400">(Add GITHUB_TOKEN in Vercel and redeploy)</span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
