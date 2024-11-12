import { articleService, articlesService } from '@entities';
import { ArticlePage } from '@pages';
import { BASE_URL, NAVIGATION_ITEMS } from '@shared';
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

const Article = ({ params: { slug } }: IArticlePageProps) => {
  const previewOfArticle = articleService.getPreview(slug);
  const contentOfArticle = articleService.getContent(slug);

  if (!previewOfArticle || !contentOfArticle) {
    notFound();
  }

  return <ArticlePage preview={previewOfArticle} content={contentOfArticle} />;
};

export default Article;

export const generateStaticParams = () => {
  return articlesService.get().map((article) => ({ slug: article.slug }));
};
