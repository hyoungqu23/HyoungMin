"use client";

import { motion, Variants } from "motion/react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

export const TypingText = ({
  text,
  speed = 0.05,
  delay = 0,
  className = "",
  once = true,
}: TypingTextProps) => {
  const characters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.p
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, amount: 0.5 }}
      aria-label={text}
    >
      {characters.map((char, index) => {
        if (char === "\n") {
          return <br key={index} />;
        }

        return (
          <motion.span
            key={index}
            variants={childVariants}
            aria-hidden="true"
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        );
      })}
    </motion.p>
  );
};
