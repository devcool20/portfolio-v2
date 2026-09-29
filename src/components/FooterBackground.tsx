"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * The stippled mountain plate used as the hero art on inner pages and as the
 * page footer.
 *
 * The spotlight follows the cursor, but it writes CSS custom properties
 * inside a rAF rather than pushing coordinates into React state — a
 * mousemove used to re-render this subtree 60+ times a second.
 */
export function FooterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const posRef = useRef({ x: -400, y: -400 });
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const spot = spotRef.current;
    if (!container) return;

    const paint = () => {
      frameRef.current = 0;
      if (!spot) return;
      const { x, y } = posRef.current;
      spot.style.maskImage = `radial-gradient(200px circle at ${x}px ${y}px, black, transparent)`;
      spot.style.webkitMaskImage = spot.style.maskImage;
      spot.style.opacity = isHoveringRef.current ? "0.15" : "0";
    };

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      posRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
    };

    const onEnter = () => {
      isHoveringRef.current = true;
      if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      isHoveringRef.current = false;
      if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
    };

    container.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full select-none overflow-hidden"
    >
      {/* Light mode: mountain stippling blended smoothly into white */}
      <div className="absolute inset-0 h-full w-full opacity-85 mix-blend-multiply dark:hidden">
        <Image
          src="/footer.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={90}
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/70" />
      </div>

      {/* Dark mode: inverted silver-luminous peaks against the cool ink */}
      <div className="absolute inset-0 hidden h-full w-full opacity-90 mix-blend-screen dark:block">
        <Image
          src="/footer.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={95}
          className="object-cover object-bottom invert brightness-110 contrast-125"
        />
        {/* Fade top and bottom so the plate dissolves into the page instead of
            ending on a hard rectangular cut. */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#080a0f]/70" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080a0f] to-transparent" />
      </div>

      {/* Cursor spotlight */}
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-0 transition-opacity duration-500 ease-in-out md:block"
        style={{
          background: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
    </div>
  );
}
