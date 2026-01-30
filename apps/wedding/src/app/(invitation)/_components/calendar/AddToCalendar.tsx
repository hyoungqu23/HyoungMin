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
  // 아이폰(Safari), 갤럭시(Chrome/Samsung Internet), 카카오 인앱 브라우저 모두 호환
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

    // 인앱 브라우저 감지 (카카오, 네이버, 인스타그램 등)
    const ua = navigator.userAgent.toLowerCase();
    const isInAppBrowser =
      ua.includes("kakaotalk") ||
      ua.includes("naver") ||
      ua.includes("instagram") ||
      ua.includes("fbav") ||
      ua.includes("line");

    if (isInAppBrowser) {
      // 인앱 브라우저: Data URI 방식 사용 (Blob URL이 동작하지 않음)
      // Base64 인코딩하여 새 창에서 열기
      const base64 = btoa(unescape(encodeURIComponent(icsContent)));
      const dataUri = `data:text/calendar;charset=utf-8;base64,${base64}`;
      window.location.href = dataUri;
    } else {
      // 일반 브라우저: 기존 Blob 다운로드 방식 사용
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
    }
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
