import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";

import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { RightNavbar } from "@/components/RightNavbar";
import { Rule } from "@/components/blueprint/rule";
import { ClapButton } from "@/components/ClapButton";
import { getNotionBlogPostBySlug, getNotionBlogs } from "@/lib/notion";

export async function generateStaticParams() {
  const blogs = await getNotionBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getNotionBlogPostBySlug(slug);

  if (!blog) notFound();

  const wordCount = (blog.content || "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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
      subtitle="Reading post"
      back
      backHref="/blogs"
    >
      <div className="relative mt-8">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>

      {/* Article header */}
      <div className="flex flex-col gap-4 py-6">
        <h1 className="max-w-[24ch] text-balance text-[24px] font-bold leading-tight tracking-tight text-zinc-900 sm:text-[32px] dark:text-zinc-50">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-4 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-500" />
              {blog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-500 dark:text-zinc-500" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-zinc-500 dark:text-zinc-500" />
              <span className="flex items-center gap-1.5">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[4px] border border-black/20 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:border-white/15 dark:bg-ink-raised dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </span>
          </div>

          <ClapButton initialClaps={blog.claps} blogSlug={blog.slug} />
        </div>
      </div>

      <div className="relative mb-8">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>

      {/* Body */}
      <article className="max-w-[70ch] space-y-4 text-[15px] leading-relaxed text-zinc-700 sm:text-[16px] dark:text-zinc-300">
        {blog.excerpt && (
          <div className="relative mb-8 border-t border-black/10 pt-6 dark:border-white/10">
            <p className="text-pretty text-[17px] font-medium leading-relaxed text-zinc-700 sm:text-[19px] dark:text-zinc-200">
              {blog.excerpt}
            </p>
          </div>
        )}

        {blog.content
          ? blog.content.split("\n\n").map((paragraph, pIdx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("# ")) {
                return (
                  <h2
                    key={pIdx}
                    className="mb-3 mt-8 text-balance text-[22px] font-bold tracking-tight text-zinc-900 sm:text-[26px] dark:text-zinc-100"
                  >
                    {trimmed.replace("# ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3
                    key={pIdx}
                    className="mb-2 mt-6 text-balance text-[18px] font-bold tracking-tight text-zinc-900 sm:text-[22px] dark:text-zinc-100"
                  >
                    {trimmed.replace("## ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h4
                    key={pIdx}
                    className="mb-2 mt-5 text-[16px] font-semibold tracking-tight text-zinc-900 sm:text-[18px] dark:text-zinc-100"
                  >
                    {trimmed.replace("### ", "")}
                  </h4>
                );
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={pIdx}
                    className="my-4 rounded-[6px] bg-ink-sunken px-4 py-3 italic text-zinc-600 dark:text-zinc-300"
                  >
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }
              if (trimmed.startsWith("```")) {
                const lines = trimmed.split("\n");
                const codeContent = lines.slice(1, -1).join("\n");
                return (
                  <pre
                    key={pIdx}
                    className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-[#0b0e14] p-4 font-mono text-[13px] leading-relaxed text-zinc-200"
                  >
                    <code>{codeContent || trimmed.replace(/```[a-z]*/g, "")}</code>
                  </pre>
                );
              }

              return (
                <p key={pIdx} className="my-3 text-pretty leading-relaxed">{trimmed}</p>
              );
            })
          : (
            <p className="italic text-zinc-500">No content available for this post.</p>
          )}
      </article>

      {/* Footer */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10">
        <span className="text-[13px] text-zinc-500 dark:text-zinc-400">Enjoyed this article?</span>
        <ClapButton initialClaps={blog.claps} blogSlug={blog.slug} />
      </div>

      <div className="relative mt-10">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>
    </PageShell>
  );
}
