"use client";

import { useState } from "react";
import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { FooterBackground } from "@/components/FooterBackground";
import { RightNavbar } from "@/components/RightNavbar";
import { ExperienceRow } from "@/components/ExperienceList";
import { experiences } from "@/data/experiencesData";

export default function AllExperiencePage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <PageShell
      rail={<RightNavbar />}
      hero={
        <>
          <FooterBackground />
          <HeroClock />
        </>
      }
      title="All Experiences"
      subtitle="Full experience archive"
      back
      contentClassName="pb-0"
    >
      <div className="flex flex-col pt-2">
        {experiences.map((item, idx) => (
          <ExperienceRow
            key={item.title}
            item={item}
            idx={idx}
            total={experiences.length}
            isOpen={openIdx === idx}
            isLast={idx === experiences.length - 1}
            onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
          />
        ))}
      </div>

      <div className="relative mt-8">
        <div className="bp-rule-h pointer-events-none absolute -inset-x-[100vw] bottom-0 border-b" />
        <span className="bp-node pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
        <span className="bp-node pointer-events-none absolute bottom-0 right-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
      </div>
    </PageShell>
  );
}
