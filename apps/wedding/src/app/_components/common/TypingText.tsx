"use client";

import { motion, Variants } from "motion/react";
import { useMemo } from "react";

type TypingAnimationProps = {
  children: string;
  speed?: number;
  delay?: number;
  className?: string;
  once?: boolean;
};

const childVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i,
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  }),
};

export const TypingAnimation = ({
  children,
  speed = 0.05,
  delay = 0,
  className = "",
  once = false,
}: TypingAnimationProps) => {
  const fullText = useMemo(() => children, [children]);

  // charCounter 변수 제거됨 (불필요)

  const renderText = (text: string) =>
    text.split("").map((char, index) => {
      // charCounter 대신 map이 제공하는 index를 사용
      const order = index;
      const currentDelay = delay + order * speed;

      if (char === "\n") return <br key={`br-${index}`} />;

      return (
        <motion.span
          key={`char-${index}`} // key도 index 기반으로 변경
          custom={currentDelay}
          variants={childVariants}
          className="inline-block whitespace-pre"
          aria-hidden="true"
        >
          {char}
        </motion.span>
      );
    });

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      aria-label={fullText}
    >
      {renderText(children)}
    </motion.div>
  );
};
