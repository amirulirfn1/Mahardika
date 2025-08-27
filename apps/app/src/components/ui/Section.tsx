import * as React from "react";

type Props = React.HTMLAttributes<HTMLElement>;

export function Section({ className = "", children, ...rest }: Props) {
  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
