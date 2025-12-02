"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type HorizontalScrollProps = {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
};

export const HorizontalScroll = ({
  children,
  direction = "left",
  speed = 300,
  className = "",
}: HorizontalScrollProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const xRange = direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"];

  const x = useTransform(scrollYProgress, [0, 1], xRange);

  return (
    <section
      ref={targetRef}
      className="relative w-full"
      style={{ height: `${speed}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-start overflow-hidden">
        <motion.div
          style={{ x }}
          className={`flex h-full items-center gap-10 p-10 will-change-transform ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};
