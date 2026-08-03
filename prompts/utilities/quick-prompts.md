# Quick Prompts

Short queue and ticket rituals for Rovo Agent — list, prioritize, summarize.

**Use when:** Fast ticket queue reviews, daily standups, Friday close-out, or comment digests.

---
id: utilities-list-tickets-table
title: List Tickets (Table)
category: utilities
tags: [my-tickets, table, sla]
use_when: Table view of your open tickets
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Show my open <PROJECT> tickets in a table (Key, Summary, Status, Time to resolution)
```

---
id: utilities-prioritize-by-sla
title: Prioritize by SLA
category: utilities
tags: [my-tickets, sla, priority]
use_when: Sort your tickets by SLA urgency
placeholders: []
mode: read-only
---

```text
Show my tickets sorted by SLA urgency (shortest first): Key, Summary, Status, Time to resolution
```

---
id: utilities-summarize-my-tickets
title: Summarize My Tickets
category: utilities
tags: [my-tickets, summary, sla]
use_when: High-level counts for SLA risk, follow-up, and waiting on customer
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Summarize my <PROJECT> tickets: how many at risk of SLA breach, how many need follow-up, how many waiting on customer
```

---
id: utilities-weekly-summary
title: Weekly Summary
category: utilities
tags: [friday, summary, sla]
use_when: Friday close-out — brief summary of assigned issues
placeholders: []
mode: read-only
---

```text
It's Friday. Give me a brief summary of all my assigned issues to close the week: how many are resolved, how many still need action, any SLA at risk.
```

---
id: utilities-summarize-ticket-comments
title: Summarize Ticket Comments
category: utilities
tags: [comments, summary]
use_when: Summarize questions, answers, and status from ticket comments
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
mode: read-only
---

```text
Summarize the comments on Jira issue <TICKET-KEY>: what questions were asked, what answers were given, and current status.
```
