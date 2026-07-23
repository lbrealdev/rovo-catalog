# Ticket Analysis Prompts

Prompts for analyzing tickets and determining if action is required or if they can be closed as informational.

**Use when:** You need to quickly assess tickets and identify closure candidates.

---

## 1) Close AWS Health Notification Tickets

Close informational AWS Health tickets assigned to me.

**Role:** Stable catalog close-out for informational AWS Health tickets. For the experimental two-step finder (review table first, then resolve), see [AWS Health Notification Ticket Finder](../../workbench/aws-health-notifications.md).

```text
/update-work-items
For tickets assigned to me with "aws_health" in the description:
- If informational-only (AWS notification requiring no action):
  - Resolve with status "Resolved"
  - Add comment: "AWS Health notification received. No action required. Closing."
```

---

## 2) Filter Informational Tickets (AWS Example)

Find and process notification-style tickets that typically require no action.

**Use case:** AWS notifications (Health, Budgets, CloudWatch alarms) that are often informational-only.

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

## JQL Templates

### AWS Notification Filter

```jql
project = <PROJECT> AND (summary ~ "AWS" OR description ~ "AWS") AND (summary ~ "notification" OR description ~ "notification" OR description ~ "AWS Health" OR description ~ "CloudWatch Alarm" OR description ~ "AWS Budgets") ORDER BY created DESC
```

### Alternative: Broader No-Action Search

```jql
project = <PROJECT> AND (summary ~ "notification" OR description ~ "notification" OR description ~ "no action" OR cf[11662] ~ "no action") ORDER BY created DESC
```

---

## Tips

- Always review the suggested comment before posting - verify it matches your tone and the specific situation
- When unsure if a ticket is informational-only, default to requiring follow-up
- Use the AWS example as a template for other notification sources (monitoring tools, automated alerts, etc.)

---

## Summary Templates

Template prompts for reporting and evaluation.

### List Issues by Reporter

```text
In the <PROJECT> project, list all issues created by reporter <REPORTER> between last Friday and today.
Treat "open" as status = "Waiting for support".
Show only the ones that are currently in "Waiting for support" and unassigned.
Return a table: Key, Summary, Status, Assignee, Reporter, Created.
```

### Evaluate Ticket Description

Evaluate and improve a ticket description for on-call engineers.

```text
Take the description text from Jira issue <TICKET-KEY> and evaluate it.
Assume I have already checked the affected resource and confirmed there is no current impact.

Grade the description from 0-10 for clarity and completeness for an on-call engineer.
Briefly justify the grade (what is good / what is missing).
Suggest an improved version of the description I could paste back into the ticket.
```
