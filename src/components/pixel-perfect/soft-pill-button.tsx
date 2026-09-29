"use client";
import React, { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export type SoftPillVariant = "secondary" | "primary";

interface SoftPillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SoftPillVariant;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

const SoftPillButton = React.forwardRef<HTMLButtonElement, SoftPillButtonProps>(
  (
    {
      className,
      children,
      variant = "secondary",
      as: Comp = "button",
      onPointerMove,
      onPointerLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const isPrimary = variant === "primary";
    const localRef = useRef<HTMLElement | null>(null);

    // A specular that follows the cursor. Bounded to the button, and written
    // straight to custom properties so a pointer move never re-renders React.
    const handlePointerMove = useCallback(
      (event: React.PointerEvent) => {
        const el = (localRef.current ?? event.currentTarget) as HTMLElement;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--bp-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        el.style.setProperty("--bp-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        (onPointerMove as ((e: React.PointerEvent) => void) | undefined)?.(event);
      },
      [onPointerMove],
    );

    const handlePointerLeave = useCallback(
      (event: React.PointerEvent) => {
        const el = (localRef.current ?? event.currentTarget) as HTMLElement;
        el.style.setProperty("--bp-x", "50%");
        el.style.setProperty("--bp-y", "0%");
        (onPointerLeave as ((e: React.PointerEvent) => void) | undefined)?.(event);
      },
      [onPointerLeave],
    );

    return (
      <Comp
        ref={(node: HTMLElement | null) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") {
            (forwardedRef as React.RefCallback<HTMLButtonElement>)(node as HTMLButtonElement);
          } else if (forwardedRef) {
            forwardedRef.current = node as HTMLButtonElement;
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "group relative block cursor-pointer rounded-[4px] px-5 py-2.5 text-center text-[13px] font-medium tracking-tight transition-[transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:translate-y-0 active:scale-[0.985] active:duration-[60ms]",
          "[backdrop-filter:blur(6px)]",
          isPrimary
            ? "text-neutral-50 dark:text-neutral-950"
            : "text-neutral-900 dark:text-neutral-300",
          className,
        )}
        style={{ ["--bp-x" as string]: "50%", ["--bp-y" as string]: "0%" }}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 overflow-hidden rounded-[4px] transition-colors duration-200 group-active:duration-[60ms]",
            isPrimary
              ? "border border-black/10 bg-[#18181b] group-hover:bg-[#27272a] dark:border-white/10 dark:bg-white dark:group-hover:bg-neutral-100"
              : "border border-black/5 bg-white/90 group-hover:border-black/10 dark:border-white/5 dark:bg-[#0c0c0e] dark:group-hover:border-white/15",
          )}
        >
          {/* Cursor-tracked specular */}
          <span
            className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120px circle at var(--bp-x) var(--bp-y), rgba(255,255,255,0.5), transparent 65%)",
            }}
          />
          {!isPrimary && (
            <span
              className="absolute inset-0 rounded-[4px] bg-black/[0.02] transition-colors duration-200 group-hover:bg-transparent dark:bg-transparent dark:group-hover:bg-white/[0.02] group-active:bg-black/[0.04] dark:group-active:bg-white/[0.04] group-active:duration-[60ms]"
            />
          )}
          <span
            className={cn(
              "absolute inset-0 transition duration-200 group-active:opacity-0 group-active:duration-[60ms]",
              isPrimary ? "opacity-[0.12]" : "opacity-[0.16] dark:opacity-[0.04]",
            )}
            style={{
              background: "linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)",
            }}
          />
          <span
            className={cn(
              "absolute inset-0 transition duration-200 group-active:duration-[60ms]",
              isPrimary ? "opacity-[0.32]" : "opacity-[0.04] dark:opacity-[0.1]",
            )}
            style={{
              background:
                "radial-gradient(65.62% 65.62% at 50% 100%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
          {!isPrimary && (
            <span
              className="absolute inset-0 opacity-[0.4] transition duration-200 group-active:opacity-0 group-active:duration-[60ms] dark:opacity-[0.04]"
              style={{
                background:
                  "linear-gradient(99deg, rgba(255, 255, 255, 0) 27.7%, rgba(255, 255, 255, 0.12) 60.19%, rgba(255, 255, 255, 0) 86.06%)",
              }}
            />
          )}
          <span
            aria-hidden="true"
            className={cn("absolute inset-0 rounded-[4px] p-px", isPrimary ? "opacity-[0.24]" : "hidden")}
            style={{
              background: isPrimary
                ? "linear-gradient(rgb(255, 255, 255) 0%, rgb(153, 153, 153) 55%, rgb(255, 255, 255) 80%, rgb(153, 153, 153) 95%)"
                : "linear-gradient(transparent 0%, rgb(255, 255, 255) 55%, transparent 80%, rgb(255, 255, 255) 95%)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </span>
        <span className="relative">{children}</span>
      </Comp>
    );
  },
);

SoftPillButton.displayName = "SoftPillButton";

export default SoftPillButton;
