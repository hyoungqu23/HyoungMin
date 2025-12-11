"use client";

import { motion, Transition } from "motion/react";
import { useMemo } from "react";

type WeddingProgressBarProps = {
  startDate?: string;
  endDate?: string;
};

const DEFAULT_START = "2015-12-26";
const DEFAULT_END = "2026-04-19";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const diffInDays = (a: Date, b: Date) =>
  Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);

const PixelCouple = () => {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 26 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 1.00391H1V9.00391H9V1.00391Z" fill="#FED7AA" />
      <path d="M9 0.00390625H1V3.00391H9V0.00390625Z" fill="black" />
      <path d="M10 9.00391H0V17.0039H10V9.00391Z" fill="black" />
      <path
        d="M6 9.00391H4V13.0039L5 14.0039L6 13.0039V9.00391Z"
        fill="#F97373"
      />
      <path d="M22 3.00391H16V8.00391H22V3.00391Z" fill="#FEE2B5" />
      <path d="M22 1.00391H16V3.00391H22V1.00391Z" fill="#854D0E" />
      <path
        d="M22 8.00391C21.259 7.01595 16.741 7.01595 16 8.00391C15.259 8.99186 14 11.0038 14 11.0038H24C24 11.0038 22.741 8.99186 22 8.00391Z"
        fill="#F973A1"
      />
      <path
        d="M24.0003 11.0039H14.0003C14.0003 11.0039 11.9703 13.9011 12.0003 16.0039C12.0304 18.1067 25.9703 18.1067 26.0003 16.0039C26.0304 13.9011 24.0003 11.0039 24.0003 11.0039Z"
        fill="#FECDD3"
      />
      <path
        d="M18.9997 2.00373C19.433 1.94957 19.433 0.0578817 18.9997 0.00372568C18.5665 -0.0504303 17.9997 0.503726 17.9997 0.503726C17.9997 0.503726 17.433 -0.0504303 16.9997 0.00372568C16.5665 0.0578816 16.5665 1.94957 16.9997 2.00373C17.433 2.05788 17.9997 1.50373 17.9997 1.50373C17.9997 1.50373 18.5665 2.05788 18.9997 2.00373Z"
        fill="#F9A8D4"
      />
    </svg>
  );
};

export const WeddingProgressBar = ({
  startDate = DEFAULT_START,
  endDate = DEFAULT_END,
}: WeddingProgressBarProps) => {
  const { progressPct, daysUntil, totalDays } = useMemo(() => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      const total = Math.max(diffInDays(end, start), 1);
      const elapsed = clamp(diffInDays(today, start), 0, total);
      const remaining = clamp(diffInDays(end, today), 0, total);

      const pct = clamp((elapsed / total) * 100, 0, 100);

      return {
        progressPct: pct,
        daysUntil: remaining,
        totalDays: total,
      };
    } catch {
      return { progressPct: 0, daysUntil: 0, totalDays: 0 };
    }
  }, [startDate, endDate]);

  const transitionSettings: Transition = {
    duration: 1.5,
    ease: "easeOut",
    delay: 0.2,
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-5 bg-white/70 backdrop-blur-sm rounded-3xl border border-rose-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>{startDate}</span>
        <span className="font-medium text-rose-500">
          결혼식까지 D-{daysUntil.toLocaleString()}일
        </span>
        <span>{endDate}</span>
      </div>

      <div className="text-[11px] text-center text-stone-400">
        만난지 {totalDays.toLocaleString()}일째
      </div>

      <div className="relative mt-2 w-full">
        <div className="w-full h-3 rounded-full bg-rose-100 overflow-hidden">
          <motion.div
            className="h-full bg-rose-400"
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPct}%` }}
            viewport={{ once: false, amount: 0.5 }}
            transition={transitionSettings}
          />
        </div>

        <motion.div
          className="absolute -top-8"
          initial={{ left: 0 }}
          whileInView={{ left: `${progressPct}%` }}
          viewport={{ once: false, amount: 0.5 }}
          transition={transitionSettings}
          style={{ x: "-50%" }}
        >
          <PixelCouple />
        </motion.div>
      </div>
    </div>
  );
};
