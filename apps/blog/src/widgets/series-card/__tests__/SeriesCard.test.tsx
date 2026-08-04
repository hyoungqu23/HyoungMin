import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SeriesCard } from "../SeriesCard";

import type { SeriesWithPostsPreview } from "@/shared/lib/taxonomies";

const series: SeriesWithPostsPreview = {
  id: "frontend architecture",
  title: "Frontend Architecture",
  description: "Architecture decisions that survive change",
  count: 1,
  latestAt: new Date("2026-08-04T00:00:00.000Z"),
  previewPosts: [
    {
      slug: "feature-sliced-design",
      firstImage: null,
      meta: {
        title: "Feature-Sliced Design",
        description: "Structuring frontend applications",
        createdAt: new Date("2026-08-04T00:00:00.000Z"),
        tags: ["Architecture"],
        draft: false,
      },
    },
  ],
};

const render = (variant: "catalog" | "featured") => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <SeriesCard series={series} color="#112233" variant={variant} />,
  );
  return container;
};

describe("SeriesCard", () => {
  it("links to the encoded series route and exposes preview content", () => {
    const container = render("catalog");

    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "/series/frontend%20architecture",
    );
    expect(container.textContent).toContain("Frontend Architecture");
    expect(container.textContent).toContain("Feature-Sliced Design");
    expect(container.textContent).toContain("1개");
  });

  it("uses catalog heading semantics without the latest-post label", () => {
    const container = render("catalog");

    expect(container.querySelector("h2")?.textContent).toBe(
      "Frontend Architecture",
    );
    expect(container.textContent).not.toContain("최신 글:");
  });

  it("uses featured heading semantics and displays the latest-post label", () => {
    const container = render("featured");

    expect(container.querySelector("h3")?.textContent).toBe(
      "Frontend Architecture",
    );
    expect(container.textContent).toContain("최신 글:");
  });
});
