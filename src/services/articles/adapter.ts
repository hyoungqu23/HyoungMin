import { IArticle, IArticleAdapter } from '@/src/services/articles/model';

class ArticleAdapter implements IArticleAdapter {
  toPreview = (article: IArticle) => ({
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
  });
}
