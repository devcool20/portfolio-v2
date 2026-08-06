"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export function FooterBackground() {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
    >
      {/* Light Mode: Mountain stippling blended smoothly into white */}
      <div className="absolute inset-0 w-full h-full dark:hidden opacity-85 mix-blend-multiply">
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

      {/* Dark Mode: Inverted silver-luminous stippled mountain peaks against pitch black */}
      <div className="absolute inset-0 w-full h-full hidden dark:block opacity-90 mix-blend-screen">
        <Image
          src="/footer.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={95}
          className="object-cover object-bottom invert brightness-110 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/70" />
      </div>

      {/* Subtle interactive hover spotlight effect */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ease-in-out hidden md:block"
        style={{
          background: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          opacity: isHovering ? 0.15 : 0,
          maskImage: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />
    </div>
  );
}
