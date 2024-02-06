import Card from '@/src/components/ui/Card';
import { articleService } from '@/src/services/article';
import { allArticles } from '@contentlayer';

const ArticlesPage = () => {
  return (
    <section className='flex flex-col items-center justify-between px-4 py-10 tablet:py-40'>
      <section className='columns-2 gap-8'>
        {allArticles.map(article => (
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
