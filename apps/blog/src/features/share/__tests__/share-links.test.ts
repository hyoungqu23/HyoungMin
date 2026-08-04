import { describe, expect, it } from "vitest";

import { buildAiContentUrl, buildSocialShareUrl } from "../share-links";

const contentUrl = "https://example.com/post?id=1";

describe("share link builders", () => {
  it("builds an X intent URL with encoded content URL and title", () => {
    expect(buildSocialShareUrl("x", contentUrl, "Test & Learn")).toBe(
      "https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1&text=Test%20%26%20Learn",
    );
  });

  it.each([
    [
      "linkedin" as const,
      "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1",
    ],
    [
      "facebook" as const,
      "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1",
    ],
    [
      "reddit" as const,
      "https://www.reddit.com/submit?url=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1&title=Test%20%26%20Learn",
    ],
    [
      "threads" as const,
      "https://www.threads.net/intent/post?text=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1",
    ],
  ])("builds the %s share URL", (platform, expected) => {
    expect(buildSocialShareUrl(platform, contentUrl, "Test & Learn")).toBe(
      expected,
    );
  });

  it.each([
    [
      "chatgpt" as const,
      "https://chatgpt.com/?prompt=Read%20https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1%20summarize%20and%20answer%20questions%20about%20the%20content",
    ],
    [
      "claude" as const,
      "https://claude.ai/new?q=Read%20https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1%20summarize%20and%20answer%20questions%20about%20the%20content",
    ],
    [
      "grok" as const,
      "https://grok.com?q=Read%20https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1%20summarize%20and%20answer%20questions%20about%20the%20content",
    ],
  ])("builds the %s content URL", (provider, expected) => {
    expect(buildAiContentUrl(provider, contentUrl)).toBe(expected);
  });
});
