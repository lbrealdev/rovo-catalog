# My Tickets JQL Queries

Reusable JQL for finding your open tickets. Shown on the **Queries** page after build.

---
id: queries-my-open-tickets
title: JQL — My Open Tickets
category: utilities
tags: [jql, my-tickets, open]
use_when: Open tickets where you are assignee or reporter
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT>
AND statusCategory != Done
AND (assignee = currentUser() OR reporter = currentUser())
ORDER BY priority DESC, updated DESC
```

---
id: queries-my-open-assignee
title: JQL — My Open Tickets (Assignee Only)
category: utilities
tags: [jql, my-tickets, assignee]
use_when: Open tickets assigned to you only
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT>
AND assignee = currentUser()
AND statusCategory != Done
ORDER BY updated DESC
```

---
id: queries-my-tickets-by-sla
title: JQL — My Tickets by SLA
category: utilities
tags: [jql, my-tickets, sla]
use_when: Your open tickets ordered by Time to resolution
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT>
AND assignee = currentUser()
AND statusCategory != Done
ORDER BY "Time to resolution" ASC, priority DESC
```
