"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Ribbon } from "./Ribbon";

type RibbonConfig = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  scale: number;
  rotate: number;
  variant: number;
  colorClass: string;
};

const generateRibbons = (): RibbonConfig[] =>
  Array.from({ length: 100 }).map((_, i) => {
    const colorRandom = Math.random();
    return {
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      scale: 0.5 + Math.random() * 0.5,
      rotate: Math.random() * 360,
      variant: Math.floor(Math.random() * 9),
      colorClass:
        colorRandom > 0.6
          ? "text-rose-400/70"
          : colorRandom > 0.3
            ? "text-pink-300/80"
            : "text-rose-200/90",
    };
  });

// SSR이 비활성화된 상태에서만 렌더링되므로 useState 초기값에서 직접 생성 가능
export const FallingRibbons = () => {
  const [ribbons] = useState<RibbonConfig[]>(generateRibbons);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {ribbons.map((r) => (
        <motion.div
          key={r.id}
          className={`absolute -top-20 drop-shadow-sm ${r.colorClass}`}
          style={{ left: `${r.left}%` }}
          initial={{ y: -100, opacity: 0, rotate: r.rotate, scale: r.scale }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: r.rotate + 360,
          }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Ribbon variant={r.variant} className="w-16 h-16" />
        </motion.div>
      ))}
    </div>
  );
};
