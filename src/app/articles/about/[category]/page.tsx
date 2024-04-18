import { articlesService } from '@entities';
import { ArticlesPage } from '@pages';

interface ICategoryPageProps {
  params: { category: string };
}

const CategoryPage = ({ params: { category } }: ICategoryPageProps) => {
  console.log('✅ category', category);

  const articlesInCategory = articlesService.filter(category);

  console.log('✅ articlesInCategory', articlesInCategory);

  return <ArticlesPage articles={articlesInCategory} />;
};

export default CategoryPage;

export const generateStaticParams = () => {
  const params = [
    ...new Set(
      articlesService.get().map((article) => ({
        category: article.category.toLowerCase().replaceAll('.', ''),
      })),
    ),
  ];

  console.log('✅ params', params);

  return params;
};
