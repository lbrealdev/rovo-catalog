# SLA Workflow Prompts

Prompts for SLA-aware ticket workflows in Jira Service Management.

**Use when:** Handling SLA expirations by cloning/continuing work in a new ticket.

---
id: sla-clone-continuation
title: SLA Clone Continuation
category: sla
tags: [clone, create, sla, continuation]
use_when: SLA at risk — clone the ticket, resolve the original, continue work on the clone
placeholders: []
mode: read-only
hub_steps: [sla-clone-ticket, sla-update-original-after-clone, sla-move-clone-in-progress]
---

```text
Use the steps below: clone the at-risk ticket, update the original, then move the clone to the target status.
```

---
id: sla-clone-ticket
title: Clone Ticket (Same Project)
category: sla
tags: [clone, create, sla]
use_when: SLA at risk — clone the ticket to continue work in the same project
placeholders:
  - name: TICKET-KEY
    required: true
    description: Original ticket ID (e.g. SUP-123)
mode: update
listed: false
---

```text
/create-work-items
- Clone <TICKET-KEY> to the same project
- Assign to me
- Preserve the existing description and append "Cloned from: [original ticket URL]" to it
```

---
id: sla-update-original-after-clone
title: Update Original Ticket After Clone
category: sla
tags: [clone, resolve, update]
use_when: After cloning — point original ticket to the new clone and resolve it
placeholders: []
mode: update
listed: false
---

```text
/update-work-items
- Add a comment to the original ticket with: "Work continues in [new ticket]" — USE Jira wiki-style link: [link text|https://url]
- Resolve the original ticket
```

---
id: sla-move-clone-in-progress
title: Move Cloned Ticket Forward
category: sla
tags: [clone, in-progress, update]
use_when: After cloning — customer reply on the new ticket and move to the target status
placeholders:
  - name: TARGET-STATUS
    required: true
    type: select
    description: Status to transition the clone into
    options: ["In Progress", "Waiting for customer"]
mode: update
listed: false
---

```text
/update-work-items
Add "Continuation of the work that was being done [original ticket]" as a "Reply to customer" comment — USE Jira wiki-style link: [link text|https://url] — and move ticket from "Waiting for Support" to "<TARGET-STATUS>"
```
