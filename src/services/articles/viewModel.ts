import { IArticle, IArticleAdapter } from '@/src/services/articles/model';
import { allArticles } from '@contentlayer';

export class ArticleViewModel {
  private articles: Array<IArticle> = [];

  constructor(private adapter: IArticleAdapter) {
    this.articles = allArticles;
  }

  getPreview = (article: IArticle) => this.adapter.toPreview(article);

  getCategories = () => [
    ...new Set(this.articles.map(this.adapter.toCategory)),
  ];

  filterByCategory = (filterBy: string) =>
    this.articles.filter(
      article => article.category.toLowerCase() === filterBy,
    );

  filterByRecommendation = () =>
    this.articles.filter(article => article.isRecommended).slice(0, 3);

  filterByRecentCreated = () => this.sortByCreatedAt().slice(0, 3);

  sortByCreatedAt = () =>
    this.articles.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
