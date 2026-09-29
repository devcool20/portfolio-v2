"use client";

import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { FooterBackground } from "@/components/FooterBackground";
import { RightNavbar } from "@/components/RightNavbar";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { Rule } from "@/components/blueprint/rule";

export default function PullRequestsPage() {
  return (
    <PageShell
      rail={<RightNavbar />}
      hero={
        <>
          <FooterBackground />
          <HeroClock />
        </>
      }
      title="Pull Requests"
      subtitle="Open source contributions"
      back
      contentClassName="pb-0"
    >
      <div className="pt-4">
        <OpenSourceContributions isFullPage />
      </div>

      <div className="relative mt-8">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>
    </PageShell>
  );
}
