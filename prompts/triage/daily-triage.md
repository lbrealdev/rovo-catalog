# Daily Triage Prompts

Reusable prompts for daily Jira Service Management triage operations.

**Use when:** Starting your shift, reviewing your queue, or triaging noisy alerts.

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
List today's new unassigned <PROJECT> tickets in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

---
id: triage-assign-unassigned-review
title: Assign Unassigned Tickets (Review)
category: triage
tags: [unassigned, assign, sla]
use_when: After seeing the list — review unassigned tickets from the last 24 hours before acting
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Show me all unassigned <PROJECT> tickets from the last 24 hours in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

---
id: triage-assign-unassigned-apply
title: Assign Unassigned Tickets (Apply)
category: triage
tags: [unassigned, assign, update]
use_when: After confirming the review list — assign, transition, and reply
placeholders: []
mode: update
---

```text
/update-work-items
Assign all listed tickets to me, change status from "Waiting for Support" to "In Progress", and add "Ticket under review. We'll update you shortly." as a customer reply.
```

---
id: triage-weekend-unassigned-review
title: Weekend Unassigned Tickets (Review)
category: triage
tags: [unassigned, weekend, monday, sla]
use_when: Monday morning — catch tickets from Friday 18:00 until now
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```text
Show me all unassigned <PROJECT> tickets from Friday 18:00 until now in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

---
id: triage-weekend-unassigned-apply
title: Weekend Unassigned Tickets (Apply)
category: triage
tags: [unassigned, weekend, monday, update]
use_when: After confirming the weekend review list — assign, transition, and reply
placeholders: []
mode: update
---

```text
/update-work-items
Assign all listed tickets to me, change status from "Waiting for Support" to "In Progress", and add "Ticket under review. We'll update you shortly." as a customer reply.
```
