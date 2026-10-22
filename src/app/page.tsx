"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FileText } from "lucide-react";

import { RightNavbar } from "@/components/RightNavbar";
import { PageShell } from "@/components/shell/page-shell";
import { HeroBanner } from "@/components/shell/hero-banner";
import { ViewAll } from "@/components/shell/view-all";
import { Section, SectionRow } from "@/components/blueprint/section";
import AnimatedCharacter from "@/components/AnimatedCharacter";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import SocialHoverCard from "@/components/pixel-perfect/social-hover-card";
import { ExperienceList } from "@/components/ExperienceList";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { GithubGraph } from "@/components/GithubGraph";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { BlogList } from "@/components/BlogList";
import { FooterBackground } from "@/components/FooterBackground";
import { EASE_DRAFT, INTRO, staggerParent, revealFadeUp, revealCard } from "@/lib/motion";

const skills = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "React Native", icon: "react" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "Python", icon: "python" },
  { name: "Kafka", icon: "apachekafka" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "Docker", icon: "docker" },
  { name: "AWS", icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/amazonwebservices.svg" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "GSAP", icon: "greensock" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Zustand", icon: "https://raw.githubusercontent.com/pmndrs/zustand/main/docs/favicon.ico" },
];

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/devcool20",
    icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" fill="none" />,
  },
  {
    name: "Twitter",
    href: "https://x.com/dshxrmx",
    icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/divyanshu-sharma-b9b534113/",
    icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/d1vyanshu.sharma",
    icon: <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" stroke="currentColor" strokeWidth="2" fill="none" />,
  },
];

