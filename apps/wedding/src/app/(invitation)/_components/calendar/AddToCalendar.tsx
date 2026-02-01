"use client";

import Calendar from "@icons/calendar.svg";
import Google from "@logos/google.png";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import {
  buildGoogleCalendarUrl,
  buildNativeCalendarUrl,
  isKakaoInAppBrowser,
  openInExternalBrowser,
} from "./calendar-utils";

// =============================================================================
// Types
// =============================================================================

interface AddToCalendarProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

// =============================================================================
// Component
// =============================================================================

export default function AddToCalendar({
  title,
  description,
  startDate,
  endDate,
  location,
}: AddToCalendarProps) {
  // Lazy initialization: 클라이언트에서만 실행됨
  const [isKakaoInApp] = useState(() => isKakaoInAppBrowser());
  const [showKakaoWarning, setShowKakaoWarning] = useState(false);

  // ---------------------------------------------------------------------------
  // Google Calendar
  // ---------------------------------------------------------------------------

  const handleGoogleCalendar = useCallback(() => {
    if (isKakaoInApp) {
      setShowKakaoWarning(true);
      return;
    }

    const url = buildGoogleCalendarUrl({
      title,
      description,
      location,
      startDate,
      endDate,
    });
    window.open(url, "_blank");
  }, [title, description, location, startDate, endDate, isKakaoInApp]);

  // ---------------------------------------------------------------------------
  // Native Calendar (Apple Calendar / 네이버 캘린더 등)
  // ---------------------------------------------------------------------------

  const handleNativeCalendar = useCallback(() => {
    if (isKakaoInApp) {
      setShowKakaoWarning(true);
      return;
    }

    const url = buildNativeCalendarUrl({
      title,
      description,
      location,
      startDate,
      endDate,
    });
    window.open(url, "_blank");
  }, [title, description, location, startDate, endDate, isKakaoInApp]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col w-full gap-3 mt-6">
      <div className="flex w-full gap-3">
        {/* 구글 캘린더 버튼 */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleCalendar}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white shadow-sm text-black font-bold text-sm hover:bg-primary transition-colors"
        >
          <Image src={Google} alt="Google" width={16} height={16} />
          구글 캘린더
        </motion.button>

        {/* 네이티브 캘린더 버튼 */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeCalendar}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary shadow-sm text-white font-bold text-sm hover:bg-primary/80 transition-colors"
        >
          <Image src={Calendar} alt="Calendar" width={16} height={16} />
          캘린더 앱 저장
        </motion.button>
      </div>

      {/* 카카오 인앱 브라우저 경고 메시지 */}
      <AnimatePresence>
        {showKakaoWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-3 p-4 bg-stone-100 rounded-xl text-center">
              <p className="text-sm text-stone-600 leading-relaxed">
                카카오톡 앱에서는 캘린더 저장이
                <br />
                지원되지 않아요. 😢
              </p>
              <button
                onClick={openInExternalBrowser}
                className="px-4 py-2 bg-[#FEE500] text-[#3C1E1E] rounded-full text-sm font-bold hover:bg-[#F5DC00] transition-colors"
              >
                외부 브라우저로 열기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
