# Recently Updated Tickets

Find open tickets assigned to you that have been updated by clients or teammates.

**Use when:** You want to keep an eye on your assigned tickets where someone (client or teammate) recently added a comment or changed the status.

**Workflow:** Read-only review of tickets and their recent updates.

---

## Main Prompt

```
Show all my open <PROJECT> tickets in a table (Key, Summary, Status, Time to resolution, Updated).

Then identify tickets where someone (client or teammate) recently added a comment or changed the status (in the last few hours).
For each updated ticket:
- Show what happened (comment added / status changed)
- Brief description of the update
```

---

## JQL Template

```jql
project = <PROJECT> AND assignee = currentUser() AND statusCategory != Done AND updated >= -8h ORDER BY updated DESC
```

---

## Tips

- Adjust the time window by changing `-8h` to `-4h` (4 hours), `-12h` (12 hours), or `-1d` (1 day)
- If you want to focus only on tickets with new comments (not status changes), add `AND commentUpdated >= -8h` to the JQL
- Rovo will review each ticket's recent activity log to determine what was updated and by whom
