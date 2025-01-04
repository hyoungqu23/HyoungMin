import { getArticles } from '@entities/articles';
import { ClientTimestamp } from '@shared/ui';
import Link from 'next/link';

const ArticlesPage = async () => {
  const articles = getArticles();

  return (
    <section className='flex flex-col gap-8 w-full justify-center'>
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/articles/${article.slug}`}
          className='w-full flex flex-col h-fit px-4 py-3 gap-4 hover:bg-secondary-200/20 focus:bg-secondary-200/20 outline-none justify-between items-center rounded-md text-heading6 tablet:text-heading4 font-bold transition-colors duration-500 tablet:flex-row'
        >
          <div className='w-full flex flex-col gap-1 tablet:gap-4'>
            <span className='text-body2'>{article.category}</span>
            <h3 className='line-clamp-2 tablet:flex-1'>{article.title}</h3>
            <div className='flex gap-1 w-full flex-wrap overflow-x-hidden whitespace-nowrap'>
              {article.tags.map((tag) => (
                <span key={tag} className='px-1 text-caption1'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className='flex flex-col items-end gap-2 text-body3 font-semibold self-end tablet:text-body1 text-nowrap'>
            <span>{article.readingTime ?? 1} min.</span>
            <ClientTimestamp className='underline' date={new Date(article.createdAt)} />
          </div>
        </Link>
      ))}
    </section>
  );
};

export default ArticlesPage;
