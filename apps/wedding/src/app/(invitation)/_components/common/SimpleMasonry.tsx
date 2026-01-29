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

type ColumnItem = {
  item: ReactNode;
  originalIndex: number;
};

type LazyItemProps = {
  children: ReactNode;
  index: number;
};

const LazyItem = memo(function LazyItem({ children, index }: LazyItemProps) {
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

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div className="w-full aspect-3/4 bg-gray-100 rounded-sm animate-pulse" />
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
    const cols: ColumnItem[][] = Array.from({ length: columns }, () => []);

    // 높이 균형(Greedy) 알고리즘 적용
    if (aspectRatios && aspectRatios.length > 0) {
      // 각 열의 현재 높이 저장
      const colHeights = new Array(columns).fill(0);

      items.forEach((item, index) => {
        // 가장 짧은 열 찾기
        let minColIndex = 0;
        let minHeight = colHeights[0];

        for (let i = 1; i < columns; i++) {
          if (colHeights[i] < minHeight) {
            minHeight = colHeights[i];
            minColIndex = i;
          }
        }

        // 아이템을 해당 열에 추가
        cols[minColIndex].push({ item, originalIndex: index });

        // 높이 업데이트 (비율의 역수 = 높이/너비, 너비는 모두 같다고 가정)
        // aspect ratio가 없으면 기본값 1.0 (정사각형) 가정
        const ratio = aspectRatios[index] || 1;
        colHeights[minColIndex] += 1 / ratio;
      });
    } else {
      // Fallback: 기존 Row-first 방식
      items.forEach((item, index) => {
        const columnIndex = index % columns;
        cols[columnIndex].push({ item, originalIndex: index });
      });
    }

    return cols;
  }, [items, columns, aspectRatios]);

  return (
    <div className={`w-full max-w-md flex gap-2 ${className}`}>
      {columnItems.map((columnChildren, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-2">
          {columnChildren.map(({ item, originalIndex }) => (
            <LazyItem key={originalIndex} index={originalIndex}>
              {item}
            </LazyItem>
          ))}
        </div>
      ))}
    </div>
  );
});
