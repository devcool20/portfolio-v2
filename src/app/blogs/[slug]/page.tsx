import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { CurrentTime } from "@/components/CurrentTime";
import { RightNavbar } from "@/components/RightNavbar";
import { FooterBackground } from "@/components/FooterBackground";
import { ClapButton } from "@/components/ClapButton";
import { getNotionBlogPostBySlug, getNotionBlogs } from "@/lib/notion";

export async function generateStaticParams() {
  const blogs = await getNotionBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getNotionBlogPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Calculate estimated reading time
  const wordCount = (blog.content || "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-clip transition-colors duration-300">
      {/* Right Side Blueprint Navigation */}
      <RightNavbar />

      {/* Vertical Lines - Ultra-fine Micro Dots */}
      <div
        className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block"
        style={{
          maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block"
        style={{
          maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Horizontal Lines - Ultra-fine Micro Dots */}
      <div
        className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={{
          maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div
        className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={{
          maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Ultra-Tiny Solid Nodes */}
      {[
        { top: "22vh", left: "30%" },
        { top: "22vh", right: "30%" },
        { top: "calc(22vh + 112px)", left: "30%" },
        { top: "calc(22vh + 112px)", right: "30%" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            transform: `translate(${pos.right ? "50%" : "-50%"}, -50%)`,
          }}
        />
      ))}

      {/* Cell 1: Blog Hero Banner */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
        <Image
          src="/blog-hero.jpg"
          alt={blog.title}
          fill
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={100}
          style={{ objectPosition: "center 40%" }}
          className="object-cover scale-105 dark:invert dark:brightness-110 dark:contrast-125 dark:mix-blend-screen transition-all duration-300"
        />
        <div className="absolute inset-x-0 top-0 h-8 pointer-events-none z-[5] bg-gradient-to-b from-white/80 to-transparent dark:from-black dark:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none z-[5] bg-gradient-to-t from-white/80 to-transparent dark:from-black dark:to-transparent" />
        <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
          <CurrentTime />
        </div>
      </div>

      {/* Cell 2: Header with Back Button + Title + Controls */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
        <div className="flex w-full items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-5">
            <Link
              href="/blogs"
              className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex flex-col justify-center">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                Blogs
              </h1>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">
                Reading Post
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1">
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-[calc(22vh+112px)] pb-16 px-4 flex flex-col z-10 relative">

        {/* Top Dashed Blueprint Divider */}
        <div className="relative mt-8">
          <div
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Article Header Metadata */}
        <div className="py-6 flex flex-col gap-4">
          <h1 className="text-[24px] sm:text-[32px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-black/10 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-zinc-400" />
                <div className="flex items-center gap-1.5">
                  {blog.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-[4px] border border-black/20 dark:border-white/15 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Applause / Clap Button */}
            <ClapButton initialClaps={blog.claps} blogSlug={blog.slug} />
          </div>
        </div>

        {/* Bottom Dashed Blueprint Divider */}
        <div className="relative mb-8">
          <div
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Article Body Content */}
        <article className="text-[15px] sm:text-[16px] leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-4">
          {blog.excerpt && (
            <p className="text-[17px] sm:text-[18px] font-medium text-zinc-900 dark:text-zinc-100 italic border-l-2 border-cyan-500 pl-4 py-1 mb-6">
              {blog.excerpt}
            </p>
          )}

          {blog.content ? (
            blog.content.split("\n\n").map((paragraph, pIdx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("# ")) {
                return (
                  <h1 key={pIdx} className="text-[22px] sm:text-[26px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-8 mb-3">
                    {trimmed.replace("# ", "")}
                  </h1>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={pIdx} className="text-[18px] sm:text-[22px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-6 mb-2">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={pIdx} className="text-[16px] sm:text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mt-5 mb-2">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={pIdx} className="border-l-2 border-zinc-400 dark:border-zinc-600 pl-4 py-1 my-4 text-zinc-600 dark:text-zinc-400 italic">
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }
              if (trimmed.startsWith("```")) {
                const lines = trimmed.split("\n");
                const codeContent = lines.slice(1, -1).join("\n");
                return (
                  <pre key={pIdx} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 overflow-x-auto text-[13px] font-mono my-4">
                    <code>{codeContent || trimmed.replace(/```[a-z]*/g, "")}</code>
                  </pre>
                );
              }

              return (
                <p key={pIdx} className="text-zinc-700 dark:text-zinc-300 leading-relaxed my-3">
                  {trimmed}
                </p>
              );
            })
          ) : (
            <p className="text-zinc-500 italic">No content available for this post.</p>
          )}
        </article>

        {/* Bottom Applause & Footer Section */}
        <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <span className="text-[13px] text-zinc-500 dark:text-zinc-400">Enjoyed this article?</span>
          <ClapButton initialClaps={blog.claps} blogSlug={blog.slug} />
        </div>
      </div>
    </div>
  );
}
