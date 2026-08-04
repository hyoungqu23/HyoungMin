import type { PostMeta } from "@hyoungmin/schema";
import type { Metadata } from "next";

const SITE_NAME = "Blog";

type PostSeoInput = {
  meta: PostMeta;
  siteUrl: string;
  slug: string;
};

export const buildNotFoundMetadata = (): Metadata => ({
  title: "Not Found",
  robots: {
    index: false,
    follow: false,
  },
});

export const buildPostMetadata = ({
  meta,
  siteUrl,
  slug,
}: PostSeoInput): Metadata => {
  const { title, description } = meta;
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
      siteName: SITE_NAME,
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
      authors: [SITE_NAME],
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

export const buildBlogPostingJsonLd = ({
  meta,
  siteUrl,
  slug,
}: PostSeoInput) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: meta.title,
  description: meta.description,
  image: `${siteUrl}/images/logos/logo-text.png`,
  datePublished: meta.createdAt.toISOString(),
  dateModified: meta.createdAt.toISOString(),
  author: {
    "@type": "Person",
    name: SITE_NAME,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
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
});
