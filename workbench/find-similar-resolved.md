# Find Similar Resolved Tickets

> **Deprecated — pointer only.** Do not use this workbench note as the source of truth.
> The stable catalog hub is **Find Similar Resolved Tickets** (`tickets-find-similar-resolved`).

**Promoted:** this experimental finder now lives in the catalog as a Review → Draft hub.

Use the catalog hub instead:

- Source: [`prompts/tickets/find-similar-resolved.md`](../prompts/tickets/find-similar-resolved.md) (`tickets-find-similar-resolved`)
- Built page (after `npm run build`): `site/dist/prompts/tickets-find-similar-resolved.html`
- Related JQL (Queries): `tickets-jql-my-resolved-90d`, `tickets-jql-resolved-by-keyword`, `tickets-jql-similar-closed`

**Workflow (unchanged intent):**

1. **Review** — find related tickets you resolved in the last 90 days
2. **Draft** — compare to the closest match and draft a resolution comment (confirm before posting)

This workbench file is kept as a pointer only so old links do not go dead. Do not edit prompts here — edit the stable hub.
