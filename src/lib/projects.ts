import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Build-time only (Server Components). A project page is the data in career.ts
// plus an optional write-up in content/projects/<slug>.md and images in
// public/work/<slug>/. cover.* is the card image; every other image is the
// gallery, in filename order.

const CONTENT = path.join(process.cwd(), "content", "projects");
const PUBLIC = path.join(process.cwd(), "public");
const IMAGE = /\.(jpe?g|png|gif|webp|avif)$/i;

export type ProjectMedia = { cover?: string; gallery: string[] };

export function projectMedia(slug: string): ProjectMedia {
  const dir = path.join(PUBLIC, "work", slug);
  if (!fs.existsSync(dir)) return { gallery: [] };
  const files = fs.readdirSync(dir).filter((f) => IMAGE.test(f)).sort();
  const cover = files.find((f) => f.startsWith("cover."));
  return {
    cover: cover && `/work/${slug}/${cover}`,
    gallery: files.filter((f) => f !== cover).map((f) => `/work/${slug}/${f}`),
  };
}

export type ProjectBody = { html: string; role?: string; tools?: string[]; video?: string };

export function projectBody(slug: string): ProjectBody | undefined {
  const file = path.join(CONTENT, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { html: marked.parse(content, { async: false }), role: data.role, tools: data.tools, video: data.video };
}
