import { compilePostMDX } from '@/shared/lib/mdx';
import { mdxComponents } from '@/shared/lib/mdx-components';
import { readArticle, listSlugs } from '@/shared/lib/fs';
import { Prose } from '@hyoungmin/ui';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { PostMeta } from '@hyoungmin/schema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const siteName = 'Blog';

export const generateStaticParams = async () => {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
};

const getPostMetadata = async (slug: string): Promise<PostMeta | null> => {
  try {
    const source = await readArticle(slug);
    const { meta } = await compilePostMDX(source, {});
    return meta;
  } catch {
    return null;
  }
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const meta = await getPostMetadata(slug);

  if (!meta || meta.draft) {
    return {
      title: 'Not Found',
    };
  }

  const title = meta.title;
  const description = meta.summary;
  const url = `${siteUrl}/${slug}`;
  const image = meta.cover
    ? meta.cover.startsWith('http')
      ? meta.cover
      : `${siteUrl}${meta.cover}`
    : `${siteUrl}/og-image.png`;

  return {
    title,
    description,
    keywords: meta.tags.length > 0 ? meta.tags : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      siteName,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: meta.date.toISOString(),
      modifiedTime: meta.date.toISOString(),
      authors: [siteName],
      tags: meta.tags.length > 0 ? meta.tags : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
};

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  let source: string;
  try {
    source = await readArticle(slug);
  } catch {
    notFound();
  }

  const { content, meta } = await compilePostMDX(source, mdxComponents);

  // JSON-LD 구조화 데이터 (SEO + GEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.summary,
    image: meta.cover
      ? meta.cover.startsWith('http')
        ? meta.cover
        : `${siteUrl}${meta.cover}`
      : `${siteUrl}/og-image.png`,
    datePublished: meta.date.toISOString(),
    dateModified: meta.date.toISOString(),
    author: {
      '@type': 'Person',
      name: siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${slug}`,
    },
    keywords: meta.tags.length > 0 ? meta.tags.join(', ') : undefined,
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id='main'>
        <Prose>
          <h1>{meta.title}</h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>{meta.summary}</p>
          {meta.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 my-4'>
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className='px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <time className='text-sm text-gray-500 dark:text-gray-500'>
            {meta.date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {content}
        </Prose>
      </main>
    </>
  );
};

export default PostPage;

