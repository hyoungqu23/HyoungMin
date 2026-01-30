"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SimpleMasonry } from "../common/SimpleMasonry";
import { GalleryModal } from "./GalleryModal";

export type GalleryItem = {
  id: number;
  src: string;
  width?: number;
  height?: number;
  date?: string; // 날짜 필드 추가 (ex: "2024. 12. 25")
};

type GalleryContainerProps = {
  items: GalleryItem[];
  initialVisibleCount?: number;
};

const LOAD_MORE_COUNT = 10;

// 개별 갤러리 아이템을 memo로 분리하여 불필요한 리렌더링 방지
type GalleryItemCardProps = {
  item: GalleryItem;
  index: number;
  onClick: (index: number) => void;
};

const GalleryItemCard = memo(function GalleryItemCard({
  item,
  index,
  onClick,
}: GalleryItemCardProps) {
  const handleClick = useCallback(() => {
    onClick(index);
  }, [onClick, index]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-sm shadow-sm group cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      <Image
        src={item.src}
        alt={`Gallery Item ${item.id + 1}`}
        width={item.width ?? 1200}
        height={item.height ?? 1600}
        className="w-full h-auto"
        loading={index < 4 ? "eager" : "lazy"}
        priority={index < 4}
      />
      {/* 필름 카메라 스타일 날짜 오버레이 */}
      {item.date && (
        <div className="absolute bottom-1 right-1 z-10 select-none pointer-events-none">
          <span
            className="font-mono text-[10px] md:text-xs text-[#ff9e42] tracking-widest font-bold opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            &apos;
            {item.date
              .replace(/^20/, "")
              .replace(/[.\s]+/g, " ")
              .trim()}
          </span>
        </div>
      )}
    </div>
  );
});

export const GalleryContainer = ({
  items,
  initialVisibleCount = 20,
}: GalleryContainerProps) => {
  const showAll = initialVisibleCount === 0;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(
    showAll ? items.length : initialVisibleCount,
  );

  // 무한 스크롤을 위한 Sentinel ref
  const sentinelRef = useRef<HTMLDivElement>(null);

  // useMemo로 visibleItems 메모이제이션
  const visibleItems = useMemo(
    () => (showAll ? items : items.slice(0, visibleCount)),
    [showAll, items, visibleCount],
  );

  // visibleItems에 대한 aspectRatios 계산
  const aspectRatios = useMemo(() => {
    return visibleItems.map((item) => {
      const width = item.width ?? 1200;
      const height = item.height ?? 1600;
      return width / height;
    });
  }, [visibleItems]);

  const hasMore = !showAll && visibleCount < items.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, items.length));
  }, [items.length]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      {
        rootMargin: "200px", // 바닥에 닿기 전 200px 지점에서 미리 로드
        threshold: 0,
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, handleLoadMore]);

  // useCallback으로 핸들러 메모이제이션
  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleIndexChange = useCallback((newIndex: number) => {
    setSelectedIndex(newIndex);
  }, []);

  if (!items.length) return null;

  return (
    <>
      <SimpleMasonry
        className="columns-3 md:columns-4"
        columns={4}
        aspectRatios={aspectRatios}
      >
        {visibleItems.map((item, index) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            index={index}
            onClick={handleSelect}
          />
        ))}
      </SimpleMasonry>

      {/* Infinite Scroll Sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-10 w-full" />}

      <AnimatePresence>
        {selectedIndex !== null && (
          <GalleryModal
            items={items}
            selectedIndex={selectedIndex}
            onClose={handleClose}
            onIndexChange={handleIndexChange}
          />
        )}
      </AnimatePresence>
    </>
  );
};
