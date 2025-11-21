import { siteUrl } from "@/shared/config/site";
import { getAllPostSummaries } from "@/shared/lib/posts";
import type { MetadataRoute } from "next";

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "monthly";
  priority: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostSummaries();

  const validPosts: SitemapEntry[] = posts
    .filter((post) => !post.meta.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.slug}`,
      lastModified: post.meta.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // 최신 포스트 우선순위 높게 설정 (GEO 최적화)
  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = a.lastModified.getTime();
    const dateB = b.lastModified.getTime();
    return dateB - dateA;
  });

  // 최신 10개 포스트는 priority 1.0으로 설정
  const prioritizedPosts: SitemapEntry[] = sortedPosts.map((post, index) => ({
    ...post,
    priority: index < 10 ? 1.0 : post.priority,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...prioritizedPosts,
  ];
}
