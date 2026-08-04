import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TagList } from "../TagList";

const render = (element: React.ReactNode) => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(element);
  return container;
};

describe("TagList", () => {
  it("renders the requested number of tags", () => {
    const container = render(
      <TagList tags={["React", "Next.js", "TypeScript"]} limit={2} />,
    );

    expect(container.querySelectorAll("span")).toHaveLength(2);
    expect(container.textContent).toContain("React");
    expect(container.textContent).toContain("Next.js");
    expect(container.textContent).not.toContain("TypeScript");
  });

  it("links tags to their encoded taxonomy routes when requested", () => {
    const container = render(<TagList tags={["React Query"]} linkable />);
    const link = container.querySelector("a");

    expect(link?.getAttribute("href")).toBe("/tags/React%20Query");
    expect(link?.textContent).toBe("React Query");
  });

  it("renders nothing for an empty tag list", () => {
    expect(renderToStaticMarkup(<TagList tags={[]} />)).toBe("");
  });
});
