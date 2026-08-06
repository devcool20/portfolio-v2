"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClapButtonProps {
  initialClaps?: number;
  blogSlug?: string;
  className?: string;
}

const RealClapIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 20v-5.5"></path>
    <path d="M14 20v-5.5"></path>
    <path d="M10.5 7A2.5 2.5 0 0 1 13 4.5V2"></path>
    <path d="M13.5 7A2.5 2.5 0 0 0 11 4.5V2"></path>
    <path d="M16 12.5V9a2.5 2.5 0 0 0-5 0"></path>
    <path d="M8 12.5V9a2.5 2.5 0 0 1 5 0"></path>
    <path d="M12 20a4 4 0 0 1-4-4V7a2 2 0 0 1 4 0v9"></path>
    <path d="M16 16a4 4 0 0 0 4-4v-3a2 2 0 0 0-4 0"></path>
    <path d="M8 16a4 4 0 0 1-4-4v-3a2 2 0 0 1 4 0"></path>
  </svg>
);

export function ClapButton({ initialClaps = 100, blogSlug = "default", className = "" }: ClapButtonProps) {
  const [claps, setClaps] = useState(initialClaps);
  const [userClaps, setUserClaps] = useState(0);
  const [floatingCounts, setFloatingCounts] = useState<{ id: number; count: number }[]>([]);

  const handleClap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (userClaps >= 50) return; // Cap max 50 claps per user

    const newClaps = claps + 1;
    const newUserClaps = userClaps + 1;
    setClaps(newClaps);
    setUserClaps(newUserClaps);

    const newId = Date.now() + Math.random();
    setFloatingCounts((prev) => [...prev, { id: newId, count: newUserClaps }]);

    setTimeout(() => {
      setFloatingCounts((prev) => prev.filter((item) => item.id !== newId));
    }, 1000);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Floating Animated Counter Badges */}
      <AnimatePresence>
        {floatingCounts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -45, scale: 1.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md shadow-emerald-500/30"
          >
            +{item.count}
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={handleClap}
        title="Clap / Applaud this article"
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 select-none ${
          userClaps > 0
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
            : "border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-500"
        }`}
      >
        <motion.div
          whileTap={{ scale: 1.3, rotate: -12 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex items-center justify-center"
        >
          <RealClapIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
        </motion.div>
        <span className="text-[13px] font-semibold tracking-tight">{claps}</span>
      </button>
    </div>
  );
}
