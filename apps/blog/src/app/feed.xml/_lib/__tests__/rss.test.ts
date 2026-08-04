import type { PostMeta } from "@hyoungmin/schema";
import { describe, expect, it } from "vitest";

import { buildRssFeed, formatRfc822 } from "../rss";

type FeedPost = {
  slug: string;
  meta: PostMeta;
};

const post = (
  slug: string,
  createdAt: string,
  overrides: Partial<PostMeta> = {},
): FeedPost => ({
  slug,
  meta: {
    title: slug,
    description: `${slug} description`,
    createdAt: new Date(createdAt),
    tags: [],
    draft: false,
    ...overrides,
  },
});

describe("RSS feed builder", () => {
  it("formats dates as RFC 822 in UTC", () => {
    expect(formatRfc822(new Date("2026-08-04T09:08:07.000Z"))).toBe(
      "Tue, 4 Aug 2026 09:08:07 +0000",
    );
  });

  it("publishes non-draft posts newest first and escapes XML content", () => {
    const rss = buildRssFeed({
      posts: [
        post("older", "2026-01-01T00:00:00.000Z"),
        post("newer", "2026-02-01T00:00:00.000Z", {
          title: "React & <Next.js>",
          description: 'Build "fast" & safely',
          tags: ["Web & App", "TypeScript"],
        }),
        post("draft", "2026-03-01T00:00:00.000Z", { draft: true }),
      ],
      siteName: "Hyoungmin Blog",
      siteUrl: "https://example.com",
      buildDate: new Date("2026-08-04T09:08:07.000Z"),
    });

    expect(rss).toContain("<title>React &amp; &lt;Next.js&gt;</title>");
    expect(rss).toContain(
      "<description>Build &quot;fast&quot; &amp; safely</description>",
    );
    expect(rss).toContain(
      "<category>Web &amp; App</category><category>TypeScript</category>",
    );
    expect(rss).not.toContain("draft description");
    expect(rss.indexOf("/newer")).toBeLessThan(rss.indexOf("/older"));
    expect(rss).toContain(
      "<lastBuildDate>Tue, 4 Aug 2026 09:08:07 +0000</lastBuildDate>",
    );
  });
});
