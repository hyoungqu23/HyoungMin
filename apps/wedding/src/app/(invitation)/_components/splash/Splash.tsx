"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "../../_lib/scroll-lock";

const FallingRibbons = dynamic(
  () => import("./FallingRibbons").then((mod) => mod.FallingRibbons),
  {
    ssr: false,
  },
);

const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const Splash = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isCountFinished, setIsCountFinished] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const splashRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const monthRef = useRef<HTMLSpanElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);

  const DURATION = 2500;
  const START_DATE = "2015-12-26";
  const END_DATE = "2026-04-19";

  useLayoutEffect(() => {
    const el = splashRef.current;
    if (!el) return;

    disableBodyScroll(el);
    return () => {
      enableBodyScroll(el);
    };
  }, []);

  useEffect(() => {
    const startTimestamp = new Date(START_DATE).getTime();
    const endTimestamp = new Date(END_DATE).getTime();
    const totalDiff = endTimestamp - startTimestamp;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const timeElapsed = time - startTime;
      const progress = Math.min(timeElapsed / DURATION, 1);
      const easedProgress = easeInOutCubic(progress);
      const currentTimestamp = startTimestamp + totalDiff * easedProgress;
      const currentDate = new Date(currentTimestamp);

      if (yearRef.current)
        yearRef.current.innerText = String(currentDate.getFullYear());
      if (monthRef.current)
        monthRef.current.innerText = String(
          currentDate.getMonth() + 1,
        ).padStart(2, "0");
      if (dayRef.current)
        dayRef.current.innerText = String(currentDate.getDate()).padStart(
          2,
          "0",
        );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        const endObj = new Date(END_DATE);
        if (yearRef.current)
          yearRef.current.innerText = String(endObj.getFullYear());
        if (monthRef.current)
          monthRef.current.innerText = String(endObj.getMonth() + 1).padStart(
            2,
            "0",
          );
        if (dayRef.current)
          dayRef.current.innerText = String(endObj.getDate()).padStart(2, "0");
        setIsCountFinished(true);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      // 오프닝 애니메이션(2.4s) 동안은 계속 잠궈두고, 실제로 스플래시가 사라지는 시점에만 잠금을 풉니다.
      const el = splashRef.current;
      if (el) enableBodyScroll(el);
      setShowSplash(false);
    }, 2400);
  };

  if (!showSplash) return null;

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 max-w-screen z-100 flex items-center justify-center pointer-events-auto overflow-hidden bg-pink-50/30"
    >
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <FallingRibbons />
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 h-full w-1/2 z-20 overflow-hidden will-change-transform"
        style={{
          transformOrigin: "top right",
          background:
            "linear-gradient(-90deg, #FFF0F5 0%, #FF87AB20 10%, #FFF0F5 20%, #FF87AB50 30%, #FFF0F5 50%, #FF87AB20 60%, #FFF0F5 80%, #FF87AB50 95%, #FFF0F5 100%)",
        }}
        initial={{ x: 0, scaleX: 1, skewX: 0 }}
        animate={
          isOpening
            ? { x: "-100%", scaleX: 0.2, skewX: -15 }
            : { x: 0, scaleX: 1, skewX: 0 }
        }
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0 bg-[#FFF5F7] z-10"
          animate={{ opacity: isOpening ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeIn" }}
        />

        <div className="absolute inset-0 bg-linear-to-r from-transparent to-rose-900/5 z-20 pointer-events-none" />
      </motion.div>

      <motion.div
        className="absolute right-0 top-0 h-full w-1/2 z-20 overflow-hidden will-change-transform"
        style={{
          transformOrigin: "top left",
          background:
            "linear-gradient(-90deg, #FFF0F5 0%, #FF87AB20 10%, #FFF0F5 20%, #FF87AB50 30%, #FFF0F5 50%, #FF87AB20 60%, #FFF0F5 80%, #FF87AB50 95%, #FFF0F5 100%)",
        }}
        initial={{ x: 0, scaleX: 1, skewX: 0 }}
        animate={
          isOpening
            ? { x: "100%", scaleX: 0.2, skewX: 15 }
            : { x: 0, scaleX: 1, skewX: 0 }
        }
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0 bg-[#FFF5F7] z-10"
          animate={{ opacity: isOpening ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeIn" }}
        />

        <div className="absolute inset-0 bg-linear-to-l from-transparent to-rose-900/5 z-20 pointer-events-none" />
      </motion.div>

      <motion.div
        className="relative z-40 flex flex-col items-center justify-center gap-6 h-full"
        animate={
          isOpening
            ? { opacity: 0, scale: 1.1, filter: "blur(20px)" }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 1.5 }}
      >
        <div className="flex flex-col items-center select-none drop-shadow-2xl gap-2">
          <div className="flex items-end gap-1 text-5xl font-bold tracking-tightest font-yeongwol text-stone-800 md:text-7xl">
            <span ref={yearRef} className="tabular-nums">
              2015
            </span>
            .
            <span ref={monthRef} className="tabular-nums w-fit text-center">
              12
            </span>
            .
            <span ref={dayRef} className="tabular-nums w-fit text-center">
              26
            </span>
          </div>

          <p className="text-sm font-medium tracking-[0.2em] text-rose-400 uppercase font-yeongwol">
            Wedding Day
          </p>
        </div>

        <AnimatePresence>
          {isCountFinished && !isOpening ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-sm font-medium">초대를 받으시겠습니까?</p>
              <motion.button
                onClick={handleOpen}
                className="group relative inline-flex items-center gap-3 px-16 py-3 bg-rose-400 text-white rounded-full overflow-hidden transition-all hover:bg-rose-500 shadow-xl hover:shadow-2xl hover:shadow-rose-200"
              >
                <span className="relative font-semibold font-yeongwol">
                  Yes
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="w-full h-20" />
          )}
        </AnimatePresence>
      </motion.div>

      <div
        className={`absolute inset-0 bg-white z-10 ${isOpening ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
};
