"use client";

import Calendar from "@icons/calendar.svg";
import Google from "@logos/google.png";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback } from "react";
import {
  buildGoogleCalendarUrl,
  buildNativeCalendarUrl,
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
  // ---------------------------------------------------------------------------
  // Google Calendar
  // ---------------------------------------------------------------------------

  const handleGoogleCalendar = useCallback(() => {
    const url = buildGoogleCalendarUrl({
      title,
      description,
      location,
      startDate,
      endDate,
    });
    window.open(url, "_blank");
  }, [title, description, location, startDate, endDate]);

  // ---------------------------------------------------------------------------
  // Native Calendar (Apple Calendar / 네이버 캘린더 등)
  // ---------------------------------------------------------------------------

  const handleNativeCalendar = useCallback(() => {
    const url = buildNativeCalendarUrl({
      title,
      description,
      location,
      startDate,
      endDate,
    });
    window.open(url, "_blank");
  }, [title, description, location, startDate, endDate]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex w-full gap-3 mt-6">
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
  );
}
