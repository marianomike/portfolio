import CareerView from "@/components/CareerView";
import { PROFILE, PROJECTS } from "@/content/career";
import { projectMedia } from "@/lib/projects";
import { buildTimeline } from "@/lib/timeline";

export default function Home() {
  const entries = buildTimeline();
  const covers: Record<string, string> = {};
  for (const p of PROJECTS) {
    const { cover } = projectMedia(p.slug);
    if (cover) covers[p.slug] = cover;
  }
  const firstYear = Number(entries.at(-1)!.start.slice(0, 4));

  return (
    <main className="home">
      <header className="hero">
        <p className="eyebrow">
          {firstYear} – Now · {PROFILE.location}
        </p>
        <h1>
          {PROFILE.headline}.
          <br />
          <em>25+ years</em> of games, apps & tools.
        </h1>
        <p className="lede">{PROFILE.intro}</p>
      </header>
      <CareerView entries={entries} covers={covers} />
    </main>
  );
}
