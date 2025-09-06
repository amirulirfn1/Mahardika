import React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "accent" | "outline";
};

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "neutral",
  ...props
}) => {
  const styles =
    variant === "accent"
      ? "bg-[hsl(var(--accent))] text-white"
      : variant === "outline"
      ? "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200"
      : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles} ${className}`}
      {...props}
    />
  );
};



