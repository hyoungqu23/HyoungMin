"use client";

import Copy from "@icons/copy.svg";
import Share from "@icons/share.svg";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { getGuestMessageCount } from "../../_actions/guestbook";
import { getHeartCount } from "../../_actions/hearts";

const ENV_WEDDING_URL = process.env.NEXT_PUBLIC_URL;
const WEDDING_TITLE = "이형민 ♥ 임희재 결혼합니다";
const WEDDING_DESCRIPTION =
  "2026년 4월 19일 오전 11시, 더베르G 웨딩에서 결혼식을 올립니다.";

const getWeddingUrl = () => ENV_WEDDING_URL ?? window.location.origin;
const getWeddingImageUrl = () =>
  new URL("/images/kakao-share.webp", getWeddingUrl()).toString();

export const ShareButtons = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const weddingUrl = getWeddingUrl();
    try {
      await navigator.clipboard.writeText(weddingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = weddingUrl;
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
        const weddingUrl = getWeddingUrl();
        await navigator.share({
          title: WEDDING_TITLE,
          text: WEDDING_DESCRIPTION,
          url: weddingUrl,
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
        <Image src={Copy} alt="Copy" width={16} height={16} />
        {copied ? "복사 완료!" : "링크 복사"}
      </button>

      {/* 카카오톡 공유하기 */}
      <OpenKakaoButton />

      {/* Web Share API */}
      <button
        onClick={handleWebShare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-full shadow-md transition-colors font-medium"
      >
        <Image src={Share} alt="Share" width={16} height={16} />
        공유하기
      </button>
    </div>
  );
};

export const OpenKakaoButton = () => {
  const handleOpenKakao = async () => {
    const kakao = window.Kakao;
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_SDK_API_KEY;

    if (!apiKey) {
      alert("카카오 공유를 위한 설정이 필요합니다.");
      return;
    }

    if (!kakao.isInitialized()) {
      kakao.init(apiKey);
    }

    const weddingUrl = getWeddingUrl();
    const weddingImageUrl = getWeddingImageUrl();

    const heartCount = await getHeartCount();
    const guestMessageCount = await getGuestMessageCount();

    kakao.Share.sendDefault({
      objectType: "location",
      address: "서울 영등포구 국회대로 612 지상2층",
      addressTitle: "더베르G 웨딩",
      content: {
        title: WEDDING_TITLE,
        description: WEDDING_DESCRIPTION,
        imageUrl: weddingImageUrl,
        link: {
          mobileWebUrl: weddingUrl,
          webUrl: weddingUrl,
        },
      },
      social: {
        likeCount: heartCount,
        commentCount: guestMessageCount,
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: weddingUrl,
            webUrl: weddingUrl,
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
