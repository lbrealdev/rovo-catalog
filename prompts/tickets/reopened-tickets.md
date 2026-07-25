# Reopened Tickets Guide

Quick reference for comparing reopened tickets against their previous closure and similar resolved tickets.

**Use when:** A ticket was closed but reopened by the customer or team.

## TL;DR

1. Ask Rovo: *"What changed since closure?"* (compare same ticket)
2. Ask Rovo: *"Detect pattern and auto-close"* (pattern matching)
3. Review draft response before applying any changes

---
id: tickets-reopened-compare-closure
title: Compare to Previous Closure
category: tickets
tags: [reopened, compare, closure]
use_when: A colleague closed it and it popped back open — compare closed vs now
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
mode: read-only
---

```text
I'm working a <PROJECT> ticket that was reopened: <TICKET-KEY>.

1) Summarize the last closure attempt:
   - who transitioned it to a closed/resolved state
   - what status/resolution it was set to
   - the last customer-visible comment used to close it
   - any internal notes around that time (if present)
   - timestamps (close + reopen)

2) Summarize why it was reopened:
   - the comment/request that triggered the reopen (customer-visible)
   - what changed in the ticket fields (status, resolution, assignee)

3) Give me a side-by-side comparison:
   "When it was closed" vs "Now"
   including: Status, Resolution, Latest customer message, Next action.
```

---
id: tickets-reopened-detect-pattern
title: Detect Recurring Pattern and Draft Close
category: tickets
tags: [reopened, pattern, duplicate]
use_when: Check if a reopened ticket matches a recurring duplicate pattern teammates already resolved
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
mode: read-only
---

```text
Analyze <TICKET-KEY> and determine if it matches a recurring duplicate pattern.

Steps:
1) Look at ALL tickets assigned to me (currentUser()) created in the last 24 hours.
2) Identify tickets with the same or similar summary/keywords that appear more than once.
3) For tickets flagged as "recurring duplicates":
   - Find up to 3 similar tickets that were recently closed by teammates
   - Extract: resolution, internal note used, customer-visible reply
4) If a pattern is confirmed:
   - Draft a closure reply consistent with teammate responses
   - Provide a 3-item checklist before closing
5) If no clear pattern: return "No recurring pattern detected"

Output format:
- Pattern match: (yes/no/unclear)
- Similar tickets table: Key | Summary | Resolution | Teammate Reply
- Draft closure reply (ready to paste)
- Quick checklist
```

---
id: tickets-reopened-batch
title: Batch Mode (Multiple Reopened Tickets)
category: tickets
tags: [reopened, batch, pattern]
use_when: Classify several reopened tickets — pattern match vs manual review (read-only)
placeholders:
  - name: N
    required: true
    description: Number of tickets in the batch
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
---

```text
I have <N> reopened tickets: <TICKET-1>, <TICKET-2>, <TICKET-3>.

For each ticket:
1) Detect if it matches a recurring duplicate pattern (same as Step 2 logic).
2) Summarize the last closure attempt (who/when/status/resolution/last public reply).
3) Summarize the reopen trigger (what the customer said / what changed).
4) Classify as:
   - Pattern match: use teammate closure pattern
   - No pattern: summarize for manual review

Return:
- Pattern matches table: Key | Summary | Teammate Reply | Draft Closure
- No pattern table: Key | Summary | Closure Summary | Next Action
- Do not transition or comment yet.
```

---
id: tickets-jql-similar-closed
title: JQL — Find Similar Closed Tickets
category: tickets
tags: [jql, similar, closed]
use_when: Find recently resolved tickets matching keywords
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT>
AND statusCategory = Done
AND resolved >= -30d
AND text ~ "\"<keyword1>\"" AND text ~ "\"<keyword2>\""
ORDER BY resolved DESC
```

---
id: tickets-jql-closed-then-reopened
title: JQL — Tickets Closed Then Reopened
category: tickets
tags: [jql, reopened, resolution]
use_when: Find tickets whose resolution changed recently after being done
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT>
AND statusCategory = Done
AND updated >= -7d
AND resolution CHANGED
```

## Taking Action

Once you've reviewed the comparison and drafts, use `/update-work-items` workflow to comment/transition/resolve—but **keep this as a second step** to avoid applying the wrong closure pattern.

## Tips

**Use Rovo "search/fetch" style questions** when you don't know the right JQL. Ask Rovo to search first, then refine to JQL.

**Resources:**

For official Rovo documentation and resources, see [Rovo Resources](../../docs/rovo-resources.md).
