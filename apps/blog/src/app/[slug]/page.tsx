import type { PostMeta } from "@hyoungmin/schema";
import { Prose } from "@hyoungmin/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ShareButton from "@/features/share/ShareButton";
import { listSlugs, readArticle } from "@/shared/lib/fs";
import { compilePostMDX } from "@/shared/lib/mdx";
import { mdxComponents } from "@/shared/lib/mdx-components";
import { calculateReadingTime } from "@/shared/lib/reading-time";
import { getRelatedPosts } from "@/shared/lib/related-posts";
import ReadingProgress from "@/widgets/reading-progress/ReadingProgress";
import TableOfContents from "@/widgets/toc/TableOfContents";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const siteName = "Blog";

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
      title: "Not Found",
    };
  }

  const title = meta.title;
  const description = meta.description;
  const url = `${siteUrl}/${slug}`;
  const image = meta.cover
    ? meta.cover.startsWith("http")
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
      type: "article",
      locale: "ko_KR",
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
      publishedTime: meta.createdAt.toISOString(),
      modifiedTime: meta.createdAt.toISOString(),
      authors: [siteName],
      tags: meta.tags.length > 0 ? meta.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
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

  const { content, meta, headings } = await compilePostMDX(
    source,
    mdxComponents,
  );

  // 읽기 시간 계산
  const readingTime = calculateReadingTime(source);

  // 관련 포스트 가져오기
  const relatedPosts = await getRelatedPosts(slug, 5);

  // JSON-LD 구조화 데이터 (SEO + GEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    image: meta.cover
      ? meta.cover.startsWith("http")
        ? meta.cover
        : `${siteUrl}${meta.cover}`
      : `${siteUrl}/og-image.png`,
    datePublished: meta.createdAt.toISOString(),
    dateModified: meta.createdAt.toISOString(),
    author: {
      "@type": "Person",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${slug}`,
    },
    keywords: meta.tags.length > 0 ? meta.tags.join(", ") : undefined,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          {/* TOC 사이드바 (데스크톱만 표시) */}
          <TableOfContents headings={headings} />

          {/* 본문 */}
          <article className="flex-1 min-w-0 lg:max-w-3xl lg:mx-auto">
            <Prose>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="flex-1">{meta.title}</h1>
                {/* 공유하기 버튼 (포스트 페이지에서만 표시) */}
                <div className="shrink-0">
                  <ShareButton
                    url={`${siteUrl}/${slug}`}
                    title={meta.title}
                    description={meta.description}
                  />
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {meta.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 my-4 text-sm text-gray-500 dark:text-gray-500">
                <time>
                  {meta.createdAt.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{readingTime}분 읽기</span>
                {meta.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex flex-wrap gap-2">
                      {meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {content}
            </Prose>
          </article>
        </div>

        {/* 관련 포스트 섹션 */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">관련 포스트</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/${relatedPost.slug}`}
                  className="group block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {relatedPost.meta.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {relatedPost.meta.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-gray-500 dark:text-gray-500">
                      {relatedPost.meta.createdAt.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {relatedPost.meta.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {relatedPost.meta.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default PostPage;
