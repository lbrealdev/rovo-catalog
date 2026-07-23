# Daily Triage Prompts

Reusable prompts for daily Jira Service Management triage operations.

**Use when:** Starting your shift, reviewing your queue, or triaging noisy alerts.

---

## 1) List Today's Unassigned Tickets

Use this when you start your shift and want to see what is new and unassigned.

```text
List today's new unassigned <PROJECT> tickets in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

---

## 2) Assign to Me + Add Initial Customer Reply

Run this after you have seen the list and are ready to act on tickets.

**Step 1 (Read-only):**
```text
Show me all unassigned <PROJECT> tickets from the last 24 hours in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

**Step 2 (After confirmation):**
```text
/update-work-items
Assign all listed tickets to me, change status from "Waiting for Support" to "In Progress", and add "Ticket under review. We'll update you shortly." as a customer reply.
```

---

## 3) Weekend Unassigned Tickets

Use this on Monday morning to catch tickets from the weekend (Friday afternoon through Monday).

**Step 1 (Read-only):**
```text
Show me all unassigned <PROJECT> tickets from Friday 18:00 until now in a table (Key, Summary, Status, Reporter, Created, Time to resolution).
```

**Step 2 (After confirmation):**
```text
/update-work-items
Assign all listed tickets to me, change status from "Waiting for Support" to "In Progress", and add "Ticket under review. We'll update you shortly." as a customer reply.
```


