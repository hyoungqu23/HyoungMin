"use client";

import { Button, Sun, Moon } from "@hyoungmin/ui";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
