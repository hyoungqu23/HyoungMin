import { NextResponse } from "next/server";

import { buildRssFeed } from "./_lib/rss";

import { siteUrl } from "@/shared/config/site";
import { getAllPostSummaries } from "@/shared/lib/posts";

const siteName = "Blog";

export async function GET() {
  try {
    const posts = await getAllPostSummaries();
    const rss = buildRssFeed({
      posts,
      siteName,
      siteUrl,
      buildDate: new Date(),
    });

    return new NextResponse(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
