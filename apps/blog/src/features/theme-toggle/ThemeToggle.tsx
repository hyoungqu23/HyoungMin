"use client";

import { Button, Sun, Moon } from "@hyoungmin/ui";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  // 서버와 클라이언트 모두에서 동일한 초기값 사용 (hydration 일치)
  const [isDark, setIsDark] = useState(false);

  // 클라이언트에서만 resolvedTheme에 따라 상태 업데이트
  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const handleToggle = () => {
    const currentTheme = resolvedTheme || "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="text-primary-800"
    >
      {isDark ? (
        <Sun className="h-6 w-6 text-primary-100" />
      ) : (
        <Moon className="h-6 w-6 text-primary-100" />
      )}
    </Button>
  );
};

export default ThemeToggle;
