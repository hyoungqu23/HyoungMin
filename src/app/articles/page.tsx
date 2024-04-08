import { notFound } from 'next/navigation';
import { articlesService } from '@entities';

const ArticlesPage = () => {
  const articles = articlesService.get();

  return (
    <section className='flex flex-col items-center justify-between px-4 py-10 tablet:py-40'>
      <section className='flex flex-wrap gap-8 w-full justify-center'>
        {/* {articleService.sortByCreatedAt().map((article) => (
          <Card
            key={article._id}
            articlePreview={articleService.getPreview(article)}
          />
        ))} */}
      </section>
    </section>
  );
};

export default ArticlesPage;
