import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { PROFILE } from "@/content/career";
import "./globals.css";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Google Analytics (GA4 stream "uiuxartist.com - GA4"). Enhanced measurement counts the
// client-side page changes too, so one tag here covers every page.
const GA_ID = "G-WHW3JK4Q8L";

export const metadata: Metadata = {
  metadataBase: new URL("https://uiuxartist.com"),
  title: { default: `${PROFILE.name} — ${PROFILE.headline}`, template: `%s — ${PROFILE.name}` },
  description: PROFILE.about[0],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <nav className="site-nav">
          <Link href="/" className="wordmark">
            {PROFILE.name}
          </Link>
          <div className="site-links">
            <Link href="/about/">About</Link>
            {PROFILE.links.map((l) => (
              <a key={l.url} href={l.url}>
                {l.label}
              </a>
            ))}
          </div>
        </nav>
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
