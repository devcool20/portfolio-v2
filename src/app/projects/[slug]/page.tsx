import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";

import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { FooterBackground } from "@/components/FooterBackground";
import { RightNavbar } from "@/components/RightNavbar";
import { Section } from "@/components/blueprint/section";
import { Reveal } from "@/components/blueprint/reveal";
import { Rule } from "@/components/blueprint/rule";
import { projectsData, iconMap, techNames, TechItem, TechKey } from "@/data/projectsData";

export function generateStaticParams() {
  return projectsData.map((project) => ({ slug: project.slug }));
}

function StatusDot({ isBuilding }: { isBuilding: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${
          isBuilding ? "bg-amber-400" : "bg-emerald-400"
        }`}
      />
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${isBuilding ? "bg-amber-500" : "bg-emerald-500"}`}
      />
    </span>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return null;

  const isBuilding = project.title === "Blueprint" || project.title === "Scribble3D";
  const isNotStarted = project.title === "Inquiro";

  return (
    <ProjectDetail
      project={project}
      isBuilding={isBuilding}
      isNotStarted={isNotStarted}
      slug={slug}
    />
  );
}

function ProjectDetail({
  project,
  isBuilding,
  isNotStarted,
}: {
  project: (typeof projectsData)[number];
  isBuilding: boolean;
  isNotStarted: boolean;
  slug: string;
}) {
  return (
    <PageShell
      rail={<RightNavbar />}
      hero={
        <>
          <FooterBackground />
          <HeroClock />
        </>
      }
      title={project.title}
      subtitle={`Projects / ${project.title}`}
      back
    >
      {/* Media plate */}
      <Reveal
        className="relative z-20 mt-8 aspect-video w-full overflow-hidden rounded-lg border border-black/10 bg-black shadow-sm dark:border-white/15"
        delay={0.1}
        y={16}
        scale={0.985}
      >
        {project.video ? (
          project.video.includes("youtube") ? (
            <iframe
              src={project.video}
              title={`${project.title} video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={project.video}
              className="h-full w-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          )
        ) : (
          <Image
            src={project.src}
            alt={project.imageTitle}
            fill
            preload
            sizes="(min-width: 768px) 40vw, 100vw"
            quality={75}
            className="object-cover"
          />
        )}
      </Reveal>

      {/* Action row */}
      <div className="relative grid grid-cols-2 items-center justify-between py-4 md:grid-cols-3">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            <SiGithub className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-12" />
            GitHub
          </a>
        ) : (
          <div />
        )}

        <div
          aria-hidden
          className="bp-rule-v pointer-events-none absolute bottom-0 left-1/3 top-0 hidden w-0 border-l md:block"
        />

        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Website
          </a>
        ) : (
          <div />
        )}

        <div
          aria-hidden
          className="bp-rule-v pointer-events-none absolute bottom-0 left-2/3 top-0 hidden w-0 border-l md:block"
        />

        <div className="hidden items-center justify-center gap-2 text-[13px] font-medium text-zinc-400 md:flex">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <line x1="9" x2="15" y1="9" y2="9" />
            <line x1="9" x2="15" y1="15" y2="15" />
          </svg>
          Post
        </div>
      </div>

      {/* Title + status */}
      <div className="relative mb-4 flex w-full items-center justify-between gap-3">
        <h1 className="text-[24px] font-bold leading-none tracking-tight text-zinc-900 sm:text-[28px] dark:text-zinc-50">
          {project.title}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <StatusDot isBuilding={isBuilding} />
          <span
            className={`text-[13px] font-medium ${
              isNotStarted
                ? "text-zinc-500 dark:text-zinc-400"
                : isBuilding
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isNotStarted ? "Not started" : isBuilding ? "Building" : "Live"}
          </span>
        </div>
      </div>

      <p className="max-w-[68ch] text-pretty text-[14px] leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-300">
        {project.description}
      </p>

      {/* Stack */}
      <Section title="Stack used" spacing="mt-10" contentClassName="pt-5">
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t: TechItem, i: number) => {
            const isKey = typeof t === "string";
            const label = isKey ? techNames[t as TechKey] : t.label;
            const Icon = isKey ? iconMap[t as TechKey] : null;

            return (
              <li
                key={i}
                className="flex items-center gap-1.5 rounded-md border border-black/10 bg-zinc-100 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:border-black/20 hover:bg-zinc-50 dark:border-white/10 dark:bg-ink-raised dark:text-zinc-300 dark:hover:border-white/20"
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </li>
            );
          })}
        </ul>
      </Section>

      <div className="relative mt-10">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>
    </PageShell>
  );
}
