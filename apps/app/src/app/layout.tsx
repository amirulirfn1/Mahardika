import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/site";
import { Providers } from "./providers";
import { Manrope, Inter } from "next/font/google";

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
          "--accent": process.env.NEXT_PUBLIC_ACCENT || ((): string => {
            // default to Mahardika violet 600
            return "124 58 237";
          })(),
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
