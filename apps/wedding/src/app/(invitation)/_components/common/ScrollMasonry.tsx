"use client";

import { motion } from "motion/react";
import { Children, memo, ReactNode, useMemo } from "react";

type ScrollMasonryProps = {
  children: ReactNode;
  className?: string;
};

const DEFAULT_COLUMNS_CLASSNAME = "columns-3 md:columns-4";

// 애니메이션 상수 - 랜덤 계산 제거로 성능 개선
const ANIMATION_DELAYS = [0, 0.1, 0.2, 0.3] as const;
const ANIMATION_OFFSETS = [30, 40, 50, 60, 70] as const;

export const ScrollMasonry = memo(function ScrollMasonry({
  children,
  className = "",
}: ScrollMasonryProps) {
  // useMemo로 items 배열 메모이제이션
  const items = useMemo(() => Children.toArray(children), [children]);

  const hasColumnsClass = className.includes("columns-");
  const resolvedColumnsClassName = hasColumnsClass
    ? ""
    : DEFAULT_COLUMNS_CLASSNAME;

  return (
    <div
      className={`w-full max-w-md gap-2 ${resolvedColumnsClassName} ${className}`}
    >
      {items.map((child, i) => {
        // 상수 배열에서 인덱스 기반으로 값 선택 (매번 계산하지 않음)
        const delay = ANIMATION_DELAYS[i % ANIMATION_DELAYS.length];
        const yOffset = ANIMATION_OFFSETS[i % ANIMATION_OFFSETS.length];

        return (
          <motion.div
            key={i}
            className="break-inside-avoid mb-2"
            initial={{
              opacity: 0,
              y: yOffset,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
              margin: "0px 0px -50px 0px",
            }}
            transition={{
              duration: 0.6,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
});
