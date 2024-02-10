import { Article } from '@contentlayer';

export const articleService = {
  getPreview: (article: Article) => ({
    title: article.title,
    description: article.description,
    category: article.category,
    createdAt: new Date(article.createdAt).toLocaleDateString(),
    tags: article.tags,
    slug: article._raw.flattenedPath,
    thumbnail: {
      src: article.thumbnail,
      alt: article.title,
    },
  }),
};

export const articlesService = {
  getPreviews: (articles: Array<Article>) =>
    articles.map(articleService.getPreview),
};
