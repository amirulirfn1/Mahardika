import React from "react";

export const SectionHeading: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    overline?: string;
    title: string;
    subtitle?: string;
  }
> = ({ overline, title, subtitle, className = "", ...props }) => {
  return (
    <div className={`mb-8 text-center ${className}`} {...props}>
      {overline ? (
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{overline}</div>
      ) : null}
      <h2 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-br from-[hsl(var(--accent))] to-fuchsia-400 bg-clip-text text-transparent dark:from-[hsl(var(--accent))] dark:to-fuchsia-400">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600 dark:text-white/70">{subtitle}</p>
      ) : null}
    </div>
  );
};



