# Portfolio

Mike Mariano's portfolio and resume at uiuxartist.com: one timeline from 2000 to now, with a Google Photos–style year scrubber and a printable resume view.

## Editing

- **Jobs, projects, education:** `src/content/career.ts` is the single source for the timeline, the resume and the project pages.
- **A project's write-up:** `content/projects/<slug>.md`. Optional frontmatter: `role`, `tools` (list), `video` (embed URL).
- **A project's images:** `public/work/<slug>/`. `cover.*` is the card image; every other image is the gallery, in filename order.

Project URLs match the old Adobe Portfolio paths (`/run-story/`, `/star-wars-commander/`…); the old hub pages (`/zynga/`, `/disney-interactive/`, `/about/`…) redirect to the timeline.

## Running

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

## Deploying

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`). `public/CNAME` sets the custom domain. One-time setup: repo Settings → Pages → Source: GitHub Actions, then point the domain's DNS at GitHub Pages (A records 185.199.108–111.153 for the apex, CNAME `www` → `<user>.github.io`).
