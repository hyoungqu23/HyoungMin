import { articleService, articlesService } from '@entities';
import { BASE_URL, LINKS, NAVIGATION_ITEMS } from '@shared';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface IArticlePageProps {
  params: { slug: string };
}

export const generateMetadata = ({ params: { slug } }: IArticlePageProps) => {
  const previewOfArticle = articleService.getPreview(slug);
  const contentOfArticle = articleService.getContent(slug);

  return {
    metadataBase: new URL(BASE_URL),
    title: previewOfArticle.title,
    description: contentOfArticle.slice(0, 100),
    keywords: previewOfArticle.tags,
    authors: [{ name: 'HyoungMin', url: LINKS.GITHUB.href }],
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: previewOfArticle.title,
      description: contentOfArticle.slice(0, 100),
      images: [
        {
          url:
            previewOfArticle.thumbnail.src ?? '/images/web/hero_background.png',
          width: 1200,
          height: 630,
        },
      ],
      siteName: 'HyoungMin Tech Blog',
      locale: 'ko',
      type: 'website',
      url: new URL(`${BASE_URL}/${NAVIGATION_ITEMS.ARTICLES.id}/${slug}`),
    },
    twitter: {
      title: previewOfArticle.title,
      description: contentOfArticle.slice(0, 100),
      url: new URL(`${BASE_URL}/${NAVIGATION_ITEMS.ARTICLES.id}/${slug}`),
      images: {
        url:
          previewOfArticle.thumbnail.src ?? '/images/web/hero_background.png',
        alt: `${previewOfArticle.title} Thumbnail`,
      },
    },
  };
};

const ArticlePage = ({ params: { slug } }: IArticlePageProps) => {
  const previewOfArticle = articleService.getPreview(slug);
  const contentOfArticle = articleService.getContent(slug);

  if (!previewOfArticle || !contentOfArticle) {
    notFound();
  }

  return (
    <section className='flex flex-col px-4 pt-10 pb-40 text-heading6 w-full'>
      <header className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <p className='self-center font-semibold underline underline-offset-2'>
            {previewOfArticle.category}
          </p>
          <p className='self-end text-body1 opacity-50'>
            {new Date(previewOfArticle.createdAt).toLocaleDateString()}
          </p>
        </div>
        <h1 className='text-heading3 tablet:text-heading1 font-extrabold'>
          {previewOfArticle.title}
        </h1>
        <ul className='flex gap-1 text-body2 flex-wrap text-primary-200/50'>
          {previewOfArticle.tags.map((tag) => (
            <span
              key={tag}
              className='after:content-["|"] after:ml-1 last:after:content-none last:after:ml-0'
            >
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

export default ArticlePage;

export const generateStaticParams = () => {
  return articlesService.get().map((article) => ({ slug: article.slug }));
};
