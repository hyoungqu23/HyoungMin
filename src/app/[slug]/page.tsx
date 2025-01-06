import { getArticles, getContent, getPreviewOfArticle } from '@entities/articles';
import { formatDate } from '@shared/lib';
import { BASE_URL, NAVIGATION_ITEMS } from '@shared/routes';
import { ClientTimestamp } from '@shared/ui';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

interface IArticlePageProps {
  params: { slug: string };
}

export const generateMetadata = ({ params: { slug } }: IArticlePageProps) => {
  const previewOfArticle = getPreviewOfArticle(slug);
  const contentOfArticle = getContent(slug);

  return {
    metadataBase: new URL(BASE_URL),
    title: previewOfArticle.title,
    description: contentOfArticle.slice(0, 100),
    keywords: previewOfArticle.tags,
    openGraph: {
      title: previewOfArticle.title,
      description: contentOfArticle.slice(0, 100),
      images: [
        {
          url: previewOfArticle.thumbnail.src ?? '/images/web/hero_background.png',
          width: 1200,
          height: 630,
        },
      ],
      siteName: 'HyoungMin Tech Blog',
      locale: 'ko',
      type: 'website',
      url: new URL(`${BASE_URL}/${slug}`),
    },
    twitter: {
      title: previewOfArticle.title,
      description: contentOfArticle.slice(0, 100),
      url: new URL(`${BASE_URL}/${slug}`),
      images: {
        url: previewOfArticle.thumbnail.src ?? '/images/web/hero_background.png',
        alt: `${previewOfArticle.title} Thumbnail`,
      },
    },
  };
};

const Article = ({ params: { slug } }: IArticlePageProps) => {
  const previewOfArticle = getPreviewOfArticle(slug);
  const contentOfArticle = getContent(slug);

  if (!previewOfArticle || !contentOfArticle) {
    notFound();
  }

  return (
    <section className='flex flex-col px-4 pt-10 pb-40 text-heading6 w-full'>
      <header className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <p className='self-center font-semibold underline underline-offset-2'>{previewOfArticle.category}</p>
          <ClientTimestamp className='self-end text-body1 opacity-50' date={new Date(previewOfArticle.createdAt)} />
        </div>
        <h1 className='text-heading3 tablet:text-heading1 font-extrabold'>{previewOfArticle.title}</h1>
        <ul className='flex gap-1 text-body2 flex-wrap text-primary-200/50'>
          {previewOfArticle.tags.map((tag) => (
            <span key={tag} className='after:content-["|"] after:ml-1 last:after:content-none last:after:ml-0'>
              {tag}
            </span>
          ))}
        </ul>
      </header>
      <div className='w-full h-0.5 bg-secondary-400 my-4' />
      <article className='prose max-w-[1024px] prose-primary w-full py-10'>
        <MDXRemote source={contentOfArticle} />
      </article>
    </section>
  );
};

export default Article;

export const generateStaticParams = () => {
  const articles = getArticles();
  return articles.map((article) => ({ slug: article.slug }));
};
