# AGENTS.md

Agent guide for **Rovo Catalog** (`rovo-catalog`) — copy-paste Rovo prompts and JQL for Jira Service Management, plus a zero-dependency static catalog app. Conventional Commits and the contribution rules below are **mandatory** for every change, human or agent.

## Repo overview

```
prompts/        # Stable catalog prompts (YAML frontmatter + fenced body)
queries/jql/    # Reusable JQL templates (same schema as prompts)
workbench/      # Experimental prompts (promote to prompts/ when stable)
guides/         # User guides
docs/           # Backlog, plans, references — incl. the prompt schema spec
site/           # Static catalog builder (scripts/templates/content/assets)
```

Product docs: [README.md](README.md). Canonical prompt-schema spec: [docs/prompt-schema.md](docs/prompt-schema.md). Jira/SLA/JQL domain reference belongs in `docs/` and `guides/`, not in this file.

## Contribution rules

### Conventional Commits (hard rule)

Every commit message uses `type(scope): subject`:

- Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `perf`, `test`, `style`, `ci`
- Scope optional but recommended (e.g. `feat(communication):`, `fix(ui):`, `ci(pages):`)
- Subject: imperative, lowercase, no trailing period

### Branch naming

- Agent branches: `cursor/<slug>-<4hex>` (e.g. `cursor/agentsmd-revamp-9f2e`)
- Human branches: `type/<slug>` (e.g. `docs/readme-humanize`, `feat/weekly-status`)

### Pull requests

- Title follows the same Conventional Commits format as commits
- Body: short what/why summary; link the issue (`Closes #N`) when one exists
- Single-purpose PRs: prompts, site, and docs changes ship separately

## Build and quality checks

- `npm run build` must pass before opening a PR (Node ≥ 24, zero npm dependencies)
- The build parses frontmatter in `prompts/**/*.md` and `queries/` and fails on invalid ids, unknown `hub_steps`, or placeholders duplicated across hub steps — fix build errors, never bypass them
- `site/dist/` is generated and gitignored; never commit it

## Static site — Rovo Catalog (`site/`)

Zero-dependency Node build: reads `prompts/**/*.md` frontmatter and writes HTML to `site/dist/` (gitignored).

```bash
npm run build              # local base path /
npm run build:pages        # GitHub Pages base /rovo-catalog/
python3 -m http.server --directory site/dist
```

**Sections**

- **Prompts** (`index.html`) — `lang: text` entries
- **Queries** (`queries.html`) — `lang: jql` entries
- **Commands** (`commands.html`) — slash-command explainers from `site/content/commands.md` only (no recipe list)

**Chrome:** Profile and Theme are header buttons (not pages). Theme uses `data-theme` + `localStorage` key `rovo-catalog-theme` (inline head boot avoids FOUC). Profile stores `PROJECT` and `YOUR-USER`.

Source layout: `site/scripts/`, `site/templates/`, `site/content/`, `site/assets/` (CSS/JS/fonts). No CDN assets.

## Prompt schema (catalog entries)

Stable prompts in `prompts/` use YAML frontmatter so the static catalog can load them. The full spec lives in [docs/prompt-schema.md](docs/prompt-schema.md) — follow it; the summary below does not replace it.

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

Essential rules:

- `id` = `category-short-slug`; `category` = folder name
- `mode`: `read-only` or `update` (for `/update-work-items` / `/create-work-items`)
- Body is the immediate fenced `text` or `jql` block after frontmatter
- Tips, reference tables, and long examples stay plain markdown (no frontmatter)
- Multi-step flows = hub entry with `hub_steps` + step entries with `listed: false`
- Placeholders live on the step that introduces them (unioned onto the hub form); do not duplicate the same token across steps
- Catalog list rows and prompt detail headers show no mode badges; hub update steps live on the hub page (`#step-<id>`), not on Commands
- Placeholders may use `type: select` with `options: ["…"]`, or `type: tags` for chip lists (default `type: text`)
- Placeholder tokens in bodies use `<UPPERCASE-WITH-HYPHENS>` and must match `placeholders[].name`
- `workbench/` schema migration is deferred (promote individual flows when ready; AWS Health is promoted)

**Catalog hubs:** `triage-unassigned-tickets`, `sla-clone-continuation`, `sla-signal-continuation`, `sla-expiring-absence`, `tickets-reopened`, `tickets-reopened-batch-flow`, `tickets-aws-health`, `utilities-search-assign`, `utilities-bulk-assign`, `utilities-jql-prioritize`.

Profile-owned placeholders (site mini profile, `localStorage`): `PROJECT`, `YOUR-USER`.
