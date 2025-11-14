"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const useKeyboardShortcuts = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에 포커스가 있으면 단축키 무시
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Meta/Ctrl 키와 함께 눌린 경우 브라우저 기본 동작 유지
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "t": {
          // 테마 토글
          event.preventDefault();
          const currentTheme = theme || "system";
          // system일 경우 resolvedTheme 확인 필요하지만, 간단하게 light/dark만 토글
          if (currentTheme === "dark") {
            setTheme("light");
          } else if (currentTheme === "light") {
            setTheme("dark");
          } else {
            // system일 경우 다크 모드로 설정
            setTheme("dark");
          }
          break;
        }

        case "g": {
          // 맨 위로 스크롤
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        }

        case "?": {
          // 단축키 도움말 표시 (선택)
          event.preventDefault();
          // TODO: 도움말 모달 표시 (선택 사항)
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [theme, setTheme]);
};

export default useKeyboardShortcuts;
