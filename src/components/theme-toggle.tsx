"use client";

import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { playSound } from "@/lib/sound-engine";
import { click003Sound } from "@/lib/click-003";
import { cn } from "@/lib/utils";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  const toggleTheme = () => {
    const transitionDocument = document as ViewTransitionDocument;
    // Read the live class at click time rather than from render state, so the
    // control never has to wait for hydration to know what it is toggling.
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    if (!transitionDocument.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Scopes the mask wipe in globals.css to this transition, so a
    // route-level view transition keeps its own treatment.
    document.documentElement.dataset.viewTransition = "theme";

    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    void transition.finished.finally(() => {
      delete document.documentElement.dataset.viewTransition;
    });
  };

  return (
    <button
      type="button"
      onClick={() => {
        void playSound(click003Sound.dataUri, { volume: 0.5 });
        toggleTheme();
      }}
      className={cn(
        "group relative z-50 flex h-[18px] w-[18px] cursor-pointer items-center justify-center text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200",
        className,
      )}
      aria-label="Toggle colour theme"
    >
      {/* Both icons are always rendered; CSS decides which is showing. That
          keeps server and client markup identical (no hydration mismatch) and
          turns the swap into a proper scale-and-rotate crossfade. */}
      <span className="relative block h-[18px] w-[18px]">
        <Sun
          aria-hidden
          className="absolute inset-0 h-[18px] w-[18px] scale-100 rotate-0 opacity-100 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:scale-90 dark:scale-50 dark:-rotate-90 dark:opacity-0"
        />
        <Moon
          aria-hidden
          className="absolute inset-0 h-[18px] w-[18px] scale-50 rotate-90 opacity-0 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:scale-90 dark:scale-100 dark:rotate-0 dark:opacity-100"
        />
      </span>
    </button>
  );
}
