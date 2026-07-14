import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiCss,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
} from "react-icons/si";

export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "prisma" | "cloud" | "langchain" | "langgraph" | "rag"
  | "node" | "motion" | "tailwind" | "bun" | "eslint" | "radixui" | "charts" | "github" | "fastapi"
  | "redis" | "celery" | "tldraw" | "css3" | "python" | "anthropic" | "claude" | "gemini" | "llama";

export type TechItem = TechKey | { label: string; tooltip?: string; };

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  video: string;
  description: string;
  tech: TechItem[];
  github: string;
  live: string;
  starsText?: string;
  backgroundImage?: string;
  hasPin: boolean;
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs, ts: SiTypescript, react: SiReact, three: SiThreedotjs, prisma: SiPrisma,
  cloud: SiCloudflare, langchain: SiLangchain, langgraph: Network, rag: Search, node: SiNodedotjs,
  motion: SiFramer, tailwind: SiTailwindcss, bun: SiBun, eslint: SiEslint, radixui: SiRadixui,
  charts: SiChartdotjs, github: SiGithub, fastapi: SiFastapi, redis: SiRedis, celery: SiCelery,
  tldraw: SiTldraw, css3: SiCss, python: SiPython, anthropic: SiAnthropic, claude: SiClaude,
  gemini: SiGooglegemini, llama: SiMeta,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js", prisma: "Prisma",
  cloud: "Cloudflare", langchain: "LangChain", langgraph: "LangGraph", rag: "RAG",
  node: "Node.js", motion: "Framer Motion", tailwind: "Tailwind CSS", bun: "Bun", eslint: "ESLint",
  radixui: "Radix UI", charts: "Charts", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  celery: "Celery", tldraw: "tldraw", css3: "CSS3", python: "Python", anthropic: "Anthropic",
  claude: "Claude", gemini: "Gemini", llama: "LLaMA",
};

export const projectsData: Project[] = [
  {
    slug: "precedent",
    title: "Precedent",
    imageTitle: "Precedent Next.js Template",
    src: "/preview-projects/precedent.png",
    video: "",
    description: "An opinionated, production-ready Next.js template with Tailwind, Prisma, and authentication setup.",
    tech: ["next", "ts", "react", "tailwind", "prisma"],
    github: "https://github.com/devcool20/Precedent",
    live: "https://precedent-code.vercel.app/",
    backgroundImage: "/image copy.png",
    hasPin: true,
  },
  {
    slug: "loql",
    title: "Loql",
    imageTitle: "Local Rental Marketplace",
    src: "/preview-projects/loql.png",
    video: "",
    description: "A neighborhood rental marketplace built around trust, nearby discovery, and QR handshakes.",
    tech: ["next", "ts", "react", "tailwind", "node"],
    github: "https://github.com/devcool20",
    live: "https://loql.in/",
    backgroundImage: "/image copy 5.png",
    hasPin: true,
  },
  {
    slug: "meet-visualizer",
    title: "Meet Visualizer",
    imageTitle: "Meeting Visualizer",
    src: "/preview-projects/meet-visualizer.png",
    video: "",
    description: "An interactive workspace visualizer for team meetings and real-time collaboration insights.",
    tech: ["react", "ts", "tailwind", "motion"],
    github: "https://github.com/devcool20/meet-ai-vis",
    live: "https://meet-visualizer.vercel.app/",
    backgroundImage: "/image copy 3.png",
    hasPin: true,
  },
  {
    slug: "proofestate",
    title: "ProofEstate",
    imageTitle: "Real Estate Tokenization",
    src: "/preview-projects/proofestate.png",
    video: "",
    description: "A Solana real-estate tokenization protocol for verified fractional ownership and yield rails.",
    tech: ["next", "ts", "react", "tailwind"],
    github: "https://github.com/devcool20",
    live: "https://proof-estate.vercel.app/",
    backgroundImage: "/image copy 4.png",
    hasPin: true,
  },
  {
    slug: "projf1",
    title: "projF1",
    imageTitle: "F1 Weekend Command Center",
    src: "/preview-projects/projf1.png",
    video: "",
    description: "A Formula 1 weekend command center with race context, predictions, community, and live fan surfaces.",
    tech: ["react", "ts", "tailwind", "node", "redis"],
    github: "https://github.com/devcool20",
    live: "https://projf1.online/",
    backgroundImage: "/image copy.png",
    hasPin: false,
  },
  {
    slug: "salesdoc",
    title: "Sales Doc",
    imageTitle: "Sales Call Analysis",
    src: "/preview-projects/salesdoc.png",
    video: "",
    description: "A sales-call analysis product that turns conversations into recommendations for teams.",
    tech: ["next", "ts", "react", "tailwind", "python", "anthropic"],
    github: "https://github.com/devcool20",
    live: "https://salesdoc.vercel.app/",
    backgroundImage: "/image copy 3.png",
    hasPin: false,
  },
  {
    slug: "stash-bird",
    title: "Stash Bird",
    imageTitle: "Developer Stash",
    src: "/image copy 5.png",
    video: "",
    description: "A developer stash tool for saving code snippets, bookmarks, and reference materials.",
    tech: ["next", "ts", "react", "tailwind"],
    github: "https://github.com/devcool20",
    live: "https://stash-bird.vercel.app/",
    backgroundImage: "/image copy 4.png",
    hasPin: false,
  },
  {
    slug: "finstream",
    title: "FinStream",
    imageTitle: "Real-time News Stream",
    src: "/image copy 4.png",
    video: "",
    description: "A real-time financial news stream with Kafka, sentiment analysis, and WebSocket delivery.",
    tech: ["python", "node", "redis"],
    github: "https://github.com/devcool20/fin-stream",
    live: "",
    backgroundImage: "/image copy.png",
    hasPin: false,
  },
];
