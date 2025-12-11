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
      width={40}
      height={32}
      viewBox="0 0 40 32"
      aria-hidden="true"
      className="drop-shadow-sm"
    >
      <rect x="4" y="6" width="8" height="8" fill="#fed7aa" />
      <rect x="4" y="4" width="8" height="3" fill="#0f172a" />
      <rect x="3" y="14" width="10" height="8" fill="#0f172a" />
      <rect x="7" y="16" width="2" height="3" fill="#f97373" />
      <rect x="24" y="6" width="8" height="8" fill="#fee2b5" />
      <rect x="24" y="4" width="8" height="3" fill="#854d0e" />
      <rect x="23" y="14" width="10" height="3" fill="#f973a1" />
      <rect x="22" y="17" width="12" height="6" fill="#fecdd3" />
      <rect x="26" y="3" width="2" height="2" fill="#f9a8d4" />
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
