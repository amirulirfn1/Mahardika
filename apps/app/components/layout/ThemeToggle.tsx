"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { type FC, useEffect, useState } from "react";

// Avoid hydration mismatch by rendering the icon only after mount.
// next-themes sets theme on the client; during SSR it's undefined.
export const ThemeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      id="theme-toggle"
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-neutral-300 hover:bg-[hsl(var(--accent))]/10 dark:ring-white/10 dark:hover:bg-[hsl(var(--accent))]/20"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
    >
      <span aria-hidden>
        {mounted ? (
          isDark ? (
            <Moon size={18} className="text-white/80" />
          ) : (
            <Sun size={18} className="text-neutral-700" />
          )
        ) : (
          // placeholder to preserve layout without causing hydration diff
          <span className="block h-[18px] w-[18px]" />
        )}
      </span>
    </button>
  );
};



