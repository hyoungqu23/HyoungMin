import { describe, expect, it } from "vitest";

import { extractFirstImage } from "../extract-first-image";

describe("extractFirstImage", () => {
  it("returns the first image in document order across HTML and Markdown", () => {
    const source = `
<img src="/images/first.png" alt="first" />

![second](/images/second.png)
`;

    expect(extractFirstImage(source)).toBe("/images/first.png");
  });

  it("ignores image examples inside fenced code blocks", () => {
    const source = `
\`\`\`mdx
![example](/images/example.png)
\`\`\`

![thumbnail](/images/thumbnail.png)
`;

    expect(extractFirstImage(source)).toBe("/images/thumbnail.png");
  });

  it("supports single-quoted HTML image sources", () => {
    expect(extractFirstImage("<img alt='cover' src='/cover.webp'>")).toBe(
      "/cover.webp",
    );
  });

  it("returns null when the document has no image", () => {
    expect(extractFirstImage("# Post without an image")).toBeNull();
  });
});
