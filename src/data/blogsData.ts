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
    title: "My GSOC Journey: The 2-Month Sprint from Doubt to Done",
    date: "Jun 2025",
    claps: 392,
    tags: ["GSOC", "Open Source"],
    link: "/blogs/gsoc-journey",
    isExternal: false,
  },
  {
    title: "JWT Authentication APIs with TypeScript, Node.js, and MongoDB.",
    date: "Feb 2025",
    claps: 104,
    tags: ["Authentication", "TypeScript", "MongoDB"],
    link: "https://medium.com/@ashutoshx7",
    isExternal: true,
  }
];
