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
    role: "Full Stack Developer",
    dates: "Sept 2025 - April 2026",
    location: "Hybrid / Remote",
    src: "/Experience-image/pngegg (1).png",
    imageFit: "contain",
    imageZoom: 1.2,
    description: `
      Helped build rocket-mail, an in-house email platform for cohort-based, multi-step campaigns using AWS SES and SNS event tracking.
      Contributed to BullMQ queue workflows supporting notifications, emails, documents, invoices, and Meta events across 5 verticals.
      Supported the launch and data migration of the Men's and Women's Health products, helping move 6K+ users to the new platform.
    `,
    tech: ["TypeScript", "Node.js", "BullMQ", "AWS SES", "SNS", "Queue Workflows", "Data Migration"],
    metrics: [
      { label: "Role", value: "Full Stack Developer" },
      { label: "Migrated Users", value: "6K+" },
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
