"use client";

import { Moon, Sun } from "@hyoungmin/ui";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * 포트폴리오 전용 테마 토글.
 * 라벨은 CSS(::after + :root.dark)로 그려 hydration mismatch를 원천 차단하고,
 * 보조기술에는 aria-pressed로 현재 상태를 노출한다.
 */
const PortfolioThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  // 서버 스냅샷 false → 클라이언트 재렌더에서 true (hydration 안전)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  const handleToggle = () => {
    const currentTheme = resolvedTheme || "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className="pf-theme-toggle"
      aria-label="다크 모드"
      aria-pressed={isDark}
      onClick={handleToggle}
    >
      <Sun aria-hidden="true" className="pf-theme-icon pf-theme-icon--sun" />
      <Moon aria-hidden="true" className="pf-theme-icon pf-theme-icon--moon" />
    </button>
  );
};

export default PortfolioThemeToggle;
