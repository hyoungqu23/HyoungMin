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
  const [isVisible, setIsVisible] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);

  // 스크롤 감지 로직
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleScroll = () => {
      setIsVisible(false);

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setIsVisible(true);
      }, 300); // 스크롤 멈추고 0.3초 뒤에 등장
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const el = sheetRef.current;
    if (!el) return;

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
            animate={
              isVisible
                ? { y: 0, opacity: 1, scale: 1 }
                : { y: 100, opacity: 0, scale: 0.9 }
            }
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggle}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <span className="text-xs font-bold">참석 의사 전달하기</span>
          </motion.button>
        </div>
      ) : (
        <>
          <motion.div
            key="dimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all"
          />

          <motion.div
            key="bottom-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-3xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[95vh]"
          >
            <div
              className="flex items-center justify-between px-6 py-4 bg-primary/10 border-b border-primary/20 cursor-pointer"
              onClick={toggle}
            >
              <h3 className="font-bold text-primary">참석 여부 전달</h3>
              <div className="p-1 rounded-full transition text-primary">
                <ChevronUp className="w-6 h-6 rotate-180" />
              </div>
            </div>

            {/* 폼 바디 */}
            <AttendanceForm />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
