"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ScrollMasonry } from "../common/ScrollMasonry";
import { GalleryModal, type GalleryItem } from "./GalleryModal";

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 0, ratio: "aspect-[3/4]", src: "/images/sample.jpg" },
  { id: 1, ratio: "aspect-[1/1]", src: "/images/sample.jpg" },
  { id: 2, ratio: "aspect-[3/5]", src: "/images/sample.jpg" },
  { id: 3, ratio: "aspect-[4/3]", src: "/images/sample.jpg" },
  { id: 4, ratio: "aspect-[3/4]", src: "/images/sample.jpg" },
  { id: 5, ratio: "aspect-[1/1]", src: "/images/sample.jpg" },
  { id: 6, ratio: "aspect-[3/4]", src: "/images/sample.jpg" },
  { id: 7, ratio: "aspect-[2/3]", src: "/images/sample.jpg" },
  { id: 8, ratio: "aspect-[3/4]", src: "/images/sample.jpg" },
  { id: 9, ratio: "aspect-[1/1]", src: "/images/sample.jpg" },
  { id: 10, ratio: "aspect-[3/5]", src: "/images/sample.jpg" },
  { id: 11, ratio: "aspect-[4/3]", src: "/images/sample.jpg" },
  { id: 12, ratio: "aspect-[3/4]", src: "/images/sample.jpg" },
  { id: 13, ratio: "aspect-[1/1]", src: "/images/sample.jpg" },
  { id: 14, ratio: "aspect-[3/4]", src: "/images/sample.jpg" },
];

export const GalleryContainer = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <ScrollMasonry>
        {GALLERY_ITEMS.map((item, index) => (
          <div
            key={item.id}
            className={`
              relative w-full ${item.ratio} overflow-hidden rounded shadow-sm ${item.src} 
              group cursor-pointer
            `}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            <Image
              src={item.src}
              alt={`Gallery Item ${item.id + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </ScrollMasonry>

      <AnimatePresence>
        {selectedIndex !== null && (
          <GalleryModal
            items={GALLERY_ITEMS}
            selectedIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onIndexChange={(newIndex) => setSelectedIndex(newIndex)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
