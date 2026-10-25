"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, EDUCATION, PROFILE, type Category, type Project } from "@/content/career";
import { dateRange, year, yearRange, type Entry } from "@/lib/timeline";
import YearScrubber from "./YearScrubber";

export type Cover = { src: string; icon?: boolean };

type View = "timeline" | "resume";
type Filter = Category | "all";

export default function CareerView({ entries, covers }: { entries: Entry[]; covers: Record<string, Cover> }) {
  const [view, setView] = useState<View>("timeline");
  const [filter, setFilter] = useState<Filter>("all");

  // Entries grouped by start year; each group is one stop on the scrubber.
  const years = useMemo(() => {
    const groups: { year: number; entries: Entry[] }[] = [];
    for (const entry of entries) {
      const y = year(entry.start);
      if (groups.at(-1)?.year === y) groups.at(-1)!.entries.push(entry);
      else groups.push({ year: y, entries: [entry] });
    }
    return groups;
  }, [entries]);

  return (
    <>
      <div className="controls" role="toolbar" aria-label="View options">
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
            {years.map((group) => (
              <li key={group.year} className="year-group" data-year={group.year}>
                <h2 className="year">{group.year}</h2>
                <div className="year-entries">
                  {group.entries.map((entry) => (
                    <TimelineEntry key={entry.id} entry={entry} filter={filter} covers={covers} />
                  ))}
                </div>
              </li>
            ))}
            <li className="year-group origin" data-year={1995}>
              <h2 className="year">1995</h2>
              <div className="year-entries">
                <article className="entry">
                  <header>
                    <h3 className="company">School</h3>
                    <p className="eyebrow">1995 – 2000</p>
                  </header>
                  <ul className="roles">
                    {EDUCATION.map((ed) => (
                      <li key={ed.school}>
                        <p className="role">
                          <span>
                            {ed.school}
                            {ed.detail && ` — ${ed.detail}`}
                          </span>
                          <span className="dates">
                            {ed.start} – {ed.end}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </li>
          </ol>
          <YearScrubber key={filter} />
        </>
      ) : (
        <Resume entries={entries} />
      )}
    </>
  );
}

function matches(project: Project, filter: Filter) {
  return filter === "all" || project.category === filter;
}

function TimelineEntry({ entry, filter, covers }: { entry: Entry; filter: Filter; covers: Record<string, Cover> }) {
  if (entry.kind === "side") {
    const shown = entry.projects.filter((p) => matches(p, filter));
    return (
      <article id={entry.id} className={`entry side${shown.length ? "" : " dim"}`}>
        <header>
          <h3 className="company">{entry.projects.length > 1 ? "Side projects" : "Side project"}</h3>
        </header>
        {shown.length > 0 && (
          <div className="cards">
            {shown.map((p) => (
              <ProjectCard key={p.slug} project={p} cover={covers[p.slug]} />
            ))}
          </div>
        )}
      </article>
    );
  }

  const { employer } = entry;
  const shown = entry.projects.filter((p) => matches(p, filter));
  // Filtering keeps the career's shape: employers with nothing matching collapse
  // to one quiet line instead of disappearing.
  const dim = filter !== "all" && shown.length === 0;
  return (
    <article id={entry.id} className={`entry${dim ? " dim" : ""}`}>
      <header>
        <h3 className="company">
          {employer.name}
          {employer.kind && <span className="kind">{employer.kind}</span>}
        </h3>
        <p className="eyebrow">{yearRange(entry.start, entry.end)}</p>
      </header>
      {!dim && (
        <>
          <ul className="roles">
            {employer.roles.map((role) => (
              <li key={role.title + role.start}>
                <p className="role">
                  <span>{role.title}</span>
                  <span className="dates">{dateRange(role.start, role.end)}</span>
                </p>
                {role.bullets.length > 0 && (
                  <ul className="bullets">
                    {role.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
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
        </>
      )}
    </article>
  );
}

function ProjectCard({ project, cover }: { project: Project; cover?: Cover }) {
  return (
    <Link href={`/${project.slug}/`} className="card">
      <div className="thumb" data-empty={!cover || undefined} data-icon={cover?.icon || undefined}>
        {cover ? <img src={cover.src} alt="" loading="lazy" /> : <span>{project.title}</span>}
      </div>
      <div className="card-text">
        <p className="card-title">{project.title}</p>
        <p className="card-blurb">{project.blurb}</p>
      </div>
    </Link>
  );
}

function Resume({ entries }: { entries: Entry[] }) {
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
      {entries
        .filter((e) => e.kind === "employer")
        .map((e) => (
          <div key={e.id} className="resume-employer">
            <p className="resume-company">
              {e.employer.name}
              {e.employer.kind && <span className="kind">{e.employer.kind}</span>}
            </p>
            {e.employer.roles.map((r) => (
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