const CALENDAR_ICON = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MAIL_ICON = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default function Home() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE_DRAFT, delay },
        };

  return (
    <PageShell
      rail={<RightNavbar />}
      hero={<HeroBanner />}
      identity={
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <AnimatedCharacter variant="compact" />
          <div className="flex min-w-0 flex-col justify-center">
            <motion.h1
              className="bp-title mb-0.5 text-[20px] font-bold leading-[1.1] tracking-tight text-zinc-800 sm:text-[24px] dark:text-zinc-100"
              {...rise(INTRO.name)}
            >
              Divyanshu Sharma
            </motion.h1>
            <motion.p
              className="text-[13px] text-zinc-500 sm:text-[14px] dark:text-zinc-400"
              {...rise(INTRO.name + 0.06)}
            >
              devcool20
            </motion.p>
          </div>
        </div>
      }
      contentClassName="pb-0"
      leftRail={
        <AnimatedCharacter variant="desktop" />
      }
    >
      {/* ---- Lead copy ------------------------------------------------- */}
      <motion.div
        variants={staggerParent(0.07, INTRO.lead)}
        initial={reduce ? undefined : "hidden"}
        animate="visible"
        className="mt-4 flex max-w-[62ch] flex-col text-balance"
      >
        <motion.p
          variants={revealFadeUp}
          className="text-[15px] leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300"
        >
          Full-stack product builder, f1 obsessive, and maker of useful interfaces.
        </motion.p>

        <motion.p
          variants={revealFadeUp}
          className="mt-3 text-[15px] leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300"
        >
          I build web and mobile products with a bias for clean interaction, sharp systems, and real
          users. Currently building{" "}
          <a
            href="https://meet-visualizer.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-0.5 font-medium text-zinc-800 underline decoration-zinc-300 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-400"
          >
            stash-live
            <svg
              viewBox="0 0 24 24"
              className="h-2.5 w-2.5 translate-y-px transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-px group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
          .
        </motion.p>

        <motion.div variants={revealFadeUp} className="mt-5 flex flex-wrap items-center gap-2">
          <Link href="/contact">
            <SoftPillButton as="span" variant="primary" className="px-3 py-1.5 !text-[12px]">
              <span className="flex items-center gap-1.5">
                {CALENDAR_ICON}
                Book an intro call
              </span>
            </SoftPillButton>
          </Link>
          <Link href="/contact">
            <SoftPillButton as="span" variant="secondary" className="px-3 py-1.5 !text-[12px]">
              <span className="flex items-center gap-1.5">
                {MAIL_ICON}
                Send an email
              </span>
            </SoftPillButton>
          </Link>
        </motion.div>
      </motion.div>

      {/* ---- Socials ---------------------------------------------------- */}
      <Section title="Here are my socials" spacing="mt-8" className="[&_h2]:text-[14px] [&_h2]:font-normal [&_h2]:text-zinc-500">
        <motion.ul
          variants={staggerParent(0.04)}
          initial={reduce ? undefined : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap gap-1.5 pt-3"
        >
          {socials.map((social) => (
            <motion.li key={social.name} variants={revealCard} className="flex">
              <SocialHoverCard socialName={social.name}>
                <SoftPillButton
                  as="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="px-3 py-1.5 !text-[12px]"
                >
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      {social.icon}
                    </svg>
                    {social.name}
                  </span>
                </SoftPillButton>
              </SocialHoverCard>
            </motion.li>
          ))}
          <motion.li variants={revealCard} className="flex">
            <Link href="/resume">
              <SoftPillButton as="span" variant="secondary" className="px-3 py-1.5 !text-[12px]">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Resume
                </span>
              </SoftPillButton>
            </Link>
          </motion.li>
        </motion.ul>
      </Section>

      {/* ---- Experience -------------------------------------------------- */}
      <Section id="experience" title="Experiences" spacing="mt-8" contentClassName="pt-2">
        <ExperienceList />

        <div className="relative flex justify-center py-5">
          <ViewAll href="/experience" />
        </div>
      </Section>

      {/* ---- Projects ----------------------------------------------------- */}
      <Section
        id="projects"
        title="Projects"
        spacing="mt-0"
        contentClassName="relative px-4 pt-6 pb-6"
      >
        {/* Centre vertical rule inside the two-column plate */}
        <div
          aria-hidden
          className="bp-rule-v pointer-events-none absolute bottom-6 left-1/2 top-0 hidden w-0 border-l -translate-x-1/2 md:block"
        />

        <ProjectsGrid />

        <div className="relative flex justify-center pb-1 pt-2">
          <ViewAll href="/projects" />
        </div>
      </Section>

      {/* ---- GitHub activity ---------------------------------------------- */}
      <div id="github" className="relative z-10 mt-6 scroll-mt-24">
        <GithubGraph />
      </div>

      {/* ---- Open source --------------------------------------------------- */}
      <div id="opensource" className="relative z-10 mt-6 scroll-mt-24">
        <OpenSourceContributions />
      </div>

      {/* ---- Skills -------------------------------------------------------- */}
      <Section id="skills" title="Skills & Technologies" spacing="mt-8" contentClassName="pt-6 pb-2">
        <motion.ul
          variants={staggerParent(0.03)}
          initial={reduce ? undefined : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex w-full flex-wrap gap-2"
        >
          {skills.map((skill) => (
            <motion.li
              key={skill.name}
              variants={revealCard}
              className="group flex grow items-center justify-center gap-2 rounded-[6px] border border-black/15 bg-ink-sunken px-3 py-1.5 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:border-black/25 dark:border-white/15 dark:bg-ink-sunken dark:hover:border-white/25"
            >
              <img
                src={skill.icon.startsWith("http") ? skill.icon : `https://cdn.simpleicons.org/${skill.icon}/71717a`}
                alt=""
                width={14}
                height={14}
                loading="lazy"
                decoding="async"
                className={`h-3.5 w-3.5 opacity-80 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110 ${skill.icon.startsWith("http") ? "rounded-sm grayscale" : ""}`}
              />
              <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
                {skill.name}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* ---- Blogs ---------------------------------------------------------- */}
      <Section id="blogs" title="Blogs" spacing="mt-8" contentClassName="pt-2">
        <BlogList />
        <div className="relative flex justify-center py-5">
          <ViewAll href="/blogs" />
        </div>
      </Section>

      {/* ---- Quote ---------------------------------------------------------- */}
      <SectionRow className="mt-14 flex flex-col items-center justify-center py-10">
        <figure className="flex w-full max-w-[480px] flex-col items-center">
          <blockquote className="mb-6 text-center text-[16px] font-medium italic leading-relaxed text-zinc-500 dark:text-zinc-400">
            &quot;Find the messy workflow, make it understandable, then make it fast.&quot;
          </blockquote>
          <figcaption className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            <span className="h-px w-4 bg-zinc-200 dark:bg-zinc-700" />
            Divyanshu Sharma
            <span className="h-px w-4 bg-zinc-200 dark:bg-zinc-700" />
          </figcaption>
        </figure>
      </SectionRow>

      {/* ---- Footer plate ----------------------------------------------------- */}
      <div className="relative -mx-4 mt-4 h-[300px] w-[calc(100%+32px)]">
        <FooterBackground />
      </div>
    </PageShell>
  );
}
