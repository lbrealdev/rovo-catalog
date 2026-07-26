# rovo-agent-notes

Personal documentation for Rovo Agent prompts, tips, and daily operations.

Includes a local static prompt catalog (HonorBox-style). GitHub Pages deploy is Phase 3 — see [docs/BACKLOG.md](docs/BACKLOG.md).

---

## Table of Contents

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
- [Quick Prompts](prompts/utilities/quick-prompts.md)
- [Proofreading](prompts/communication/proofreading.md)
- [Confirm Before Action](prompts/communication/confirm-before-action.md)

### Experimental Prompts
- [AWS Health Notifications](workbench/aws-health-notifications.md) — two-step finder; stable close-out is in Ticket Analysis
- [Confluence Documentation](workbench/confluence-explain.md) — explain/Q&A variants; stable summarization is in Guides
- [Find Similar Resolved Tickets](workbench/find-similar-resolved.md)
- [Recently Updated Tickets](workbench/recently-updated-tickets.md)

### JQL Queries
- [My Tickets JQL](queries/jql/my-tickets.md)

### Catalog
- Build with `npm run build`, then serve `site/dist/` (see [Getting Started](#getting-started))

### References
- [Backlog](docs/BACKLOG.md) — roadmap for the prompt catalog app
- [Prompt Schema](docs/prompt-schema.md) — catalog frontmatter format
- [Rovo Resources](docs/rovo-resources.md)
- [AGENTS.md](AGENTS.md) — agent and contributor conventions

---

## Repository Structure

```
.
├── package.json                 # npm run build (zero dependencies)
├── AGENTS.md                    # Conventions for prompts and JQL
├── docs/
│   ├── BACKLOG.md               # Product roadmap (prompt catalog app)
│   ├── prompt-schema.md         # Catalog frontmatter schema
│   └── rovo-resources.md        # Official Rovo links
├── site/                        # Static catalog builder + assets
│   ├── scripts/                 # parse-prompts.js, build.js
│   ├── templates/
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

**Note:** `workbench/` contains prompts being actively developed and tested. Once stable, they may be promoted to `prompts/`.

---

## Getting Started

### Prompt catalog (local)

```bash
npm run build
python3 -m http.server 8765 --directory site/dist
# open http://127.0.0.1:8765/
```

1. Set **Profile** (`PROJECT`, `YOUR-USER`) — stored in `localStorage`
2. Browse / search prompts, open one, fill placeholders, **Copy**
3. Paste into Rovo Chat and review before applying changes

For a GitHub Pages base path preview: `npm run build:pages` (deploy is Phase 3).

### Markdown prompts (without the site)

1. Copy prompts from the relevant category under `prompts/`
2. Replace `<PROJECT>`, `<TICKET-KEY>`, `<YOUR-USER>` placeholders
3. Paste into Rovo Chat
4. Review output before applying any changes

---

## Contributing

This is a personal knowledge base. Feel free to adapt prompts for your own use.
