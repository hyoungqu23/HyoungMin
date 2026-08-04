import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ShareButton from "../ShareButton";

const reactTestEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

describe("ShareButton", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    document.title = "Test & Learn";
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
    vi.restoreAllMocks();
  });

  it("opens the selected social share intent for the supplied URL", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    act(() => {
      root.render(<ShareButton url="https://example.com/post?id=1" />);
    });

    const shareButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Share on X (Twitter)"]',
    );
    act(() => shareButton?.click());

    expect(open).toHaveBeenCalledWith(
      "https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D1&text=Test%20%26%20Learn",
      "_blank",
      "width=600,height=400,noopener,noreferrer",
    );
  });
});
