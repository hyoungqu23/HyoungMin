"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import type { GalleryItem } from "./GalleryModal";
import { GalleryModal } from "./GalleryModal";

type GridGalleryProps = {
  items: GalleryItem[];
  className?: string;
};

export const GridGallery = ({ items, className = "" }: GridGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
      <div className={`grid grid-cols-3 gap-3 ${className}`}>
        {items.map((item, index) => (
          <Image
            key={item.id}
            src={item.src}
            alt={`Photo ${item.id}`}
            width={800}
            height={800}
            className={`w-full rounded object-cover cursor-pointer hover:opacity-90 transition-opacity ${
              index === 0 ? "col-span-3 row-span-2" : "aspect-square"
            }`}
            onClick={() => handleSelect(index)}
            loading={index < 4 ? "eager" : "lazy"}
            priority={index < 4}
          />
        ))}
      </div>

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
