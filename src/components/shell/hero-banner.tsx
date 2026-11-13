"use client";

import Image from "next/image";
import { CurrentTime } from "@/components/CurrentTime";

export function HeroBanner() {
  return (
    <div className="bond-banner">
      <div className="bond-art">
        <Image src="/bond-banner-light.png" alt="" fill fetchPriority="high" sizes="340px" quality={90} className="object-contain dark:hidden" />
        <Image src="/bond-banner-dark.png" alt="" fill fetchPriority="high" sizes="340px" quality={90} className="hidden object-contain dark:block" />
      </div>
      <div className="bond-clock"><CurrentTime /></div>
    </div>
  );
}
