import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export function Card({ children, className = "", ...props }: DivProps) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: DivProps) {
  return (
    <div className={`p-6 font-medium ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: DivProps) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
