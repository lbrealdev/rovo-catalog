# Prompt Schema

Metadata format for catalog entries in `prompts/`. Markdown remains the source of truth; YAML frontmatter labels each copy-paste template so a future static catalog can load it reliably.

**Product path:** browse → fill placeholders → copy → paste into Rovo  
**Site direction (Phase 2):** HonorBox-style zero-dependency static builder (plain HTML/CSS + tiny first-party JS on GitHub Pages). Not Vite. Not Backstage.

---

## Entry format

Each catalog entry is a YAML frontmatter block immediately followed by one fenced body (`text` or `jql`):

```markdown
---
id: triage-list-unassigned-today
title: List Today's Unassigned Tickets
category: triage
tags: [unassigned, morning, sla]
use_when: Start of shift — see new unassigned tickets
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
List today's new unassigned <PROJECT> tickets in a table (...)
```
```

Keep a short human intro at the top of each file. Multiple entries may live in one file (each starts with `---`). Put tips/reference prose **after** all entries, and avoid thematic `---` rules in these files (they collide with frontmatter delimiters).

**Parser rule:** a catalog entry is a frontmatter block that contains `id:` and is immediately followed by a fenced `text` or `jql` body.

---

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Stable slug: `category-short-name` (e.g. `triage-list-unassigned-today`) |
| `title` | yes | Catalog display title |
| `category` | yes | Folder name: `triage`, `tickets`, `sla`, `communication`, `utilities` |
| `tags` | yes | List of lowercase tags for later filters |
| `use_when` | yes | Short situation blurb |
| `placeholders` | yes | List of `{ name, required, description }` (use `[]` if none) |
| `mode` | yes | `read-only` or `update` (prompts that use `/update-work-items` or `/create-work-items`) |
| body | yes | Fenced block immediately after frontmatter |

Placeholder names in the body use `<UPPERCASE-WITH-HYPHENS>` and must match `placeholders[].name`.

---

## What counts as a catalog entry

**Include:** every fenced `text` or `jql` block meant to paste into Rovo (or Jira JQL search).

**Exclude (plain markdown, no frontmatter):**

- Tips, TL;DR, workflow prose
- Reference tables (e.g. SLA function tables, Rovo command lists)
- Long example drafts that illustrate a template (e.g. confirm-before-action examples)

Multi-step flows (review → apply) are **two separate entries**, not a linked workflow engine.

---

## Mini profile placeholders (Phase 2)

The future static site will store a mini profile in `localStorage` (persists until the user clears site data / cache). Align schema names now:

| Name | Profile-owned? | Notes |
|------|----------------|-------|
| `PROJECT` | yes | Default project key |
| `YOUR-USER` | yes | Jira username / display handle |
| `TICKET-KEY` | no | Per use |
| Other ticket/date/pattern fields | no | Per use |

---

## Inclusion scope

- **Phase 1:** stable `prompts/` only
- **Deferred:** `workbench/` (apply the same schema when promoting experimental prompts)

---

## Future extension: Jira API

Out of scope for v1. A later private design may use an API token to fetch tickets. Do **not** put API keys in a public GitHub Pages bundle. Any future key handling needs a private/proxy approach; the catalog schema does not define API fields today.

---

## Conventions reminder

- Use `"Time to resolution"` for SLA columns (never `SLA remaining` / `Time to SLA`)
- Prefer read-only prompts before update prompts
- Guardrails: e.g. "If more than 20 tickets, stop and ask"
- Language tags: `text` for Rovo prompts, `jql` for JQL snippets

See also [AGENTS.md](../AGENTS.md).
