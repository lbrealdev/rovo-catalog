# Quick Prompts

Short conversational prompts for Rovo Agent.

**Use when:** Fast ticket queue reviews, daily standups, quick status checks.

---
id: utilities-list-tickets-bullets
title: List Tickets (Bullets)
category: utilities
tags: [my-tickets, bullets, sla]
use_when: Quick bullet list of your open tickets
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
List my open <PROJECT> tickets as bullets (Key, Summary, Status, Time to resolution)
```

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
id: utilities-group-by-status
title: Group by Status
category: utilities
tags: [my-tickets, status, sla]
use_when: Group your queue by status with Time to resolution
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Group my <PROJECT> tickets by status (Waiting for support, In Progress, etc.) and show Time to resolution for each
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
id: utilities-unassigned-summary-bullets
title: Summary of Unassigned Issues (Bullets)
category: utilities
tags: [unassigned, bullets, sla]
use_when: Bulleted summary of open unassigned issues
placeholders: []
mode: read-only
---

```text
Give me a bulleted summary of all open and unassigned issues (Key, Summary, Status, Time to resolution).
```

---
id: utilities-unassigned-table
title: Unassigned Issues in Table
category: utilities
tags: [unassigned, table, sla]
use_when: Table of open unassigned issues
placeholders: []
mode: read-only
---

```text
Show all open and unassigned issues in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

---
id: utilities-improve-ticket-description
title: Improve Ticket Description
category: utilities
tags: [description, polish]
use_when: Align a pasted Jira description to best practice
placeholders: []
mode: read-only
---

```text
Take this Jira issue description and align it to best-practice:

[PASTE DESCRIPTION]
```

---
id: utilities-user-story-template
title: Create User Story Template
category: utilities
tags: [user-story, template]
use_when: Generate a user story description template for a project
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Create a user story description template for <PROJECT> with: As a [role], I want [goal], so that [benefit]. Include acceptance criteria placeholders.
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

---
id: utilities-ignore-jira-context
title: Ignore Jira Context
category: utilities
tags: [context, chat]
use_when: Step out of Jira context for a side conversation
placeholders: []
mode: read-only
---

```text
Ignore the Jira context for now; I want to talk about [topic] instead.
```
