"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "../../_lib/scroll-lock";
import { Accordion } from "../common/Accordion";
import { KakaoMap } from "../location/KakaoMap";
import { LocationButtons } from "../location/LocationButtons";

// 2026-04-19 11:00 KST == 2026-04-19 02:00 UTC
const CEREMONY_AT_MS = Date.UTC(2026, 3, 19, 2, 0, 0);

const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6l12 12M18 6L6 18"
    />
  </svg>
);

export const HappyWeddingDay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [remainingMs, setRemainingMs] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const el = dialogRef.current;
    if (!el) return;

    disableBodyScroll(el);
    return () => {
      enableBodyScroll(el);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const tick = () => setRemainingMs(Math.max(0, CEREMONY_AT_MS - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="happy-wedding-day"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="happy-wedding-day-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-60 w-svw h-svh overflow-y-auto bg-black text-white"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="닫기"
            className="fixed top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm text-primary shadow-md transition-transform active:scale-95"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          <div className="w-full max-w-md mx-auto px-4 pt-16 pb-12 flex flex-col gap-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <h2
                id="happy-wedding-day-title"
                className="text-4xl font-bold font-great-vibes italic text-primary"
              >
                Happy Wedding Day
              </h2>
              <p className="font-playfair-display">HyoungMin & HeeJae</p>
              <div className="mt-4 flex flex-col items-center gap-2">
                {/* <p className="font-great-vibes text-xl text-primary">
                  Until the ceremony
                </p> */}
                <p
                  className="font-dseg7 text-5xl text-primary tracking-wider tabular-nums font-bold"
                  aria-live="polite"
                >
                  {formatCountdown(remainingMs)}
                </p>
              </div>
              <p className="font-pretendard text-base mt-2">
                <b>2026년 4월 19일 일요일 오전 11시</b>
                <br />
                더베르G 웨딩
                <br />
                서울시 영등포구 국회대로 612 2층
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <KakaoMap />
              <LocationButtons
                placeName="더베르G 웨딩"
                lat={37.5257757}
                lng={126.902050869}
              />

              <Accordion name="happy-wedding-day-location" title="약도">
                <Image
                  src="/images/location.webp"
                  alt="약도"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                />
              </Accordion>

              <ul className="flex flex-col gap-6 w-full font-pretendard [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2">
                <li>
                  <h3>자차로 오시는 길</h3>
                  <ul className="list-disc list-inside text-xs flex flex-col gap-1">
                    <li>네비게이션 [더베르G] 검색</li>
                    <li>국회대로 612 코레일유통사옥 2층 / 당산동34가 2-7</li>
                  </ul>
                </li>
                <li>
                  <h3>지하철로 오시는 길</h3>
                  <ul className="list-disc list-inside text-xs flex flex-col gap-1">
                    <li>
                      2, 5호선 영등포구청역 4번 출구에서 566m(도보 약 7분)
                    </li>
                  </ul>
                </li>
                <li>
                  <h3>버스로 오시는 길</h3>
                  <ul className="list-disc list-inside text-xs flex flex-col gap-1">
                    <li>서울시립청소년 문화센터[19-439]: 간선 660</li>
                    <li>하이서울유스호스텔[19-127]: 일반 5</li>
                    <li>
                      신화병원[19-121]: 좌석 700, 간선 605, 간선 661, 간선 760,{" "}
                      <br />
                      <span className="pl-28">지선 5616, 지선 5714</span>
                    </li>
                    <li>삼환아파트[19-125]: 직행 9030, 직행 8000</li>
                  </ul>
                </li>
                <li>
                  <h3>셔틀버스 안내</h3>
                  <ul className="list-disc list-inside text-xs flex flex-col gap-1">
                    <li>
                      2, 5호선 영등포구청역 5번 출구 뒤 ↔ 더베르G 주차장 입구
                      좌측
                    </li>
                    <li>2대 운행</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
