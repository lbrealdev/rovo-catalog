# AWS Health Notification Ticket Finder

> **Deprecated — pointer only.** Do not use this workbench note as the source of truth.
> The stable catalog hub is **AWS Health Notifications** (`tickets-aws-health`).

**Promoted:** this experimental two-step finder now lives in the catalog.

Use the catalog hub instead:

- Source: [`prompts/tickets/ticket-analysis.md`](../prompts/tickets/ticket-analysis.md) (`tickets-aws-health`)
- Built page (after `npm run build`): `site/dist/prompts/tickets-aws-health.html`

**Workflow (unchanged intent):**

1. **Review** — find open tickets assigned to you with `aws_health` in the description; classify informational vs follow-up; draft replies
2. **Apply** — after confirmation, post Reply to customer, set resolution, and transition to Resolved/Closed

This workbench file is kept as a pointer only so old links do not go dead. Do not edit prompts here — edit the stable hub.
