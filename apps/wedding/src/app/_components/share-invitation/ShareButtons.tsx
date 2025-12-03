"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Copy } from "../../_icons/Copy";

const WEDDING_URL = process.env.NEXT_PUBLIC_URL!;
const WEDDING_TITLE = "이형민 ♥ 임희재 결혼합니다";
const WEDDING_DESCRIPTION =
  "2026년 4월 19일 오전 11시, 더베르G 웨딩에서 결혼식을 올립니다.";

export const ShareButtons = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WEDDING_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
        if ((error as Error).name !== "AbortError") {
          console.error("공유 실패:", error);
        }
      }
    } else {
      alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full py-12">
      {/* 링크 복사 */}
      <button
        onClick={handleCopyAddress}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full shadow-md transition-colors"
      >
        <Copy />
        {copied ? "복사 완료!" : "링크 복사"}
      </button>

      {/* 카카오톡 공유하기 */}
      <OpenKakaoButton />

      {/* Web Share API */}
      <button
        onClick={handleWebShare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-400 hover:bg-rose-500 text-white rounded-full shadow-md transition-colors font-medium"
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
    const kakao = window.Kakao;

    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_SDK_API_KEY!);
    }

    kakao.Share.sendDefault({
      objectType: "location",
      address: "서울 영등포구 국회대로 612 지상2층",
      addressTitle: "더베르G 웨딩",
      content: {
        title: WEDDING_TITLE,
        description: WEDDING_DESCRIPTION,
        imageUrl: "",
        link: {
          mobileWebUrl: WEDDING_URL,
          webUrl: WEDDING_URL,
        },
      },
      social: {
        likeCount: 0,
        commentCount: 0,
        viewCount: 0,
        subscriberCount: 0,
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: WEDDING_URL,
            webUrl: WEDDING_URL,
          },
        },
      ],
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleOpenKakao}
      className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-[#FEE500] text-[#3C1E1E] rounded-full font-bold shadow-md hover:bg-[#F5DC00] transition-colors"
    >
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
  );
};
