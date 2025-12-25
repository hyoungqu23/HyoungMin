"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "../../_lib/scroll-lock";
import { AttendanceForm } from "./AttendanceForm";

const ChevronUp = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

export const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const el = sheetRef.current;
    if (!el) return;

    // 스크롤락은 "바텀시트(모달) 엘리먼트"를 타겟으로 걸어야 중복 모달/스플래시와 충돌이 덜합니다.
    disableBodyScroll(el);
    return () => {
      enableBodyScroll(el);
    };
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <AnimatePresence>
      {!isOpen ? (
        <div
          key="floating-button"
          className="fixed bottom-4 w-fit right-2 z-50 flex justify-end pointer-events-none"
        >
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={toggle}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-rose-400 px-6 py-3 text-white shadow-lg shadow-rose-200 hover:bg-rose-300 transition-colors active:scale-95"
          >
            <span className="font-bold">참석 의사 전달하기 💌</span>
          </motion.button>
        </div>
      ) : (
        <>
          {/* 딤드 레이어 */}
          <motion.div
            key="dimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* 바텀 시트 */}
          <motion.div
            key="bottom-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-3xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* 헤더 */}
            <div
              className="flex items-center justify-between px-6 py-4 bg-rose-50/50 border-b border-rose-100 cursor-pointer"
              onClick={toggle}
            >
              <h3 className="font-bold text-stone-800">참석 여부 전달</h3>
              <div className="p-1 rounded-full hover:bg-rose-100 transition text-rose-400">
                <ChevronUp className="w-6 h-6 rotate-180" />
              </div>
            </div>

            {/* 폼 바디 */}
            <AttendanceForm onSuccess={toggle} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
