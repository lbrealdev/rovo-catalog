# Rovo slash commands

Use these commands in Rovo when you want the agent to **change** Jira work items. Prefer a read-only Prompts hub step first (list / draft / confirm), then paste an update or create command after you approve the plan.

Official background: [Chat Actions](https://support.atlassian.com/rovo/docs/chat-actions/) and [What are Skills?](https://support.atlassian.com/rovo/docs/what-are-skills/).

## `/update-work-items`

Updates **existing** issues. Typical actions in this toolkit:

- Assign or reassign
- Add a customer-visible reply or informational comment
- Transition status (for example Waiting for support → In Progress)
- Set resolution when closing

**Use when:** you already know which tickets to change — either you typed the keys, or a previous read-only step listed them and you confirmed.

**Do not use when:** you still need to discover or triage the queue. Run a Prompts hub review step first, then come back with `/update-work-items`.

**Caution:** this can modify many tickets. If a recipe might match more than ~20 issues, stop and narrow the scope before running the update.

## `/create-work-items`

Creates **new** issues in a project (including clones used for SLA continuation).

**Use when:** work must continue under a new key — for example cloning an at-risk ticket, preserving description, and linking back to the original (see the SLA Clone Continuation hub on Prompts).

**Do not use when:** you only need to comment, assign, or transition an existing ticket — use `/update-work-items` instead.

**Tip:** after create, follow with a confirmed `/update-work-items` step on the original and/or the new ticket (resolve original, move clone forward, post wiki-style links).

## Workflow reminder

1. **Review** — copy a read-only step from Prompts (hubs list tickets or draft comments).
2. **Confirm** — check the table or draft yourself.
3. **Change** — paste the hub’s update/create step, which starts with `/update-work-items` or `/create-work-items`.
