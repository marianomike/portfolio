// Adds screenshots dropped into screenshots/<project>/ to that project's
// gallery in public/work/<slug>/, resized for the web and numbered after the
// images already there. A file named cover.* replaces the card image instead.
// <project> is the slug or the title ("beyond-the-dark" finds slug "roblox").
//
//   npm run screenshots           # import, then preview with npm run dev
//   npm run screenshots:publish   # import, commit and push (deploys the site)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const INBOX = path.join(ROOT, "screenshots");
const WORK = path.join(ROOT, "public", "work");
const IMAGE = /\.(jpe?g|png|webp|avif|heic|tiff?)$/i;
const MAX_W = 1800;
const publish = process.argv.includes("--publish");

// slug and title-as-slug -> slug, read straight from career.ts
const career = fs.readFileSync(path.join(ROOT, "src", "content", "career.ts"), "utf8");
const slugs = new Map();
for (const [, slug, title] of career.matchAll(/slug: "([^"]+)",\s*title: "([^"]+)"/g)) {
  slugs.set(slug, slug);
  slugs.set(title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), slug);
}

async function save(src, destStem) {
  const img = sharp(src).rotate(); // honor camera orientation
  const { width = 0 } = await img.metadata();
  const { isOpaque } = await img.stats();
  if (width > MAX_W) img.resize({ width: MAX_W });
  // Screenshots are opaque, so JPEG; keep PNG only when transparency is used.
  const dest = `${destStem}${isOpaque ? ".jpg" : ".png"}`;
  await (isOpaque ? img.jpeg({ quality: 82, mozjpeg: true }) : img.png({ palette: true, quality: 85 })).toFile(dest);
  return dest;
}

const added = [];
for (const folder of fs.existsSync(INBOX) ? fs.readdirSync(INBOX).sort() : []) {
  const dir = path.join(INBOX, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  const files = fs.readdirSync(dir).filter((f) => IMAGE.test(f)).sort();
  if (!files.length) continue;
  const slug = slugs.get(folder);
  if (!slug) {
    console.error(`screenshots/${folder}: no project with that slug or title, skipped`);
    continue;
  }
  const out = path.join(WORK, slug);
  fs.mkdirSync(out, { recursive: true });
  let n = Math.max(0, ...fs.readdirSync(out).map((f) => Number(f.match(/^(\d+)\./)?.[1] ?? 0)));
  for (const f of files) {
    const src = path.join(dir, f);
    let dest;
    if (/^cover\./i.test(f)) {
      for (const old of fs.readdirSync(out).filter((o) => o.startsWith("cover."))) fs.unlinkSync(path.join(out, old));
      dest = await save(src, path.join(out, "cover"));
    } else {
      dest = await save(src, path.join(out, String(++n).padStart(2, "0")));
    }
    fs.unlinkSync(src);
    added.push(path.relative(ROOT, dest));
    console.log(`${folder}/${f} → ${path.relative(ROOT, dest)}`);
  }
}

if (!added.length) {
  console.log("Nothing to add. Drop images into screenshots/<project>/ first.");
  process.exit(0);
}

if (publish) {
  const git = (...args) => execFileSync("git", args, { cwd: ROOT, stdio: "inherit" });
  const projects = [...new Set(added.map((p) => p.split(path.sep)[2]))].join(", ");
  git("add", "--", ...added);
  git("commit", "-m", `Add screenshots: ${projects}`, "--", ...added);
  git("push");
  console.log("Pushed. The site updates in about a minute.");
} else {
  console.log(`Added ${added.length}. Preview with npm run dev, then npm run screenshots:publish or commit as usual.`);
}
