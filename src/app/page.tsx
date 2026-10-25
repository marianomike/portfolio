import CareerView, { type Cover } from "@/components/CareerView";
import { PROFILE, PROJECTS } from "@/content/career";
import { projectMedia } from "@/lib/projects";
import { buildTimeline } from "@/lib/timeline";

export default function Home() {
  const chapters = buildTimeline();
  const covers: Record<string, Cover> = {};
  for (const p of PROJECTS) {
    const { cover, icon, gallery } = projectMedia(p.slug);
    if (cover) covers[p.slug] = { src: cover };
    else if (icon) covers[p.slug] = { src: icon, icon: true };
    else if (gallery[0]) covers[p.slug] = { src: gallery[0] };
  }
  const firstYear = chapters.at(-1)!.start;

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
      <CareerView chapters={chapters} covers={covers} />
    </main>
  );
}
