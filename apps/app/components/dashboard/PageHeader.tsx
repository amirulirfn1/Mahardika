import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const headerVariants = cva("w-full", {
  variants: {
    variant: {
      plain: "border-b border-border pb-6 mb-6",
      spotlight:
        "relative overflow-hidden rounded-2xl border border-border bg-muted/60 shadow-card py-6 md:py-8 mb-8",
    },
    align: {
      left: "text-left",
      center: "text-center",
    },
  },
  defaultVariants: {
    variant: "plain",
    align: "left",
  },
});

type PageHeaderProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof headerVariants> & {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
  };

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
  variant,
  align,
  ...props
}: PageHeaderProps) {
  const alignmentClasses = align === "center" ? "items-center" : "items-start";
  return (
    <div className={cn(headerVariants({ variant, align }), className)} {...props}>
      {variant === "spotlight" ? (
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(80%_50%_at_0%_0%,hsl(var(--ring)/0.12),transparent_60%)]" />
      ) : null}
      <div className={cn("relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between", alignmentClasses)}>
        <div className={cn("space-y-2", align === "center" && "md:text-center") }>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2 md:justify-end">{actions}</div> : null}
      </div>
    </div>
  );
}
