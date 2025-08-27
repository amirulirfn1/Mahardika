import * as React from "react";

type Props = React.HTMLAttributes<HTMLElement> & { as?: keyof JSX.IntrinsicElements };

export function Section({ as, className = "", children, ...rest }: Props) {
  const Comp: any = as ?? "section";
  return (
    <Comp className={`px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </Comp>
  );
}

