import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";

import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { toHslChannels } from "@/lib/color";
import { site } from "@/lib/site";

import { Providers } from "./providers";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

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
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${inter.variable} antialiased`}>
      <body
        className="bg-grain"
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
