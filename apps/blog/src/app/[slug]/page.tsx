import type { PostMeta } from "@hyoungmin/schema";
import { Prose } from "@hyoungmin/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { TagList } from "@/features/post-list/TagList";
import ShareButton from "@/features/share/ShareButton";
import { listSlugs, readArticle } from "@/shared/lib/fs";
import { compilePostMDX } from "@/shared/lib/mdx";
import { mdxComponents } from "@/shared/lib/mdx-components";
import { calculateReadingTime } from "@/shared/lib/reading-time";
import { getRelatedPosts } from "@/shared/lib/related-posts";
import ReadingProgress from "@/widgets/reading-progress/ReadingProgress";
import { RelatedPosts } from "@/widgets/related-posts/RelatedPosts";
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
  const image = `${siteUrl}/images/logos/logo-background.png`;

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
    image: `${siteUrl}/images/logos/logo-text.png`,
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
        url: `${siteUrl}/images/logos/logo-text.png`,
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

      <div className="container px-4 h-full flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
        {/* 사이드바 (데스크톱만 표시) */}
        <aside className="hidden sticky top-24 md:flex w-72 shrink-0 h-full flex-col gap-6 md:gap-8">
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
              <TagList tags={meta.tags} />
            </div>
            {content}
          </Prose>
        </article>

        {/* 모바일 관련 포스트 */}
        <div className="md:hidden">
          <RelatedPosts relatedPosts={relatedPosts} />
        </div>
      </div>
    </>
  );
};

export default PostPage;
