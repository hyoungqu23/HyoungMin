import type { readFile } from "fs/promises";

import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockReadFile } = vi.hoisted(() => ({
  mockReadFile:
    vi.fn<
      (...args: Parameters<typeof readFile>) => ReturnType<typeof readFile>
    >(),
}));

vi.mock("fs/promises", () => ({
  default: {
    readFile: mockReadFile,
  },
  readFile: mockReadFile,
}));

describe("series registry", () => {
  beforeEach(() => {
    vi.resetModules();
    mockReadFile.mockReset();
  });

  it("loads validated series entries from the registry file", async () => {
    mockReadFile.mockResolvedValue(
      JSON.stringify({
        architecture: {
          title: "Architecture",
          description: "Designing maintainable systems",
          color: "#112233",
        },
      }),
    );
    const { getSeriesEntry, getSeriesRegistry } = await import("../series");

    await expect(getSeriesRegistry()).resolves.toEqual({
      architecture: {
        title: "Architecture",
        description: "Designing maintainable systems",
        color: "#112233",
      },
    });
    await expect(getSeriesEntry("architecture")).resolves.toEqual({
      id: "architecture",
      title: "Architecture",
      description: "Designing maintainable systems",
      color: "#112233",
    });
  });

  it("returns null when the requested series does not exist", async () => {
    mockReadFile.mockResolvedValue("{}");
    const { getSeriesEntry } = await import("../series");

    await expect(getSeriesEntry("missing")).resolves.toBeNull();
  });

  it("falls back to an empty registry when the file cannot be read", async () => {
    mockReadFile.mockRejectedValue(new Error("ENOENT"));
    const { getSeriesRegistry } = await import("../series");

    await expect(getSeriesRegistry()).resolves.toEqual({});
  });

  it("rejects malformed registry entries by returning an empty registry", async () => {
    mockReadFile.mockResolvedValue(
      JSON.stringify({
        architecture: { title: "Architecture", color: "blue" },
      }),
    );
    const { getSeriesRegistry } = await import("../series");

    await expect(getSeriesRegistry()).resolves.toEqual({});
  });
});
