# Backlog — Rovo Prompt Catalog

Single source of truth for planned work. Prefer updating this file over duplicating tasks as GitHub Issues (open an issue only when a chunk needs a focused PR or discussion).

**Product goal:** turn this daily-use markdown prompt repo into a small static app on GitHub Pages:

`browse by situation → fill placeholders → one-click copy → paste into Rovo`

---

## Phase 0 — Stabilize content

Foundation work so the catalog has clean, consistent prompts.

- [ ] Restore weekend triage wording from PR #12 (`Friday 18:00 until now`) in `prompts/triage/daily-triage.md`
- [ ] Add `Time to resolution` columns where intended in daily triage (assign + weekend list steps)
- [ ] Sync `README.md` with actual repo structure and current sections
- [ ] Sync `AGENTS.md` directory tree with real `prompts/` layout (`triage/`, `tickets/`, `sla/`, `communication/`, `utilities/`)
- [ ] Normalize SLA field naming in workbench to `Time to resolution` (not `SLA remaining` / `Time to SLA`)
- [ ] Decide AWS Health overlap: one canonical prompt (`workbench/aws-health-notifications.md` vs `prompts/tickets/ticket-analysis.md`)
- [ ] Decide Confluence prompts: keep in workbench, promote to `prompts/` / `guides/`, or both with clear roles

---

## Phase 1 — Prompt schema

Define metadata so the app can load prompts reliably.

- [ ] Define frontmatter (or sidecar) schema per prompt, e.g.:
  - `id`, `title`, `category`, `tags`
  - `use_when`
  - `placeholders` (e.g. `PROJECT`, `TICKET-KEY`, `YOUR-USER`)
  - `mode`: `read-only` | `update`
  - prompt `body`
- [ ] Apply schema to existing prompts (stable `prompts/` first, then `workbench/`)
- [ ] Document schema + conventions in `AGENTS.md` (placeholders, ```text / ```jql blocks, guardrails)

---

## Phase 2 — Minimal static app (MVP)

Small catalog UI — not a blog, not a backend.

- [ ] Scaffold Vite static site in-repo (e.g. `site/` or `app/`)
- [ ] Catalog home: list prompts by category / situation
- [ ] Search + tag filters
- [ ] Prompt detail view with:
  - use-when blurb
  - placeholder inputs
  - rendered prompt preview
  - **Copy** button
- [ ] Visually distinguish read-only vs `/update-work-items` prompts
- [ ] Keep markdown as source of truth; build step loads content into the app

---

## Phase 3 — GitHub Pages deploy

- [ ] Add GitHub Actions workflow to build + deploy Pages
- [ ] Configure base path for the repository name
- [ ] Add live site URL to `README.md`
- [ ] Verify usability on desktop (and mobile if used daily)

---

## Phase 4 — Daily-use polish

- [ ] Situation shortcuts (e.g. Monday triage, SLA at risk, AWS Health close-out)
- [ ] Recently used / favorites (`localStorage`)
- [ ] JQL snippets section with copy
- [ ] Link related prompts (e.g. find similar → draft resolution)
- [ ] Readability-focused styling only (avoid over-design)

---

## Phase 5 — Optional later

- [ ] Docs/changelog section (Marmite or simple pages) if a writing surface is needed beside the catalog
- [ ] Promote stable workbench prompts into catalog categories
- [ ] Track Rovo product changes that require prompt updates

---

## Non-goals (v1)

- No backend / auth
- No live Jira API integration
- No heavy design system
- No duplicate backlog in GitHub Issues (unless a task needs its own PR/discussion)

---

## Working notes

- Content cleanup (Phase 0) unblocks a trustworthy catalog.
- Schema (Phase 1) unblocks the app without rewriting prompts later.
- Ship MVP (Phases 2–3) as soon as a few prompts are schema-ready; polish after daily use.
