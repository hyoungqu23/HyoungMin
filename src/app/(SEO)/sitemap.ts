import { articlesService } from '@entities';
import { BASE_URL } from '@shared';
import type { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const articles = articlesService.get();

  return articles.map((article) => ({
    url: `${BASE_URL}/${article.slug}`,
    lastModified: article.createdAt,
  }));
};

export default sitemap;
