"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

type LocationButtonsProps = {
  placeName: string;
  address: string;
  lat: number;
  lng: number;
};

type MapType = "naver-map" | "kakao-map" | "tmap";

/**
 * 사용 방식
  <LocationButtons
    placeName="더베르G 웨딩"
    address="서울 영등포구 국회대로 612 지상2층,지하1층"
    lat={37.5257757}
    lng={126.902050869}
    />
 */

export const LocationButtons = ({
  placeName,
  address,
  lat,
  lng,
}: LocationButtonsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const encodedName = encodeURIComponent(placeName);

  const getUrl = useCallback(
    (type: MapType): string | null => {
      if (!isMobile) {
        switch (type) {
          case "naver-map":
            return `https://map.naver.com/v5/search/${encodedName}`;
          case "kakao-map":
            return `https://map.kakao.com/link/search/${encodedName}`;
          case "tmap":
            return null;
        }
      }
      // 모바일에서는 항상 URL이 있음
      return "mobile";
    },
    [isMobile, encodedName],
  );

  const handleConnect = (type: MapType) => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isMobile) {
      const url = getUrl(type);
      if (url) {
        window.open(url, "_blank");
      }
      return;
    }

    if (type === "naver-map") {
      if (isAndroid) {
        const intentUrl = `intent://search?query=${encodedName}&appname=com.example.wedding#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        const scheme = `nmap://search?query=${encodedName}&appname=com.example.wedding`;
        const storeUrl = "https://apps.apple.com/kr/app/id311867728";
        triggerApp(scheme, storeUrl);
      }
    } else if (type === "kakao-map") {
      if (isAndroid) {
        const intentUrl = `intent://search?q=${encodedName}#Intent;scheme=kakaomap;package=net.daum.android.map;end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        const scheme = `https://m.map.kakao.com/scheme/search?q=${encodedName}&p=${lat},${lng}`;
        const storeUrl = "https://apps.apple.com/kr/app/id304608425";
        triggerApp(scheme, storeUrl);
      }
    } else if (type === "tmap") {
      if (isAndroid) {
        const intentUrl = `intent://search?name=${encodedName}#Intent;scheme=tmap;package=com.skt.tmap.ku;end`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        const scheme = `tmap://search?name=${encodedName}`;
        const storeUrl = "https://apps.apple.com/kr/app/id431589174";
        triggerApp(scheme, storeUrl);
      }
    }
  };

  const triggerApp = useCallback((scheme: string, storeUrl: string) => {
    const start = Date.now();
    window.location.href = scheme;

    console.log("triggerApp", scheme, storeUrl);

    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.location.href = storeUrl;
      }
    }, 5000);
  }, []);

  const buttons: {
    type: MapType;
    bgColor: string;
    textColor?: string;
    label: string;
  }[] = [
    { type: "naver-map", bgColor: "bg-[#03C75A]", label: "네이버 지도" },
    {
      type: "kakao-map",
      bgColor: "bg-[#FAE100]",
      textColor: "text-black",
      label: "카카오맵",
    },
    {
      type: "tmap",
      bgColor: "bg-gradient-to-br from-[#0089CD] to-[#00C754]",
      label: "티맵",
    },
  ];

  const visibleButtons = buttons.filter(
    (button) => getUrl(button.type) !== null,
  );

  return (
    <div className="flex w-full items-center justify-center gap-3 py-4">
      {visibleButtons.map((button) => (
        <AppButton
          key={button.type}
          onClick={() => handleConnect(button.type)}
          bgColor={button.bgColor}
          textColor={button.textColor}
          label={button.label}
        />
      ))}
    </div>
  );
};

type AppButtonProps = {
  onClick: () => void;
  bgColor: string;
  textColor?: string;
  label: string;
};

const AppButton = ({
  onClick,
  bgColor,
  textColor = "text-white",
  label,
}: AppButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex h-12 flex-1 items-center justify-center rounded-xl 
        ${bgColor} ${textColor} text-sm font-bold shadow-md
        transition-shadow hover:shadow-lg
      `}
    >
      {label}
    </motion.button>
  );
};
