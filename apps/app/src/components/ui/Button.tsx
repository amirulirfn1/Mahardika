"use client";
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({ className = "", variant = "default", size = "md", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
      "bg-[hsl(var(--accent))] text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed",
    outline:
      "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:bg-transparent dark:text-white",
    ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10",
  };
  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}
