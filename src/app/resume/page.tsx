import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, FileText } from "lucide-react";

import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { FooterBackground } from "@/components/FooterBackground";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { Reveal } from "@/components/blueprint/reveal";
import { Rule } from "@/components/blueprint/rule";

const resumePath = "/Divyanshu-Sharma-Resume.pdf";

export const metadata: Metadata = {
  title: "Resume | devcool20",
  description:
    "Resume of Divyanshu Sharma, full-stack product builder and open-source contributor.",
};

export default function ResumePage() {
  return (
    <PageShell
      hero={
        <>
          <FooterBackground />
          <HeroClock />
        </>
      }
      title="Resume"
      subtitle="Divyanshu Sharma"
      back
    >
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-black/10 bg-ink-sunken text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
              Divyanshu Sharma Resume
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-600">PDF document</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={resumePath}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open resume in a new tab"
            title="Open in new tab"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-black/10 bg-ink-sunken text-zinc-500 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-ink-raised hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link href={resumePath} download="Divyanshu-Sharma-Resume.pdf" aria-label="Download resume">
            <SoftPillButton as="span" variant="primary" className="px-3 py-1.5 !text-[12px]">
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Download
              </span>
            </SoftPillButton>
          </Link>
        </div>
      </div>

      <Reveal
        className="relative aspect-[8.5/11] w-full overflow-hidden rounded-[6px] border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b0e14]"
        delay={0.12}
        y={18}
      >
        <iframe
          src={`${resumePath}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Divyanshu Sharma Resume"
          className="min-h-[520px] h-full w-full border-none"
        />
      </Reveal>

      <div className="relative mt-8">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>
    </PageShell>
  );
}
