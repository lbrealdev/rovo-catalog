# Special Prompts

Multi-step hubs (review → confirm → update) plus one-shot `/update-work-items` recipes.

**Use when:** You need to perform several actions on tickets efficiently.

One-shot recipes (`Assign + Comment`, `Status Change + Comment`, `Status + Resolution + Close`) use `listed: false` so they appear on **Commands**, not the Prompts catalog.

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
listed: false
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
listed: false
---

```text
/update-work-items
Transition <TICKET-KEY> to "In Progress".
Add a customer-visible comment: "We're looking into this now."
```

---
id: utilities-search-assign
title: Search + Assign + Comment
category: utilities
tags: [unassigned, assign, comment, update]
use_when: Find recent unassigned tickets, then assign and reply after confirm
placeholders: []
mode: read-only
hub_steps: [utilities-search-assign-review, utilities-search-assign-comment]
---

```text
Use the steps below: review recent unassigned tickets by lookback, then assign and reply after you confirm.
```

---
id: utilities-search-assign-review
title: Review Recent Unassigned Tickets
category: utilities
tags: [unassigned, assign, comment]
use_when: List recent unassigned tickets before assigning
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: LOOKBACK
    required: true
    type: select
    description: Created-within window for the search
    options: ["-24h", "-48h", "-72h", "-7d"]
mode: read-only
listed: false
---

```text
Find all tickets in <PROJECT> where assignee is EMPTY and created >= <LOOKBACK>.
Show a table: Key, Summary, Status, Reporter, Created, Time to resolution.
If more than 20 tickets match, stop and ask me to narrow the scope.
Do NOT assign or comment yet.
```

---
id: utilities-search-assign-comment
title: Assign and Comment on Listed Tickets
category: utilities
tags: [unassigned, assign, comment, update]
use_when: After confirming the review list — assign and reply to all
placeholders:
  - name: YOUR-USER
    required: true
    description: Jira username
mode: update
listed: false
---

```text
/update-work-items
For the unassigned tickets listed above that I confirmed:
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
listed: false
---

```text
/update-work-items
Transition <TICKET-KEY> to "Done".
Set resolution to "Resolved".
Add a customer-visible comment: "This issue has been resolved. Closing ticket."
```

---
id: utilities-bulk-assign
title: Bulk Action
category: utilities
tags: [bulk, assign, comment, update]
use_when: Confirm a ticket list, then apply the same assign + reply action
placeholders: []
mode: read-only
hub_steps: [utilities-bulk-action-review, utilities-bulk-action]
---

```text
Use the steps below: confirm the ticket list, then apply assign + reply after you confirm.
```

---
id: utilities-bulk-action-review
title: Confirm Bulk Ticket List
category: utilities
tags: [bulk, assign, comment]
use_when: Show the tickets that will receive the bulk assign + reply
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
mode: read-only
listed: false
---

```text
Show confirmation details for tickets <TICKET-1>, <TICKET-2>, <TICKET-3>:
Key, Summary, Status, Assignee, Time to resolution.
Do NOT assign or comment yet — wait for my confirmation.
```

---
id: utilities-bulk-action
title: Apply Bulk Assign + Comment
category: utilities
tags: [bulk, assign, comment, update]
use_when: After confirming the list — assign and reply to each ticket
placeholders:
  - name: YOUR-USER
    required: true
    description: Jira username
mode: update
listed: false
---

```text
/update-work-items
For tickets <TICKET-1>, <TICKET-2>, <TICKET-3>:
1) Assign each to me (<YOUR-USER>).
2) Add a customer-visible comment: "Ticket under review. We'll update you shortly."
Only apply to tickets I confirmed from the previous step.
```

---
id: utilities-jql-prioritize
title: JQL + Update
category: utilities
tags: [jql, prioritize, update]
use_when: Find your recently updated open tickets, prioritize, then update after confirm
placeholders: []
mode: read-only
hub_steps: [utilities-jql-update-review, utilities-jql-update]
---

```text
Use the steps below: review and prioritize your open tickets, then update status after you confirm.
```

---
id: utilities-jql-update-review
title: Review and Prioritize Open Tickets
category: utilities
tags: [jql, prioritize]
use_when: Find your recently updated open tickets and suggest top priorities
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: LOOKBACK
    required: true
    type: select
    description: Updated-within window
    options: ["-24h", "-48h", "-7d", "-14d"]
mode: read-only
listed: false
---

```text
Use JQL to find tickets in <PROJECT> with:
- assignee = currentUser()
- statusCategory != Done
- updated >= <LOOKBACK>

For each ticket:
1) Show a table: Key, Summary, Status, Time to resolution.
2) Suggest which tickets to prioritize (top 5).
Do NOT update status or comment yet.
```

---
id: utilities-jql-update
title: Update Prioritized Tickets
category: utilities
tags: [jql, prioritize, update]
use_when: After confirming priorities — move selected tickets to the target status
placeholders:
  - name: TARGET-STATUS
    required: true
    type: select
    description: Status to transition confirmed tickets into
    options: ["In Progress", "Waiting for customer"]
mode: update
listed: false
---

```text
/update-work-items
For the prioritized tickets I confirmed from the previous step:
Update the status to "<TARGET-STATUS>" and add a customer comment: "We're looking into this now."
If more than 20 tickets were confirmed, stop and ask me to narrow the scope.
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
