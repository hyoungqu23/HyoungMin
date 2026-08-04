"use client";

import { Button, Sun, Moon } from "@hyoungmin/ui";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

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
      className="text-zinc-700 transition-colors hover:text-amber-600 dark:text-zinc-200 dark:hover:text-amber-300"
    >
      {/* 두 아이콘을 SSR에 함께 렌더하고 html.dark가 첫 페인트부터 표시 상태를 결정한다. */}
      <Sun
        aria-hidden="true"
        className="hidden h-6 w-6 text-amber-300 dark:block"
      />
      <Moon
        aria-hidden="true"
        className="block h-6 w-6 text-zinc-700 dark:hidden"
      />
    </Button>
  );
};

export default ThemeToggle;
