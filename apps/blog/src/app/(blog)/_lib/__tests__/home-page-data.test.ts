import type { PostMeta } from "@hyoungmin/schema";
import { describe, expect, it } from "vitest";

import { buildHomePageData } from "../home-page-data";

import type { PostSummary } from "@/shared/lib/taxonomies";

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
    tags: ["React"],
    draft: false,
    ...overrides,
  },
});

describe("buildHomePageData", () => {
  it("builds sorted, published home page sections from supplied data", () => {
    const result = buildHomePageData({
      posts: [
        post("older", "2026-01-01", {
          series: "architecture",
          tags: ["React", "Next.js"],
        }),
        post("newer", "2026-03-01", {
          category: "Backend",
          series: "architecture",
          tags: ["React"],
        }),
        post("draft", "2026-04-01", { draft: true }),
      ],
      seriesRegistry: {
        architecture: { title: "Architecture", color: "#112233" },
      },
    });

    expect(result.latestPosts.map(({ slug }) => slug)).toEqual([
      "newer",
      "older",
    ]);
    expect(result.latestPosts[0]?.seriesColor).toBe("#112233");
    expect(result.topSeries[0]).toMatchObject({
      id: "architecture",
      title: "Architecture",
      count: 2,
    });
    expect(result.topCategories.map(({ name }) => name)).toEqual([
      "Backend",
      "Frontend",
    ]);
    expect(result.topTags).toEqual([
      { name: "React", count: 2 },
      { name: "Next.js", count: 1 },
    ]);
  });
});
