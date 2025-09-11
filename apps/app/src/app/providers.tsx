"use client";
import { ThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";

import { AuthHashHandler } from "./auth/hash-handler";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthHashHandler />
      {children}
    </ThemeProvider>
  );
};



