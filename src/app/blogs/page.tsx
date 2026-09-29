import Image from "next/image";
import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { RightNavbar } from "@/components/RightNavbar";
import { BlogList } from "@/components/BlogList";

export default function AllBlogsPage() {
  return (
    <PageShell
      rail={<RightNavbar />}
      hero={
        <div className="relative h-full w-full overflow-hidden bg-ink">
          <Image
            src="/blog-hero.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            quality={100}
            style={{ objectPosition: "center 40%" }}
            className="object-cover transition-all duration-300 dark:invert dark:brightness-110 dark:contrast-125 dark:mix-blend-screen"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-8 bg-gradient-to-b from-ink/80 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-8 bg-gradient-to-t from-ink/80 to-transparent"
          />
          <HeroClock />
        </div>
      }
      title="Blogs"
      subtitle="Thoughts, architecture & technical writing"
      back
    >
      <div className="pt-4">
        <BlogList />
      </div>
    </PageShell>
  );
}
