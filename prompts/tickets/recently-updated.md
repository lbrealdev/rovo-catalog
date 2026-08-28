# Recently Updated Tickets

Find open tickets assigned to you that clients or teammates recently touched.

**Use when:** You want a read-only sweep of your assigned queue for new comments or status changes.

---
id: tickets-recently-updated
title: Recently Updated Tickets
category: tickets
tags: [updated, comments, my-tickets, table]
use_when: Review your open tickets updated in a lookback window
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: LOOKBACK
    required: true
    type: select
    description: Updated-within window
    options: ["-4h", "-8h", "-12h", "-1d"]
mode: read-only
---

```text
Show all my open <PROJECT> tickets in a table (Key, Summary, Status, Time to resolution, Updated).

Then identify tickets where someone (client or teammate) recently added a comment or changed the status (updated within <LOOKBACK>).
For each updated ticket:
- Show what happened (comment added / status changed)
- Brief description of the update

Do NOT update any tickets.
```

---
id: tickets-jql-recently-updated
title: JQL — Recently Updated Open Tickets
category: tickets
tags: [jql, updated, my-tickets]
use_when: Open tickets assigned to you, ordered by recent updates
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: LOOKBACK
    required: true
    type: select
    description: Updated-within window
    options: ["-4h", "-8h", "-12h", "-1d"]
mode: read-only
---

```jql
project = <PROJECT> AND assignee = currentUser() AND statusCategory != Done AND updated >= <LOOKBACK> ORDER BY updated DESC
```
