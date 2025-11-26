"use client";

import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin = "100px",
}: UseInfiniteScrollOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || isLoading || !hasMore) return;

      setIsLoading(true);
      Promise.resolve(onLoadMore()).finally(() => setIsLoading(false));
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  return { observerTarget, isLoading };
};
