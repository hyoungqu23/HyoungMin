import type { PostMeta } from "@hyoungmin/schema";
import { describe, expect, it } from "vitest";

import { rankRelatedPosts, type PostWithSlug } from "../related-posts";

const post = (
  slug: string,
  tags: string[],
  createdAt: string,
  overrides: Partial<PostMeta> = {},
): PostWithSlug => ({
  slug,
  meta: {
    title: slug,
    description: `${slug} description`,
    createdAt: new Date(createdAt),
    tags,
    draft: false,
    ...overrides,
  },
});

describe("rankRelatedPosts", () => {
  const posts = [
    post("current", ["React", "Next.js"], "2026-01-01"),
    post("most-similar", ["React", "Next.js", "TypeScript"], "2025-01-01"),
    post("newer-tie", ["React"], "2026-03-01"),
    post("older-tie", ["Next.js"], "2026-02-01"),
    post("unrelated", ["CSS"], "2026-04-01"),
    post("draft", ["React", "Next.js"], "2026-05-01", { draft: true }),
  ];

  it("ranks by shared tags and uses recency as the tie breaker", () => {
    expect(rankRelatedPosts(posts, "current").map(({ slug }) => slug)).toEqual([
      "most-similar",
      "newer-tie",
      "older-tie",
    ]);
  });

  it("excludes the current post, drafts, and posts without shared tags", () => {
    const result = rankRelatedPosts(posts, "current");

    expect(result.map(({ slug }) => slug)).not.toContain("current");
    expect(result.map(({ slug }) => slug)).not.toContain("draft");
    expect(result.map(({ slug }) => slug)).not.toContain("unrelated");
  });

  it("applies the requested limit without mutating the input", () => {
    const originalOrder = posts.map(({ slug }) => slug);

    expect(rankRelatedPosts(posts, "current", 2)).toHaveLength(2);
    expect(posts.map(({ slug }) => slug)).toEqual(originalOrder);
  });

  it("returns an empty list when the current post is unavailable", () => {
    expect(rankRelatedPosts(posts, "missing")).toEqual([]);
  });
});
