"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_DRAFT } from "@/lib/motion";

const DOT_GAP = "gap-2 sm:gap-2.5";

function TwoDots({ beat }: { beat: number }) {
  return (
    <div className={`${DOT_GAP} -translate-x-[1px] flex flex-col sm:-translate-x-[1.5px]`}>
      <motion.span
        key={`a-${beat}`}
        className="block h-[2px] w-[2px] bg-zinc-500 dark:bg-zinc-400"
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease: EASE_DRAFT }}
      />
      <motion.span
        key={`b-${beat}`}
        className="block h-[2px] w-[2px] bg-zinc-500 dark:bg-zinc-400"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 0.18, ease: EASE_DRAFT }}
      />
    </div>
  );
}

function Digit({ value, index }: { value: string; index: number }) {
  const reduce = useReducedMotion();

  return (
    // No overflow clipping: the dot-matrix glyphs sit close to the box edge and
    // a hidden overflow would shave their terminals.
    <span className="relative inline-block align-bottom">
      <motion.span
        // Re-keying on the character is what makes the digit re-enter.
        key={value}
        className="block will-change-transform"
        initial={reduce ? undefined : { y: "-0.5em", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: reduce ? 0 : 0.3,
          ease: EASE_DRAFT,
          delay: reduce ? 0 : index * 0.03,
        }}
      >
        {value}
      </motion.span>
    </span>
  );
}

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    if (!time) return null;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return {
      h: pad(time.getHours()),
      m: pad(time.getMinutes()),
      s: pad(time.getSeconds()),
      beat: time.getSeconds(),
    };
  }, [time]);

  const shell =
    "bp-numeric flex items-center text-[20px] font-black tracking-[0.14em] text-zinc-600 sm:text-[24px] dark:text-zinc-400";

  if (!parts) {
    // Same footprint as the live clock, so nothing shifts on hydration.
    return (
      <div className="flex h-6 items-center opacity-0" aria-hidden>
        <span className={shell} style={{ fontFamily: "var(--font-doto), monospace" }}>
          00.00.00
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-6 items-center">
      <div
        className={shell}
        style={{ fontFamily: "var(--font-doto), monospace" }}
        role="timer"
        aria-label={`Local time ${parts.h}:${parts.m}:${parts.s}`}
      >
        <Digit value={parts.h[0]} index={0} />
        <Digit value={parts.h[1]} index={1} />
        <TwoDots beat={reduce ? 0 : parts.beat} />
        <Digit value={parts.m[0]} index={2} />
        <Digit value={parts.m[1]} index={3} />
        <TwoDots beat={reduce ? 0 : parts.beat} />
        <Digit value={parts.s[0]} index={4} />
        <Digit value={parts.s[1]} index={5} />
      </div>
    </div>
  );
}
