import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const wrapperVariants = cva("", {
  variants: {
    variant: {
      marketing: "space-y-4",
      app: "space-y-2",
    },
    align: {
      left: "text-left",
      center: "text-center mx-auto",
    },
  },
  defaultVariants: {
    variant: "marketing",
    align: "left",
  },
});

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof wrapperVariants> & {
    eyebrow?: string;
    title: string;
    subtitle?: string;
  };

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  variant,
  align,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", wrapperVariants({ variant, align }), className)} {...props}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-semibold leading-tight tracking-tight",
          variant === "marketing"
            ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle ? <p className="text-base text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
