# Rovo Catalog

Copy-paste Rovo prompts and JQL for Jira Service Management — browse, fill placeholders, copy, paste into Rovo.

**Live site:** [https://lbrealdev.github.io/rovo-catalog/](https://lbrealdev.github.io/rovo-catalog/) (deploys from `main` via GitHub Actions).

Zero-dependency static site (plain HTML/CSS + tiny first-party JS). Markdown under `prompts/` is the source of truth; `npm run build` writes pages to `site/dist/`.

---

## Use it

1. Set **Profile** (`PROJECT`, `YOUR-USER`) — stored in `localStorage`.
2. Browse **Prompts** by category or situation shortcuts; page with ← / → when the pager is visible.
3. Open an item, fill placeholders, **Copy** → paste into Rovo Chat.
4. **Queries** is reusable JQL (`lang: jql`) with copy.
5. **Commands** is slash-command explainers (`/update-work-items`, `/create-work-items`) — not a recipe list.

**Theme** (moon/sun) persists in `localStorage`. Reading the generated HTML works with JavaScript off. Copy, Profile, Theme, favorites, and recently used need JS.

To skip the site: open a file under `prompts/<category>/`, replace `<PROJECT>`, `<TICKET-KEY>`, `<YOUR-USER>` (and any other tokens), paste into Rovo Chat, and review output before any `/update-work-items` step.

---

## Fork and host on GitHub Pages

1. Fork this repo. Keep the name `rovo-catalog`, or note that the deploy workflow derives the site base path from the repository name.
2. In the fork: **Settings → Pages → Source: GitHub Actions**.
3. Push to `main` or run the **Deploy GitHub Pages** workflow. No secrets. The workflow sets `SITE_BASE_PATH` from the repo name:
   - Project site: `https://<user>.github.io/<repo>/` (base `/<repo>/`)
   - User or org site named `<user>.github.io`: builds at `/`

Local preview of the Pages base path (this repo’s name):

```bash
npm run build:pages
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/rovo-catalog/
```

`npm run build:pages` hardcodes `/rovo-catalog/` for local preview. CI derives the path from the repository name.

---

## Build locally

Node ≥ 24, zero npm dependencies.

```bash
npm run build
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/
```

Prompt and query counts are printed by the build; do not treat README numbers as source of truth. `site/dist/` is generated and gitignored.

---

## Catalog reference

### Guides
- [Document Summaries](guides/document-summaries.md) — stable summarization (experimental Confluence explain/Q&A lives in workbench)

### Jira Prompts
- [Daily Triage](prompts/triage/daily-triage.md) — schema-ready catalog entries
- [Ticket Analysis](prompts/tickets/ticket-analysis.md)
- [Reopened Tickets](prompts/tickets/reopened-tickets.md)
- [SLA Management](prompts/sla/sla-management.md)
- [SLA Workflow](prompts/sla/sla-workflow.md)

### Other Prompts
- [Special Commands](prompts/utilities/prompts-special.md)
- [Quick Prompts](prompts/utilities/quick-prompts.md) — queue rituals (list / prioritize / summarize)
- [Weekly Status (Client)](prompts/communication/weekly-status.md) — talking points for the recurring client weekly
- [Proofreading](prompts/communication/proofreading.md)
- [Confirm Before Action](prompts/communication/confirm-before-action.md)

### Experimental Prompts
- [AWS Health Notifications](prompts/tickets/ticket-analysis.md) — stable Review → Apply hub (`tickets-aws-health`); workbench file is a pointer
- [Confluence Documentation](workbench/confluence-explain.md) — explain/Q&A variants; stable summarization is in Guides
- [Find Similar Resolved Tickets](workbench/find-similar-resolved.md)
- [Recently Updated Tickets](workbench/recently-updated-tickets.md)

### JQL Queries
- [My Tickets JQL](queries/jql/my-tickets.md)

### Docs
- [Backlog](docs/BACKLOG.md) — roadmap for the prompt catalog app
- [Prompt Schema](docs/prompt-schema.md) — catalog frontmatter format
- [Rovo Resources](docs/rovo-resources.md)
- [AGENTS.md](AGENTS.md) — agent and contributor conventions

### Features

- **Situation-first catalog** — Prompts grouped by triage, tickets, SLA, communication, and utilities; hubs stack review → apply steps on one page
- **Placeholder forms** — fill `<PROJECT>`, `<YOUR-USER>`, selects, and tag chips; Profile prefills the ones you reuse
- **One-click copy** — preview the rendered prompt, copy, paste into Rovo Chat
- **Queries page** — reusable JQL (`lang: jql`) next to the text prompts
- **Commands page** — slash-command explainers only (`/update-work-items`, `/create-work-items`); no recipe dump
- **Light / dark theme** — `localStorage`, no FOUC; moon/sun toggle in the header
- **Offline-friendly build** — no CDN, no Vite, no backend; Node ≥ 24, zero npm dependencies

### Prompt categories

| Category | Path | What it’s for |
|----------|------|----------------|
| Triage | [`prompts/triage/`](prompts/triage/) | Daily triage, unassigned hub |
| Tickets | [`prompts/tickets/`](prompts/tickets/) | Analyze & close, reopened, AWS Health hub |
| SLA | [`prompts/sla/`](prompts/sla/) | SLA signals, absence, clone continuation |
| Communication | [`prompts/communication/`](prompts/communication/) | Proofreading, confirm-before-action, weekly status |
| Utilities | [`prompts/utilities/`](prompts/utilities/) | Quick queue rituals, search/bulk/JQL hubs |

Stable entries use YAML frontmatter (`id`, `title`, `category`, `tags`, `use_when`, `placeholders`, `mode`) plus one fenced `text` or `jql` body. Spec: [docs/prompt-schema.md](docs/prompt-schema.md).

Reusable JQL templates live in [`queries/jql/`](queries/jql/). Same schema as prompts; they show on the **Queries** page, not Prompts.

> `"Time to resolution"` cannot use date comparisons. Use SLA functions such as `remaining("Time to resolution")`. Full rules: [AGENTS.md](AGENTS.md).

[`workbench/`](workbench/) holds prompts still in testing. Schema migration is deferred; promote into `prompts/` when a flow is stable. AWS Health is already promoted (`tickets-aws-health` in ticket analysis).

### Repository structure

```
.
├── package.json                 # npm run build (zero dependencies)
├── AGENTS.md                    # Conventions for prompts and JQL
├── docs/
│   ├── BACKLOG.md               # Product roadmap
│   ├── prompt-schema.md         # Catalog frontmatter schema
│   └── rovo-resources.md        # Official Rovo links
├── site/                        # Rovo Catalog (static builder)
│   ├── scripts/                 # parse-prompts.js, build.js
│   ├── templates/
│   ├── content/                 # Commands explainers (commands.md)
│   ├── assets/                  # CSS, JS, self-hosted fonts
│   └── dist/                    # Generated (gitignored)
├── workbench/                   # Experimental prompts (in testing)
├── guides/
│   └── document-summaries.md
├── prompts/                     # Schema-ready catalog source
└── queries/
    └── jql/
        └── my-tickets.md
```
