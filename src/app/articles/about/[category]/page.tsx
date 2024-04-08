import { articlesService } from '@entities';

interface ICategoryPageProps {
  params: { category: string };
}

const CategoryPage = ({ params: { category } }: ICategoryPageProps) => {
  const articlesInCategory = articlesService.filter(category);

  return (
    <section className='flex flex-col items-center justify-between px-4 py-10 tablet:py-40'>
      <section className='flex flex-wrap gap-8 w-full justify-center'>
        {/* {articlesInCategory.map((article) => (
          <Card
            key={article._id}
            articlePreview={articleService.getPreview(article)}
          />
        ))} */}
      </section>
    </section>
  );
};

export default CategoryPage;
