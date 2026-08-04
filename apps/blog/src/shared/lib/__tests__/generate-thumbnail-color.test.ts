import { describe, expect, it } from "vitest";

import {
  generateThumbnailColor,
  getTextColor,
} from "../generate-thumbnail-color";

describe("thumbnail colors", () => {
  it("returns the same palette color for the same title", () => {
    const first = generateThumbnailColor("Feature-Sliced Design");
    const second = generateThumbnailColor("Feature-Sliced Design");

    expect(first).toBe(second);
    expect(first).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("chooses dark text for a light background", () => {
    expect(getTextColor("#FFFFFF")).toBe("#000000");
  });

  it("chooses light text for a dark background", () => {
    expect(getTextColor("#111827")).toBe("#FFFFFF");
  });

  it("accepts colors without a hash prefix", () => {
    expect(getTextColor("FDE68A")).toBe("#000000");
  });
});
