import { articleService, articlesService } from '@entities';
import { BASE_URL, LINKS, NAVIGATION_ITEMS } from '@shared';
import { notFound } from 'next/navigation';

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
    <section className='flex flex-col px-4 pt-10 pb-40 items-center'>
      {/* <>
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            width={400}
            height={300}
            className='object-contain'
          />
        ) : null}
      </>
      <h1 className='text-display2 font-extrabold'>{article.title}</h1>
      <p>{article.description}</p>
      <p>{new Date(article.createdAt).toLocaleDateString()}</p>
      <p>{article.category}</p>

      <ul className='flex gap-1'>
        {article.tags.map((tag) => (
          <span key={tag} style={{ color: getRandomColor() }}>
            {tag}
          </span>
        ))}
      </ul>
      <div className='w-full h-0.5 bg-primary-500 my-4' />
      <article className='prose prose-primary max-w-3xl'>
        <MDXContent />
      </article> */}
    </section>
  );
};

export default ArticlePage;

export const generateStaticParams = () => {
  return articlesService.get().map((article) => ({ slug: article.slug }));
};
