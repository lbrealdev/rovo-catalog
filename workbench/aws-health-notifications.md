# AWS Health Notification Ticket Finder

Find AWS Health notification tickets assigned to me that require no action.

**Role:** Experimental two-step finder (find → confirm → resolve). For the stable catalog close-out, use [Close AWS Health Notification Tickets](../prompts/tickets/ticket-analysis.md#1-close-aws-health-notification-tickets).

**Use when:** Identifying informational AWS notifications that can be quickly resolved.

**Workflow:** Two-step process - first review tickets (read-only), then apply changes after confirmation.

---

## Step 1: Find Tickets (Read-only)

```
In <PROJECT>, find tickets that are assigned to me and open, contain "aws_health" in the description, and are informational-only AWS notifications requiring no action.

Use JQL:
project = <PROJECT> AND assignee = currentUser() AND status != "Resolved" AND description ~ "aws_health" ORDER BY created DESC

Display results in a table with these columns:
| Key | Summary | Status | Time to resolution | Created |
```

---

## Step 2: Apply Changes (After Confirmation)

```
/update-work-items
For the tickets listed above:
- Review each AWS Health notification and add an appropriate **Reply to customer** comment explaining why no action is required (e.g., past incident, informational only, etc.)
- Change status to "Resolved" or "Closed"
```

---

## Workflow for AWS Health Notifications

1. **Step 1 (Read-only):** Find and review tickets containing aws_health
2. **Step 2 (After confirmation):** Add Reply to customer comment + resolve ticket

**When to use:**
- Ticket opened from AWS Health notification
- Assigned with initial note (first-response SLA)
- Review the AWS Health notification
- If past incident/notification only: apply Step 2

---

## JQL Template

```jql
project = <PROJECT> AND assignee = currentUser() AND status != "Resolved" AND description ~ "aws_health" ORDER BY created DESC
```
