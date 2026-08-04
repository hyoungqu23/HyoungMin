import { beforeAll, describe, expect, it } from "vitest";

const BASE = "https://example.com";

describe("sitemap", () => {
  beforeAll(() => {
    // siteUrl 모듈이 로드 시점에 env를 요구하므로 dynamic import 전에 주입한다
    process.env.NEXT_PUBLIC_SITE_URL = BASE;
  });

  it("includes exactly one /portfolio entry", async () => {
    const { default: sitemap } = await import("../sitemap");
    const entries = await sitemap();
    const portfolioEntries = entries.filter(
      (entry) => entry.url === `${BASE}/portfolio`,
    );

    expect(portfolioEntries).toHaveLength(1);
    expect(portfolioEntries[0]?.priority).toBe(0.9);
  });

  it("keeps the existing static routes", async () => {
    const { default: sitemap } = await import("../sitemap");
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(BASE);
    expect(urls).toContain(`${BASE}/posts`);
    expect(urls).toContain(`${BASE}/categories`);
    expect(urls).toContain(`${BASE}/tags`);
    expect(urls).toContain(`${BASE}/series`);
  });
});
