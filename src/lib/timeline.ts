import { EMPLOYERS, PROJECTS, type Employer, type Project } from "@/content/career";

export type Entry =
  | { kind: "employer"; id: string; start: string; end?: string; employer: Employer; projects: Project[] }
  | { kind: "side"; id: string; start: string; end?: string; project: Project };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const year = (ym: string) => Number(ym.slice(0, 4));

export function monthYear(ym: string) {
  const [y, m] = ym.split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

export function dateRange(start: string, end?: string) {
  return `${monthYear(start)} – ${end ? monthYear(end) : "Present"}`;
}

export function yearRange(start: string, end?: string) {
  const a = year(start);
  if (!end) return `${a} – Present`;
  const b = year(end);
  return a === b ? `${a}` : `${a} – ${b}`;
}

/** Newest first. An employer spans its roles; side projects stand alone by their own dates. */
export function buildTimeline(): Entry[] {
  const entries: Entry[] = EMPLOYERS.map((employer) => {
    const starts = employer.roles.map((r) => r.start).sort();
    const ends = employer.roles.map((r) => r.end);
    return {
      kind: "employer" as const,
      id: employer.id,
      start: starts[0],
      end: ends.includes(undefined) ? undefined : ends.sort().at(-1),
      employer,
      projects: PROJECTS.filter((p) => p.employer === employer.id),
    };
  });
  for (const project of PROJECTS.filter((p) => !p.employer)) {
    entries.push({ kind: "side", id: project.slug, start: project.start, end: project.end, project });
  }
  // Current roles sort by start too, so Finish Line Labs (2025) leads Roblox (2020).
  return entries.sort((a, b) => b.start.localeCompare(a.start));
}
