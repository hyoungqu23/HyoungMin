"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useState } from "react";
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

export const FallingRibbons = () => {
  const [ribbons, setRibbons] = useState<RibbonConfig[]>([]);

  useLayoutEffect(() => {
    const newRibbons = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      scale: 0.5 + Math.random() * 0.5,
      rotate: Math.random() * 360,

      variant: Math.floor(Math.random() * 9),

      colorClass:
        Math.random() > 0.6
          ? "text-rose-400/70"
          : Math.random() > 0.3
            ? "text-pink-300/80"
            : "text-rose-200/90",
    }));

    setRibbons(newRibbons);
  }, []);

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
