# Special Prompts

Lean multi-line prompts that combine multiple Rovo actions efficiently.

**Use when:** You need to perform several actions on a ticket at once.

---
id: utilities-assign-comment
title: Assign + Comment
category: utilities
tags: [assign, comment, update]
use_when: Assign a ticket to yourself and add a customer reply
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
  - name: YOUR-USER
    required: true
    description: Jira username
mode: update
---

```text
/update-work-items
Assign <TICKET-KEY> to me (<YOUR-USER>).
Add a customer-visible comment: "Ticket under review. We'll update you shortly."
```

---
id: utilities-status-comment
title: Status Change + Comment
category: utilities
tags: [status, comment, update]
use_when: Move a ticket to In Progress and update the customer
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
mode: update
---

```text
/update-work-items
Transition <TICKET-KEY> to "In Progress".
Add a customer-visible comment: "We're looking into this now."
```

---
id: utilities-search-assign-comment
title: Search + Assign + Comment
category: utilities
tags: [unassigned, assign, comment, update]
use_when: Find recent unassigned tickets, then assign and reply to all
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: YOUR-USER
    required: true
    description: Jira username
mode: update
---

```text
/update-work-items
Find all tickets in <PROJECT> where assignee is EMPTY and created >= -24h.
Assign each to me (<YOUR-USER>).
Add a customer-visible comment: "Ticket under review. We'll update you shortly."
If more than 20 tickets match, stop and ask me to narrow the scope.
```

---
id: utilities-status-resolution-close
title: Status + Resolution + Close
category: utilities
tags: [close, resolution, update]
use_when: Move a ticket to Done with resolution and closure message
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
mode: update
---

```text
/update-work-items
Transition <TICKET-KEY> to "Done".
Set resolution to "Resolved".
Add a customer-visible comment: "This issue has been resolved. Closing ticket."
```

---
id: utilities-bulk-action
title: Bulk Action
category: utilities
tags: [bulk, assign, comment, update]
use_when: Apply the same assign + reply action to multiple tickets
placeholders:
  - name: TICKET-1
    required: true
    description: First ticket ID
  - name: TICKET-2
    required: true
    description: Second ticket ID
  - name: TICKET-3
    required: true
    description: Third ticket ID
  - name: YOUR-USER
    required: true
    description: Jira username
mode: update
---

```text
/update-work-items
For tickets <TICKET-1>, <TICKET-2>, <TICKET-3>:
1) Assign each to me (<YOUR-USER>).
2) Add a customer-visible comment: "Ticket under review. We'll update you shortly."
Show confirmation list before applying changes.
```

---
id: utilities-jql-update
title: JQL + Update
category: utilities
tags: [jql, prioritize, update]
use_when: Find your recently updated open tickets, prioritize, then update after confirm
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: update
---

```text
/update-work-items
Use JQL to find tickets in <PROJECT> with:
- assignee = currentUser()
- statusCategory != Done
- updated >= -7d

For each ticket:
1) Show a table: Key, Summary, Status, Time to resolution.
2) Suggest which tickets to prioritize (top 5).
3) After I confirm, update the status to "In Progress" and add a customer comment.
```

## Reference

**Available Rovo commands:**
- `/update-work-items` - update fields, assign, comment, transition
- `/create-work-items` - create new tickets

**Skills used:**
- Jira JQL
- Assign work item
- Comment on work item
- Transition work item

**Documentation:**

See [Rovo Resources](../../docs/rovo-resources.md) for official Rovo documentation.
