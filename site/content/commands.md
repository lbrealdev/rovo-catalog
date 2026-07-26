# Rovo slash commands

Use these commands in Rovo when you want the agent to **change** Jira work items. Prefer a read-only review prompt first, then run an update recipe after you confirm.

## `/update-work-items`

Updates existing issues: assign, comment, transition status, set resolution, and similar field changes.

**Use when:** you already know which tickets to change (or the previous step listed them).

**Caution:** this can modify many tickets. If a recipe might match more than ~20 issues, narrow the scope first.

## `/create-work-items`

Creates new issues (including clones) in a project.

**Use when:** continuing work in a new ticket (for example SLA continuation / clone workflows).

## Recipes below

Each recipe is a ready-to-copy prompt that starts with a slash command. Open one, fill placeholders from your Profile, copy, and paste into Rovo.
