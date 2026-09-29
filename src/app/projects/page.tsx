"use client";

import { PageShell } from "@/components/shell/page-shell";
import { FooterBackground } from "@/components/FooterBackground";
import { HeroClock } from "@/components/shell/page-shell";
import { ProjectCard, VideoModal, projectsData } from "@/components/ProjectsGrid";
import { RightNavbar } from "@/components/RightNavbar";
import { useState } from "react";

export default function AllProjectsPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const rows = Math.ceil(projectsData.length / 2);

  return (
    <>
      <PageShell
        rail={<RightNavbar />}
        hero={
          <>
            <FooterBackground />
            <HeroClock />
          </>
        }
        title="All Projects"
        subtitle="Full project archive"
        back
      >
        <div className="relative pt-6 pb-6">
          {/* Centre rule through the two-column plate */}
          <div
            aria-hidden
            className="bp-rule-v pointer-events-none absolute bottom-6 left-1/2 top-0 hidden w-0 border-l -translate-x-1/2 md:block"
          />
          <span className="bp-node pointer-events-none absolute left-1/2 top-0 z-20 hidden h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 md:block" />

          <div className="relative z-10 flex w-full flex-col">
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const rowProjects = projectsData.slice(rowIndex * 2, rowIndex * 2 + 2);
              const isFirst = rowIndex === 0;
              const isLast = rowIndex === rows - 1;

              return (
                <div key={rowIndex} className="relative flex w-full flex-col">
                  <div
                    className={`grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 md:gap-y-0 ${
                      isFirst
                        ? "pb-10 md:pb-6"
                        : isLast
                          ? "pt-0 md:pt-6"
                          : "pb-10 pt-0 md:pb-6 md:pt-6"
                    }`}
                  >
                    {rowProjects.map((project) => (
                      <ProjectCard
                        key={project.title}
                        project={project}
                        setActiveVideo={setActiveVideo}
                        isPriority={isFirst}
                      />
                    ))}
                  </div>

                  {!isLast && (
                    <div className="relative hidden h-0 w-full md:block">
                      <div className="bp-rule-h absolute -inset-x-[100vw] bottom-0 border-b" />
                      <span className="bp-node pointer-events-none absolute left-0 top-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
                      <span className="bp-node pointer-events-none absolute left-1/2 top-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
                      <span className="bp-node pointer-events-none absolute right-0 top-0 z-20 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mt-8">
          <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] bottom-0 border-b" />
          <span className="bp-node pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
          <span className="bp-node pointer-events-none absolute bottom-0 right-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
        </div>
      </PageShell>

      <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
