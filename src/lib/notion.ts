import { blogsData, Blog } from "@/data/blogsData";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getNotionBlogs(): Promise<Blog[]> {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return blogsData;
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          sorts: [
            {
              property: "Date",
              direction: "descending",
            },
          ],
        }),
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.warn(`Notion API returned status ${response.status}. Using fallback blogs.`);
      return blogsData;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return blogsData;
    }

    const blogs: Blog[] = data.results.map((page: any) => {
      const props = page.properties;

      // Extract Title
      const titleProp = props.Title || props.Name || props.title || props.name;
      const title =
        titleProp?.title?.[0]?.plain_text ||
        titleProp?.rich_text?.[0]?.plain_text ||
        "Untitled Post";

      const rawSlug = props.Slug?.rich_text?.[0]?.plain_text || props.slug?.rich_text?.[0]?.plain_text;
      const slug = rawSlug ? generateSlug(rawSlug) : generateSlug(title);

      // Extract Date
      const dateProp = props.Date || props.date;
      const rawDate = dateProp?.date?.start || page.created_time;
      const dateFormatted = new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Extract Claps / Likes
      const clapsProp = props.Claps || props.Likes || props.claps || props.likes;
      const claps = clapsProp?.number || 100;

      // Extract Excerpt
      const excerptProp = props.Excerpt || props.excerpt;
      const excerpt = excerptProp?.rich_text?.[0]?.plain_text || "";

      // Extract Tags
      const tagsProp = props.Tags || props.tags;
      let tags: string[] = [];
      if (tagsProp?.multi_select?.length > 0) {
        tags = tagsProp.multi_select.map((t: any) => t.name);
      } else if (tagsProp?.select?.name) {
        tags = [tagsProp.select.name];
      }

      if (tags.length === 0) {
        if (title.toLowerCase().includes("loql")) tags = ["Product", "Startup", "Tech"];
        else if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("thesis")) tags = ["AI", "Security", "Infrastructure"];
        else tags = ["Product", "Tech"];
      }

      // Always use the official blog-hero.jpg as requested
      const heroImage = "/blog-hero.jpg";

      const link = `/blogs/${slug}`;

      return {
        slug,
        title,
        date: dateFormatted,
        claps,
        tags,
        link,
        isExternal: false,
        excerpt,
        heroImage,
      };
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching Notion blogs:", error);
    return blogsData;
  }
}

export async function getNotionBlogPostBySlug(slug: string): Promise<Blog | null> {
  const allBlogs = await getNotionBlogs();
  const matched = allBlogs.find((b) => b.slug === slug || generateSlug(b.title) === slug);

  if (!matched) {
    const fallback = blogsData.find((b) => b.slug === slug);
    return fallback || null;
  }

  const NOTION_API_KEY = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return matched;
  }

  try {
    // Find page ID from database query
    const dbRes = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        }),
        next: { revalidate: 60 },
      }
    );

    if (!dbRes.ok) return matched;

    const dbData = await dbRes.json();
    const pageObj = dbData.results?.find((page: any) => {
      const props = page.properties;
      const title =
        props.Title?.title?.[0]?.plain_text ||
        props.Name?.title?.[0]?.plain_text ||
        "";
      const pageSlug = props.Slug?.rich_text?.[0]?.plain_text || generateSlug(title);
      return pageSlug === slug || generateSlug(title) === slug || generateSlug(pageSlug) === slug;
    });

    if (!pageObj) return matched;

    // Fetch page blocks children
    const blocksRes = await fetch(
      `https://api.notion.com/v1/blocks/${pageObj.id}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
        next: { revalidate: 60 },
      }
    );

    if (!blocksRes.ok) return matched;

    const blocksData = await blocksRes.json();
    const markdownLines: string[] = [];

    for (const block of blocksData.results || []) {
      const type = block.type;
      const contentObj = block[type];
      if (!contentObj) continue;

      const text = contentObj.rich_text?.map((t: any) => t.plain_text).join("") || "";

      if (type === "paragraph") {
        if (text) markdownLines.push(`\n${text}\n`);
      } else if (type === "heading_1") {
        markdownLines.push(`\n# ${text}\n`);
      } else if (type === "heading_2") {
        markdownLines.push(`\n## ${text}\n`);
      } else if (type === "heading_3") {
        markdownLines.push(`\n### ${text}\n`);
      } else if (type === "bulleted_list_item") {
        markdownLines.push(`- ${text}`);
      } else if (type === "numbered_list_item") {
        markdownLines.push(`1. ${text}`);
      } else if (type === "quote") {
        markdownLines.push(`> ${text}`);
      } else if (type === "callout") {
        markdownLines.push(`> 💡 ${text}`);
      } else if (type === "code") {
        markdownLines.push(`\`\`\`${contentObj.language || ""}\n${text}\n\`\`\``);
      } else if (type === "image") {
        const imgUrl = contentObj.file?.url || contentObj.external?.url || "";
        const caption = contentObj.caption?.map((c: any) => c.plain_text).join("") || "Blog image";
        if (imgUrl) {
          markdownLines.push(`![${caption}](${imgUrl})`);
        }
      } else if (type === "divider") {
        markdownLines.push(`\n---\n`);
      }
    }

    const fullContent = markdownLines.join("\n");
    if (fullContent.trim().length > 0) {
      matched.content = fullContent;
    }

    return matched;
  } catch (err) {
    console.error("Error fetching Notion post blocks:", err);
    return matched;
  }
}
