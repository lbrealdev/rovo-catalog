# Backlog — Rovo Prompt Catalog

Single source of truth for planned work. Prefer updating this file over duplicating tasks as GitHub Issues (open an issue only when a chunk needs a focused PR or discussion).

**Product goal:** turn this daily-use markdown prompt repo into a small static app on GitHub Pages:

`browse by situation → fill placeholders → one-click copy → paste into Rovo`

---

## Phase 0 — Stabilize content

Foundation work so the catalog has clean, consistent prompts.

- [x] Restore weekend triage wording from PR #12 (`Friday 18:00 until now`) in `prompts/triage/daily-triage.md`
- [x] Add `Time to resolution` columns where intended in daily triage (assign + weekend list steps)
- [x] Sync `README.md` with actual repo structure and current sections
- [x] Sync `AGENTS.md` directory tree with real `prompts/` layout (`triage/`, `tickets/`, `sla/`, `communication/`, `utilities/`)
- [x] Normalize SLA field naming in workbench to `Time to resolution` (not `SLA remaining` / `Time to SLA`)
- [x] Decide AWS Health overlap: one canonical prompt (`workbench/aws-health-notifications.md` vs `prompts/tickets/ticket-analysis.md`)
- [x] Decide Confluence prompts: keep in workbench, promote to `prompts/` / `guides/`, or both with clear roles

---

## Phase 1 — Prompt schema

Define metadata so the app can load prompts reliably.

- [x] Define frontmatter schema per prompt (`id`, `title`, `category`, `tags`, `use_when`, `placeholders`, `mode`, body) — see [prompt-schema.md](prompt-schema.md)
- [x] Apply schema to stable `prompts/` (workbench deferred until promotion)
- [x] Document schema + conventions in `AGENTS.md` (placeholders, ```text / ```jql blocks, guardrails)

---

## Phase 2 — Minimal static app (MVP)

Small catalog UI — HonorBox-style: zero-dependency Node build, plain HTML/CSS, tiny first-party JS. Not Vite. Not a blog or backend.

- [x] Scaffold static site in-repo (`site/`) with a zero-dep build script that reads `prompts/**/*.md` frontmatter
- [x] Catalog home: list prompts by category / situation
- [x] Search + tag filters
- [x] Prompt detail view with:
  - use-when blurb
  - placeholder inputs
  - rendered prompt preview
  - **Copy** button
- [x] Mini profile (`localStorage`): `PROJECT`, `YOUR-USER` — persists until site data/cache is cleared; prefills placeholders
- [x] Visually distinguish read-only vs `/update-work-items` prompts
- [x] Keep markdown as source of truth; build step loads content into static pages
- [x] No external CDN scripts/fonts (first-party only); usable with JS off for reading (copy/profile need JS)

---

## Phase 3 — GitHub Pages deploy

- [x] Add GitHub Actions workflow to build + deploy Pages
- [x] Configure base path for the repository name (`SITE_BASE_PATH=/rovo-agent-notes/` via `npm run build:pages`)
- [x] Add live site URL to `README.md`
- [ ] Verify usability on desktop (and mobile if used daily) — after first green deploy + Pages source = GitHub Actions

---

## Phase 2.5 — Toolkit IA (post-MVP)

Shared Rovo Agent toolkit chrome on top of the Phase 2 static site.

- [x] Nav: Prompts · Commands · Queries (pages) + Profile · Theme (buttons)
- [x] Light/dark theme (`localStorage`, no FOUC)
- [x] JQL entries (`lang: jql`) on Queries, excluded from Prompts
- [x] Commands page: slash-command explainers + `mode: update` recipes
- [ ] Profile notes + export (Markdown/HTML) — TBD
- [ ] Confluence / Guides section — later

---

## Phase 4 — Daily-use polish

- [ ] Situation shortcuts (e.g. Monday triage, SLA at risk, AWS Health close-out)
- [ ] Recently used / favorites (`localStorage`)
- [x] JQL snippets section with copy (Queries page)
- [ ] Link related prompts (e.g. find similar → draft resolution)
- [x] Readability-focused styling only (avoid over-design) — sparse, high-quality impression (browse hub + pager + HonorBox theme — PR #18)

---

## Phase 5 — Optional later

- [ ] Docs/changelog section (Marmite or simple pages) if a writing surface is needed beside the catalog
- [ ] Promote stable workbench prompts into catalog categories (apply prompt schema on promotion)
- [ ] Track Rovo product changes that require prompt updates
- [ ] Jira API / API token for fetching tickets — only behind a private/proxy design (never bake secrets into public Pages JS)

---

## Non-goals (v1)

- No backend / auth
- No live Jira API integration in v1 (possible later behind a private design)
- No heavy design system
- No Vite / SPA framework unless needs clearly outgrow the static builder
- No duplicate backlog in GitHub Issues (unless a task needs its own PR/discussion)

---

## Working notes

- Content cleanup (Phase 0) unblocks a trustworthy catalog.
- Schema (Phase 1) unblocks the app without rewriting prompts later.
- Ship MVP (Phases 2–3) with HonorBox-style static pages; polish after daily use.
