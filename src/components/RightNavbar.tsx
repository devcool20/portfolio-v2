"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function RightNavbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    const sections = ["experience", "projects", "blogs", "opensource", "skills"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const links = [
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "#blogs" },
    { name: "Open Source", href: "#opensource" },
    { name: "Skills", href: "#skills" },
  ];

  return (
    <nav className="absolute top-[22vh] left-[calc(69%+32px)] z-50 pointer-events-auto hidden lg:flex flex-col gap-4 mt-2">
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase mb-1">Index</h3>
      {links.map((link) => {
        const isActive = activeSection === link.href.slice(1);
        return (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`text-[12px] font-medium tracking-[0.05em] transition-all duration-700 ease-out flex items-center gap-3 ${
              isActive 
                ? "text-zinc-800 dark:text-zinc-200" 
                : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400"
            }`}
          >
            <span className={`h-[1px] transition-all duration-700 ease-out ${
              isActive
                ? "w-3 bg-zinc-300 dark:bg-zinc-700"
                : "w-0 bg-transparent"
            }`} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
