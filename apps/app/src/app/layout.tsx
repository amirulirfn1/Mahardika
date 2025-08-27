import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/site";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: "Manage policies, payments, customers, and loyalty — all in one place.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: site.name,
    description: "Manage policies, payments, customers, and loyalty — all in one place.",
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: "Manage policies, payments, customers, and loyalty — all in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{
        // Map site.accent to a CSS variable used in CSS
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error inline style custom property
        "--accent": ((): string => {
          switch (site.accent) {
            case "indigo":
              return "79 70 229"; // indigo-600
            case "blue":
              return "37 99 235"; // blue-600
            case "violet":
              return "109 40 217"; // violet-600
            case "emerald":
              return "5 150 105"; // emerald-600
            default:
              return "79 70 229";
          }
        })()
      }}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
