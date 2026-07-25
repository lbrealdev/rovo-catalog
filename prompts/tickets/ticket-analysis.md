# Ticket Analysis Prompts

Prompts for analyzing tickets and determining if action is required or if they can be closed as informational.

**Use when:** You need to quickly assess tickets and identify closure candidates.

**Role:** Stable catalog close-out for informational AWS Health tickets. For the experimental two-step finder (review table first, then resolve), see [AWS Health Notification Ticket Finder](../../workbench/aws-health-notifications.md).

---
id: tickets-close-aws-health
title: Close AWS Health Notification Tickets
category: tickets
tags: [aws, health, close, update]
use_when: Close informational AWS Health tickets assigned to you
placeholders: []
mode: update
---

```text
/update-work-items
For tickets assigned to me with "aws_health" in the description:
- If informational-only (AWS notification requiring no action):
  - Resolve with status "Resolved"
  - Add comment: "AWS Health notification received. No action required. Closing."
```

---
id: tickets-filter-informational-aws
title: Filter Informational Tickets (AWS Example)
category: tickets
tags: [aws, notification, filter]
use_when: Find and classify AWS notification-style tickets; draft closes, confirm before changes
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
mode: update
---

```text
/update-work-items
In <PROJECT>, find AWS notification-type tickets (Health, Budgets, CloudWatch alarms):

Use JQL:
project = <PROJECT> AND (summary ~ "AWS" OR description ~ "AWS") AND (summary ~ "notification" OR description ~ "notification" OR description ~ "AWS Health" OR description ~ "CloudWatch Alarm" OR description ~ "AWS Budgets") ORDER BY created DESC

For each ticket:
- Show: Key, Summary, Status, Assignee, Created
- Classify: Informational-only or Requires follow-up
- For informational tickets: draft closing comment and suggest status/resolution

Limit to 20 most recent. Read-only unless I confirm changes.
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
