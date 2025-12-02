"use client";

import { Children, ReactNode } from "react";
import { motion } from "motion/react";

interface ScrollGridProps {
  children: ReactNode;
  className?: string;
}

export const ScrollGrid = ({
  children,
  className = "grid grid-cols-2 gap-4",
}: ScrollGridProps) => {
  const items = Children.toArray(children);

  return (
    <div className={`w-full ${className}`}>
      {items.map((child, i) => {
        const isLeft = i % 2 === 0;
        const randomX = isLeft ? -50 : 50;

        const delay = (i % 3) * 0.1;

        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: randomX,
              y: 30,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full h-full"
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};
