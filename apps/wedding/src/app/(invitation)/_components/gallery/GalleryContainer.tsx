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
};

export const GalleryContainer = ({ items }: GalleryContainerProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <>
      <ScrollMasonry className="columns-7 md:columns-7">
        {items.map((item, index) => (
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
