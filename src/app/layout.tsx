import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { PROFILE } from "@/content/career";
import "./globals.css";

const display = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
      </body>
    </html>
  );
}
