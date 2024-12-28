import { articlesService } from '@entities';
import { ArticlesPage } from '@pages';

const Articles = () => {
  const articles = articlesService.get();

  return <ArticlesPage articles={articles} />;
};

export default Articles;
