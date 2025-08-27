"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      id="theme-toggle"
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-neutral-300 hover:bg-neutral-100 dark:ring-white/10 dark:hover:bg-white/10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span aria-hidden>
        {isDark ? <Moon size={18} className="text-white/80" /> : <Sun size={18} className="text-neutral-700" />}
      </span>
    </button>
  );
};



