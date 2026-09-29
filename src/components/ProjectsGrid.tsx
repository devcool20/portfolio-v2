"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Play } from "lucide-react";

import {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
  projectsData,
} from "@/data/projectsData";
import { EASE_DRAFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
  projectsData,
};

export const ProjectCard = ({
  project,
  setActiveVideo,
  isPriority = false,
}: {
  project: Project;
  setActiveVideo: (v: string) => void;
  isPriority?: boolean;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
      if (mobile) setShouldLoadHoverImage(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cursor-tracked spotlight. Written straight to the node's custom
  // properties inside the event handler — no state, no re-render.
  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--px", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--py", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const imageSrc = resolvedTheme === "light" && project.lightModeSrc ? project.lightModeSrc : project.src;

  const isNotStarted = project.title === "Inquiro";
  const isBuilding = project.title === "Blueprint" || project.title === "Scribble3D";
  const statusColor = isNotStarted ? "bg-zinc-400" : isBuilding ? "bg-red-500" : "bg-emerald-500";
  const statusLabel = isNotStarted ? "Not started" : isBuilding ? "Building" : "Live";

  return (
    <motion.article
      className="flex flex-col"
      initial={reduce ? undefined : { opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: EASE_DRAFT }}
      onMouseEnter={() => setShouldLoadHoverImage(true)}
      onFocus={() => setShouldLoadHoverImage(true)}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        role="link"
        tabIndex={0}
        aria-label={`${project.title} — ${project.description}`}
        onClick={() => router.push(`/projects/${project.slug}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push(`/projects/${project.slug}`);
          }
        }}
        className={cn(
          "group relative flex aspect-[1.35] w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-black/5 p-3.5 pb-0 outline-offset-4 sm:aspect-[1.5] sm:p-4 sm:pb-0",
          "bg-ink-sunken/80 transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:-translate-y-1 hover:border-black/10 hover:shadow-lg hover:shadow-black/[0.06]",
          "dark:border-white/5 dark:bg-ink-sunken/80 dark:hover:border-white/15 dark:hover:shadow-black/40",
        )}
        variants={{ rest: {}, hover: {} }}
        initial="rest"
        animate={isMobile ? "hover" : "rest"}
        whileHover={isMobile ? undefined : "hover"}
      >
        {/* Cursor spotlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--px, 50%) var(--py, 50%), rgba(0,0,0,0.05), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0"
          style={{
            background:
              "radial-gradient(240px circle at var(--px, 50%) var(--py, 50%), rgba(255,255,255,0.05), transparent 70%)",
          }}
        />

        <div className="z-10 flex min-h-[24px] items-center justify-end">
          {project.hasPin && (
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-zinc-200/80 text-zinc-400 transition-colors duration-200 group-hover:border-zinc-300 group-hover:text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-500 dark:group-hover:border-zinc-700 dark:group-hover:text-zinc-300">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 17v5" />
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a2 2 0 0 0 1 1h12a2 2 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a2 2 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 2 0 0 1 1 1z" />
              </svg>
            </span>
          )}
        </div>

        {/* Ambient plate */}
        <motion.span
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              shouldLoadHoverImage && project.backgroundImage
                ? `url('${project.backgroundImage}')`
                : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={{ rest: { opacity: 0, scale: 1 }, hover: { opacity: 1, scale: 1.05 } }}
          transition={{ duration: 0.35, ease: EASE_DRAFT }}
        />
        {project.video && (
          <motion.span
            className="absolute left-4 top-4 z-30 text-[10px] font-bold uppercase tracking-widest text-zinc-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] dark:text-zinc-400"
            variants={{
              rest: { left: "1rem", top: "1rem", x: "0%", color: "#71717a", opacity: 0 },
              hover: { left: "50%", top: "25%", x: "-50%", color: "#ffffff", opacity: 1 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            Play Video
          </motion.span>
        )}

        {project.video && (
          <motion.span
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
            variants={{ rest: { scale: 0.5, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
          >
            <span
              role="button"
              tabIndex={isMobile ? 0 : -1}
              aria-label="Play video"
              onClick={(event) => {
                event.stopPropagation();
                if (project.video) setActiveVideo(project.video);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  if (project.video) setActiveVideo(project.video);
                }
              }}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <Play className="ml-0.5 h-4 w-4 fill-zinc-900 text-zinc-900" />
            </span>
          </motion.span>
        )}

        {/* Floating screenshot, seated in the bottom of the plate */}
        <motion.span
          className="absolute bottom-0 left-1/2 z-20 w-[85%] rounded-t-[10px] border border-b-0 border-black/5 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:border-white/15 dark:bg-[#0a0d13] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
          variants={{
            rest: { height: "78%", y: 0, x: "-50%" },
            hover: { height: "72%", y: 6, x: "-50%" },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <span className="block size-full overflow-hidden rounded-t-[9px]">
            <Image
              src={imageSrc}
              alt={`${project.title} preview`}
              width={600}
              height={400}
              preload={isPriority}
              sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
              quality={70}
              className="size-full object-contain object-top"
            />
          </span>
        </motion.span>
      </motion.div>

      {/* Caption */}
      <div className="mt-4 flex flex-col px-0.5">        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
          <h3 className="text-[15px] font-bold leading-tight text-zinc-900 dark:text-zinc-100">
            {project.title}
          </h3>

          <div className="flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-zinc-200/50 bg-white px-2 py-0.5 dark:border-zinc-800/50 dark:bg-ink-raised">
            <span className="relative flex h-1.5 w-1.5">
              {isBuilding && (
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
                    statusColor,
                  )}
                />
              )}
              <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", statusColor)} />
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{statusLabel}</span>
          </div>
        </div>

        <p className="mt-1.5 pr-2 text-pretty text-[13px] leading-relaxed text-zinc-500 sm:mt-2 dark:text-zinc-400">
          {project.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap gap-2">
            {project.tech.map((item) => {
              const key = typeof item === "string" ? item : item.label;
              const isIconItem = typeof item === "string";
              const tooltipText = isIconItem ? techNames[item] : item.tooltip || item.label;
              const uniqueId = `${project.title}-${key}`;

              return (
                <span
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredTech(uniqueId)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {isIconItem ? (
                    (() => {
                      const TechIcon = iconMap[item];
                      return (
                        <TechIcon className="h-4 w-4 text-zinc-400 transition-colors duration-200 hover:text-zinc-800 md:h-3.5 md:w-3.5 dark:text-zinc-500 dark:hover:text-zinc-200" />
                      );
                    })()
                  ) : (
                    <span className="rounded border border-black/30 px-1.5 py-0.5 text-[9px] leading-none text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                      {item.label}
                    </span>
                  )}
                  <AnimatePresence>
                    {hoveredTech === uniqueId && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.16, ease: EASE_DRAFT }}
                        className="pointer-events-none absolute -top-7 left-1/2 z-50 -translate-x-1/2"
                      >
                        <span className="block whitespace-nowrap rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-100 shadow-xl dark:bg-zinc-100 dark:text-zinc-900">
                          {tooltipText}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              );
            })}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              const href = project.live ?? project.github;
              if (href) window.open(href, "_blank", "noopener,noreferrer");
            }}
            className="group/link flex shrink-0 cursor-pointer items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-900 sm:text-[12px] dark:group-hover:text-zinc-200"
          >
            View Project
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

/** Shared lightbox for project videos. */
export function VideoModal({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Project video"
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE_DRAFT }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[92%] max-w-3xl overflow-hidden rounded-xl bg-black shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-3 top-3 z-50 cursor-pointer rounded-full bg-neutral-800/80 p-2 transition-colors duration-200 hover:bg-neutral-700"
            >
              <X size={18} className="text-neutral-200" />
            </button>

            {src.includes("youtube") ? (
              <iframe
                src={src}
                title="Project video"
                className="aspect-video w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={src} className="h-auto w-full" controls autoPlay playsInline />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProjectsGrid() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <div className="relative z-10 flex w-full flex-col">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 pb-10 md:grid-cols-2 md:gap-y-0 md:pb-6">
          {projectsData.slice(0, 2).map((project) => (
            <ProjectCard key={project.title} project={project} setActiveVideo={setActiveVideo} />
          ))}
        </div>

        <div className="relative hidden h-0 w-full md:block">
          <div className="bp-rule-h absolute -inset-x-[100vw] bottom-0 border-b" />
          <span className="bp-node pointer-events-none absolute left-0 top-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
          <span className="bp-node pointer-events-none absolute left-1/2 top-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
          <span className="bp-node pointer-events-none absolute right-0 top-0 z-20 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 pt-0 md:grid-cols-2 md:gap-y-0 md:pt-6">
          {projectsData.slice(2, 4).map((project) => (
            <ProjectCard key={project.title} project={project} setActiveVideo={setActiveVideo} />
          ))}
        </div>
      </div>

      <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
