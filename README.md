# rovo-catalog

Copy-paste Rovo prompts and JQL for Jira Service Management — plus a small static app to browse, fill, and copy them.

**Rovo Agent Toolkit** is a zero-dependency static site (HonorBox-style: plain HTML/CSS + tiny first-party JS). Markdown under `prompts/` stays the source of truth; `npm run build` turns frontmatter into pages under `site/dist/`.

**How it works:** browse by situation → fill placeholders → one-click copy → paste into Rovo.

**Live site:** [https://lbrealdev.github.io/rovo-catalog/](https://lbrealdev.github.io/rovo-catalog/) (deploys from `main` via GitHub Actions).

---

## Table of Contents

### Toolkit
- [Features](#features)
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)

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

### References
- [Backlog](docs/BACKLOG.md) — roadmap for the prompt catalog app
- [Prompt Schema](docs/prompt-schema.md) — catalog frontmatter format
- [Rovo Resources](docs/rovo-resources.md)
- [AGENTS.md](AGENTS.md) — agent and contributor conventions

---

## Features

- **Situation-first catalog** — Prompts grouped by triage, tickets, SLA, communication, and utilities; hubs stack review → apply steps on one page
- **Placeholder forms** — fill `<PROJECT>`, `<YOUR-USER>`, selects, and tag chips; Profile prefills the ones you reuse
- **One-click copy** — preview the rendered prompt, copy, paste into Rovo Chat
- **Queries page** — reusable JQL (`lang: jql`) next to the text prompts
- **Commands page** — slash-command explainers only (`/update-work-items`, `/create-work-items`); no recipe dump
- **Light / dark theme** — `localStorage`, no FOUC; moon/sun toggle in the header
- **Offline-friendly build** — no CDN, no Vite, no backend; Node ≥ 24, zero npm dependencies

> [!NOTE]
> Catalog build currently reports **22 listed prompts** (44 total with hub steps) and **6 queries**. Counts come from `npm run build`.

---

## Getting Started

### Live site

Open [https://lbrealdev.github.io/rovo-catalog/](https://lbrealdev.github.io/rovo-catalog/).

1. Set **Profile** (`PROJECT`, `YOUR-USER`) — stored in `localStorage`
2. Use **Theme** (moon/sun) for light/dark — choice persists
3. Browse **Prompts** by category or situation shortcuts; page with ← / → when the pager is visible
4. Open an item, fill placeholders, **Copy** → paste into Rovo

**Commands** is slash-command docs. **Queries** is JQL with copy.

### Build locally

```bash
npm run build
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/
```

GitHub Pages base-path preview:

```bash
npm run build:pages
# serves under /rovo-catalog/
```

> [!TIP]
> Reading the generated HTML works with JavaScript off. Copy, Profile, Theme, favorites, and recently used need JS.

### Markdown without the site

1. Open a prompt under `prompts/<category>/`
2. Replace `<PROJECT>`, `<TICKET-KEY>`, `<YOUR-USER>` (and any other tokens)
3. Paste into Rovo Chat
4. Review output before any `/update-work-items` step

---

## Prompt categories

| Category | Path | What it’s for |
|----------|------|----------------|
| Triage | [`prompts/triage/`](prompts/triage/) | Daily triage, unassigned hub |
| Tickets | [`prompts/tickets/`](prompts/tickets/) | Analyze & close, reopened, AWS Health hub |
| SLA | [`prompts/sla/`](prompts/sla/) | SLA signals, absence, clone continuation |
| Communication | [`prompts/communication/`](prompts/communication/) | Proofreading, confirm-before-action, weekly status |
| Utilities | [`prompts/utilities/`](prompts/utilities/) | Quick queue rituals, search/bulk/JQL hubs |

Stable entries use YAML frontmatter (`id`, `title`, `category`, `tags`, `use_when`, `placeholders`, `mode`) plus one fenced `text` or `jql` body. Spec: [docs/prompt-schema.md](docs/prompt-schema.md).

### JQL queries

Reusable templates live in [`queries/jql/`](queries/jql/). Same schema as prompts; they show on the **Queries** page, not Prompts.

> [!IMPORTANT]
> `"Time to resolution"` cannot use date comparisons. Use SLA functions such as `remaining("Time to resolution")`. Full rules: [AGENTS.md](AGENTS.md).

### Experimental workbench

[`workbench/`](workbench/) holds prompts still in testing. Schema migration is deferred; promote into `prompts/` when a flow is stable. AWS Health is already promoted (`tickets-aws-health` in ticket analysis).

### Guides & references

- [Document Summaries](guides/document-summaries.md)
- [Backlog](docs/BACKLOG.md)
- [Prompt Schema](docs/prompt-schema.md)
- [Rovo Resources](docs/rovo-resources.md)
- [AGENTS.md](AGENTS.md)

---

## Repository Structure

```
.
├── package.json                 # npm run build (zero dependencies)
├── AGENTS.md                    # Conventions for prompts and JQL
├── docs/
│   ├── BACKLOG.md               # Product roadmap
│   ├── prompt-schema.md         # Catalog frontmatter schema
│   └── rovo-resources.md        # Official Rovo links
├── site/                        # Rovo Agent Toolkit (static builder)
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

`workbench/` is for prompts under active development. Promote to `prompts/` once stable.
