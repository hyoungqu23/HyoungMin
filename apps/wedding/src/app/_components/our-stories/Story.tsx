"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useId } from "react"; // 고유 ID 생성을 위해 추가
import { Section } from "../common/Section";

// --- 데이터 ---
const EPISODES = [
  {
    year: "2015",
    title: "첫 OO, 겨울",
    desc: "어쩌고 저쩌고\n어쩌고 저쩌고",
    image: "/images/sample.jpg",
  },
  {
    year: "2016",
    title: "첫 OO, 봄",
    desc: "어쩌고 저쩌고\n어쩌고 저쩌고",
    image: "/images/sample.jpg",
  },
  {
    year: "2018",
    title: "첫 OO, 봄",
    desc: "어쩌고 저쩌고\n어쩌고 저쩌고",
    image: "/images/sample.jpg",
  },
  {
    year: "2020",
    title: "첫 OO, 봄",
    desc: "어쩌고 저쩌고\n어쩌고 저쩌고",
    image: "/images/sample.jpg",
  },
  {
    year: "2025",
    title: "첫 OO, 여름",
    desc: "어쩌고 저쩌고\n어쩌고 저쩌고",
    image: "/images/sample.jpg",
  },
  {
    year: "2026",
    title: "새로운 시작, 봄",
    desc: "어쩌고 저쩌고\n어쩌고 저쩌고",
    image: "/images/sample.jpg",
  },
];

// 🎨 발자국 스타일 (보여지는 디자인)
const FOOTPRINT_STYLE = {
  fill: "none",
  stroke: "#FDA4AF", // rose-300
  strokeWidth: "7",
  strokeLinecap: "round" as const,
  strokeDasharray: "0 20", // 점선(발자국)
};

// ✨ 애니메이션용 마스크 컴포넌트 (핵심 해결책)
const AnimatedPath = ({ d }: { d: string }) => {
  const maskId = useId(); // 유니크한 ID 생성 (Mask 충돌 방지)

  return (
    <svg
      className="w-full h-24 md:h-32 overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* 1. 마스크 정의: 하얀색 실선이 그려지면서 아래 내용을 보여줌 */}
        <mask id={maskId}>
          <motion.path
            d={d}
            fill="none"
            stroke="white" // 마스크는 흰색 부분이 보임
            strokeWidth="15" // 발자국(7px)보다 넉넉하게 두껍게 해서 가림 없이 보여줌
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </mask>
      </defs>

      {/* 애니메이션 되는 발자국 */}
      <path
        d={d}
        {...FOOTPRINT_STYLE}
        mask={`url(#${maskId})`} // 위에서 만든 마스크 적용
      />
    </svg>
  );
};

// --- 각 방향별 곡선 데이터 (d 값만 전달) ---
const CurveLeftToRight = () => (
  <AnimatedPath d="M 50 0 C 50 50, 50 50, 90 50 S 90 100, 90 100" />
);

const CurveRightToLeft = () => (
  <AnimatedPath d="M 90 0 C 90 50, 90 50, 50 50 S 10 100, 10 100" />
);

const CurveBackToCenter = ({ from }: { from: "left" | "right" }) => (
  <AnimatedPath
    d={
      from === "left"
        ? "M 10 0 C 10 50, 10 50, 50 100"
        : "M 90 0 C 90 50, 90 50, 50 100"
    }
  />
);

// ✨ 찰칵! 효과 이미지 컴포넌트 (유지)
const FlashImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-stone-100">
      {/* Flash Overlay */}
      <motion.div
        className="absolute inset-0 bg-white z-20 pointer-events-none"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      />
      {/* Developing Effect */}
      <motion.div
        className="relative w-full h-full"
        initial={{ scale: 1.2, filter: "blur(5px) grayscale(100%)" }}
        whileInView={{ scale: 1, filter: "blur(0px) grayscale(0%)" }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw"
        />
      </motion.div>
    </div>
  );
};

export const Story = () => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-20 overflow-hidden bg-stone-50/50">
      <Section.Title category="Our Story" title="Our Story" />

      <div className="flex flex-col items-center">
        {EPISODES.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              className="w-full flex flex-col items-center relative"
            >
              {/* 컨텐츠 Row */}
              <div
                className={`w-full flex items-center justify-between gap-6 mb-0 ${isEven ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* 📸 사진 프레임 */}
                <motion.div
                  className="relative w-1/2 aspect-4/5"
                  initial={{
                    opacity: 0,
                    rotate: isEven ? -10 : 10,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    rotate: isEven ? -2 : 2,
                    scale: 1,
                  }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <div className="absolute inset-0 bg-white p-1.5 shadow-xl rounded-2xl">
                    <FlashImage src={item.image} alt={item.title} />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
                    className={`
                      absolute -top-2 ${isEven ? "-left-1" : "-right-1"} 
                      bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-30 border-2 border-white
                    `}
                  >
                    {item.year}
                  </motion.div>
                </motion.div>

                {/* 📝 텍스트 영역 */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={`w-1/2 flex flex-col justify-center ${isEven ? "text-left items-start" : "text-right items-end"}`}
                >
                  <h3 className="text-lg font-bold text-stone-800 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed whitespace-pre-wrap font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              </div>

              {/* 👣 발자국 길 (Mask 적용됨) */}
              {index < EPISODES.length - 1 && (
                <div className="w-full -my-6 relative z-0 opacity-80 pointer-events-none">
                  {isEven ? <CurveLeftToRight /> : <CurveRightToLeft />}
                </div>
              )}

              {index === EPISODES.length - 1 && (
                <div className="w-full -my-6 relative z-0 opacity-80 pointer-events-none">
                  <CurveBackToCenter from={isEven ? "left" : "right"} />
                </div>
              )}
            </div>
          );
        })}

        {/* 도착점 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-rose-100 z-10">
            <span className="text-4xl animate-pulse">💍</span>
          </div>

          <div className="text-center">
            <p className="text-rose-500 font-bold text-sm tracking-widest uppercase">
              Finally
            </p>
            <p className="text-stone-700 font-bold text-lg mt-1">Wedding Day</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
