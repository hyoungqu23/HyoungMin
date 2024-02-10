import Card from '@/src/components/ui/Card';
import { articleService } from '@/src/services/article';
import { allArticles } from '@contentlayer';

const HomePage = () => {
  const recommendedArticles = allArticles.filter(
    (article) => article.isRecommended,
  );

  const recentArticles = allArticles
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <section className='w-full py-10 px-8 space-y-20'>
      <section className='flex flex-col gap-8 tablet:flex-row'>
        <section className='w-full h-[50vh] bg-[url("/images/web/hero_background.png")] bg-no-repeat bg-center bg-contain bg-white rounded-3xl grid grid-cols-[3fr_100px_minmax(60px,_1.2fr)_100px] grid-rows-[2fr_1fr_150px_80px_50px]'>
          <div className='relative col-start-4 col-end-5 bg-secondary-500 text-white row-start-3 row-end-4 rounded-tl-3xl before:absolute before:shadow-[24px_24px_0px_rgb(23,23,23)] before:rounded-full before:right-0 before:bottom-full before:w-12 before:h-12' />
          <div className='relative col-start-3 col-end-5 bg-secondary-500 text-white row-start-4 row-end-5 rounded-tl-3xl flex items-end justify-end pr-4 font-bold text-3xl before:absolute before:shadow-[24px_24px_0px_rgb(23,23,23)] before:rounded-full before:right-[100px] before:bottom-full before:w-12 before:h-12'>
            <h2 className='z-10'>이형민</h2>
          </div>
          <div className='relative col-start-2 col-end-5 bg-secondary-500 text-white row-start-5 row-end-6 rounded-tl-3xl flex items-start justify-end pr-4 font-bold text-3xl before:absolute before:shadow-[24px_24px_0px_rgb(23,23,23)] before:rounded-full before:left-[100px] before:-translate-x-full  before:bottom-full before:w-12 before:h-12 after:absolute after:shadow-[24px_24px_0px_rgb(23,23,23)] after:rounded-full after:right-full after:bottom-0 after:w-12 after:h-12'>
            <h2 className='z-10'>프론트엔드 개발자</h2>
          </div>
        </section>
        <section className='bg-[url("/images/web/profile.jpg")] bg-bottom bg-cover bg-no-repeat rounded-3xl tablet:w-[25vw] h-[25vh] tablet:h-auto'></section>
      </section>
      {/* Recommended Articles */}
      <section className='flex flex-col items-center justify-center'>
        <h3 className='text-heading2 font-bold'>Recommended</h3>
        <div className='flex gap-8'>
          {recommendedArticles.map((article) => (
            <Card
              key={article._id}
              articlePreview={articleService.getPreview(article)}
            />
          ))}
        </div>
      </section>
      {/* Recent Articles */}
      <section className='flex flex-col items-center justify-center'>
        <h3 className='text-heading2 font-bold'>Recent</h3>
        <div className='flex gap-8'>
          {recentArticles.map((article) => (
            <Card
              key={article._id}
              articlePreview={articleService.getPreview(article)}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default HomePage;
