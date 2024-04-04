import { BASE_URL } from '@shared';
import { allArticles } from '@contentlayer';
import type { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  return allArticles.map((article) => ({
    url: `${BASE_URL}/${article._raw.flattenedPath}`,
    lastModified: article.createdAt,
  }));
};

export default sitemap;
