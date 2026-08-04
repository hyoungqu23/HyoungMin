import type { PostMeta } from "@hyoungmin/schema";

type FeedPost = {
  slug: string;
  meta: PostMeta;
};

type BuildRssFeedInput = {
  buildDate: Date;
  posts: FeedPost[];
  siteName: string;
  siteUrl: string;
};

export const formatRfc822 = (date: Date): string => {
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
  const dayNumber = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${day}, ${dayNumber} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
};

const escapeXml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const buildRssFeed = ({
  buildDate,
  posts,
  siteName,
  siteUrl,
}: BuildRssFeedInput): string => {
  const publishedPosts = posts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => b.meta.createdAt.getTime() - a.meta.createdAt.getTime());

  const items = publishedPosts
    .map((post) => {
      const url = `${siteUrl}/${post.slug}`;
      const categories = post.meta.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `    <item>
      <title>${escapeXml(post.meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.meta.description)}</description>
      <pubDate>${formatRfc822(post.meta.createdAt)}</pubDate>
      ${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteName)} RSS Feed</description>
    <language>ko-KR</language>
    <lastBuildDate>${formatRfc822(buildDate)}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>`;
};
