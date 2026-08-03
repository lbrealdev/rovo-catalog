# Ticket Analysis Prompts

Prompts for analyzing tickets and determining if action is required or if they can be closed as informational.

**Use when:** You need to quickly assess tickets and identify closure candidates.

**Role:** Stable catalog hub for informational AWS Health tickets (review → apply). The workbench note points here after promotion.

---
id: tickets-aws-health
title: AWS Health Notifications
category: tickets
tags: [aws, health, notification, close]
use_when: Find informational AWS Health tickets assigned to you, then resolve after confirm
placeholders: []
mode: read-only
hub_steps: [tickets-filter-informational-aws, tickets-close-aws-health]
---

```text
Use the steps below: review AWS Health notification tickets assigned to you, then resolve the informational ones after you confirm.
```

---
id: tickets-filter-informational-aws
title: Review AWS Health Notification Tickets
category: tickets
tags: [aws, notification, filter]
use_when: Find and classify AWS Health notification tickets assigned to you — drafts only
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
listed: false
---

```text
In <PROJECT>, find tickets that are assigned to me and open, contain "aws_health" in the description, and look like informational-only AWS notifications requiring no action.

Use JQL:
project = <PROJECT> AND assignee = currentUser() AND statusCategory != Done AND description ~ "aws_health" ORDER BY created DESC

Display results in a table with these columns:
Key | Summary | Status | Time to resolution | Created

For each ticket:
- Classify: Informational-only or Requires follow-up
- For informational tickets: draft a Reply to customer comment explaining why no action is required

Limit to 20 most recent. Do NOT update any tickets until I confirm.
```

---
id: tickets-close-aws-health
title: Close AWS Health Notification Tickets
category: tickets
tags: [aws, health, close, update]
use_when: After confirming the review list — resolve informational AWS Health tickets
placeholders:
  - name: TARGET-STATUS
    required: true
    type: select
    description: Status to transition informational tickets into
    options: ["Resolved", "Closed"]
mode: update
listed: false
---

```text
/update-work-items
For the informational-only tickets listed above that I confirmed:
- Add each ticket's drafted Reply to customer comment (or "AWS Health notification received. No action required. Closing." if no draft)
- Set resolution to "Resolved" (skip this if "<TARGET-STATUS>" already implies resolution in the project workflow)
- Transition each ticket to "<TARGET-STATUS>"
Skip every ticket classified as Requires follow-up. If more than 20 tickets were confirmed, stop and ask me to narrow the scope.
```

---
id: tickets-jql-aws-notification-filter
title: JQL — AWS Notification Filter
category: tickets
tags: [jql, aws, notification]
use_when: Reusable JQL for AWS notification-type tickets
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT> AND (summary ~ "AWS" OR description ~ "AWS") AND (summary ~ "notification" OR description ~ "notification" OR description ~ "AWS Health" OR description ~ "CloudWatch Alarm" OR description ~ "AWS Budgets") ORDER BY created DESC
```

---
id: tickets-jql-broader-no-action
title: JQL — Broader No-Action Search
category: tickets
tags: [jql, notification, no-action]
use_when: Broader JQL for notification / no-action style tickets
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: read-only
---

```jql
project = <PROJECT> AND (summary ~ "notification" OR description ~ "notification" OR description ~ "no action" OR cf[11662] ~ "no action") ORDER BY created DESC
```

---
id: tickets-list-issues-by-reporter
title: List Issues by Reporter
category: tickets
tags: [reporter, unassigned, table]
use_when: List open unassigned issues from a reporter since last Friday
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: REPORTER
    required: true
    description: Reporter username or account id
mode: read-only
---

```text
In the <PROJECT> project, list all issues created by reporter <REPORTER> between last Friday and today.
Treat "open" as status = "Waiting for support".
Show only the ones that are currently in "Waiting for support" and unassigned.
Return a table: Key, Summary, Status, Assignee, Reporter, Created.
```

---
id: tickets-evaluate-description
title: Evaluate Ticket Description
category: tickets
tags: [description, on-call, evaluate]
use_when: Grade and improve a ticket description for on-call clarity
placeholders:
  - name: TICKET-KEY
    required: true
    description: Ticket ID (e.g. SUP-123)
mode: read-only
---

```text
Take the description text from Jira issue <TICKET-KEY> and evaluate it.
Assume I have already checked the affected resource and confirmed there is no current impact.

Grade the description from 0-10 for clarity and completeness for an on-call engineer.
Briefly justify the grade (what is good / what is missing).
Suggest an improved version of the description I could paste back into the ticket.
```

## Tips

- Always review the suggested comment before posting - verify it matches your tone and the specific situation
- When unsure if a ticket is informational-only, default to requiring follow-up
- Use the AWS example as a template for other notification sources (monitoring tools, automated alerts, etc.)
