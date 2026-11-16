"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { experiences, type ExperienceData } from "@/data/experiencesData";
import { EASE_DRAFT } from "@/lib/motion";
import { Rule } from "@/components/blueprint/rule";

export function ExperienceRow({
  item,
  idx,
  isOpen,
  onToggle,
  isLast,
  total,
}: {
  item: ExperienceData;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
  total: number;
}) {
  const reduce = useReducedMotion();
  const delay = Math.min(0.05, 0.4 / Math.max(total, 1)) * idx;

  return (
    <motion.div
      className="group relative"
      initial={false}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: EASE_DRAFT, delay: reduce ? 0 : delay }}
    >
      {!isLast && (
        <div className="pointer-events-none absolute -inset-x-4 bottom-0 z-10">
          <Rule side="bottom" inset="inset-x-0" />
        </div>
      )}
      {isLast && <Rule side="bottom" bleed nodes={["start", "end"]} />}

      {/* The row is a real disclosure control — it was a div with onClick,
          which put it entirely outside the keyboard. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`experience-panel-${idx}`}
        className="relative z-20 -mx-4 flex w-[calc(100%+2rem)] cursor-pointer flex-col items-start gap-2.5 rounded-lg px-4 py-3.5 text-left transition-colors duration-200 hover:bg-ink-sunken sm:gap-3 sm:py-4 2xl:flex-row 2xl:items-center 2xl:justify-between dark:hover:bg-ink-sunken"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-black/10 bg-zinc-50 p-[2px] shadow-sm shadow-black/15 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:shadow-md dark:border-zinc-800 dark:bg-[#111318] dark:shadow-md dark:shadow-black/50">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-[7px] border border-black/5 bg-white dark:border-black/20">
              <Image
                src={item.src}
                alt=""
                width={40}
                height={40}
                sizes="40px"
                quality={60}
                style={item.imageZoom ? { transform: `scale(${item.imageZoom})` } : undefined}
                className={`h-full w-full ${item.imageFit === "contain" ? "object-contain" : "object-cover"}`}
              />
            </span>
          </span>

          <span className="flex min-w-0 flex-col gap-0.5 pr-2 sm:pr-4">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-bold leading-tight text-zinc-900 sm:text-[17px] dark:text-zinc-100">
                {item.title}
              </span>
              {item.type && (
                <span className="self-center whitespace-nowrap rounded-[4px] border border-zinc-300/50 bg-zinc-200/50 px-1.5 py-px text-[11px] font-medium text-zinc-600 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400">
                  {item.type}
                </span>
              )}
            </span>
            <span className="truncate text-[14px] text-zinc-600 sm:text-[15px] dark:text-zinc-400">
              {item.role}
            </span>
          </span>
        </div>

        <span className="flex shrink-0 flex-col items-start gap-0.5 pl-[52px] pr-5 text-left sm:pl-[56px] 2xl:mt-0 2xl:items-end 2xl:pl-0 2xl:text-right">
          <span className="relative flex items-center text-[13px] font-medium text-zinc-900 sm:text-[14px] dark:text-zinc-100">
            {item.dates}
            <svg
              viewBox="0 0 24 24"
              className="absolute -right-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ rotate: isOpen ? "180deg" : "0deg" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          <span className="text-[13px] text-zinc-500 sm:text-[14px] dark:text-zinc-400">
            {item.location}
          </span>
        </span>
      </button>

      {item.appLink && (
        <a href={item.appLink} target="_blank" rel="noopener noreferrer"
          className="group/app relative z-20 mb-4 ml-[52px] inline-flex min-h-10 items-center gap-2 rounded-md border border-zinc-200 bg-ink-raised px-3 py-2 text-[12px] font-medium text-zinc-800 transition-[background-color,color,transform] duration-200 hover:bg-ink-sunken active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 sm:ml-[56px] dark:border-zinc-800 dark:text-zinc-100 motion-reduce:transition-none motion-reduce:transform-none"
          aria-label="Get Rocket Journal on Google Play (opens in a new tab)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true"><path d="M5 3.5v17l14-8.5L5 3.5Z" strokeLinejoin="round" /></svg>
          Get Rocket Journal on Google Play
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 transition-transform duration-200 group-hover/app:-translate-y-0.5 group-hover/app:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
        </a>
      )}

      {/* grid-template-rows, so the panel expands without animating height */}
      <div
        id={`experience-panel-${idx}`}
        className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`pl-6 pr-8 text-[14px] text-zinc-600 transition-[opacity,transform,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:text-zinc-400 ${
              isOpen ? "translate-y-0 pb-4 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            {item.metrics && (
              <div className="relative -ml-6 -mr-8 mb-4">
                <div className="grid max-w-full grid-cols-2 pl-6 pr-8 2xl:grid-cols-4">
                  {item.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="relative min-w-0 px-3 py-2 after:absolute after:bottom-0 after:right-0 after:top-0 after:w-0 after:border-r after:border-black/30 after:[mask-image:repeating-linear-gradient(to_bottom,black_0,black_1px,transparent_1px,transparent_6px)] dark:after:border-white/15 [&:nth-child(2n)]:after:hidden 2xl:[&:not(:last-child)]:after:block 2xl:[&:last-child]:after:hidden"
                    >
                      <p
                        className={`${metric.value.includes(" - ") ? "text-[13px]" : "text-[16px]"} break-words text-pretty font-bold leading-snug text-zinc-900 dark:text-zinc-100`}
                      >
                        {metric.value}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase text-zinc-500 dark:text-zinc-500">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
                <span className="bp-rule-h pointer-events-none absolute inset-x-0 top-0 border-t" />
                <span className="bp-rule-h pointer-events-none absolute inset-x-0 top-1/2 border-t 2xl:hidden" />
                <span className="bp-rule-h pointer-events-none absolute inset-x-0 bottom-0 border-b" />
              </div>
            )}

            {isOpen && item.screenshot && (
              <div className="relative mb-4 overflow-hidden rounded-[6px] bg-black">
                <Image
                  src={item.screenshot}
                  alt={`${item.title} analytics screenshot`}
                  width={1400}
                  height={1050}
                  sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                  quality={70}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <ul className="mb-4 space-y-2 text-[13px] leading-relaxed">
              {item.description
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((point, i) => {
                  const [label, ...detail] = point.split(":");
                  return (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="mt-[2px] text-[14px] leading-none text-zinc-400 dark:text-zinc-500">
                        •
                      </span>
                      <span className="text-pretty">
                        {detail.length > 0 ? (
                          <>
                            <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {label}:
                            </strong>
                            {detail.join(":")}
                          </>
                        ) : (
                          point
                        )}
                      </span>
                    </li>
                  );
                })}
            </ul>

            {item.tech && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[4px] border border-zinc-200/50 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:border-zinc-800/50 dark:bg-[#111318] dark:text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceList() {
  const [openIdx, setOpenIdx] = useState<number | null>(() => experiences.findIndex(item => item.title === "RocketHealth"));

  return (
    <div className="block">
      {experiences.map((item, idx) => (
        <ExperienceRow
          key={item.title}
          item={item}
          idx={idx}
          total={experiences.length}
          isOpen={openIdx === idx}
          isLast={idx === experiences.length - 1}
          onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
        />
      ))}
    </div>
  );
}
