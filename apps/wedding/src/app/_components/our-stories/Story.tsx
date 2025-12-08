"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Section } from "../common/Section";

// --- 데이터 ---
const EPISODES = [
  {
    year: "2015",
    title: "첫 만남, 겨울",
    desc: "서로의 온기가 필요했던\n유난히 추웠던 그 겨울날,\n우리의 이야기가 시작되었습니다.",
    image: "/images/sample.jpg",
  },
  {
    year: "2016",
    title: "첫 벚꽃, 봄",
    desc: "함께 맞이한 첫 봄,\n흩날리는 벚꽃 아래에서\n수줍게 잡은 두 손.",
    image: "/images/sample.jpg",
  },
  {
    year: "2018",
    title: "함께하는 여행",
    desc: "낯선 곳으로의 여행,\n그 속에서 발견한\n서로의 새로운 모습들.",
    image: "/images/sample.jpg",
  },
  {
    year: "2020",
    title: "소중한 일상",
    desc: "특별하지 않아도 좋은,\n매일매일 채워가는\n우리만의 소소한 행복.",
    image: "/images/sample.jpg",
  },
  {
    year: "2025",
    title: "프러포즈",
    desc: "평생을 약속한 순간,\n떨리는 목소리로 전한\n진심 어린 고백.",
    image: "/images/sample.jpg",
  },
  {
    year: "2026",
    title: "새로운 시작",
    desc: "이제 연인이 아닌 부부로서\n함께 내딛는 첫걸음,\n그 설레는 시작.",
    image: "/images/sample.jpg",
  },
];

const TimelineItem = ({
  data,
  index,
}: {
  data: (typeof EPISODES)[0];
  index: number;
}) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative flex w-full items-center justify-between mb-24 md:mb-32 ${
        isEven ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* 1. 이미지 영역 (카드 느낌) */}
      <motion.div
        className={`relative w-5/12 ${isEven ? "pl-4 md:pl-10" : "pr-4 md:pr-10"}`} // 중앙 라인과의 간격
        initial={{ opacity: 0, x: isEven ? 50 : -50, rotate: isEven ? -5 : 5 }}
        whileInView={{
          opacity: 1,
          x: 0,
          rotate: isEven ? 2 : -2, // 살짝 틀어진 느낌 유지 (자연스럽게)
        }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 0 }}
          className="relative aspect-[4/5] w-full max-w-[280px] mx-auto bg-white p-2 md:p-3 shadow-lg rounded-sm transform transition-transform"
          style={{
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)", // 부드러운 그림자
          }}
        >
          {/* 사진 구멍/테이프 장식 (옵션) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 opacity-20 z-10">
            {/* 테이프 디자인 등 추가 가능 */}
          </div>

          <div className="relative w-full h-full overflow-hidden rounded-sm bg-stone-100">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 연도 뱃지 (사진 위에 살짝 걸치게) */}
          <div className="absolute -bottom-3 right-4 bg-rose-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
            {data.year}
          </div>
        </motion.div>
      </motion.div>

      {/* 2. 중앙 타임라인 노드 (점) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 w-8 h-8">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          className="w-4 h-4 rounded-full bg-rose-400 ring-4 ring-white shadow-sm"
        />
      </div>

      {/* 3. 텍스트 영역 */}
      <motion.div
        className={`w-5/12 flex flex-col justify-center ${
          isEven
            ? "items-start text-left pr-4 md:pr-10"
            : "items-end text-right pl-4 md:pl-10"
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="text-rose-500 font-serif text-sm md:text-base font-medium mb-1 tracking-wider">
          Episode {index + 1}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-3 break-keep">
          {data.title}
        </h3>
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium font-sans opacity-80">
          {data.desc}
        </p>
      </motion.div>
    </div>
  );
};

export const Story = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section className="relative overflow-hidden ">
      <div className="relative z-10 flex flex-col items-center gap-16 md:gap-24 w-full max-w-3xl mx-auto px-4">
        <Section.Title category="Love Story" title="우리가 걸어온 길" />

        <div ref={containerRef} className="relative w-full">
          {/* 중앙 연결 선 (배경 라인) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-stone-200 rounded-full" />

          {/* 스크롤에 따라 채워지는 선 (진행 라인) */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2 bg-rose-300 rounded-full origin-top z-0"
          />

          <div className="pt-10 pb-20">
            {EPISODES.map((item, index) => (
              <TimelineItem key={index} data={item} index={index} />
            ))}
          </div>

          {/* 마지막 엔딩 섹션 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex flex-col items-center gap-4 relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-rose-100"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded-full flex items-center justify-center border-2 border-rose-100 text-3xl md:text-4xl">
              💍
            </div>
            <div className="text-center">
              <p className="text-stone-500 text-sm font-serif italic mb-1">
                And finally...
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-stone-800">
                12월 8일, 우리 결혼합니다
              </h3>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};
