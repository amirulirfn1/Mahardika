"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      id="theme-toggle"
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-white/10 hover:bg-white/10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span aria-hidden>
        {isDark ? <Moon size={18} className="text-white/80" /> : <Sun size={18} />}
      </span>
    </button>
  );
};



