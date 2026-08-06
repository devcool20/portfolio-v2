import { NextResponse } from "next/server";
import { getNotionBlogs } from "@/lib/notion";

export async function GET() {
  const blogs = await getNotionBlogs();
  return NextResponse.json({ blogs });
}
