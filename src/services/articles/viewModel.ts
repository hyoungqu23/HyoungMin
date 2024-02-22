import { IArticle, IArticleAdapter } from '@/src/services/articles/model';
import { allArticles } from '@contentlayer';

export class ArticleViewModel {
  private articles: Array<IArticle> = [];

  constructor(private adapter: IArticleAdapter) {
    this.articles = allArticles;
  }

  getPreview = (articles: Array<IArticle>) =>
    articles.map(this.adapter.toPreview);

  filter = (filterBy: string) =>
    this.articles.filter(article => article.category === filterBy);
  sortByCreatedAt = () =>
    this.articles.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
