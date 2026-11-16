export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
  appLink?: string;
};

/**
 * Lived in two files verbatim before this was extracted; the home page and
 * the archive route had drifted apart more than once.
 */
export const experiences: ExperienceData[] = [
  {
    title: "Clawvisor (YC P26)",
    role: "Backend Developer",
    dates: "May 2026 - July 2026",
    location: "Remote",
    src: "/Experience-image/pngegg (1).png",
    imageFit: "contain",
    imageZoom: 1.2,
    description: `
      Built and hardened LLM proxy infrastructure for Clawvisor (YC P26), shipping production backend features across streaming, validation, integrations, and runtime reliability.
      Resolved high-concurrency SQLite contention under 200+ requests/sec by tuning WAL, connection pooling, busy timeouts, and transaction boundaries.
      Added headless runner support with programmatic approval wait APIs, structured denial metadata, token budgeting, and rate-limit queueing.
    `,
    tech: ["Python", "TypeScript", "LLM Proxies", "SQLite", "Streaming", "APIs & Protocols", "Backend Infrastructure"],
    metrics: [
      { label: "Role", value: "Backend Developer" },
      { label: "Throughput", value: "200+ req/s" },
    ],
  },
  {
    title: "RocketHealth",
    appLink: "https://play.google.com/store/apps/details?id=com.journalrocketapp",
    role: "Full Stack Developer",
    dates: "Sept 2025 - April 2026",
    location: "Hybrid / Remote",
    src: "/Experience-image/pngegg (1).png",
    imageFit: "contain",
    imageZoom: 1.2,
    description: `
      Built Rocket Journal, a React Native voice-enabled mood journal for day-and-night mood, habit, and reflection logging, with scribbling and rant mode.
      Developed its FastAPI backend to support daily diary entries and expressive journaling workflows across voice, text, and reflection experiences.
    `,
    tech: ["React Native", "FastAPI", "Python", "Voice Journaling"],
    metrics: [
      { label: "Role", value: "Full Stack Developer" },
      { label: "Product", value: "Rocket Journal" },
    ],
  },
  {
    title: "Zingvel Travels",
    role: "Software Developer Intern",
    dates: "December 2024 - May 2025",
    location: "Remote",
    src: "/Experience-image/pngegg (1).png",
    imageFit: "contain",
    imageZoom: 1.2,
    description: `
      Engineered major UI/UX components, including a comprehensive airline ticketing system.
      Developed and integrated Wanderlust, an AI-powered travel recommendation engine that personalized booking experiences and improved user engagement.
    `,
    tech: ["React", "TypeScript", "Node.js", "FastAPI", "AI Integration", "UI/UX Systems"],
    metrics: [
      { label: "Role", value: "Developer Intern" },
      { label: "Domain", value: "AI Travel" },
    ],
  },
];
