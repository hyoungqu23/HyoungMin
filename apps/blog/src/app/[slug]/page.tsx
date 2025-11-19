import type { PostMeta } from "@hyoungmin/schema";
import { Prose } from "@hyoungmin/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ShareButton from "@/features/share/ShareButton";
import { listSlugs, readArticle } from "@/shared/lib/fs";
import { compilePostMDX } from "@/shared/lib/mdx";
import { mdxComponents } from "@/shared/lib/mdx-components";
import { calculateReadingTime } from "@/shared/lib/reading-time";
import { getRelatedPosts } from "@/shared/lib/related-posts";
import ReadingProgress from "@/widgets/reading-progress/ReadingProgress";
import { RelatedPosts } from "@/widgets/related-posts/RelatedPosts";
import TableOfContents from "@/widgets/toc/TableOfContents";
import Script from "next/script";

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
      <Script
        strategy="beforeInteractive"
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />

      <div className="container px-4 h-full flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
        {/* 사이드바 (데스크톱만 표시) */}
        <aside className="hidden sticky top-24 md:flex w-72 shrink-0 h-full flex-col gap-12">
          <TableOfContents headings={headings} />
          <RelatedPosts relatedPosts={relatedPosts} />
        </aside>

        {/* 본문 */}
        <article className="relative flex-1 min-w-0 max-w-screen overflow-x-auto md:border-l-2 md:border-primary-200 px-4 md:px-12">
          <Prose>
            <h1>{meta.title}</h1>

            <p className="text-lg text-primary-700">{meta.description}</p>
            <div className="flex flex-wrap items-center gap-4 my-4 text-sm text-primary-600">
              <time>
                {meta.createdAt.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>|</span>
              <span>{readingTime}분 읽기</span>
              <ShareButton url={`${siteUrl}/${slug}`} />
              {meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs border border-primary-200! bg-primary-50! rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {content}
          </Prose>
        </article>

        {/* 모바일 관련 포스트 */}
        <section className="mt-16 pt-8 border-t border-primary-200 lg:hidden">
          <RelatedPosts relatedPosts={relatedPosts} />
        </section>
      </div>
    </>
  );
};

export default PostPage;
