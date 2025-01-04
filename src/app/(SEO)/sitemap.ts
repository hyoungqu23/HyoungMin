import { getArticles } from '@entities/articles';
import { BASE_URL } from '@shared/routes';
import type { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  const articles = getArticles();

  return articles.map((article) => ({
    url: `${BASE_URL}/${article.slug}`,
    lastModified: article.createdAt,
  }));
};

export default sitemap;
