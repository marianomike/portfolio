"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, EDUCATION, EMPLOYERS, PROFILE, type Category, type Project } from "@/content/career";
import { dateRange, employerName, monthYear, year, type RoleRef, type YearGroup } from "@/lib/timeline";
import YearScrubber from "./YearScrubber";

export type Cover = { src: string; icon?: boolean };

type View = "timeline" | "resume";
type Filter = Category | "all";

export default function CareerView({ years, covers }: { years: YearGroup[]; covers: Record<string, Cover> }) {
  const [view, setView] = useState<View>("timeline");
  const [filter, setFilter] = useState<Filter>("all");

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
              <Year key={group.year} group={group} filter={filter} covers={covers} />
            ))}
            <li className="year-group origin" data-year={1995}>
              <h2 className="year">1995</h2>
              <div className="year-entries">
                <article className="entry">
                  <header>
                    <h3 className="company">School</h3>
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
  // Filtering keeps the career's shape: roles stay as quiet one-liners and the
  // year itself fades when none of its work matches.
  const filtered = filter !== "all";
  const quiet = filtered && shown.length === 0;
  const sparse = group.started.length === 0 && shown.length === 0;
  return (
    <li className="year-group" data-year={group.year} data-quiet={quiet || undefined} data-sparse={sparse || undefined}>
      <h2 className="year">{group.year}</h2>
      <div className="year-entries">
        {group.ongoing.length > 0 && (
          <ul className="ongoing">
            {group.ongoing.map((r) => (
              <li key={r.id}>
                <span className="ongoing-company">{r.employer.name}</span>
                <span className="ongoing-title">{r.role.title}</span>
                <span className="dates">
                  since {monthYear(r.role.start)} · year {group.year - year(r.role.start) + 1}
                </span>
              </li>
            ))}
          </ul>
        )}
        {group.started.map((r) => (
          <RoleStart key={r.id} item={r} compact={filtered} />
        ))}
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

function RoleStart({ item, compact }: { item: RoleRef; compact: boolean }) {
  const { employer, role } = item;
  return (
    <article id={item.id} className={`entry${compact ? " dim" : ""}`}>
      <header>
        <h3 className="company">
          {employer.name}
          {employer.kind && <span className="kind">{employer.kind}</span>}
        </h3>
      </header>
      <p className="role">
        <span>{role.title}</span>
        <span className="dates">{dateRange(role.start, role.end)}</span>
      </p>
      {!compact && role.bullets.length > 0 && (
        <ul className="bullets">
          {role.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </article>
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
