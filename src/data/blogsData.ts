export interface Blog {
  title: string;
  date: string;
  claps: number;
  tags: string[];
  link: string;
  isExternal: boolean;
}

export const blogsData: Blog[] = [
  {
    title: "the journey of building loql",
    date: "Feb 17, 2026",
    claps: 120,
    tags: ["Product", "Startup", "Tech"],
    link: "https://loql.in/",
    isExternal: true,
  },
  {
    title: "my thesis on ai-generated image verification gateway",
    date: "Feb 15, 2026",
    claps: 85,
    tags: ["AI", "Security", "Infrastructure"],
    link: "https://github.com/devcool20",
    isExternal: true,
  }
];
