"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft } from "../_icons/ChevronLeft";
import { ChevronRight } from "../_icons/ChevronRight";
import { Close } from "../_icons/Close";

// 이미지 타입 정의
export type GalleryItem = {
  id: number;
  src: string; // 실제 이미지 경로 (or color class for test)
  ratio: string;
};

type GalleryModalProps = {
  items: GalleryItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
};

// 슬라이드 애니메이션 설정
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function GalleryModal({
  items,
  selectedIndex,
  onClose,
  onIndexChange,
}: GalleryModalProps) {
  const [direction, setDirection] = useState(0); // 1: 오른쪽, -1: 왼쪽

  // 페이지 이동 함수
  const paginate = useCallback(
    (newDirection: number) => {
      if (selectedIndex === null) return;
      setDirection(newDirection);

      let nextIndex = selectedIndex + newDirection;
      // 무한 루프 (Looping)
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;

      onIndexChange(nextIndex);
    },
    [selectedIndex, items.length, onIndexChange],
  );

  // 키보드 이벤트 (Arrow, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // 모달 열렸을 때 뒷배경 스크롤 방지
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, onClose, onIndexChange, paginate]); // selectedIndex가 바뀔 때마다는 아니고, 마운트/언마운트 시 처리됨 (클로저 문제 해결 위해 의존성 관리 필요할 수 있으나 여기선 함수형 업데이트 사용)

  // 스와이프 종료 감지
  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipeConfidenceThreshold = 10000;
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower < -swipeConfidenceThreshold) {
      paginate(1); // 오른쪽에서 왼쪽으로 스와이프 (다음)
    } else if (swipePower > swipeConfidenceThreshold) {
      paginate(-1); // 왼쪽에서 오른쪽으로 스와이프 (이전)
    }
  };

  if (selectedIndex === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
        onClick={onClose}
      >
        <Close />
      </button>

      {/* 화살표 버튼 (PC용, 모바일에서는 숨기거나 작게) */}
      <button
        className="absolute left-4 z-50 hidden md:block text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition"
        onClick={(e) => {
          e.stopPropagation();
          paginate(-1);
        }}
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute right-4 z-50 hidden md:block text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition"
        onClick={(e) => {
          e.stopPropagation();
          paginate(1);
        }}
      >
        <ChevronRight />
      </button>

      {/* 이미지 슬라이더 */}
      <div
        className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()} // 이미지 영역 클릭 시 닫히지 않음
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={selectedIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x" // 가로 드래그 허용
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full flex items-center justify-center p-4"
          >
            {/* 
               실제 이미지라면 <Image src={...} /> 사용. 
               여기서는 테스트용 div 박스로 구현 
            */}
            <div
              className={`
                w-full h-full max-w-lg max-h-[70vh] 
                ${items[selectedIndex].ratio} ${items[selectedIndex].src} 
                rounded-lg shadow-2xl
              `}
            >
              {/* 이미지 대신 테스트용 텍스트 */}
              <div className="w-full h-full flex items-center justify-center text-white/50 text-4xl font-bold">
                {items[selectedIndex].id + 1}
              </div>
            </div>

            {/* 하단 인디케이터 (현재 장수 / 전체 장수) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm">
              {selectedIndex + 1} / {items.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
