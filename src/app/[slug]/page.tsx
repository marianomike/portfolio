import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EMPLOYERS, PROJECTS } from "@/content/career";
import { projectBody, projectMedia } from "@/lib/projects";
import { yearRange } from "@/lib/timeline";

// Old uiuxartist.com pages that were hubs rather than projects. They become
// redirects to their place on the timeline so existing links keep working.
const ALIASES: Record<string, string> = {
  zynga: "/#zynga",
  "disney-interactive": "/#disney",
  "sketch-plugin-duplicate-symbol": "/sketch-plugins/",
  "sketch-plugin-organize-symbols": "/sketch-plugins/",
  // Removed from the portfolio; old links go to the timeline.
  "the-game-ux-interview-series": "/",
  "prototyping-ui-in-unity-tutorial": "/",
  projects: "/",
  about: "/",
  contact: "/",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [...PROJECTS.map((p) => p.slug), ...Object.keys(ALIASES)].map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.blurb } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (ALIASES[slug]) {
    // Static export has no server redirects; a refresh tag is what Pages can serve.
    return (
      <main className="project">
        <meta httpEquiv="refresh" content={`0; url=${ALIASES[slug]}`} />
        <p>
          This page moved to <Link href={ALIASES[slug]}>the timeline</Link>.
        </p>
      </main>
    );
  }

  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();
  const employer = EMPLOYERS.find((e) => e.id === project.employer);
  const { cover, icon, gallery } = projectMedia(slug);
  const body = projectBody(slug);
  // Images placed in the write-up aren't repeated in the gallery.
  const extra = gallery.filter((src) => !body?.html.includes(src));

  return (
    <main className="project">
      <Link href={`/#${slug}`} className="back">
        ← Timeline
      </Link>
      <header className="project-head">
        {icon && <img className="project-icon" src={icon} alt="" />}
        <p className="eyebrow">
          {[employer?.name ?? "Side project", yearRange(project.start, project.end)].join(" · ")}
        </p>
        <h1>{project.title}</h1>
        <p className="lede">{project.blurb}</p>
        <dl className="facts">
          {body?.role && (
            <div>
              <dt>Role</dt>
              <dd>{body.role}</dd>
            </div>
          )}
          {body?.tools && (
            <div>
              <dt>Tools</dt>
              <dd>{body.tools.join(", ")}</dd>
            </div>
          )}
        </dl>
        {project.links && (
          <p className="project-links">
            {project.links.map((l) => (
              <a key={l.url} href={l.url}>
                {l.label} ↗
              </a>
            ))}
          </p>
        )}
      </header>
      {cover && <img className="project-cover" src={cover} alt="" />}
      {body?.video && (
        <div className="video">
          <iframe src={body.video} title={`${project.title} video`} allowFullScreen />
        </div>
      )}
      {body && <div className="prose" dangerouslySetInnerHTML={{ __html: body.html }} />}
      {extra.length > 0 && (
        <div className="gallery">
          {extra.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      )}
    </main>
  );
}
