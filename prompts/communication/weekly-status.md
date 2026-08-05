# Weekly Status (Client)

Prompts for preparing talking points for the recurring weekly status call with the client.

**Use when:** You need to summarize the period since the last weekly meeting — backlog, incoming tickets (including system-generated), and work in progress — into a short, valuable update for the client.

The weekly is short: cover only what happened and what is happening, and leave room for the client to share their own needs.

---
id: communication-weekly-status
title: Weekly Status (Client)
category: communication
tags: [weekly, client, summary, backlog, dashboard]
use_when: Prepare talking points for the recurring weekly call with the client
placeholders:
  - name: PROJECT
    required: true
    description: Jira project key (e.g. SUP)
  - name: LOOKBACK
    required: true
    type: select
    description: Period since the last weekly meeting
    options: ["the last 7 days", "the last 10 days", "the last 14 days"]
mode: read-only
---

```text
Prepare a short talking-points summary for my weekly status call with the client, for project <PROJECT>, covering the period <LOOKBACK>.

Include:
- Total tickets created in the period (including system-generated: automation, integration, or health-style tickets) and how many are being addressed
- Key items handled in the last few days — across dev, uat and prod, prioritizing anything in prod — in a compact table with columns: Key, Summary, Env (dev/uat/prod when known), Status
- Work currently in progress (same table shape when helpful)

Keep it concise and useful for a short meeting. If nothing relevant was found, say so explicitly — do not invent or stretch anything. Leave room at the end for the client to share their own needs and priorities.
```
