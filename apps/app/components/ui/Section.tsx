import React, { PropsWithChildren } from "react";

import { Container } from "./Container";

export const Section: React.FC<
  PropsWithChildren<{ className?: string; id?: string }>
> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
};



