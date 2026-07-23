# AGENTS.md

Repository for Rovo (Atlassian AI assistant) prompts and JQL queries for Jira Service Management.

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
│   └── daily-triage.md          # Daily triage operations
├── tickets/
│   ├── ticket-analysis.md       # Analyze & close tickets
│   └── reopened-tickets.md      # Handle reopened tickets
├── sla/
│   ├── sla-management.md        # SLA-aware prompts
│   └── sla-workflow.md          # SLA continuation workflow
├── communication/
│   ├── proofreading.md          # Message proofreading
│   └── confirm-before-action.md # Get approval before actions
└── utilities/
    ├── prompts-special.md       # Lean multi-line prompts
    └── quick-prompts.md         # Quick conversational prompts
workbench/                       # Experimental prompts (in testing)
guides/                          # Documentation
docs/                            # Backlog and references
queries/jql/                     # Reusable JQL templates
```

## Placeholder Format

Prompts use `<UPPERCASE-WITH-HYPHENS>`:
- `<PROJECT>` - Jira project key (e.g., SUP, IT)
- `<TICKET-KEY>` - Ticket ID (e.g., SUP-123)
- `<YOUR-USER>` - Jira username
- `<PATTERN>` - Search pattern
- `<HOURS-AWAY>` - Hours in away period

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
