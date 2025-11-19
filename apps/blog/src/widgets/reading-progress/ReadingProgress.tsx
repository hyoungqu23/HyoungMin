"use client";

import { useEffect, useState } from "react";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // 스크롤 가능한 높이 계산
      const scrollableHeight = documentHeight - windowHeight;
      const scrolled = scrollTop;

      // 진행률 계산 (0-100)
      const percentage =
        scrollableHeight > 0 ? (scrolled / scrollableHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    // 초기 진행률 설정
    updateProgress();

    // 스크롤 이벤트 리스너 등록 (throttle 적용)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-20 left-0 right-0 z-50 h-8 bg-secondary-200"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-secondary-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
