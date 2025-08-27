import React, { PropsWithChildren } from "react";

export const Container: React.FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className = "" }) => {
  return <div className={`container-default ${className}`}>{children}</div>;
};



