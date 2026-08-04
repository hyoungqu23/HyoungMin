import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LayoutToggle } from "../LayoutToggle";

const reactTestEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

describe("LayoutToggle", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("announces the selected layout and requests a list layout on click", () => {
    const onLayoutChange = vi.fn();

    act(() => {
      root.render(
        <LayoutToggle layout="card" onLayoutChange={onLayoutChange} />,
      );
    });

    const listButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="List layout"]',
    );
    const cardButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Card layout"]',
    );

    expect(listButton?.getAttribute("aria-pressed")).toBe("false");
    expect(cardButton?.getAttribute("aria-pressed")).toBe("true");

    act(() => listButton?.click());

    expect(onLayoutChange).toHaveBeenCalledWith("list");
  });
});
