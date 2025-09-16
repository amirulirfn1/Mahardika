import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const sectionVariants = cva("w-full", {
  variants: {
    variant: {
      marketing: "py-20 md:py-28",
      app: "py-8 md:py-10",
    },
  },
  defaultVariants: {
    variant: "marketing",
  },
});

type SectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  containerClassName?: string;
  spotlight?: boolean;
}> & VariantProps<typeof sectionVariants>;

export function Section({
  id,
  className,
  containerClassName,
  variant,
  spotlight = false,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn(sectionVariants({ variant }), className)}>
      <Container className={cn(containerClassName, spotlight && "px-0")}>
        {spotlight ? (
          <div className="spotlight relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-card px-8 py-12 md:px-14 md:py-16">
            {children}
          </div>
        ) : (
          children
        )}
      </Container>
    </section>
  );
}
