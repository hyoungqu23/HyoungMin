import type { PostMeta } from "@hyoungmin/schema";
import { describe, expect, it } from "vitest";

import {
  buildBlogPostingJsonLd,
  buildNotFoundMetadata,
  buildPostMetadata,
} from "../post-seo";

const meta: PostMeta = {
  title: "Test post",
  description: "Test description",
  createdAt: new Date("2026-08-04T00:00:00.000Z"),
  category: "Frontend",
  tags: ["Next.js", "Testing"],
  draft: false,
};

const input = {
  meta,
  siteUrl: "https://example.com",
  slug: "test-post",
};

describe("post SEO builders", () => {
  it("builds article metadata from post data", () => {
    const metadata = buildPostMetadata(input);

    expect(metadata).toMatchObject({
      title: "Test post",
      description: "Test description",
      keywords: ["Next.js", "Testing"],
      alternates: { canonical: "https://example.com/test-post" },
      openGraph: {
        type: "article",
        publishedTime: "2026-08-04T00:00:00.000Z",
        tags: ["Next.js", "Testing"],
      },
      twitter: {
        card: "summary_large_image",
      },
    });
  });

  it("omits empty keyword fields", () => {
    const metadata = buildPostMetadata({
      ...input,
      meta: { ...meta, tags: [] },
    });

    expect(metadata.keywords).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({ tags: undefined });
  });

  it("builds BlogPosting structured data", () => {
    expect(buildBlogPostingJsonLd(input)).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Test post",
      description: "Test description",
      image: "https://example.com/images/logos/logo-text.png",
      datePublished: "2026-08-04T00:00:00.000Z",
      dateModified: "2026-08-04T00:00:00.000Z",
      author: { "@type": "Person", name: "Blog" },
      publisher: {
        "@type": "Organization",
        name: "Blog",
        logo: {
          "@type": "ImageObject",
          url: "https://example.com/images/logos/logo-text.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://example.com/test-post",
      },
      keywords: "Next.js, Testing",
    });
  });

  it("builds non-indexable metadata for unavailable posts", () => {
    expect(buildNotFoundMetadata()).toEqual({
      title: "Not Found",
      robots: { index: false, follow: false },
    });
  });
});
