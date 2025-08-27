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
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {overline}
        </div>
      ) : null}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600 dark:text-neutral-300">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};



