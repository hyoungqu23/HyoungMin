import { articlesService } from '@entities';
import { type TLayoutProps } from '@shared';
import { CategoryHeader } from '@widgets';

const ArticlesLayout = ({ children }: TLayoutProps) => {
  const categories = [
    ...new Set(articlesService.get().map((article) => article.category)),
  ];

  return (
    <section className='flex flex-col gap-10 tablet:gap-20 w-full px-4 py-10 tablet:py-20'>
      <CategoryHeader categories={categories} />
      {children}
    </section>
  );
};

export default ArticlesLayout;
