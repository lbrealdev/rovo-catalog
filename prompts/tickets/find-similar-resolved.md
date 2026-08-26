# Find Similar Resolved Tickets

Use when you have a ticket In Progress and want past resolutions that match by content.

**Workflow:** Find similar resolved tickets, then optionally draft a resolution from the closest match.

---
id: tickets-find-similar-resolved
title: Find Similar Resolved Tickets
category: tickets
tags: [similar, resolved, pattern, compare]
use_when: Find past resolutions related to a ticket in progress, then draft from patterns
placeholders: []
mode: read-only
hub_steps: [tickets-find-similar-resolved-review, tickets-find-similar-resolved-draft]
---

```text
Use the steps below: find related tickets you already resolved, then draft a resolution for the current ticket after you review the matches.
```

---
id: tickets-find-similar-resolved-review
title: Review Similar Resolved Tickets
category: tickets
tags: [similar, resolved, search]
use_when: Search your recently resolved tickets for content similar to the current one
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID currently in progress (e.g. SUP-123)
mode: read-only
listed: false
---

```text
I'm working on ticket <TICKET-KEY> (currently In Progress).

Please search for tickets I previously resolved (within last 90 days) that are related to this one.

Use the summary and description of <TICKET-KEY> to find matches based on content similarity.

For each related resolved ticket found:
- Show: Key, Summary, Status, Resolution
- Show: My final comment/resolution note
- Explain: Why it's related (matching keywords/concepts)

Limit to 10 most relevant matches. Do NOT update any tickets.
```

---
id: tickets-find-similar-resolved-draft
title: Draft Resolution From Patterns
category: tickets
tags: [similar, resolved, draft]
use_when: After reviewing matches — compare and draft a resolution comment
placeholders: []
mode: read-only
listed: false
---

```text
Using the similar resolved tickets from the previous step for <TICKET-KEY>:
- Compare <TICKET-KEY> with the most similar resolved ticket side-by-side
- Identify patterns/lessons from the resolved ticket that apply
- Draft a resolution comment for <TICKET-KEY> based on those patterns

Do NOT post the comment until I confirm.
```

---
id: tickets-jql-my-resolved-90d
title: JQL — My Resolved Tickets (90 Days)
category: tickets
tags: [jql, resolved, my-tickets]
use_when: List tickets you resolved in the last 90 days
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT>
AND assignee = currentUser()
AND statusCategory = Done
AND resolved >= -90d
ORDER BY resolved DESC
```

---
id: tickets-jql-resolved-by-keyword
title: JQL — Resolved Tickets by Keyword
category: tickets
tags: [jql, resolved, keyword, similar]
use_when: Manual keyword search over your recently resolved tickets
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: KEYWORD
    required: true
    description: Search keyword for summary or description
mode: read-only
---

```jql
project = <PROJECT>
AND assignee = currentUser()
AND statusCategory = Done
AND (summary ~ "<KEYWORD>" OR description ~ "<KEYWORD>")
AND resolved >= -90d
ORDER BY resolved DESC
```
