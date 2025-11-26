import type { readdir, readFile } from "fs/promises";

import { describe, it, expect, vi, beforeEach } from "vitest";

import { listSlugs, readArticle } from "../fs";

const { mockReaddir, mockReadFile } = vi.hoisted(() => ({
  mockReaddir:
    vi.fn<
      (...args: Parameters<typeof readdir>) => ReturnType<typeof readdir>
    >(),
  mockReadFile:
    vi.fn<
      (...args: Parameters<typeof readFile>) => ReturnType<typeof readFile>
    >(),
}));

vi.mock("fs/promises", () => ({
  default: {
    readdir: mockReaddir,
    readFile: mockReadFile,
  },
  readdir: mockReaddir,
  readFile: mockReadFile,
}));

vi.mock("process", () => ({
  cwd: vi.fn(() => "/test"),
}));

describe("fs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listSlugs", () => {
    it("should return slugs from .mdx files", async () => {
      const mockFiles = ["post1.mdx", "post2.mdx", "readme.txt", "post3.mdx"];
      mockReaddir.mockResolvedValue(
        mockFiles as unknown as Awaited<ReturnType<typeof readdir>>,
      );

      const result = await listSlugs();

      expect(result).toEqual(["post1", "post2", "post3"]);
    });

    it("should return empty array when no .mdx files exist", async () => {
      const mockFiles = ["readme.txt", "config.json"];
      mockReaddir.mockResolvedValue(
        mockFiles as unknown as Awaited<ReturnType<typeof readdir>>,
      );

      const result = await listSlugs();

      expect(result).toEqual([]);
    });
  });

  describe("readArticle", () => {
    it("should read and return article content", async () => {
      const mockContent = "---\ntitle: Test\n---\n\nContent";
      mockReadFile.mockResolvedValue(
        mockContent as Awaited<ReturnType<typeof readFile>>,
      );

      const result = await readArticle("test-slug");

      expect(result).toBe(mockContent);
      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining("contents/posts/test-slug.mdx"),
        "utf-8",
      );
    });
  });
});
