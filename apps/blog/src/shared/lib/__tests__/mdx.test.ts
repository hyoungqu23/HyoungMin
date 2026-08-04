import { describe, expect, it } from "vitest";

import { compilePostMDX } from "../mdx";

const source = `---
title: Test post
createdAt: 2026-08-04
description: MDX pipeline integration test
category: Frontend
tags:
  - Next.js
  - MDX
draft: false
---

# Document title

## Architecture overview

![Cover](/images/cover.png)

### Implementation details

The article body.
`;

describe("compilePostMDX", () => {
  it("compiles validated metadata, table-of-contents headings, and the cover image", async () => {
    const result = await compilePostMDX(source, {});

    expect(result.meta).toEqual({
      title: "Test post",
      createdAt: new Date("2026-08-04T00:00:00.000Z"),
      description: "MDX pipeline integration test",
      category: "Frontend",
      tags: ["Next.js", "MDX"],
      draft: false,
    });
    expect(result.headings).toEqual([
      {
        id: "architecture-overview",
        text: "Architecture overview",
        level: 2,
      },
      {
        id: "implementation-details",
        text: "Implementation details",
        level: 3,
      },
    ]);
    expect(result.firstImage).toBe("/images/cover.png");
    expect(result.content).toBeTruthy();
  });
});
