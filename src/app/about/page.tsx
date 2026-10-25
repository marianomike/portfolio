import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { PROFILE } from "@/content/career";

export const metadata: Metadata = { title: "About" };

export default function About() {
  // Every photo in public/about/, in filename order.
  const photos = fs
    .readdirSync(path.join(process.cwd(), "public", "about"))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/about/${f}`);

  return (
    <main className="about">
      <header className="about-head">
        <h1>About</h1>
        {PROFILE.about.map((p) => (
          <p key={p} className="lede">
            {p}
          </p>
        ))}
      </header>
      <div className="about-photos">
        {photos.map((src) => (
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>
    </main>
  );
}
