# Daily Triage Prompts

Reusable prompts for daily Jira Service Management triage operations.

**Use when:** Starting your shift, reviewing your queue, or triaging noisy alerts.

---
id: triage-unassigned-tickets
title: Unassigned Tickets
category: triage
tags: [unassigned, assign, morning, weekend, monday, sla]
use_when: Review unassigned tickets by lookback, then assign and update
placeholders: []
mode: read-only
hub_steps: [triage-assign-unassigned-review, triage-assign-unassigned-apply]
---

```text
Use the steps below: review unassigned tickets by lookback window, then apply assignment updates.
```

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
  - name: LOOKBACK
    required: true
    type: select
    description: Time window for the review
    options: ["today", "the last 24 hours", "the last 48 hours", "the last 72 hours", "Friday 18:00 until now"]
mode: read-only
listed: false
---

```text
Show me all unassigned <PROJECT> tickets from <LOOKBACK> in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

---
id: triage-assign-unassigned-apply
title: Assign Unassigned Tickets
category: triage
tags: [unassigned, assign, update]
use_when: After confirming the review list — assign, transition, and reply
placeholders:
  - name: TARGET-STATUS
    required: true
    type: select
    description: Status to transition tickets into
    options: ["In Progress", "Waiting for customer"]
mode: update
listed: false
---

```text
/update-work-items
Assign all listed tickets to me, change status from "Waiting for Support" to "<TARGET-STATUS>", and add "Ticket under review. We'll update you shortly." as a customer reply.
```
