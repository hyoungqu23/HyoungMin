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
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target && target.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          onLoadMore();
          // 로딩 완료 후 상태 리셋 (부모 컴포넌트에서 처리)
          setTimeout(() => setIsLoading(false), 100);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  return { observerTarget, isLoading };
};
