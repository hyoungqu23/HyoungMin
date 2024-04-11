import { articlesService } from '@entities';
import { ArticlesPage } from '@pages';

interface ICategoryPageProps {
  params: { category: string };
}

const CategoryPage = ({ params: { category } }: ICategoryPageProps) => {
  const articlesInCategory = articlesService.filter(category);

  return <ArticlesPage articles={articlesInCategory} />;
};

export default CategoryPage;
