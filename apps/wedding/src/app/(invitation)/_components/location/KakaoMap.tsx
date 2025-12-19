"use client";

import { useEffect, useRef, useState } from "react";

// 웨딩홀 정보
const WEDDING_LOCATION = {
  placeName: "더베르G 웨딩",
  address: "서울 영등포구 국회대로 612 지상2층,지하1층",
  lat: 37.5257757,
  lng: 126.902050869,
  placeId: "344245328",
};

// 카카오맵 타입 선언 (window.kakao 접근용)
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (
          container: HTMLElement,
          options: KakaoMapOptions,
        ) => KakaoMapInstance;
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
        InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
        event: {
          addListener: (
            target: KakaoMarker | KakaoMapInstance,
            type: string,
            handler: () => void,
          ) => void;
        };
      };
    };
  }
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMapInstance {
  setCenter: (latlng: KakaoLatLng) => void;
  setLevel: (level: number) => void;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMapInstance;
}

interface KakaoMarker {
  setMap: (map: KakaoMapInstance | null) => void;
}

interface KakaoInfoWindowOptions {
  content: string;
  removable?: boolean;
}

interface KakaoInfoWindow {
  open: (map: KakaoMapInstance, marker: KakaoMarker) => void;
  close: () => void;
}

type KakaoMapProps = {
  className?: string;
};

export const KakaoMap = ({ className = "" }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // SDK가 로드되었는지 확인하는 함수
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        return true;
      }
      return false;
    };

    // 지도 초기화 함수
    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        const { lat, lng, placeName, address } = WEDDING_LOCATION;

        // 지도 옵션 설정
        const mapOption = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3, // 확대 레벨 (숫자가 작을수록 확대)
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        // 마커 위치
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커를 지도에 표시
        marker.setMap(map);

        // 인포윈도우 내용
        const infoContent = `
          <div style="
            padding: 12px 16px;
            font-size: 14px;
            line-height: 1.5;
            min-width: 180px;
            text-align: center;
          ">
            <strong style="
              display: block;
              font-size: 15px;
              color: #333;
              margin-bottom: 4px;
            ">${placeName}</strong>
            <span style="
              display: block;
              font-size: 12px;
              color: #666;
            ">${address}</span>
          </div>
        `;

        // 인포윈도우 생성
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
        });

        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });

        // 초기에 인포윈도우 표시
        infoWindow.open(map, marker);

        setIsLoaded(true);
      } catch (err) {
        console.error("카카오맵 초기화 실패:", err);
        setError("지도를 불러오는데 실패했습니다.");
      }
    };

    // SDK 로드 대기 및 초기화
    if (checkKakaoLoaded()) {
      // 이미 로드된 경우
      window.kakao.maps.load(initializeMap);
    } else {
      // SDK 로드 대기 (최대 5초)
      let attempts = 0;
      const maxAttempts = 50;
      const interval = setInterval(() => {
        attempts++;
        if (checkKakaoLoaded()) {
          clearInterval(interval);
          window.kakao.maps.load(initializeMap);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setError("카카오맵 SDK 로드에 실패했습니다.");
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl ${className}`}>
      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        className="w-full h-[280px] sm:h-[350px] bg-stone-100"
        aria-label="웨딩홀 위치 지도"
      />

      {/* 로딩 상태 */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-rose-300 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-stone-500">지도 로딩중...</span>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <span className="text-2xl">🗺️</span>
            <span className="text-sm text-stone-500">{error}</span>
            <a
              href={`https://place.map.kakao.com/${WEDDING_LOCATION.placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 bg-[#FAE100] text-black text-sm font-bold rounded-lg"
            >
              카카오맵에서 보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
