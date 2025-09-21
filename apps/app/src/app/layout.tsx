import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { toHslChannels } from "@/lib/color";
import { site } from "@/lib/site";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const description = "Manage policies, payments, customers, and loyalty - all in one place.";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s - ${site.name}`,
  },
  description,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: site.name,
    description,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        style={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error inline style custom property
          "--accent": toHslChannels(process.env.NEXT_PUBLIC_ACCENT),
        }}
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}