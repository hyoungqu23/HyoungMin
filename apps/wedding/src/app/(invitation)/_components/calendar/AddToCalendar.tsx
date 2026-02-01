"use client";

import Calendar from "@icons/calendar.svg";
import Google from "@logos/google.png";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  formatToIcsDate,
  formatToKakaoUtc,
  isInAppBrowser,
  isKakaoInAppBrowser,
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
  const isKakaoInApp = isKakaoInAppBrowser();

  // OAuth 콜백 pending 상태 확인 (초기 렌더링 시)
  const hasPendingKakaoAuth =
    isKakaoInApp &&
    typeof window !== "undefined" &&
    (() => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const pending = sessionStorage.getItem("kakao_talk_calendar_pending");
      return Boolean(code && pending);
    })();

  const [isKakaoProcessing, setIsKakaoProcessing] =
    useState(hasPendingKakaoAuth);
  const isProcessingRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Kakao Calendar API
  // ---------------------------------------------------------------------------

  const requestKakaoCalendarEvent = useCallback(async () => {
    const kakao = window.Kakao;
    if (!kakao?.API || !kakao?.Auth || !kakao?.isInitialized?.()) {
      throw new Error("Kakao SDK is not ready.");
    }

    await kakao.API.request({
      url: "/v2/api/calendar/create/event",
      data: {
        calendar_id: "primary",
        event: JSON.stringify({
          title,
          description,
          time: {
            start_at: formatToKakaoUtc(startDate),
            end_at: formatToKakaoUtc(endDate),
            time_zone: "Asia/Seoul",
          },
          location: { name: location },
        }),
      },
    });
  }, [title, description, startDate, endDate, location]);

  const handleKakaoCalendar = useCallback(() => {
    const kakao = window.Kakao;
    if (!kakao?.Auth || !kakao?.isInitialized?.()) {
      alert("카카오 SDK가 준비되지 않았어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    // 이미 토큰이 있으면 바로 이벤트 생성
    if (kakao.Auth.getAccessToken?.()) {
      setIsKakaoProcessing(true);
      requestKakaoCalendarEvent()
        .then(() => alert("톡캘린더에 추가했어요."))
        .catch(() =>
          alert("톡캘린더 추가에 실패했어요. 잠시 후 다시 시도해 주세요."),
        )
        .finally(() => setIsKakaoProcessing(false));
      return;
    }

    // 토큰이 없으면 OAuth 인증 시작
    sessionStorage.setItem("kakao_talk_calendar_pending", "1");
    const redirectUri = `${window.location.origin}${window.location.pathname}`;

    if (!kakao.Auth.authorize) {
      alert("카카오 로그인 설정이 필요해요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    kakao.Auth.authorize({ redirectUri, scope: "talk_calendar" });
  }, [requestKakaoCalendarEvent]);

  // OAuth 콜백 처리
  useEffect(() => {
    if (!isKakaoInApp || isProcessingRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const pending = sessionStorage.getItem("kakao_talk_calendar_pending");

    if (!code || !pending) return;

    isProcessingRef.current = true;
    const redirectUri = `${window.location.origin}${window.location.pathname}`;

    fetch("/api/kakao/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Token exchange failed.");
        const data = (await res.json()) as { access_token?: string };
        if (!data.access_token) throw new Error("Missing access token.");

        window.Kakao?.Auth?.setAccessToken?.(data.access_token);
        await requestKakaoCalendarEvent();

        sessionStorage.removeItem("kakao_talk_calendar_pending");

        // URL에서 code 파라미터 제거
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());

        alert("톡캘린더에 추가했어요.");
      })
      .catch(() => alert("톡캘린더 추가에 실패했어요. 다시 시도해 주세요."))
      .finally(() => {
        isProcessingRef.current = false;
        setIsKakaoProcessing(false);
      });
  }, [isKakaoInApp, requestKakaoCalendarEvent]);

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
  // Native Calendar (ICS Download)
  // ---------------------------------------------------------------------------

  const handleNativeCalendar = useCallback(async () => {
    const start = formatToIcsDate(startDate);
    const end = formatToIcsDate(endDate);
    const icsContent = buildIcsContent({
      title,
      description,
      location,
      start,
      end,
    });

    // Web Share API 지원 시 공유 시도
    const file = new File([icsContent], "wedding_event.ics", {
      type: "text/calendar;charset=utf-8",
    });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title, text: description });
        return;
      } catch {
        // 공유 취소 또는 실패 시 다운로드로 fallback
      }
    }

    // API Route를 통한 다운로드
    const params = new URLSearchParams({
      title,
      description,
      location,
      start,
      end,
      tz: "Asia/Seoul",
    });
    const downloadUrl = `/api/calendar?${params.toString()}`;

    if (isInAppBrowser()) {
      window.location.href = downloadUrl;
      return;
    }

    // 일반 브라우저: anchor 클릭으로 다운로드
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "wedding_event.ics";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* 네이티브/카카오 캘린더 버튼 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={isKakaoInApp ? handleKakaoCalendar : handleNativeCalendar}
        disabled={isKakaoProcessing}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary shadow-sm text-white font-bold text-sm hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        <Image src={Calendar} alt="Calendar" width={16} height={16} />
        {isKakaoInApp ? "톡캘린더 추가" : "캘린더 앱 저장"}
      </motion.button>
    </div>
  );
}
