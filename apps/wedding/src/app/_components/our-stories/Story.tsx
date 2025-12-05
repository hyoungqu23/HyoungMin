"use client";

import { motion } from "motion/react";
import Image from "next/image";
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

export const Story = () => {
  return (
    <Section className="flex flex-col items-center gap-10">
      <Section.Title category="Our Story" title="Our Story" />

      <div className="flex flex-col items-center gap-10">
        {EPISODES.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              className="w-full flex flex-col items-center relative"
            >
              {/* 컨텐츠 Row */}
              <div
                className={`w-full flex items-center justify-between gap-6 mb-0 ${isEven ? "flex-row rotate-3" : "flex-row-reverse -rotate-3"}`}
              >
                <motion.div
                  className="relative w-[150px] aspect-square"
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
                  <div
                    className={`absolute inset-0 ${isEven ? "-left-4 -bottom-4" : "-right-4 -top-4"}`}
                  >
                    <Image
                      src="/images/frame_circle.svg"
                      alt="Flower Frame"
                      fill
                      className={`${isEven ? "" : "rotate-180"} z-20 scale-120`}
                    />
                  </div>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-full overflow-hidden"
                  />
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
            </div>
          );
        })}

        {/* 도착점 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-rose-100 z-10">
            <span className="text-4xl animate-pulse">💍</span>
          </div>

          <div className="text-center">
            <p className="text-rose-500 font-bold text-sm tracking-widest uppercase">
              Finally
            </p>
            <p className="text-stone-700 font-bold text-lg font-serif">
              Wedding Day
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
