import type { PostMeta } from "@hyoungmin/schema";
import { describe, expect, it } from "vitest";

import {
  selectPublishedPosts,
  selectTopCategoriesByLatestPost,
  sortPostsInSeries,
  summarizeCategories,
  summarizeSeriesWithPostsPreview,
  summarizeTags,
  type PostSummary,
} from "../taxonomies";

const post = (
  slug: string,
  createdAt: string,
  overrides: Partial<PostMeta> = {},
): PostSummary => ({
  slug,
  firstImage: null,
  meta: {
    title: slug,
    description: `${slug} description`,
    createdAt: new Date(createdAt),
    category: "Frontend",
    tags: [],
    draft: false,
    ...overrides,
  },
});

describe("taxonomy selectors", () => {
  const posts = [
    post("older", "2026-01-01", {
      tags: ["React", "Next.js"],
      series: "architecture",
      seriesOrder: 2,
    }),
    post("newer", "2026-03-01", {
      category: "Backend",
      tags: ["Next.js"],
      series: "architecture",
      seriesOrder: 1,
    }),
    post("draft", "2026-04-01", { draft: true, tags: ["React"] }),
  ];

  it("selects published posts newest first without mutating the input", () => {
    expect(selectPublishedPosts(posts).map(({ slug }) => slug)).toEqual([
      "newer",
      "older",
    ]);
    expect(posts.map(({ slug }) => slug)).toEqual(["older", "newer", "draft"]);
  });

  it("summarizes categories and tags from supplied posts", () => {
    const publishedPosts = selectPublishedPosts(posts);

    expect(summarizeCategories(publishedPosts)).toEqual([
      { name: "Backend", count: 1 },
      { name: "Frontend", count: 1 },
    ]);
    expect(summarizeTags(publishedPosts)).toEqual([
      { name: "Next.js", count: 2 },
      { name: "React", count: 1 },
    ]);
  });

  it("sorts series posts by explicit order before publication date", () => {
    expect(
      sortPostsInSeries(posts.slice(0, 2)).map(({ slug }) => slug),
    ).toEqual(["newer", "older"]);
  });

  it("builds series previews and resolves registry content", () => {
    const result = summarizeSeriesWithPostsPreview(
      selectPublishedPosts(posts),
      {
        architecture: {
          title: "Architecture",
          description: "Architecture series",
          color: "#112233",
        },
      },
      1,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "architecture",
      title: "Architecture",
      count: 2,
      latestAt: new Date("2026-03-01"),
    });
    expect(result[0]?.previewPosts.map(({ slug }) => slug)).toEqual(["newer"]);
  });

  it("selects categories by their latest post", () => {
    expect(selectTopCategoriesByLatestPost(posts, 1)).toEqual([
      {
        name: "Frontend",
        count: 2,
        latestAt: new Date("2026-04-01"),
      },
    ]);
  });
});
