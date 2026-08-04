import { describe, expect, it } from "vitest";

import { calculateReadingTime } from "../reading-time";

describe("calculateReadingTime", () => {
  it("returns the one-minute minimum for empty content", () => {
    expect(calculateReadingTime("   \n\t  ")).toBe(1);
  });

  it("rounds a partial minute up using 200 words per minute", () => {
    const text = Array.from(
      { length: 201 },
      (_, index) => `word-${index}`,
    ).join(" ");

    expect(calculateReadingTime(text)).toBe(2);
  });

  it("treats consecutive whitespace as a single separator", () => {
    expect(calculateReadingTime("one   two\nthree\tfour")).toBe(1);
  });
});
