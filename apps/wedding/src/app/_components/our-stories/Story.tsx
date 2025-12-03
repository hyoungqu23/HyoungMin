"use client";

import { motion, Transition } from "motion/react";
import Image from "next/image";

// --- 데이터 ---
const EPISODES = [
  {
    year: "2015",
    title: "우연히, 겨울",
    desc: "도서관 앞 벤치,\n따뜻한 캔커피 하나로 시작된 인연.",
    image: "/images/story_1.jpg",
  },
  {
    year: "2018",
    title: "너를 기다림",
    desc: "전역하던 날,\n꽃신을 신겨주며 다짐했던 약속.",
    image: "/images/story_2.jpg",
  },
  {
    year: "2023",
    title: "함께하는 여행",
    desc: "제주도 푸른 밤,\n우리는 서로의 가장 친한 친구가 되었다.",
    image: "/images/story_3.jpg",
  },
  {
    year: "2026",
    title: "새로운 시작",
    desc: "10년의 연애를 마치고,\n평생의 연인이 되기로 한 날.",
    image: "/images/story_4.jpg",
  },
];

// 🎨 발자국 설정 (터벅 터벅 느낌)
const PATH_PROPS = {
  fill: "none",
  stroke: "#FDA4AF", // rose-300
  strokeWidth: "7",
  strokeLinecap: "round" as const,
  strokeDasharray: "0 20", // 점 간격
};

const TRANSITION_PROPS: Transition = {
  duration: 2.5, // 걷는 속도 (조금 느긋하게)
  ease: "linear", // 뚜벅뚜벅 일정한 속도
};

// --- S자 곡선 컴포넌트들 ---
const CurveLeftToRight = () => (
  <svg
    className="w-full h-24 md:h-32 overflow-visible"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M 50 0 C 50 50, 50 50, 90 50 S 90 100, 90 100"
      {...PATH_PROPS}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={TRANSITION_PROPS}
    />
  </svg>
);

const CurveRightToLeft = () => (
  <svg
    className="w-full h-24 md:h-32 overflow-visible"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M 90 0 C 90 50, 90 50, 50 50 S 10 100, 10 100"
      {...PATH_PROPS}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={TRANSITION_PROPS}
    />
  </svg>
);

const CurveBackToCenter = ({ from }: { from: "left" | "right" }) => (
  <svg
    className="w-full h-24 md:h-32 overflow-visible"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <motion.path
      d={
        from === "left"
          ? "M 10 0 C 10 50, 10 50, 50 100"
          : "M 90 0 C 90 50, 90 50, 50 100"
      }
      {...PATH_PROPS}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={TRANSITION_PROPS}
    />
  </svg>
);

// ✨ 찰칵! 효과를 주는 이미지 컴포넌트
const FlashImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-stone-100">
      {/* 1. 하얀 섬광 (Flash Overlay) */}
      <motion.div
        className="absolute inset-0 bg-white z-20 pointer-events-none"
        initial={{ opacity: 1 }} // 처음엔 하얗게 가려져 있음
        whileInView={{ opacity: 0 }} // 팟! 하고 사라짐
        viewport={{ once: true, margin: "-20%" }} // 화면에 들어오면 트리거
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // 0.2초 딜레이 후 섬광 사라짐
      />

      {/* 2. 이미지 줌아웃 & 선명해짐 (Developing Effect) */}
      <motion.div
        className="relative w-full h-full"
        initial={{ scale: 1.2, filter: "blur(5px) grayscale(100%)" }}
        whileInView={{ scale: 1, filter: "blur(0px) grayscale(0%)" }}
        viewport={{ once: true, margin: "-20%" }}
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
      <div className="flex flex-col items-center">
        {/* Start Point */}
        <div className="flex flex-col items-center mb-0">
          <div className="w-2 h-2 rounded-full bg-rose-300 mb-1 animate-bounce" />
          <div className="px-4 py-1.5 bg-white text-rose-500 text-xs font-bold rounded-full shadow-sm border border-rose-100">
            Our Story Start
          </div>
        </div>

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
                {/* 📸 사진 프레임 (찰칵 효과 적용) */}
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
                    delay: 0.1, // 발자국보다 아주 살짝 늦게 찰칵
                  }}
                >
                  {/* 폴라로이드 흰 테두리 */}
                  <div className="absolute inset-0 bg-white p-1.5 shadow-xl rounded-2xl">
                    <FlashImage src={item.image} alt={item.title} />
                  </div>

                  {/* 연도 뱃지 (통통 튀어나옴) */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.6 }} // 사진 나오고 난 뒤 뿅!
                    className={`
                      absolute -top-2 ${isEven ? "-left-1" : "-right-1"} 
                      bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-30 border-2 border-white
                    `}
                  >
                    {item.year}
                  </motion.div>
                </motion.div>

                {/* 📝 텍스트 영역 (스르륵 등장) */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }} // 사진 찍히고 나서 글씨 써짐
                  className={`w-1/2 flex flex-col justify-center ${isEven ? "text-left items-start" : "text-right items-end"}`}
                >
                  <h3 className="text-lg font-serif font-bold text-stone-800 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed whitespace-pre-wrap font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              </div>

              {/* 👣 발자국 길 (Step Path) */}
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
            <p className="text-stone-700 font-serif font-bold text-lg mt-1">
              Wedding Day
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
