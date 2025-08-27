"use client";
import React from "react";
import { useTheme } from "next-themes";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      id="theme-toggle"
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span aria-hidden> {isDark ? "🌙" : "☀️"} </span>
    </button>
  );
};



