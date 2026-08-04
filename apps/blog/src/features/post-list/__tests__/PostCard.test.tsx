import type { PostMeta } from "@hyoungmin/schema";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PostCard } from "../PostCard";

const baseMeta: PostMeta = {
  title: "Architecture post",
  description: "A maintainable frontend architecture",
  createdAt: new Date("2026-08-04T00:00:00.000Z"),
  tags: ["Architecture"],
  draft: false,
};

const render = (meta: PostMeta, firstImage?: string | null) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <PostCard slug="architecture-post" meta={meta} firstImage={firstImage} />,
  );
  return container;
};

describe("PostCard", () => {
  it("prefers and normalizes the explicit cover image", () => {
    const container = render(
      { ...baseMeta, cover: "images/cover.png" },
      "/images/from-content.png",
    );
    const image = container.querySelector("img");

    expect(image?.getAttribute("alt")).toBe("Architecture post");
    expect(decodeURIComponent(image?.getAttribute("src") ?? "")).toContain(
      "/images/cover.png",
    );
    expect(decodeURIComponent(image?.getAttribute("src") ?? "")).not.toContain(
      "/images/from-content.png",
    );
  });

  it("uses the first content image when no cover is provided", () => {
    const image = render(baseMeta, "images/from-content.png").querySelector(
      "img",
    );

    expect(decodeURIComponent(image?.getAttribute("src") ?? "")).toContain(
      "/images/from-content.png",
    );
  });

  it("renders a generated thumbnail when the post has no image", () => {
    const container = render(baseMeta);

    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("Architecture post");
  });
});
