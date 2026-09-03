# Backlog — Rovo Prompt Catalog

Planned work lives here. Prefer updating this file over opening GitHub Issues for every task; open an issue when a chunk needs its own PR or discussion.

**Product goal:** a small static app on GitHub Pages for this prompt repo:

`browse by situation → fill placeholders → one-click copy → paste into Rovo`

---

## Phase 0 — Stabilize content

Get prompts clean and consistent before building on them.

- [x] Restore weekend triage wording from PR #12 (`Friday 18:00 until now`) in `prompts/triage/daily-triage.md`
- [x] Add `Time to resolution` columns where intended in daily triage (assign + weekend list steps)
- [x] Sync `README.md` with actual repo structure and current sections
- [x] Sync `AGENTS.md` directory tree with real `prompts/` layout (`triage/`, `tickets/`, `sla/`, `communication/`, `utilities/`)
- [x] Normalize SLA field naming in workbench to `Time to resolution` (not `SLA remaining` / `Time to SLA`)
- [x] Decide AWS Health overlap: one canonical prompt (`workbench/aws-health-notifications.md` vs `prompts/tickets/ticket-analysis.md`)
- [x] Decide Confluence prompts: keep in workbench, promote to `prompts/` / `guides/`, or both with clear roles
- [x] Catalog content cleanup: remove duplicate/filler Prompts entries; Commands = slash docs only (no copyable recipe list)
- [x] Batch hubs use one `TICKET-KEYS` list placeholder (not fixed TICKET-1/2/3)

---

## Phase 1 — Prompt schema

Metadata so the app can load prompts reliably.

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
- [x] Configure base path for the repository name (`SITE_BASE_PATH=/rovo-catalog/` via `npm run build:pages`)
- [x] Add live site URL to `README.md`
- [ ] Verify usability on desktop (and mobile if used daily) — after first green deploy + Pages source = GitHub Actions

---

## Phase 2.5 — Catalog IA (post-MVP)

Shared Rovo Catalog chrome on top of the Phase 2 static site.

- [x] Nav: Prompts · Commands · Queries (pages) + Profile · Theme (buttons)
- [x] Light/dark theme (`localStorage`, no FOUC)
- [x] JQL entries (`lang: jql`) on Queries, excluded from Prompts
- [x] Commands page: slash-command explainers only (`site/content/commands.md`; no recipe index)
- [ ] Profile notes + export (Markdown/HTML) — TBD
- [ ] Confluence / Guides section — later

---

## Phase 4 — Daily-use polish

- [x] Situation shortcuts (Monday triage, SLA at risk, Reopened, Proofreading)
- [x] Recently used / favorites (`localStorage`) — Prompts catalog only
- [x] JQL snippets section with copy (Queries page)
- [x] Link related prompts via hubs (`hub_steps`) — Unassigned Tickets + Issue #24 rollout (SLA clone/signals, reopened, AWS Health, utilities)
- [x] Readability-focused styling only (avoid over-design) — sparse, high-quality impression (browse hub + pager + HonorBox theme — PR #18)

---

## Phase 5 — Optional later

- [ ] Docs/changelog section (Marmite or simple pages) if a writing surface is needed beside the catalog
- [x] Promote AWS Health workbench finder into `tickets-aws-health` hub (Issue #24); other workbench prompts still deferred
- [ ] Promote remaining stable workbench prompts into catalog categories (apply prompt schema on promotion)
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

- Content cleanup (Phase 0) keeps the catalog trustworthy: Prompts = hubs + situational recipes; Commands = slash-command docs (`/update-work-items`, `/create-work-items`); Queries = `lang: jql`.
- Schema (Phase 1) lets the app load prompts without rewriting them later.
- Ship MVP (Phases 2–3) with HonorBox-style static pages; polish after daily use.
