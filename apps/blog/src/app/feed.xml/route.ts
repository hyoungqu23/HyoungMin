import type { PostMeta } from "@hyoungmin/schema";
import { NextResponse } from "next/server";

import { listSlugs, readArticle } from "@/shared/lib/fs";
import { compilePostMDX } from "@/shared/lib/mdx";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const siteName = "Blog";

type PostWithMeta = {
  slug: string;
  meta: PostMeta;
};

// RFC 822 날짜 형식 변환
const formatRFC822 = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const dayNum = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
};

// XML 이스케이프
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

export async function GET() {
  try {
    const slugs = await listSlugs();

    // 모든 포스트 메타데이터 가져오기
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const source = await readArticle(slug);
          const { meta } = await compilePostMDX(source, {});

          if (meta.draft) {
            return null;
          }

          return {
            slug,
            meta,
          };
        } catch {
          return null;
        }
      }),
    );

    // 드래프트 제외 및 날짜 내림차순 정렬
    const publishedPosts: PostWithMeta[] = posts
      .filter((post): post is PostWithMeta => post !== null)
      .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

    // RSS 2.0 형식 생성
    const rssItems = publishedPosts
      .map((post) => {
        const url = `${siteUrl}/${post.slug}`;
        const pubDate = formatRFC822(post.meta.createdAt);

        return `    <item>
      <title>${escapeXml(post.meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.meta.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.meta.tags.length > 0 ? `<category>${post.meta.tags.map((tag: string) => escapeXml(tag)).join("</category><category>")}</category>` : ""}
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteName)} RSS Feed</description>
    <language>ko-KR</language>
    <lastBuildDate>${formatRFC822(new Date())}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
${rssItems}
  </channel>
</rss>`;

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
