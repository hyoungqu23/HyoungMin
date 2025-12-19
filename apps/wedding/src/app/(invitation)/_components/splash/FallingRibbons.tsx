"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const ribbonSources: string[] = Array.from(
  { length: 12 },
  (_, idx) => `/icons/ribbon_${String(idx + 1).padStart(2, "0")}.svg`,
);

type RibbonConfig = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  scale: number;
  rotate: number;
  variant: number;
};

const generateRibbons = (): RibbonConfig[] =>
  Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 3,
    scale: 0.5 + Math.random() * 0.5,
    rotate: Math.random() * 360,
    variant: Math.floor(Math.random() * ribbonSources.length),
  }));

export const FallingRibbons = () => {
  const [ribbons] = useState<RibbonConfig[]>(generateRibbons);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {ribbons.map((r) => {
        return (
          <motion.div
            key={r.id}
            className="absolute -top-20 drop-shadow-sm"
            style={{ left: `${r.left}%` }}
            initial={{ y: -100, opacity: 0, rotate: r.rotate, scale: r.scale }}
            animate={{
              y: "110vh",
              opacity: [0, 0.5, 0.5, 0],
              rotate: r.rotate + 360,
            }}
            transition={{
              duration: r.duration,
              delay: r.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Image
              src={ribbonSources[r.variant]}
              alt={`Ribbon ${r.variant + 1}`}
              loading="lazy"
              width={36}
              height={28}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
