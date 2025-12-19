"use client";

import { motion, Variants } from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
} from "react";

interface TypingAnimationProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  delay?: number;
  once?: boolean;
}

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

interface ElementWithChildren {
  children?: ReactNode;
  [key: string]: unknown;
}

function isElementWithChildren(
  node: ReactNode,
): node is ReactElement<ElementWithChildren> {
  return (
    isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    "children" in node.props
  );
}

let charIndex = 0;

export const TypingAnimation = ({
  children,
  className = "",
  speed = 0.05,
  delay = 0,
  once = false,
}: TypingAnimationProps) => {
  const fullText = useMemo(() => {
    const extract = (node: ReactNode): string => {
      if (typeof node === "string" || typeof node === "number") {
        return String(node);
      }
      if (isElementWithChildren(node)) {
        return Children.map(node.props.children, extract)?.join("") || "";
      }
      if (Array.isArray(node)) {
        return node.map(extract).join("");
      }
      return "";
    };
    return extract(children);
  }, [children]);

  const renderTree = (node: ReactNode): ReactNode => {
    if (typeof node === "string" || typeof node === "number") {
      const text = String(node);

      return text.split("").map((char, index) => {
        if (char === "\n") {
          return <br key={`br-${index}`} />;
        }

        const currentIndex = charIndex;
        const currentDelay = delay + currentIndex * speed;
        charIndex += 1;

        return (
          <motion.span
            key={`char-${currentIndex}`}
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

    if (isElementWithChildren(node)) {
      const { children: nodeChildren, ...restProps } = node.props;

      const animatedChildren = Children.map(nodeChildren, (child) =>
        renderTree(child),
      );

      return cloneElement(node, restProps, animatedChildren);
    }

    if (Array.isArray(node)) {
      return node.map((child) => renderTree(child));
    }

    return node;
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      aria-label={fullText}
    >
      {/* 
        renderTree 함수가 실행되면서 charIndex를 0부터 증가시키며 JSX를 생성합니다.
        렌더링 결과물은 항상 동일하므로 Side Effect가 없습니다.
      */}
      {renderTree(children)}
    </motion.div>
  );
};
