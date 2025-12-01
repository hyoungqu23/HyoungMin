"use client";

import { motion } from "motion/react";
import { ComponentType, useState } from "react";
import { Ribbon01 } from "../_icons/Ribbon01";
import { Ribbon02 } from "../_icons/Ribbon02";
import { Ribbon03 } from "../_icons/Ribbon03";
import { Ribbon04 } from "../_icons/Ribbon04";
import { Ribbon05 } from "../_icons/Ribbon05";
import { Ribbon06 } from "../_icons/Ribbon06";
import { Ribbon07 } from "../_icons/Ribbon07";
import { Ribbon08 } from "../_icons/Ribbon08";
import { Ribbon09 } from "../_icons/Ribbon09";
import { Ribbon10 } from "../_icons/Ribbon10";
import { Ribbon11 } from "../_icons/Ribbon11";
import { Ribbon12 } from "../_icons/Ribbon12";

const RibbonComponents: ComponentType[] = [
  Ribbon01,
  Ribbon02,
  Ribbon03,
  Ribbon04,
  Ribbon05,
  Ribbon06,
  Ribbon07,
  Ribbon08,
  Ribbon09,
  Ribbon10,
  Ribbon11,
  Ribbon12,
];

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
  Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 3,
    scale: 0.5 + Math.random() * 0.5,
    rotate: Math.random() * 360,
    variant: Math.floor(Math.random() * RibbonComponents.length),
  }));

export const FallingRibbons = () => {
  const [ribbons] = useState<RibbonConfig[]>(generateRibbons);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {ribbons.map((r) => {
        const RibbonIcon = RibbonComponents[r.variant];
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
            <RibbonIcon />
          </motion.div>
        );
      })}
    </div>
  );
};
