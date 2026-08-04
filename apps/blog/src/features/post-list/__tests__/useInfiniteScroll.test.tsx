import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInfiniteScroll } from "../useInfiniteScroll";

const reactTestEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};

type HarnessProps = {
  hasMore: boolean;
  onLoadMore: () => void;
};

const Harness = ({ hasMore, onLoadMore }: HarnessProps) => {
  const { observerTarget, isLoading } = useInfiniteScroll({
    hasMore,
    onLoadMore,
  });

  return <div ref={observerTarget} data-loading={isLoading} />;
};

describe("useInfiniteScroll", () => {
  let callback: IntersectionObserverCallback;
  let container: HTMLDivElement;
  let root: Root;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  beforeEach(() => {
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    observe.mockReset();
    unobserve.mockReset();
    disconnect.mockReset();

    class IntersectionObserverStub {
      constructor(observerCallback: IntersectionObserverCallback) {
        callback = observerCallback;
      }

      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    }

    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("requests more posts when the sentinel enters the viewport", async () => {
    const onLoadMore = vi.fn();
    act(() => root.render(<Harness hasMore onLoadMore={onLoadMore} />));

    expect(observe).toHaveBeenCalledWith(container.firstElementChild);

    await act(async () => {
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
      await Promise.resolve();
    });

    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it("does not request more posts when the list is complete", () => {
    const onLoadMore = vi.fn();
    act(() => root.render(<Harness hasMore={false} onLoadMore={onLoadMore} />));

    act(() => {
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
