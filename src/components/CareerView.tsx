"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, EDUCATION, EMPLOYERS, PROFILE, type Category, type Project } from "@/content/career";
import { dateRange, employerName, year, yearRange, type ChapterGroup } from "@/lib/timeline";
import YearScrubber from "./YearScrubber";

export type Cover = { src: string; icon?: boolean };

type View = "timeline" | "resume";
type Filter = Category | "all";

export default function CareerView({ chapters, covers }: { chapters: ChapterGroup[]; covers: Record<string, Cover> }) {
  const [view, setView] = useState<View>("timeline");
  const [filter, setFilter] = useState<Filter>("all");

  // The sticky controls change height as the chips wrap; the sticky chapter
  // ranges and the scrubber sit just below them.
  const controls = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = controls.current!;
    const ro = new ResizeObserver(() =>
      document.documentElement.style.setProperty("--controls-h", `${el.offsetHeight}px`),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div ref={controls} className="controls" role="toolbar" aria-label="View options">
        <div className="segmented">
          {(["timeline", "resume"] as View[]).map((v) => (
            <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>
              {v === "timeline" ? "Timeline" : "Resume"}
            </button>
          ))}
        </div>
        {view === "timeline" ? (
          <div className="chips">
            {[{ id: "all" as Filter, label: "All" }, ...CATEGORIES].map((c) => (
              <button key={c.id} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <button className="print" onClick={() => window.print()}>
            Save as PDF
          </button>
        )}
      </div>

      {view === "timeline" ? (
        <>
          <ol className="timeline">
            {chapters.map((c) => (
              <ChapterSection key={c.id} chapter={c} filter={filter} covers={covers} />
            ))}
            <li className="chapter origin" data-year={1995} data-label="1995 – 2000">
              <h2 className="range">
                1995 <span>– 2000</span>
              </h2>
              <div className="chapter-body">
                <ul className="jobs">
                  {EDUCATION.map((ed) => (
                    <li key={ed.school}>
                      <strong>{ed.school}</strong>
                      {ed.detail && <span className="job-title">{ed.detail}</span>}
                      <span className="dates">
                        {ed.start} – {ed.end}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ol>
          <YearScrubber key={filter} />
        </>
      ) : (
        <Resume />
      )}
    </>
  );
}

function matches(project: Project, filter: Filter) {
  return filter === "all" || project.category === filter;
}

function ChapterSection({ chapter, filter, covers }: { chapter: ChapterGroup; filter: Filter; covers: Record<string, Cover> }) {
  const shown = chapter.projects.filter((p) => matches(p, filter));
  const label = `${chapter.start} – ${chapter.end ?? "Present"}`;
  return (
    <li
      id={chapter.id}
      className="chapter"
      data-year={chapter.start}
      data-label={label}
      data-quiet={(filter !== "all" && shown.length === 0) || undefined}
    >
      <h2 className="range">
        {chapter.start} <span>– {chapter.end ?? "Present"}</span>
      </h2>
      <div className="chapter-body">
        <ul className="jobs">
          {chapter.jobs.map((j) => (
            // Each employer keeps its id, so old /#zynga and /#disney links land here.
            <li key={j.employer.id} id={j.employer.id}>
              <strong>{j.employer.name}</strong>
              <span className="job-title">{j.title}</span>
              <span className="dates">{yearRange(j.start, j.end)}</span>
            </li>
          ))}
        </ul>
        {shown.length > 0 && (
          <div className="cards">
            {shown.map((p) => (
              <ProjectCard key={p.slug} project={p} cover={covers[p.slug]} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function ProjectCard({ project, cover }: { project: Project; cover?: Cover }) {
  return (
    <Link href={`/${project.slug}/`} id={project.slug} className="card">
      <div className="thumb" data-empty={!cover || undefined} data-icon={cover?.icon || undefined}>
        {cover ? <img src={cover.src} alt="" loading="lazy" /> : <span>{project.title}</span>}
      </div>
      <div className="card-text">
        <p className="card-eyebrow">
          {employerName(project.employer) ?? "Side project"} · {year(project.start)}
        </p>
        <p className="card-title">{project.title}</p>
        <p className="card-blurb">{project.blurb}</p>
      </div>
    </Link>
  );
}

function Resume() {
  return (
    <section className="resume">
      <header className="resume-head">
        <h2>{PROFILE.name}</h2>
        <p>
          {PROFILE.headline} · {PROFILE.location}
        </p>
        <p className="resume-links">
          {PROFILE.links.map((l) => (
            <a key={l.url} href={l.url}>
              {l.url.replace(/^https:\/\/(www\.)?/, "")}
            </a>
          ))}
        </p>
      </header>
      <h3 className="resume-section">Experience</h3>
      {EMPLOYERS.map((e) => (
        <div key={e.id} className="resume-employer">
          <p className="resume-company">
            {e.name}
            {e.kind && <span className="kind">{e.kind}</span>}
          </p>
          {e.roles.map((r) => (
            <div key={r.title + r.start} className="resume-role">
              <p className="role">
                <span>{r.title}</span>
                <span className="dates">{dateRange(r.start, r.end)}</span>
              </p>
              {r.bullets.length > 0 && (
                <ul className="bullets">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
      <h3 className="resume-section">Education</h3>
      {EDUCATION.map((ed) => (
        <p key={ed.school} className="role">
          <span>
            {ed.school}
            {ed.detail && ` — ${ed.detail}`}
          </span>
          <span className="dates">
            {ed.start} – {ed.end}
          </span>
        </p>
      ))}
    </section>
  );
}
