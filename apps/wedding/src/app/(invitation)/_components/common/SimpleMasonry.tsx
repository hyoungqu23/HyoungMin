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
  columns?: number;
  aspectRatios?: number[]; // 각 아이템의 가로/세로 비율 (width / height)
};

type LazyItemProps = {
  children: ReactNode;
  index: number;
  aspectRatio?: number;
};

const LazyItem = memo(function LazyItem({
  children,
  index,
  aspectRatio,
}: LazyItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(index < 8);

  useEffect(() => {
    if (isVisible) return;

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
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  const ratio =
    typeof aspectRatio === "number" && Number.isFinite(aspectRatio)
      ? aspectRatio
      : 0.75;

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div
          className="w-full bg-gray-100 rounded-sm animate-pulse"
          style={{ aspectRatio: ratio }}
        />
      )}
    </div>
  );
});

export const SimpleMasonry = memo(function SimpleMasonry({
  children,
  className = "",
  columns = 3,
  aspectRatios,
}: SimpleMasonryProps) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const columnItems = useMemo(() => {
    const cols: number[][] = Array.from({ length: columns }, () => []);
    const hasAspectRatios = Boolean(aspectRatios && aspectRatios.length > 0);

    if (hasAspectRatios) {
      const heights = new Array(columns).fill(0);

      for (let index = 0; index < items.length; index += 1) {
        let minColIndex = 0;
        let minHeight = heights[0];

        for (let i = 1; i < columns; i += 1) {
          if (heights[i] < minHeight) {
            minHeight = heights[i];
            minColIndex = i;
          }
        }

        cols[minColIndex].push(index);

        const ratio = aspectRatios?.[index] || 1;
        heights[minColIndex] += 1 / ratio;
      }
    } else {
      for (let index = 0; index < items.length; index += 1) {
        const columnIndex = index % columns;
        cols[columnIndex].push(index);
      }
    }

    return cols;
  }, [items, columns, aspectRatios]);

  return (
    <div className={`w-full max-w-md flex gap-2 ${className}`}>
      {columnItems.map((columnChildren, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-2 min-w-0">
          {columnChildren.map((originalIndex) => (
            <LazyItem
              key={originalIndex}
              index={originalIndex}
              aspectRatio={aspectRatios?.[originalIndex]}
            >
              {items[originalIndex]}
            </LazyItem>
          ))}
        </div>
      ))}
    </div>
  );
});
