"use client";

import { motion } from "motion/react";
import { useCallback } from "react";

type LocationButtonsProps = {
  placeName: string;
  lat: number;
  lng: number;
};

type MapType = "naver-map" | "kakao-map" | "tmap";

export const LocationButtons = ({
  placeName,
  lat,
  lng,
}: LocationButtonsProps) => {
  const encodedName = encodeURIComponent(placeName);

  const getWebUrl = useCallback(
    (type: MapType): string | null => {
      switch (type) {
        case "naver-map":
          return `https://map.naver.com/v5/search/${encodedName}`;
        case "kakao-map":
          return `https://map.kakao.com/link/search/${encodedName}`;
        case "tmap":
          return null;
      }
    },
    [encodedName],
  );

  const triggerApp = useCallback((scheme: string, storeUrl: string) => {
    const start = Date.now();
    window.location.assign(scheme);

    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.location.assign(storeUrl);
      }
    }, 5000);
  }, []);

  const handleConnect = (type: MapType) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isMobile) {
      const url = getWebUrl(type);
      if (url) {
        window.open(url, "_blank");
      } else {
        alert("해당 지도 앱은 모바일에서만 지원합니다.");
      }
      return;
    }

    if (type === "naver-map") {
      if (isAndroid) {
        const intentUrl = `intent://search?query=${encodedName}&appname=com.example.wedding#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`;

        window.location.assign(intentUrl);
      } else if (isIOS) {
        const scheme = `nmap://search?query=${encodedName}&appname=com.example.wedding`;
        const storeUrl = "https://apps.apple.com/kr/app/id311867728";
        triggerApp(scheme, storeUrl);
      }
    } else if (type === "kakao-map") {
      if (isAndroid) {
        const intentUrl = `intent://search?q=${encodedName}#Intent;scheme=kakaomap;package=net.daum.android.map;end`;

        window.location.assign(intentUrl);
      } else if (isIOS) {
        const scheme = `https://m.map.kakao.com/scheme/search?q=${encodedName}&p=${lat},${lng}`;
        const storeUrl = "https://apps.apple.com/kr/app/id304608425";
        triggerApp(scheme, storeUrl);
      }
    } else if (type === "tmap") {
      if (isAndroid) {
        const intentUrl = `intent://search?name=${encodedName}#Intent;scheme=tmap;package=com.skt.tmap.ku;end`;

        window.location.assign(intentUrl);
      } else if (isIOS) {
        const scheme = `tmap://search?name=${encodedName}`;
        const storeUrl = "https://apps.apple.com/kr/app/id431589174";
        triggerApp(scheme, storeUrl);
      }
    }
  };

  const buttons: {
    type: MapType;
    bgColor: string;
    textColor?: string;
    label: string;
    className?: string;
  }[] = [
    {
      type: "naver-map",
      bgColor: "bg-gradient-to-b from-[#0061FF] to-[#00DC00]",
      label: "네이버 지도",
    },
    {
      type: "kakao-map",
      bgColor: "bg-[#FAE100]",
      textColor: "text-black",
      label: "카카오맵",
    },
    {
      type: "tmap",
      bgColor: "bg-gradient-to-br from-[#773BFF] to-[#0065FF]",
      label: "티맵",
      className: "md:hidden",
    },
  ];

  return (
    <div className="flex w-full items-center justify-center gap-3 py-4">
      {buttons.map((button) => (
        <AppButton
          key={button.type}
          onClick={() => handleConnect(button.type)}
          bgColor={button.bgColor}
          textColor={button.textColor}
          label={button.label}
          className={button.className}
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
  className?: string;
};

const AppButton = ({
  onClick,
  bgColor,
  textColor = "text-white",
  label,
  className,
}: AppButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex h-12 flex-1 items-center justify-center gap-2 rounded-xl
        ${className ?? ""}
        ${bgColor} ${textColor} text-sm font-bold shadow-md
        transition-shadow hover:shadow-lg
      `}
    >
      {label}
    </motion.button>
  );
};
