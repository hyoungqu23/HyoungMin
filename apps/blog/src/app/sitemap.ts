import { listSlugs, readArticle } from '@/shared/lib/fs';
import { compilePostMDX } from '@/shared/lib/mdx';
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: 'monthly';
  priority: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug): Promise<SitemapEntry | null> => {
      try {
        const source = await readArticle(slug);
        const { meta } = await compilePostMDX(source, {});

        if (meta.draft) {
          return null;
        }

        return {
          url: `${siteUrl}/${slug}`,
          lastModified: meta.date,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        };
      } catch {
        return null;
      }
    }),
  );

  const validPosts: SitemapEntry[] = posts.filter(
    (post): post is SitemapEntry => post !== null,
  );

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
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...prioritizedPosts,
  ];
}

