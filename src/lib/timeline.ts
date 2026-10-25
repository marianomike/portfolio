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

export type RoleRef = {
  /** The newest role of each employer carries the employer id, so /#zynga still lands. */
  id: string;
  employer: Employer;
  role: Role;
};

export type YearGroup = {
  year: number;
  /** Roles that started this year, shown in full. */
  started: RoleRef[];
  /** Roles from earlier years still held this year, shown as one line each. */
  ongoing: RoleRef[];
  /** Projects that came out this year. */
  projects: Project[];
};

/**
 * Every year from the first role to now, newest first. A role is shown in full
 * in the year it started and as a one-line "still here" in each later year it
 * ran into; a project sits in the year it came out.
 */
export function buildTimeline(now = new Date().getFullYear()): YearGroup[] {
  const roles: RoleRef[] = EMPLOYERS.flatMap((employer) =>
    employer.roles.map((role, i) => ({ id: i === 0 ? employer.id : `${employer.id}-${role.start}`, employer, role })),
  );
  const newestFirst = (a: string, b: string) => b.localeCompare(a);
  const first = Math.min(...roles.map((r) => year(r.role.start)));

  const groups: YearGroup[] = [];
  for (let y = now; y >= first; y--) {
    const lastYear = (r: RoleRef) => (r.role.end ? year(r.role.end) : now);
    groups.push({
      year: y,
      started: roles.filter((r) => year(r.role.start) === y).sort((a, b) => newestFirst(a.role.start, b.role.start)),
      // A role that ended in January hardly ran into that year; only count it from February on.
      ongoing: roles
        .filter((r) => year(r.role.start) < y && lastYear(r) >= y && !(r.role.end === `${y}-01`))
        .sort((a, b) => newestFirst(a.role.start, b.role.start)),
      projects: PROJECTS.filter((p) => year(p.start) === y).sort((a, b) => newestFirst(a.start, b.start)),
    });
  }
  return groups;
}

export function employerName(id?: string) {
  return EMPLOYERS.find((e) => e.id === id)?.name;
}
