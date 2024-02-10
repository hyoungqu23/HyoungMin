import Card from '@/src/components/ui/Card';
import { articleService } from '@/src/services/article';
import { allArticles } from '@contentlayer';

const ArticlesPage = () => {
  const sortedArticles = allArticles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className='flex flex-col items-center justify-between px-4 py-10 tablet:py-40'>
      <section className='flex flex-wrap gap-8 w-full justify-center'>
        {sortedArticles.map((article) => (
          <Card
            key={article._id}
            articlePreview={articleService.getPreview(article)}
          />
        ))}
      </section>
    </section>
  );
};

export default ArticlesPage;
