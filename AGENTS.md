# AGENTS.md

Conventions for Rovo (Atlassian AI assistant) prompts and JQL used with Jira Service Management in this repo.

## Critical JQL Syntax Rules

**The "Time to resolution" field cannot use date comparisons.**
```jql
-- WRONG (will not work):
"Time to resolution" >= "2026-04-03"
-- CORRECT - use SLA functions:
remaining("Time to resolution") < 72
```

**Available SLA functions for Time to resolution:**
- `remaining("Time to resolution")` - hours until SLA expires
- `elapsed("Time to resolution")` - hours since SLA started
- `breached("Time to resolution")` - true/false, has SLA been breached
- `withinCalendarHours("Time to resolution", "09:00", "17:00")` - within business hours

**Searching comments:**
```jql
-- Use "comment ~" not "text ~":
comment ~ "<PATTERN>"
```

---

## JQL/SLA Field Naming Conventions

When referencing SLA fields in prompts or JQL queries, always use the actual Jira field name:

- **Use:** `"Time to resolution"` (the actual SLA field name)
- **Do NOT use:** `<SLA>`, `SLA field`, or generic placeholders

Example in prompts:
```text
Show my open <PROJECT> tickets in a table (Key, Summary, Status, Time to resolution)
```

Example in JQL:
```jql
project = <PROJECT>
AND remaining("Time to resolution") < 72
```

---

## Repository Structure

```
prompts/
├── triage/
│   └── daily-triage.md          # Daily triage (+ Unassigned Tickets hub)
├── tickets/
│   ├── ticket-analysis.md       # Analyze & close (+ AWS Health hub)
│   ├── reopened-tickets.md      # Reopened single + batch hubs
│   ├── recently-updated.md      # Recently updated tickets
│   └── find-similar-resolved.md # Similar resolved hub
├── sla/
│   ├── sla-management.md        # SLA signals / absence hubs
│   └── sla-workflow.md          # SLA clone continuation hub
├── communication/
│   ├── proofreading.md          # Message proofreading
│   └── confirm-before-action.md # Get approval before actions
├── utilities/
│   ├── prompts-special.md       # Lean multi-line (+ search/bulk/JQL hubs)
│   └── quick-prompts.md         # Queue rituals (list / prioritize / summarize)
└── confluence/
    └── explain.md               # Confluence explain / procedure / checklist / compare
workbench/                       # Experimental prompts (pointers / in testing)
guides/                          # Documentation
docs/                            # Backlog and references
queries/jql/                     # Reusable JQL templates (also loaded by the builder)
site/                            # Static catalog (HonorBox-style builder)
```

## Static site — Rovo Agent Toolkit (`site/`)

Zero-dependency Node build: reads `prompts/**/*.md` and `queries/jql/*.md` frontmatter and writes HTML to `site/dist/` (gitignored).

```bash
npm run build              # local base path /
npm run build:pages        # GitHub Pages base /rovo-catalog/
python3 -m http.server --directory site/dist
```

**Sections**

- **Prompts** (`index.html`) — `lang: text` entries
- **Queries** (`queries.html`) — `lang: jql` entries
- **Commands** (`commands.html`) — slash-command explainers from `site/content/commands.md` only (no recipe list)

**Chrome:** Profile and Theme are header buttons (not pages). Theme uses `data-theme` + `localStorage` key `rovo-catalog-theme` (inline head boot avoids FOUC). Profile stores `PROJECT`, `YOUR-USER`, and optional `CONFLUENCE-PAGE-URL`.

Source layout: `site/scripts/`, `site/templates/`, `site/content/`, `site/assets/` (CSS/JS/fonts). No CDN assets.

## Prompt Schema (Catalog Entries)

Stable prompts in `prompts/` use YAML frontmatter so the static catalog can load them. Full spec: [docs/prompt-schema.md](docs/prompt-schema.md).

Each copy-paste template is one entry:

```markdown
---
id: category-short-slug
title: Display Title
category: triage
tags: [example]
use_when: Short situation blurb
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Prompt body with <PROJECT> placeholders...
```
```

Rules:

- `id` = `category-short-slug`; `category` = folder name
- `mode`: `read-only` or `update` (for `/update-work-items` / `/create-work-items`)
- Body is the immediate fenced `text` or `jql` block after frontmatter
- Tips, reference tables, and long examples stay plain markdown (no frontmatter)
- Multi-step flows = hub entry with `hub_steps` + step entries with `listed: false`
- Placeholders live on the step that introduces them (unioned onto the hub form); do not duplicate the same token across steps
- Catalog list rows and prompt detail headers show no mode badges; hub update steps live on the hub page (`#step-<id>`), not on Commands
- Placeholders may use `type: select` with `options: ["…"]`, or `type: tags` for chip lists (default `type: text`)
- `workbench/` holds pointers / experiments; promote into `prompts/` when stable (AWS Health, recently updated, similar resolved, Confluence daily flows are promoted)

**Catalog hubs:** `triage-unassigned-tickets`, `sla-clone-continuation`, `sla-signal-continuation`, `sla-expiring-absence`, `tickets-reopened`, `tickets-reopened-batch-flow`, `tickets-aws-health`, `tickets-find-similar-resolved`, `utilities-search-assign`, `utilities-bulk-assign`, `utilities-jql-prioritize`.

Profile-owned placeholders (`localStorage`): `PROJECT`, `YOUR-USER`, optional `CONFLUENCE-PAGE-URL`.

## Placeholder Format

Prompts use `<UPPERCASE-WITH-HYPHENS>`:
- `<PROJECT>` - Jira project key (e.g., SUP, IT)
- `<TICKET-KEY>` - Ticket ID (e.g., SUP-123)
- `<TICKET-KEYS>` - Batch hub ticket list (`type: tags`; e.g., SUP-101, SUP-102)
- `<YOUR-USER>` - Jira username
- `<CONFLUENCE-PAGE-URL>` - Confluence page URL (optional in Profile)
- `<PATTERN>` - Search pattern
- `<HOURS-AWAY>` - Hours in away period (often a select)
- `<LOOKBACK>` - Selectable time window (natural language or JQL relative, per hub)
- `<TARGET-STATUS>` - Selectable transition status for Apply steps

## Prompt Conventions

- Prompts include read-only steps first, update steps after explicit confirmation
- Guardrails: "If more than 20 tickets, stop and ask"
- Use `/update-work-items` prefix for prompts that modify tickets

## Markdown Conventions

### Code Blocks for Prompts

All prompt text must be wrapped in triple backticks for easy copy-paste:

```markdown
```text
Your multi-line prompt text here...
```
```

Use language specifiers:
- `text` for plain text prompts
- `jql` for JQL queries
