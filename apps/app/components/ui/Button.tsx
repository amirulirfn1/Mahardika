import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "link";
  size?: "sm" | "md" | "lg";
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed transition";
  const sizes =
    size === "sm"
      ? "text-xs h-8 px-3"
      : size === "lg"
      ? "text-sm h-11 px-6"
      : "text-sm h-9 px-4";
  const styles =
    variant === "primary"
      ? "bg-[hsl(var(--accent))] text-white hover:opacity-90"
      : variant === "outline"
      ? "ring-1 ring-white/10 text-white hover:bg-white/10"
      : variant === "link"
      ? "bg-transparent underline underline-offset-4 text-white hover:opacity-90"
      : "bg-transparent hover:bg-white/10 text-white";
  return <button className={`${base} ${sizes} ${styles} ${className}`} {...props} />;
};
