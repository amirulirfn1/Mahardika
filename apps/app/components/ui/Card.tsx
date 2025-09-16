import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const cardVariants = cva(
  "border border-border bg-card text-card-foreground shadow-card transition-colors",
  {
    variants: {
      intent: {
        default: "",
        subtle: "bg-background/95",
        interactive: "hover:-translate-y-1 hover:shadow-card",
      },
      radius: {
        app: "rounded-xl",
        marketing: "rounded-2xl",
      },
    },
    defaultVariants: {
      intent: "default",
      radius: "app",
    },
  },
);

const sectionVariants = cva("flex flex-col gap-3", {
  variants: {
    density: {
      app: "px-6 py-5",
      marketing: "px-8 py-6",
    },
  },
  defaultVariants: {
    density: "app",
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

type CardSectionProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof sectionVariants>;

export function Card({ className, intent, radius, ...props }: CardProps) {
  return <div className={cn(cardVariants({ intent, radius }), className)} {...props} />;
}

export function CardHeader({ className, density, ...props }: CardSectionProps) {
  return <div className={cn(sectionVariants({ density }), className)} {...props} />;
}

export function CardContent({ className, density, ...props }: CardSectionProps) {
  return <div className={cn(sectionVariants({ density }), className)} {...props} />;
}

export function CardFooter({ className, density, ...props }: CardSectionProps) {
  return <div className={cn(sectionVariants({ density }), className)} {...props} />;
}
