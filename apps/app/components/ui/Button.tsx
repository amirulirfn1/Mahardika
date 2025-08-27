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
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition";
  const sizes =
    size === "sm"
      ? "text-xs h-8 px-3"
      : size === "lg"
      ? "text-sm h-11 px-6"
      : "text-sm h-9 px-4";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-400 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
      : variant === "outline"
      ? "border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900"
      : variant === "link"
      ? "bg-transparent underline underline-offset-4 text-neutral-900 dark:text-neutral-100 hover:no-underline"
      : "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100";
  return <button className={`${base} ${sizes} ${styles} ${className}`} {...props} />;
};
