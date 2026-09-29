"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { blogsData, Blog } from "@/data/blogsData";
import { EASE_DRAFT } from "@/lib/motion";
import { Rule } from "@/components/blueprint/rule";

const RealClapIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 20v-5.5" />
    <path d="M14 20v-5.5" />
    <path d="M10.5 7A2.5 2.5 0 0 1 13 4.5V2" />
    <path d="M13.5 7A2.5 2.5 0 0 0 11 4.5V2" />
    <path d="M16 12.5V9a2.5 2.5 0 0 0-5 0" />
    <path d="M8 12.5V9a2.5 2.5 0 0 1 5 0" />
    <path d="M12 20a4 4 0 0 1-4-4V7a2 2 0 0 1 4 0v9" />
    <path d="M16 16a4 4 0 0 0 4-4v-3a2 2 0 0 0-4 0" />
    <path d="M8 16a4 4 0 0 1-4-4v-3a2 4 0 0 1 4 0" />
  </svg>
);

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>(blogsData);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.blogs?.length > 0) setBlogs(data.blogs);
        }
      } catch (err) {
        console.error("Failed to fetch Notion blogs; using local fallback.", err);
      }
    }

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className="block">
      {blogs.map((blog, idx) => {
        const isLast = idx === blogs.length - 1;
        const delay = Math.min(0.05, 0.4 / Math.max(blogs.length, 1)) * idx;

        return (
          <motion.li
            key={idx}
            className="relative"
            initial={reduce ? undefined : { opacity: 0, x: -14, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE_DRAFT, delay }}
          >
            {!isLast && (
              <div className="pointer-events-none absolute -inset-x-4 bottom-0 z-10">
                <Rule side="bottom" inset="inset-x-0" />
              </div>
            )}
            {isLast && <Rule side="bottom" bleed nodes={["start", "end"]} />}

            <Link
              href={blog.link}
              target={blog.isExternal ? "_blank" : undefined}
              rel={blog.isExternal ? "noopener noreferrer" : undefined}
              className="group -mx-4 block px-4 py-4 transition-colors duration-200 hover:bg-ink-sunken"
            >
              <div className="flex w-full items-start justify-between sm:items-center">
                <div className="flex flex-col gap-2.5">
                  <h3 className="pr-6 text-pretty text-[14px] font-bold text-zinc-900 transition-colors duration-200 group-hover:text-zinc-600 md:text-[15px] dark:text-zinc-100 dark:group-hover:text-zinc-300">
                    {blog.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {blog.date}
                    </span>

                    <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-500">
                      <RealClapIcon className="h-3.5 w-3.5" />
                      {blog.claps}
                    </span>

                    <span aria-hidden className="hidden h-3 w-px bg-zinc-300 sm:block dark:bg-zinc-700" />

                    <span className="flex flex-wrap items-center gap-2">
                      {blog.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="rounded-[4px] border border-black/30 bg-white/50 px-2 py-0.5 text-[11px] text-zinc-600 transition-colors duration-200 group-hover:border-black/45 dark:border-white/15 dark:bg-black/20 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <span className="ml-4 shrink-0 text-zinc-400 transition-[transform,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100">
                  {blog.isExternal ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </span>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
