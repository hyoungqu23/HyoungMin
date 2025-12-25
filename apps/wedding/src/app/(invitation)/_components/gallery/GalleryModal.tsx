"use client";

import ChevronLeft from "@icons/arrow_left.svg";
import ChevronRight from "@icons/arrow_right.svg";
import Close from "@icons/close.svg";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryItem = {
  id: number;
  src: string;
  width?: number;
  height?: number;
};

type GalleryModalProps = {
  items: GalleryItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
};

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

export const GalleryModal = ({
  items,
  selectedIndex,
  onClose,
  onIndexChange,
}: GalleryModalProps) => {
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      if (selectedIndex === null) return;
      setDirection(newDirection);

      let nextIndex = selectedIndex + newDirection;
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;

      onIndexChange(nextIndex);
    },
    [selectedIndex, items.length, onIndexChange],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, onClose, onIndexChange, paginate]);

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipeConfidenceThreshold = 10000;
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipePower > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  if (selectedIndex === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-md px-12 py-20"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
        onClick={onClose}
      >
        <Image src={Close} alt="Close" width={16} height={16} />
      </button>

      <button
        className="absolute left-4 z-50 hidden md:block text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition"
        onClick={(e) => {
          e.stopPropagation();
          paginate(-1);
        }}
      >
        <Image src={ChevronLeft} alt="Chevron Left" width={16} height={16} />
      </button>
      <button
        className="absolute right-4 z-50 hidden md:block text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition"
        onClick={(e) => {
          e.stopPropagation();
          paginate(1);
        }}
      >
        <Image src={ChevronRight} alt="Chevron Right" width={16} height={16} />
      </button>

      <div
        className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full flex items-center justify-center p-4"
          >
            <Image
              src={items[selectedIndex].src}
              alt={`Gallery Item ${items[selectedIndex].id + 1}`}
              fill
              className="object-contain"
            />

            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm">
              {selectedIndex + 1} / {items.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
