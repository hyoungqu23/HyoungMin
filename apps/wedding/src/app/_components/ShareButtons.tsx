"use client";

import { motion } from "motion/react";
import { useState } from "react";

const WEDDING_URL = "https://wedding.example.com"; // TODO: 실제 URL로 변경
const WEDDING_TITLE = "형민 ♥ 신부 결혼합니다";
const WEDDING_DESCRIPTION =
  "2026년 4월 19일 오후 2시, 웨딩홀에서 결혼식을 올립니다.";

export const ShareButtons = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WEDDING_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 폴백: execCommand 사용
      const textArea = document.createElement("textarea");
      textArea.value = WEDDING_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: WEDDING_TITLE,
          text: WEDDING_DESCRIPTION,
          url: WEDDING_URL,
        });
      } catch (error) {
        // 사용자가 공유를 취소한 경우
        if ((error as Error).name !== "AbortError") {
          console.error("공유 실패:", error);
        }
      }
    } else {
      // Web Share API를 지원하지 않는 브라우저
      alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      {/* 주소 복사 */}
      <button
        onClick={handleCopyAddress}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        {copied ? "복사 완료!" : "주소 복사"}
      </button>

      {/* 카카오톡 공유하기 */}
      <OpenKakaoButton />

      {/* Web Share API */}
      <button
        onClick={handleWebShare}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-400 hover:bg-rose-500 text-white rounded-full transition-colors font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
        공유하기
      </button>
    </div>
  );
};

export const OpenKakaoButton = () => {
  const handleOpenKakao = () => {
    // 1. 유저 에이전트 확인
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    // 2. 안드로이드 처리 (Intent 방식 - 가장 확실함)
    if (isAndroid) {
      // 카카오톡 패키지명: com.kakao.talk
      // 앱이 있으면 실행, 없으면 마켓으로 이동하는 안드로이드 표준 포맷
      const intentUrl =
        "intent://#Intent;scheme=kakaotalk;package=com.kakao.talk;end";
      window.location.href = intentUrl;
      return;
    }

    // 3. 아이폰(iOS) 처리
    if (isIOS) {
      const scheme = "kakaotalk://"; // 카카오톡 실행 스키마
      const appStoreUrl = "https://apps.apple.com/app/id362057947"; // 앱스토어 주소

      const start = Date.now();

      // 앱 실행 시도
      window.location.href = scheme;

      // 1.5초 뒤에도 화면이 여전하다면(앱으로 전환 안됨) 스토어로 이동
      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.location.href = appStoreUrl;
        }
      }, 1500);
      return;
    }

    // 4. PC 등 기타 환경
    alert("모바일에서만 실행 가능한 기능입니다.");
  };

  return (
    <div className="flex justify-center mt-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenKakao}
        className="flex items-center gap-2 px-8 py-3 bg-[#FEE500] text-[#3C1E1E] rounded-xl font-bold shadow-md hover:bg-[#F5DC00] transition-colors"
      >
        {/* 카카오톡 심볼 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.746 1.818 5.161 4.554 6.517-.144.525-.927 3.378-.964 3.602 0 0-.019.158.084.22.103.061.224.014.224.014.296-.041 3.434-2.235 3.97-2.62.694.097 1.41.147 2.132.147 5.523 0 10-3.463 10-7.88C22 6.463 17.523 3 12 3z" />
        </svg>
        카카오톡 열기
      </motion.button>
    </div>
  );
};
