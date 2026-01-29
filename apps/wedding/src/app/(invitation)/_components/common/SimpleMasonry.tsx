"use client";

import {
  Children,
  memo,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SimpleMasonryProps = {
  children: ReactNode;
  className?: string;
};

const DEFAULT_COLUMNS_CLASSNAME = "columns-3 md:columns-4";

type LazyItemProps = {
  children: ReactNode;
  index: number;
};

// Lazy loading이 적용된 개별 아이템
const LazyItem = memo(function LazyItem({ children, index }: LazyItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(index < 8); // 처음 8개는 즉시 표시

  useEffect(() => {
    if (isVisible) return; // 이미 visible이면 observe 필요 없음

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // 화면 200px 전에 미리 로드
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} className="break-inside-avoid mb-2">
      {isVisible ? (
        children
      ) : (
        // Placeholder: 이미지 비율을 유지하는 스켈레톤
        <div className="w-full aspect-3/4 bg-gray-100 rounded-sm animate-pulse" />
      )}
    </div>
  );
});

/**
 * SimpleMasonry
 * - ScrollMasonry와 달리 motion 애니메이션 없이 순수 CSS로만 Masonry 레이아웃 구현
 * - 각 아이템에 개별 IntersectionObserver 대신 Lazy Loading 통합
 * - MaxListenersExceededWarning 해결
 */
export const SimpleMasonry = memo(function SimpleMasonry({
  children,
  className = "",
}: SimpleMasonryProps) {
  const items = useMemo(() => Children.toArray(children), [children]);

  const hasColumnsClass = className.includes("columns-");
  const resolvedColumnsClassName = hasColumnsClass
    ? ""
    : DEFAULT_COLUMNS_CLASSNAME;

  return (
    <div
      className={`w-full max-w-md gap-2 ${resolvedColumnsClassName} ${className}`}
    >
      {items.map((child, i) => (
        <LazyItem key={i} index={i}>
          {child}
        </LazyItem>
      ))}
    </div>
  );
});
