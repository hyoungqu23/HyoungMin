"use client";

import { motion } from "motion/react";

// --- 1. 손으로 그린 듯한 동그라미 애니메이션 컴포넌트 ---
const HandDrawnCircle = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="overflow-visible"
        style={{ transform: "scale(1.4) rotate(-5deg)" }} // 살짝 키우고 기울여서 자연스럽게
      >
        <motion.path
          // 두 번 겹쳐 그린 듯한 자연스러운 패스
          d="M50,10 C25,10 10,35 10,50 C10,75 35,90 50,90 C75,90 90,65 90,50 C90,30 70,10 50,10 C40,10 20,20 20,50"
          fill="none"
          stroke="#F43F5E" // Rose-500 (포인트 컬러)
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }} // 화면에 보이면 그려짐
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
      </svg>
    </div>
  );
};

// --- 2. 2026년 4월 달력 컴포넌트 ---
export const Calendar = () => {
  const WEDDING_DAY = 19;

  // 2026년 4월 1일은 수요일(idx: 3)입니다.
  // 빈 칸: 일(0), 월(1), 화(2) -> 3개
  const blanks = Array(3).fill(null);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  // 주 단위(7일)로 쪼개기
  const weeks = [];
  for (let i = 0; i < totalSlots.length; i += 7) {
    weeks.push(totalSlots.slice(i, i + 7));
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
      {/* 달력 헤더 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-bold text-stone-800 tracking-widest">
          2026. 04.
        </h3>
      </div>

      {/* 달력 테이블 */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs text-stone-400 border-b border-stone-100">
            <th className="pb-3 font-normal text-rose-400">SUN</th>
            <th className="pb-3 font-normal">MON</th>
            <th className="pb-3 font-normal">TUE</th>
            <th className="pb-3 font-normal">WED</th>
            <th className="pb-3 font-normal">THU</th>
            <th className="pb-3 font-normal">FRI</th>
            <th className="pb-3 font-normal text-stone-400">SAT</th>
          </tr>
        </thead>
        <tbody className="text-stone-700">
          {weeks.map((week, wIndex) => (
            <tr key={wIndex}>
              {week.map((day, dIndex) => {
                // 날짜가 없는 빈 칸
                if (!day) return <td key={dIndex} className="p-2"></td>;

                const isWeddingDay = day === WEDDING_DAY;
                const isSunday = dIndex === 0;

                return (
                  <td
                    key={dIndex}
                    className="p-1 relative text-center align-middle"
                  >
                    <div className="relative inline-flex w-8 h-8 items-center justify-center z-10">
                      {/* 날짜 숫자 */}
                      <span
                        className={`
                        text-sm font-medium
                        ${isWeddingDay ? "font-bold text-stone-900" : ""}
                        ${isSunday && !isWeddingDay ? "text-rose-400" : ""}
                      `}
                      >
                        {day}
                      </span>

                      {/* 19일에만 동그라미 애니메이션 적용 */}
                      {isWeddingDay && <HandDrawnCircle />}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 디테일 문구 */}
      <div className="mt-6 text-center text-sm text-stone-500 font-serif">
        <p>토요일 오후 12시 30분</p>
      </div>
    </div>
  );
};
