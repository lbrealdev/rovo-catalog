# AWS Health Notification Ticket Finder

**Promoted:** this experimental two-step finder is now the stable catalog hub **AWS Health Notifications**.

Use the catalog hub instead:

- Source: [`prompts/tickets/ticket-analysis.md`](../prompts/tickets/ticket-analysis.md) (`tickets-aws-health`)
- Built page (after `npm run build`): `site/dist/prompts/tickets-aws-health.html`

**Workflow (unchanged intent):**

1. **Review** — find open tickets assigned to you with `aws_health` in the description; classify informational vs follow-up; draft replies
2. **Apply** — after confirmation, post Reply to customer + transition to Resolved/Closed

This workbench file is kept as a pointer only so old links do not go dead. Do not edit prompts here — edit the stable hub.
