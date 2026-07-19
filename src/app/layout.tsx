import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import { Providers } from "@/shared/components/layout/providers";
import { SiteHeader } from "@/shared/components/layout/site-header";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import { Toaster } from "@/shared/components/ui/sonner";
import { PWARegister } from "@/shared/components/common/pwa-register";
import "./globals.css";

export const dynamic = "force-dynamic";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ficshelf — Discover and recommend fanfictions",
  description:
    "Social fanfiction catalog: add, tag, rate, and discover your next favorite read.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('ficshelf:theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: `if("serviceWorker"in navigator)navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(r){r.unregister()})})` }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
        <PWARegister />
        <Toaster />
      </body>
    </html>
  );
}
