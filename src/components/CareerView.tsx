"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, EDUCATION, EMPLOYERS, PROFILE, type Category, type Project } from "@/content/career";
import { dateRange, employerName, monthYear, type YearGroup } from "@/lib/timeline";
import YearScrubber from "./YearScrubber";

export type Cover = { src: string; icon?: boolean };

type View = "timeline" | "resume";
type Filter = Category | "all";

export default function CareerView({ years, covers }: { years: YearGroup[]; covers: Record<string, Cover> }) {
  const [view, setView] = useState<View>("timeline");
  const [filter, setFilter] = useState<Filter>("all");
  const [current, setCurrent] = useState(years[0].year);
  const group = years.find((g) => g.year === current) ?? years[0];
  const today = group === years[0];

  // The sticky controls change height as chips wrap and the "where" line grows;
  // the sticky year headings and the scrubber sit just below them.
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
        {view === "timeline" && (
          // Where I was at the year on screen: follows scrolling and the scrubber.
          <p className="where" aria-live="polite">
            <span className="where-year">{today ? "Today" : group.year}</span>
            {group.held.map((r) => (
              <span key={r.employer.id + r.role.start} className="where-role">
                <strong>{r.employer.name}</strong> {r.role.title}
                <span className="dates">
                  {today ? `since ${monthYear(r.role.start)}` : dateRange(r.role.start, r.role.end)}
                </span>
              </span>
            ))}
          </p>
        )}
      </div>

      {view === "timeline" ? (
        <>
          <ol className="timeline">
            {years.map((g) => (
              <Year key={g.year} group={g} filter={filter} covers={covers} />
            ))}
            <li className="year-group origin" data-year={1995}>
              <h2 className="year">1995</h2>
              <div className="year-entries">
                <ul className="milestones">
                  {EDUCATION.map((ed) => (
                    <li key={ed.school}>
                      <strong>{ed.school}</strong>
                      {ed.detail && ` ${ed.detail}`}
                      <span className="dates">
                        {ed.start} – {ed.end}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ol>
          <YearScrubber key={filter} onYear={setCurrent} />
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

function Year({ group, filter, covers }: { group: YearGroup; filter: Filter; covers: Record<string, Cover> }) {
  const shown = group.projects.filter((p) => matches(p, filter));
  const quiet = filter !== "all" && shown.length === 0;
  return (
    <li className="year-group" data-year={group.year} data-quiet={quiet || undefined} data-sparse={shown.length === 0 || undefined}>
      <h2 className="year">{group.year}</h2>
      <div className="year-entries">
        {group.started.length > 0 && (
          <ul className="milestones">
            {group.started.map((r) => (
              // The newest role of each employer keeps the employer id, so old /#zynga links land.
              <li key={r.employer.id + r.role.start} id={r.employer.roles[0] === r.role ? r.employer.id : undefined}>
                {r.employer.roles.at(-1) !== r.role ? "New role at " : r.employer.kind === "Self-employed" ? "Started " : "Joined "}
                <strong>{r.employer.name}</strong> · {r.role.title}
                <span className="dates">{monthYear(r.role.start)}</span>
              </li>
            ))}
          </ul>
        )}
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
        <p className="card-eyebrow">{employerName(project.employer) ?? "Side project"}</p>
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
