import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { toHslChannels } from "@/lib/color";
import { site } from "@/lib/site";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s - ${site.name}`,
  },
  description: "Manage policies, payments, customers, and loyalty - all in one place.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: site.name,
    description: "Manage policies, payments, customers, and loyalty - all in one place.",
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: "Manage policies, payments, customers, and loyalty - all in one place.",
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
        {/* Early hash cleanup + stash for auth */}
        <Script id="sb-hash-pre" strategy="beforeInteractive">
          {`
          (function(){
            try{
              var h = window.location.hash || '';
              if (h && h.indexOf('access_token=') !== -1) {
                // keep for later setSession after redirect
                try { localStorage.setItem('sb-hash', h); } catch(e){}
                var url = new URL(window.location.href);
                var next = url.searchParams.get('next') || '/dashboard';
                // remove hash from address bar immediately
                history.replaceState(null, '', url.origin + url.pathname + (url.search || ''));
                window.location.replace(next);
              }
            } catch(_){
            }
          })();
          `}
        </Script>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
