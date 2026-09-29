"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BannerParticles } from "@/components/BannerParticles";
import { CurrentTime } from "@/components/CurrentTime";
import { EASE_DRAFT } from "@/lib/motion";

const INK = "#080a0f";

/**
 * The hero plate. On load it develops the way a print does in a tray: it
 * arrives soft and slightly over-scaled, resolves to focus, and settles —
 * while the drafting rules draw in underneath it.
 */
export function HeroBanner() {
  const reduce = useReducedMotion();

  const develop = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 1.1, filter: "blur(14px)" },
        animate: { opacity: 1, scale: 1.05, filter: "blur(0px)" },
        transition: { duration: 1.15, ease: EASE_DRAFT, delay: 0.1 },
      };

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <motion.div className="absolute inset-0" {...develop}>
        <Image
          src="/bond-banner-light.png"
          alt=""
          fill
          fetchPriority="high"
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={100}
          style={{ objectPosition: "center 35%" }}
          className="object-cover dark:hidden"
        />
        <Image
          src="/bond-banner-dark.png"
          alt=""
          fill
          fetchPriority="high"
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={100}
          style={{ objectPosition: "center 35%" }}
          className="hidden object-cover dark:block"
        />
      </motion.div>

      {/* Radial vignette, matched to the dark-mode ink rather than pure black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6] hidden dark:block"
        style={{ background: `radial-gradient(ellipse, transparent 28%, ${INK} 78%)` }}
      />

      <BannerParticles />

      {/* Feather the plate into the sheet on all four sides */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-10 bg-gradient-to-b from-ink/90 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-10 bg-gradient-to-t from-ink/90 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-8 bg-gradient-to-r from-ink/90 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-8 bg-gradient-to-l from-ink/90 to-transparent" />

      <div className="absolute bottom-3 right-2 z-30">
        <CurrentTime />
      </div>
    </div>
  );
}
