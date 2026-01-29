"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import { SimpleMasonry } from "../common/SimpleMasonry";
import { GalleryModal } from "./GalleryModal";

export type GalleryItem = {
  id: number;
  src: string;
  width?: number;
  height?: number;
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
    </div>
  );
});

export const GalleryContainer = ({
  items,
  initialVisibleCount = 10,
}: GalleryContainerProps) => {
  const showAll = initialVisibleCount === 0;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(
    showAll ? items.length : initialVisibleCount,
  );

  // useMemo로 visibleItems 메모이제이션
  const visibleItems = useMemo(
    () => (showAll ? items : items.slice(0, visibleCount)),
    [showAll, items, visibleCount],
  );

  const hasMore = !showAll && visibleCount < items.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, items.length));
  }, [items.length]);

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
      <SimpleMasonry className="columns-4 md:columns-4">
        {visibleItems.map((item, index) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            index={index}
            onClick={handleSelect}
          />
        ))}
      </SimpleMasonry>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-200"
          >
            더 보기 ({items.length - visibleCount}장)
          </button>
        </div>
      )}

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
