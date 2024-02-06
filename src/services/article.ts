import { Article } from '@/.contentlayer/generated';

export const articleService = {
  getPreview: (article: Article) => ({
    title: article.title,
    description: article.description,
    category: article.category,
    createdAt: new Date(article.createdAt).toLocaleDateString(),
    tags: article.tags,
    slug: article.slug,
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
