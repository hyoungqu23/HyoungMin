import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { EditorialArticle } from "../_components/EditorialArticle";

import {
  buildBlogPostingJsonLd,
  buildNotFoundMetadata,
  buildPostMetadata,
} from "./_lib/post-seo";

import { siteUrl } from "@/shared/config/site";
import { listSlugs, readArticle } from "@/shared/lib/fs";
import { compilePostMDX } from "@/shared/lib/mdx";
import { mdxComponents } from "@/shared/lib/mdx-components";
import { getPostSummary } from "@/shared/lib/posts";
import { calculateReadingTime } from "@/shared/lib/reading-time";
import { getRelatedPosts } from "@/shared/lib/related-posts";
import { getSeriesEntry } from "@/shared/lib/series";

export const generateStaticParams = async () => {
  const slugs = await listSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const summary = await getPostSummary(slug).catch(() => null);
  const meta = summary?.meta;

  if (!meta || meta.draft) {
    return buildNotFoundMetadata();
  }

  return buildPostMetadata({ meta, siteUrl, slug });
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

  if (meta.draft) {
    notFound();
  }

  // 읽기 시간 계산
  const readingTime = calculateReadingTime(source);

  // 관련 포스트 가져오기
  const relatedPosts = await getRelatedPosts(slug, 5);
  const seriesEntry = meta.series ? await getSeriesEntry(meta.series) : null;

  const jsonLd = buildBlogPostingJsonLd({ meta, siteUrl, slug });

  return (
    <>
      <Script
        strategy="beforeInteractive"
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EditorialArticle
        content={content}
        headings={headings}
        meta={meta}
        readingTime={readingTime}
        relatedPosts={relatedPosts}
        seriesEntry={seriesEntry}
        slug={slug}
      />
    </>
  );
};

export default PostPage;
