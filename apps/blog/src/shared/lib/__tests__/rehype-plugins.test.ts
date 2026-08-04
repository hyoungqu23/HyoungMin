import type { Root } from "hast";
import { describe, expect, it } from "vitest";

import { rehypeExtractFirstImage } from "../extract-first-image";
import { rehypeExtractHeadings } from "../rehype-extract-headings";

describe("MDX extraction plugins", () => {
  it("extracts h2 and h3 headings with nested text in document order", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "h1",
          properties: { id: "ignored" },
          children: [{ type: "text", value: "Ignored title" }],
        },
        {
          type: "element",
          tagName: "h2",
          properties: { id: "architecture" },
          children: [
            { type: "text", value: "Architecture " },
            {
              type: "element",
              tagName: "code",
              properties: {},
              children: [{ type: "text", value: "overview" }],
            },
          ],
        },
        {
          type: "element",
          tagName: "h3",
          properties: { id: "details" },
          children: [
            {
              type: "element",
              tagName: "a",
              properties: { href: "#details" },
              children: [{ type: "text", value: "Implementation details" }],
            },
          ],
        },
        {
          type: "element",
          tagName: "h2",
          properties: {},
          children: [{ type: "text", value: "Missing id" }],
        },
      ],
    };
    const headings: Array<{ id: string; text: string; level: number }> = [];

    rehypeExtractHeadings({ headings })(tree);

    expect(headings).toEqual([
      { id: "architecture", text: "Architecture overview", level: 2 },
      { id: "details", text: "Implementation details", level: 3 },
    ]);
  });

  it("captures only the first valid image source", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "img",
          properties: { src: "/first.png" },
          children: [],
        },
        {
          type: "element",
          tagName: "img",
          properties: { src: "/second.png" },
          children: [],
        },
      ],
    };
    const options = { firstImage: null as string | null };

    rehypeExtractFirstImage(options)(tree);

    expect(options.firstImage).toBe("/first.png");
  });

  it("preserves an image supplied by an earlier pipeline stage", () => {
    const tree: Root = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "img",
          properties: { src: "/from-tree.png" },
          children: [],
        },
      ],
    };
    const options = { firstImage: "/already-selected.png" };

    rehypeExtractFirstImage(options)(tree);

    expect(options.firstImage).toBe("/already-selected.png");
  });
});
