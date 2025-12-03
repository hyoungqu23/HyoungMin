"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import GalleryModal, { GalleryItem } from "./GalleryModal";
import { ScrollMasonry } from "../common/ScrollMasonry";

// 테스트 데이터 (src 필드에 색상 클래스를 넣어서 테스트 중)
const GALLERY_ITEMS: GalleryItem[] = [
  { id: 0, ratio: "aspect-[3/4]", src: "bg-rose-100" },
  { id: 1, ratio: "aspect-[1/1]", src: "bg-stone-200" },
  { id: 2, ratio: "aspect-[3/5]", src: "bg-orange-100" },
  { id: 3, ratio: "aspect-[4/3]", src: "bg-blue-100" },
  { id: 4, ratio: "aspect-[3/4]", src: "bg-green-100" },
  { id: 5, ratio: "aspect-[1/1]", src: "bg-purple-100" },
  { id: 6, ratio: "aspect-[3/4]", src: "bg-pink-200" },
  { id: 7, ratio: "aspect-[2/3]", src: "bg-yellow-100" },
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
            // 클릭 시 해당 인덱스로 모달 열기
            onClick={() => setSelectedIndex(index)}
          >
            {/* 호버/클릭 효과용 오버레이 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* (실제 이미지가 들어가면 Image 태그 사용) */}
            <div className="absolute inset-0 flex items-center justify-center text-stone-500/30 text-3xl font-bold font-serif pointer-events-none">
              {item.id + 1}
            </div>
          </div>
        ))}
      </ScrollMasonry>

      {/* 모달 렌더링 (AnimatePresence로 닫힐 때 애니메이션 보장) */}
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
