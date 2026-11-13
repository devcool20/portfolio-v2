"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Open Source", href: "#opensource" },
  { name: "Skills", href: "#skills" },
  { name: "Blog", href: "#blogs" },
] as const;

/**
 * The right-hand index.
 *
 * Originally a static list of labels with a growing tick. It is now a
 * drafting rail: a continuous track whose fill tracks document progress,
 * with the active section's node opening up. The rail gives the reader a
 * sense of how much sheet is left, which a list of words never did.
 */
export function RightNavbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();

  const fill = useSpring(progress, { ...springSoft, stiffness: 180, damping: 34 });
  const readout = useTransform(
    fill,
    (v) => String(Math.round(v * 100)).padStart(3, "0"),
  );

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = SECTIONS.map((s) => document.getElementById(s.href.slice(1))).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 },
    );

    sections.forEach((el) => observer.observe(el));

    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      setProgress(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  const activeIndex = SECTIONS.findIndex((s) => s.href.slice(1) === activeSection);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 hidden min-[1100px]:block"
      style={{ width: "calc(100vw - var(--removed-body-scroll-bar-size, 0px))" }}
    >
      <nav
        aria-label="Section index"
        className="section-index pointer-events-auto absolute flex flex-col"
      >
        <h3 className="mb-5 text-[11px] font-medium tracking-[0.04em] text-zinc-500 dark:text-zinc-400">
          Index
        </h3>

        <div className="relative flex gap-4">
          {/* Track + fill */}
          <div className="relative w-px shrink-0 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <motion.div
              className="absolute inset-0 origin-top bg-zinc-400 dark:bg-zinc-500"
              style={{ scaleY: reduce ? progress : fill }}
              aria-hidden
            />
          </div>

          <ul className="flex flex-col gap-1">
            {SECTIONS.map((link, i) => {
              const isActive = activeSection === link.href.slice(1);
              const isPassed = activeIndex > -1 && i < activeIndex;

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group flex min-h-10 items-center gap-2.5 text-[13px] font-medium transition-colors duration-200",
                      isActive
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100",
                    )}
                  >
                    <span
                      className={cn(
                        "h-[3px] w-[3px] shrink-0 rounded-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive
                          ? "scale-125 bg-zinc-800 dark:bg-zinc-200"
                          : isPassed
                            ? "bg-zinc-400 dark:bg-zinc-600"
                            : "bg-zinc-300 dark:bg-zinc-700 group-hover:scale-110 group-hover:bg-zinc-500 dark:group-hover:bg-zinc-500",
                      )}
                    />
                    <span className="relative">
                      {link.name}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive ? "scale-x-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40",
                        )}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Read-out, so the rail reports a number as well as a shape. */}
        <div className="mt-5 flex items-center gap-1.5 text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
          <motion.span className="font-mono">{readout}</motion.span>
          <span className="h-px w-3 bg-current opacity-40" />
          <span className="font-mono">100</span>
        </div>
      </nav>
    </div>
  );
}
