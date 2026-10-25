import { CHAPTERS, EMPLOYERS, PROJECTS, type Chapter, type Employer, type Project } from "@/content/career";

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

/** One line per employer in a chapter: first and last title, whole stint. */
export type Job = { employer: Employer; title: string; start: string; end?: string };

export type ChapterGroup = Chapter & { jobs: Job[]; projects: Project[] };

// "Lead UI Designer, Mafia Wars" → "Lead UI Designer": the game is on the card.
const baseTitle = (t: string) => t.split(",")[0];

function job(employer: Employer): Job {
  const roles = [...employer.roles].reverse(); // oldest first
  const first = baseTitle(roles[0].title);
  const last = baseTitle(roles.at(-1)!.title);
  return {
    employer,
    title: first === last ? last : `${first} → ${last}`,
    start: roles[0].start,
    end: roles.at(-1)!.end,
  };
}

export function buildTimeline(): ChapterGroup[] {
  return CHAPTERS.map((chapter) => {
    const employers = EMPLOYERS.filter((e) => chapter.employers.includes(e.id));
    // Side projects have no employer and join the chapter their date falls in.
    const inChapter = (p: Project) =>
      p.employer
        ? chapter.employers.includes(p.employer)
        : year(p.start) >= Number(chapter.start) && (!chapter.end || year(p.start) < Number(chapter.end));
    return {
      ...chapter,
      jobs: employers.map(job).sort((a, b) => b.start.localeCompare(a.start)),
      projects: PROJECTS.filter(inChapter).sort((a, b) => b.start.localeCompare(a.start)),
    };
  });
}

export function employerName(id?: string) {
  return EMPLOYERS.find((e) => e.id === id)?.name;
}
