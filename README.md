# rovo-agent-notes

Personal documentation for Rovo Agent prompts, tips, and daily operations.

Evolving toward a static prompt catalog on GitHub Pages — see [docs/BACKLOG.md](docs/BACKLOG.md).

---

## Table of Contents

### Guides
- [Document Summaries](guides/document-summaries.md) — stable summarization (experimental Confluence explain/Q&A lives in workbench)

### Jira Prompts
- [Daily Triage](prompts/triage/daily-triage.md)
  - [List Today's Unassigned Tickets](prompts/triage/daily-triage.md#1-list-todays-unassigned-tickets)
  - [Assign to Me + Add Initial Customer Reply](prompts/triage/daily-triage.md#2-assign-to-me--add-initial-customer-reply)
  - [Weekend Unassigned Tickets](prompts/triage/daily-triage.md#3-weekend-unassigned-tickets)
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

### References
- [Backlog](docs/BACKLOG.md) — roadmap for the prompt catalog app
- [Rovo Resources](docs/rovo-resources.md)
- [AGENTS.md](AGENTS.md) — agent and contributor conventions

---

## Repository Structure

```
.
├── AGENTS.md                    # Conventions for prompts and JQL
├── docs/
│   ├── BACKLOG.md               # Product roadmap (prompt catalog app)
│   └── rovo-resources.md        # Official Rovo links
├── workbench/                   # Experimental prompts (in testing)
│   ├── aws-health-notifications.md
│   ├── confluence-explain.md
│   ├── find-similar-resolved.md
│   └── recently-updated-tickets.md
├── guides/
│   └── document-summaries.md    # Summarize Confluence/AWS docs
├── prompts/
│   ├── triage/
│   │   └── daily-triage.md     # Daily triage operations
│   ├── tickets/
│   │   ├── ticket-analysis.md  # Analyze & close tickets
│   │   └── reopened-tickets.md # Handle reopened tickets
│   ├── sla/
│   │   ├── sla-management.md   # SLA-aware prompts
│   │   └── sla-workflow.md     # SLA continuation workflow
│   ├── communication/
│   │   ├── proofreading.md     # Message proofreading
│   │   └── confirm-before-action.md # Get approval before actions
│   └── utilities/
│       ├── prompts-special.md  # Lean multi-line prompts
│       └── quick-prompts.md    # Quick conversational prompts
└── queries/
    └── jql/
        └── my-tickets.md       # JQL queries for my tickets
```

**Note:** `workbench/` contains prompts being actively developed and tested. Once stable, they may be promoted to `prompts/`.

---

## Getting Started

1. Copy prompts from the relevant category
2. Replace `<PROJECT>`, `<TICKET-KEY>`, `<YOUR-USER>` placeholders
3. Paste into Rovo Chat
4. Review output before applying any changes

---

## Contributing

This is a personal knowledge base. Feel free to adapt prompts for your own use.
