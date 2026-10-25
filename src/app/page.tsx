import CareerView, { type Cover } from "@/components/CareerView";
import { PROFILE, PROJECTS } from "@/content/career";
import { projectMedia } from "@/lib/projects";
import { buildTimeline } from "@/lib/timeline";

export default function Home() {
  const years = buildTimeline();
  const covers: Record<string, Cover> = {};
  for (const p of PROJECTS) {
    const { cover, icon } = projectMedia(p.slug);
    if (cover) covers[p.slug] = { src: cover };
    else if (icon) covers[p.slug] = { src: icon, icon: true };
  }
  const firstYear = years.at(-1)!.year;

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
      <CareerView years={years} covers={covers} />
    </main>
  );
}
