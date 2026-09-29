"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_DRAFT } from "@/lib/motion";

type Toast = { id: number; message: string; icon?: React.ReactNode };

const ToastContext = createContext<{ notify: (message: string, icon?: React.ReactNode) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/**
 * Confirmation for actions that currently complete silently — "Copy Link"
 * used to do nothing observable, so there was no way to know it worked.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const reduce = useReducedMotion();

  const notify = useCallback((message: string, icon?: React.ReactNode) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, icon }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={!reduce}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.26, ease: EASE_DRAFT }}
              className="pointer-events-auto flex items-center gap-2 rounded-[8px] border border-black/10 bg-white/95 px-3 py-2 text-[13px] font-medium text-zinc-800 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-[#12161f]/95 dark:text-zinc-100 dark:shadow-black/50"
            >
              {toast.icon}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
