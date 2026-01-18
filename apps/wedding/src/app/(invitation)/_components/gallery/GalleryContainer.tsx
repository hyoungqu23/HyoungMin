"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ScrollMasonry } from "../common/ScrollMasonry";
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

export const GalleryContainer = ({
  items,
  initialVisibleCount = 10,
}: GalleryContainerProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  if (!items.length) return null;

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, items.length));
  };

  return (
    <>
      <ScrollMasonry className="columns-5 md:columns-5">
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className="relative w-full overflow-hidden rounded shadow-sm group cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            <Image
              src={item.src}
              alt={`Gallery Item ${item.id + 1}`}
              width={item.width ?? 1200}
              height={item.height ?? 1600}
              className="w-full h-auto"
            />
          </div>
        ))}
      </ScrollMasonry>

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
            onClose={() => setSelectedIndex(null)}
            onIndexChange={(newIndex) => setSelectedIndex(newIndex)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
