"use client";

import { motion, Variants } from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
  PropsWithChildren,
} from "react";

type TypingAnimationProps = {
  children: ReactNode;
  speed?: number;
  delay?: number;
  className?: string;
  once?: boolean;
};

const isReactElementWithChildren = (
  node: ReactNode,
): node is ReactElement<PropsWithChildren> => {
  return (
    isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    "children" in node.props
  );
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
  const extractText = (node: ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }
    if (isReactElementWithChildren(node)) {
      return Children.map(node.props.children, extractText)?.join("") || "";
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }
    return "";
  };

  const fullText = useMemo(() => extractText(children), [children]);
  const counterRef = useRef(0);

  const renderAnimatedChildren = (node: ReactNode): ReactNode => {
    if (typeof node === "string" || typeof node === "number") {
      const text = String(node);
      return text.split("").map((char, index) => {
        const currentDelay = delay + counterRef.current * speed;
        counterRef.current += 1;

        if (char === "\n") return <br key={`br-${index}`} />;

        return (
          <motion.span
            key={`char-${counterRef.current}-${index}`}
            custom={currentDelay}
            variants={childVariants}
            className="inline-block whitespace-pre"
            aria-hidden="true"
          >
            {char}
          </motion.span>
        );
      });
    }

    if (isReactElementWithChildren(node)) {
      return cloneElement(
        node,
        { ...node.props, key: undefined },
        Children.map(node.props.children, (child) =>
          renderAnimatedChildren(child),
        ),
      );
    }

    if (Array.isArray(node)) {
      return node.map((child) => renderAnimatedChildren(child));
    }

    return node;
  };

  counterRef.current = 0;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      aria-label={fullText}
    >
      {renderAnimatedChildren(children)}
    </motion.div>
  );
};
