"use client";

import Calendar from "@icons/calendar.svg";
import Google from "@logos/google.png";
import { motion } from "motion/react";
import Image from "next/image";

interface AddToCalendarProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

export default function AddToCalendar({
  title,
  description,
  startDate,
  endDate,
  location,
}: AddToCalendarProps) {
  const parseDateTime = (dateStr: string) => {
    const [datePart, timePart = "00:00"] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day) ||
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    return new Date(year, month - 1, day, hour, minute);
  };

  const getFormattedDate = (dateStr: string) => {
    const date = parseDateTime(dateStr);
    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const DD = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${YYYY}${MM}${DD}T${HH}${mm}00`;
  };

  // 1. 구글 캘린더 (웹 링크)
  // 노션 캘린더는 구글 캘린더와 동기화되므로 이 방식을 주로 사용합니다.
  const handleGoogleCalendar = () => {
    const start = getFormattedDate(startDate);
    const end = getFormattedDate(endDate);

    const url =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(title)}` +
      `&dates=${start}/${end}` +
      `&details=${encodeURIComponent(description)}` +
      `&location=${encodeURIComponent(location)}` +
      `&ctz=Asia/Seoul`; // 한국 시간대 명시

    window.open(url, "_blank");
  };

  // 2. 기본 캘린더 (ICS 파일 다운로드 -> 앱 실행)
  // 아이폰(Safari), 갤럭시(Chrome/Samsung Internet) 모두 호환
  const handleNativeCalendar = () => {
    const start = getFormattedDate(startDate);
    const end = getFormattedDate(endDate);

    // ICS 파일 내용 작성
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//KR",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `DTSTART;TZID=Asia/Seoul:${start}`,
      `DTEND;TZID=Asia/Seoul:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    // Blob 생성 및 다운로드 트리거
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wedding_event.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex w-full gap-3 mt-6">
      {/* 구글/노션 캘린더 버튼 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleGoogleCalendar}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white shadow-sm text-black font-bold text-sm hover:bg-primary transition-colors"
      >
        <Image src={Google} alt="Google" width={16} height={16} />
        구글 캘린더
      </motion.button>

      {/* 기본 캘린더 (애플/삼성) 버튼 */}
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
