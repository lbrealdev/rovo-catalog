# Prompt Schema

Metadata format for catalog entries in `prompts/`. Markdown remains the source of truth; YAML frontmatter labels each copy-paste template so a future static catalog can load it reliably.

**Product path:** browse → fill placeholders → copy → paste into Rovo  
**Site:** HonorBox-style zero-dependency builder in [`site/`](../site/) (`npm run build` → `site/dist/`). Toolkit sections: Prompts (`lang: text`), Queries (`lang: jql`), Commands (`site/content/commands.md` slash explainers only). Plain HTML/CSS + tiny first-party JS. Not Vite. Not Backstage. GitHub Pages deploy is Phase 3.

---

## Entry format

Each catalog entry is a YAML frontmatter block immediately followed by one fenced body (`text` or `jql`):

```markdown
---
id: triage-assign-unassigned-review
title: Review Unassigned Tickets
category: triage
tags: [unassigned, assign, sla]
use_when: Review unassigned tickets for a lookback window before acting
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Show me all unassigned <PROJECT> tickets from <LOOKBACK> in a table (...)
```
```

Keep a short human intro at the top of each file. Multiple entries may live in one file (each starts with `---`). Put tips/reference prose **after** all entries, and avoid thematic `---` rules in these files (they collide with frontmatter delimiters).

**Parser rule:** a catalog entry is a frontmatter block that contains `id:` and is immediately followed by a fenced `text` or `jql` body.

---

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Stable slug: `category-short-name` (e.g. `triage-assign-unassigned-review`). Must match `/^[a-z0-9-]+$/` |
| `title` | yes | Catalog display title |
| `category` | yes | Folder name: `triage`, `tickets`, `sla`, `communication`, `utilities` |
| `tags` | yes | List of lowercase tags for later filters |
| `use_when` | yes | Short situation blurb |
| `placeholders` | yes | List of placeholder objects (use `[]` if none) |
| `mode` | yes | `read-only` or `update` (prompts that use `/update-work-items` or `/create-work-items`) |
| `listed` | no | Default `true`. `false` hides the entry from the Prompts index (step entries under a hub) |
| `hub_steps` | no | Ordered list of entry ids rendered as stacked steps on one hub page |
| body | yes | Fenced block immediately after frontmatter |

### Placeholders

Each placeholder is `{ name, required, description, type?, options? }`:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Token name matching `<NAME>` in the body |
| `required` | yes | Whether the field is required in the catalog form |
| `description` | yes | Short help text under the label |
| `type` | no | `text` (default), `select`, or `tags` (chip list that serializes to a comma-separated string) |
| `options` | for `select` | Non-empty list of option strings (inline `["a", "b"]` or a YAML block list). Do not set for `tags`. |

Placeholder names in the body use `<UPPERCASE-WITH-HYPHENS>` and must match `placeholders[].name`.

**Inline list quoting:** the frontmatter parser supports a quote-aware subset for `[a, "b, c", 'd']`. It does **not** handle escape sequences inside quotes (e.g. `"say \"hi\""` or `'it\'s'`). Prefer options that avoid the quote delimiter, or use a YAML block list (`options:` / `- item`) when an option must contain quotes.

### Hubs (multi-step flows)

Use a listed hub entry with `hub_steps` for review → apply (and related) flows. Step entries keep their own bodies and placeholders, set `listed: false`, and render stacked on the hub page (each with its own preview + copy). The builder **unions** step placeholders onto one shared hub form (first definition wins) — put each token on the step that introduces it; do not duplicate the same name across steps. Catalog list rows and prompt detail headers show no mode badges; hub update steps are reached via the hub page (`#step-<id>`), not a Commands recipe list. Unknown `hub_steps` ids, a hub listing its own id, and a step owned by two hubs fail the build.

Examples:

- [`prompts/triage/daily-triage.md`](../prompts/triage/daily-triage.md) — **Unassigned Tickets**
- [`prompts/sla/sla-workflow.md`](../prompts/sla/sla-workflow.md) — **SLA Clone Continuation**
- [`prompts/tickets/reopened-tickets.md`](../prompts/tickets/reopened-tickets.md) — **Reopened Tickets** / batch
- [`prompts/tickets/ticket-analysis.md`](../prompts/tickets/ticket-analysis.md) — **AWS Health Notifications**
- [`prompts/utilities/prompts-special.md`](../prompts/utilities/prompts-special.md) — search/assign, bulk, JQL prioritize hubs

---

## What counts as a catalog entry

**Include:** every fenced `text` or `jql` block meant to paste into Rovo (or Jira JQL search).

**Exclude (plain markdown, no frontmatter):**

- Tips, TL;DR, workflow prose
- Reference tables (e.g. SLA function tables, Rovo command lists)
- Long example drafts that illustrate a template (e.g. confirm-before-action examples)

Multi-step flows (review → apply) use a **hub entry** (`hub_steps`) plus unlisted step entries — not unrelated list rows.

---

## Mini profile placeholders (Phase 2)

The future static site will store a mini profile in `localStorage` (persists until the user clears site data / cache). Align schema names now:

| Name | Profile-owned? | Notes |
|------|----------------|-------|
| `PROJECT` | yes | Default project key |
| `YOUR-USER` | yes | Jira username / display handle |
| `TICKET-KEY` | no | Per use (single ticket) |
| `TICKET-KEYS` | no | Per use (`type: tags` chip list → comma-separated keys) |
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
