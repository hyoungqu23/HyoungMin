"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Button } from "@hyoungmin/ui";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-gray-700 dark:text-gray-300"
    >
      {isDark ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </Button>
  );
};

export default ThemeToggle;
