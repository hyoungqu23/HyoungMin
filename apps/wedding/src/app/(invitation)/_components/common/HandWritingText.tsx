"use client";

import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface HandWritingTextProps {
  text: string;
  className?: string;
}

export const HandWritingText = ({
  text,
  className = "",
}: HandWritingTextProps) => {
  const textRef = useRef<SVGTextElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isReady, setIsReady] = useState(false); // 준비 상태 체크

  useEffect(() => {
    // 폰트가 다 로딩된 후에 길이를 계산해야 정확함
    document.fonts.ready.then(() => {
      if (textRef.current) {
        const length = textRef.current.getComputedTextLength();
        // 만약 length가 0이면(아직 렌더링 안됨) requestAnimationFrame으로 다음 프레임에 재시도
        if (length === 0) {
          requestAnimationFrame(() => {
            if (textRef.current) {
              setPathLength(textRef.current.getComputedTextLength());
              setIsReady(true);
            }
          });
        } else {
          setPathLength(length);
          setIsReady(true);
        }
      }
    });
  }, [text]);

  return (
    // 부모 div에 w-fit을 주어 SVG가 텍스트 크기에 딱 맞게 감싸도록 함
    <div className={`relative inline-block w-fit ${className}`}>
      <motion.svg width="100%" height="100%" className="overflow-visible">
        {/* 
          1. 외곽선 애니메이션 텍스트
          - isReady가 true일 때만 보여줌 (길이 계산 전에는 숨김)
        */}
        {isReady && (
          <motion.text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            // 폰트 클래스는 layout.tsx에서 설정한 변수명과 일치해야 합니다 (예: font-yeongwol)
            className="font-yeongwol text-6xl md:text-8xl font-bold"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            // strokeDasharray가 pathLength만큼 있어야 점선 간격이 글자 전체 길이가 됨
            initial={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
            }}
            whileInView={{ strokeDashoffset: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            {text}
          </motion.text>
        )}

        {/* 
           2. 길이 측정용 투명 텍스트 (항상 렌더링) 
           - 이 녀석이 있어야 getComputedTextLength가 작동함
           - 눈에는 안 보임 (opacity: 0)
        */}
        <text
          ref={textRef}
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-yeongwol text-6xl md:text-8xl font-bold"
          fill="transparent"
          stroke="none"
          opacity="0"
        >
          {text}
        </text>

        {isReady && (
          <motion.text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-yeongwol text-6xl md:text-8xl font-bold"
            fill="currentColor"
            stroke="none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            {text}
          </motion.text>
        )}
      </motion.svg>
    </div>
  );
};
