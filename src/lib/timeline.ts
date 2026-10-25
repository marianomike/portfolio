import { EMPLOYERS, PROJECTS, type Employer, type Project, type Role } from "@/content/career";

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

export type RoleRef = { employer: Employer; role: Role };

export type YearGroup = {
  year: number;
  /** Projects that came out this year: the timeline itself. */
  projects: Project[];
  /** Roles that began this year, marked with one line. */
  started: RoleRef[];
  /** Every role held at some point this year, for the "where I was" line. */
  held: RoleRef[];
};

/**
 * Every year from the first role to now, newest first, so the scrubber can stop
 * on any year even when nothing shipped in it.
 */
export function buildTimeline(now = new Date().getFullYear()): YearGroup[] {
  const roles: RoleRef[] = EMPLOYERS.flatMap((employer) => employer.roles.map((role) => ({ employer, role })));
  const newestFirst = (a: RoleRef, b: RoleRef) => b.role.start.localeCompare(a.role.start);
  const first = Math.min(...roles.map((r) => year(r.role.start)));

  const groups: YearGroup[] = [];
  for (let y = now; y >= first; y--) {
    // A role that ended in January hardly ran into that year.
    const held = (r: RoleRef) =>
      year(r.role.start) <= y && (!r.role.end || (year(r.role.end) >= y && r.role.end !== `${y}-01`));
    groups.push({
      year: y,
      projects: PROJECTS.filter((p) => year(p.start) === y).sort((a, b) => b.start.localeCompare(a.start)),
      started: roles.filter((r) => year(r.role.start) === y).sort(newestFirst),
      held: roles.filter(held).sort(newestFirst),
    });
  }
  return groups;
}

export function employerName(id?: string) {
  return EMPLOYERS.find((e) => e.id === id)?.name;
}
