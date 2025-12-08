"use client";

import { motion } from "motion/react";
import { Children, ReactNode } from "react";

type ScrollMasonryProps = {
  children: ReactNode;
  className?: string;
};

export const ScrollMasonry = ({
  children,
  className = "",
}: ScrollMasonryProps) => {
  const items = Children.toArray(children);

  return (
    <div
      className={`w-full max-w-md columns-3 md:columns-4 gap-2.5 ${className}`}
    >
      {items.map((child, i) => {
        const randomDelay = (i % 4) * 0.1;
        const randomY = 30 + (i % 5) * 10;

        return (
          <motion.div
            key={i}
            className="break-inside-avoid mb-2.5"
            initial={{
              opacity: 0,
              y: randomY,
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
              duration: 0.8,
              delay: randomDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};
