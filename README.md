# rovo-agent-notes

Personal documentation for Rovo Agent prompts, tips, and daily operations.

---

## Table of Contents

### Guides
- [Document Summaries](guides/document-summaries.md)
  - [Summarize Documentation](guides/document-summaries.md#summarize-documentation)
  - [Summarize Procedure](guides/document-summaries.md#summarize-procedure)

### Jira Prompts
- [Daily Triage](prompts/triage/daily-triage.md)
  - [List Today's Unassigned Tickets](prompts/triage/daily-triage.md#1-list-todays-unassigned-tickets)
  - [Assign to Me + Add Initial Customer Reply](prompts/triage/daily-triage.md#2-assign-to-me--add-initial-customer-reply)
  - [Review & Improve Ticket Description](prompts/triage/daily-triage.md#3-review--improve-ticket-description)
  - [My Assigned Tickets, Sorted by Urgency/SLA](prompts/triage/daily-triage.md#4-my-assigned-tickets-sorted-by-urgencysla)
  - [Filter "Likely No-Action" Alert-Style Tickets](prompts/triage/daily-triage.md#5-filter-likely-no-action-alert-style-tickets)
  - [JQL Quick Reference](prompts/triage/daily-triage.md#jql-quick-reference)
  - [Daily Prompts](prompts/triage/daily-triage.md#daily-prompts)
- [Ticket Analysis](prompts/tickets/ticket-analysis.md)
  - [Close AWS Health Notification Tickets](prompts/tickets/ticket-analysis.md#1-close-aws-health-notification-tickets)
  - [Filter Informational Tickets](prompts/tickets/ticket-analysis.md#2-filter-informational-tickets-aws-example)
  - [JQL Templates](prompts/tickets/ticket-analysis.md#jql-templates)
  - [Tips](prompts/tickets/ticket-analysis.md#tips)
  - [Summary Templates](prompts/tickets/ticket-analysis.md#summary-templates)
- [Reopened Tickets](prompts/tickets/reopened-tickets.md)
  - [TL;DR](prompts/tickets/reopened-tickets.md#tldr)
  - [Best Practice Workflow](prompts/tickets/reopened-tickets.md#best-practice-workflow)
  - [Taking Action](prompts/tickets/reopened-tickets.md#taking-action)
  - [Tips](prompts/tickets/reopened-tickets.md#tips)
- [SLA Management](prompts/sla/sla-management.md)
  - [SLA JQL Functions Reference](prompts/sla/sla-management.md#sla-jql-functions-reference)
  - [Signal Work Continuation](prompts/sla/sla-management.md#1-signal-work-continuation-ticket-x--ticket-y)
  - [SLA Expiring During Team Absence](prompts/sla/sla-management.md#2-sla-expiring-during-team-absence)
  - [Find Tickets with Note Pattern](prompts/sla/sla-management.md#3-find-tickets-with-note-pattern)

### Other Prompts
- [Special Commands](prompts/utilities/prompts-special.md)
  - [Assign + Comment](prompts/utilities/prompts-special.md#1-assign--comment)
  - [Status Change + Comment](prompts/utilities/prompts-special.md#2-status-change--comment)
  - [Search + Assign + Comment](prompts/utilities/prompts-special.md#3-search--assign--comment)
  - [Status + Resolution + Close](prompts/utilities/prompts-special.md#4-status--resolution--close)
  - [Bulk Action](prompts/utilities/prompts-special.md#5-bulk-action)
  - [JQL + Update](prompts/utilities/prompts-special.md#6-jql--update)
- [Proofreading](prompts/communication/proofreading.md)
  - [General Proofreading](prompts/communication/proofreading.md#general-proofreading)
  - [Client Messages](prompts/communication/proofreading.md#client-messages-projectaws-context)
  - [Message Templates](prompts/communication/proofreading.md#message-templates)

### Experimental Prompts
- [AWS Health Notifications](workbench/aws-health-notifications.md)
- [Find Similar Resolved Tickets](workbench/find-similar-resolved.md)
- [Recently Updated Tickets](workbench/recently-updated-tickets.md)

### JQL Queries
- [My Tickets JQL](queries/jql/my-tickets.md)
  - [My Open Tickets](queries/jql/my-tickets.md#my-open-tickets)
  - [My Open Tickets (Assignee Only)](queries/jql/my-tickets.md#my-open-tickets-assignee-only)
  - [My Tickets by SLA](queries/jql/my-tickets.md#my-tickets-by-sla)

### References
- [Backlog](docs/BACKLOG.md) — roadmap for the prompt catalog app
- [Rovo Resources](docs/rovo-resources.md)

---

## Repository Structure

```
.
├── workbench/                   # Experimental prompts (in testing)
│   ├── aws-health-notifications.md
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