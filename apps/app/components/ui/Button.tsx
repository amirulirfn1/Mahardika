import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-transparent hover:bg-gray-100";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}


