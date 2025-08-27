"use client";
import React from "react";

export const AnimatedPrice: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}> = ({ value, prefix = "$", suffix = "/mo", durationMs = 500 }) => {
  const [display, setDisplay] = React.useState<number>(value);
  const prevRef = React.useRef<number>(value);

  React.useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    const startAt = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - startAt;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOut(t);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    prevRef.current = end;
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

