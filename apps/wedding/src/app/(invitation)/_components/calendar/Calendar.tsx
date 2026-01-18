"use client";

import { motion } from "motion/react";

const HandDrawnCircle = () => {
  const STROKE_COLOR = "#F43F5E";
  const CIRCLE_DURATION = 1.5;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="overflow-visible"
        style={{ transform: "scale(1.4) rotate(-5deg)" }}
      >
        <motion.path
          d="M35,15 C65,5 95,25 92,55 C89,85 60,98 30,92 C5,87 0,50 20,25 C40,5 80,10 95,40 C105,70 75,95 45,95 C15,95 5,65 15,40 C25,15 65,15 85,35 C95,55 85,85 55,88"
          fill="none"
          stroke={STROKE_COLOR}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{
            once: false,
            margin: "-30% 0px -30% 0px",
          }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M80,0 L88,25 L65,10 L95,10 L72,25 Z"
          fill="none"
          stroke={STROKE_COLOR}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
          transition={{
            duration: 0.4,
            delay: CIRCLE_DURATION - 0.2,
            ease: "easeOut",
          }}
        />
      </svg>
    </div>
  );
};

export const Calendar = () => {
  const WEDDING_DAY = 19;

  const blanks = Array(3).fill(null);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  const weeks = [];
  for (let i = 0; i < totalSlots.length; i += 7) {
    weeks.push(totalSlots.slice(i, i + 7));
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-4 font-hahmlet">
      {/* 달력 헤더 */}
      <h3 className="text-center text-xl font-bold text-stone-800">
        2026년 4월
      </h3>

      {/* 달력 테이블 */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs text-stone-400 border-b border-stone-100">
            <th className="pb-3">SUN</th>
            <th className="pb-3">MON</th>
            <th className="pb-3">TUE</th>
            <th className="pb-3">WED</th>
            <th className="pb-3">THU</th>
            <th className="pb-3">FRI</th>
            <th className="pb-3">SAT</th>
          </tr>
        </thead>
        <tbody className="text-stone-700">
          {weeks.map((week, wIndex) => (
            <tr key={wIndex}>
              {week.map((day, dIndex) => {
                if (!day) return <td key={dIndex} className="p-2"></td>;

                const isWeddingDay = day === WEDDING_DAY;

                return (
                  <td
                    key={dIndex}
                    className="p-1 relative text-center align-middle"
                  >
                    <div className="relative inline-flex w-8 h-8 items-center justify-center z-10">
                      {/* 날짜 숫자 */}
                      <span
                        className={`${isWeddingDay ? "font-extrabold text-rose-400" : " text-sm font-medium"}`}
                      >
                        {day}
                      </span>

                      {/* 19일에만 동그라미 애니메이션 적용 */}
                      {isWeddingDay ? <HandDrawnCircle /> : null}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
