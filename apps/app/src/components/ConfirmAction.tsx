"use client";

import React from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage?: string;
  children: React.ReactNode;
  className?: string;
};

export function ConfirmAction({
  action,
  confirmMessage = "Are you sure?",
  children,
  className,
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const ok = window.confirm(confirmMessage);
        if (!ok) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </form>
  );
}
