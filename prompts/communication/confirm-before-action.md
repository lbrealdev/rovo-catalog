# Confirmation Before Action Responses

**Use when:** You need to show the customer what was done and get their approval before proceeding.

---
id: communication-confirm-before-action
title: Confirm Before Action (Template)
category: communication
tags: [confirm, reply, approval]
use_when: Draft a customer reply that shows work done and asks for confirmation before proceeding
placeholders:
  - name: RECIPIENT
    required: true
    description: Name or "the reporter"
  - name: TONE
    required: true
    description: e.g. professional but friendly
  - name: WHAT-WAS-DONE
    required: true
    description: Specific description of completed work
  - name: ATTACHMENT/DETAILS
    required: true
    description: PR link, config, or other details to review
mode: read-only
---

```text
Reply to <RECIPIENT>, <TONE>. I completed <WHAT-WAS-DONE>.
Please review <ATTACHMENT/DETAILS> and confirm if this matches your requirements
before we proceed.
```

## Draft response shape

> Hi <NAME>,
>
> I've completed <WHAT-WAS-DONE>.
>
> <DETAILS-OR-ATTACHMENT>
>
> Please review and let me know if this aligns with what you had in mind. Happy to adjust if needed.
>
> Kind regards,
> <YOUR-NAME>

## Examples

Examples below illustrate the template. They are not separate catalog entries.

### Example 1: PR / Code Change

**Prompt to Rovo:**
```
Reply to Elon, professional but friendly. I created the PR with the requested changes
for the IAM policy update. Please review the code and confirm if this matches your
requirements before we proceed.

PR: <PR-URL>
```

**Draft response:**
> Hi Elon,
>
> I've created the PR with the requested changes for the IAM policy update.
>
> PR: <PR-URL>
>
> Please review the code and let me know if this aligns with what you had in mind. Happy to adjust if needed.
>
> Kind regards,
> <YOUR-NAME>

### Example 2: Configuration Change

**Prompt to Rovo:**
```
Reply to the reporter, professional. I updated the security group rules for <RESOURCE>
with the following configuration. Please confirm if this matches your requirements
before we apply it.

Config:
<CONFIG-DETAILS>
```

### Example 3: Documentation Update

**Prompt to Rovo:**
```
Reply to Sarah, professional but friendly. I've updated the runbook for <PROCESS>
based on your feedback. Please review the changes and confirm if this is the approach
you'd like us to follow going forward.

Changes:
<DIFF-SUMMARY>
```

### Example 4: AWS Resource Modification

**Prompt to Rovo:**
```
Reply to the reporter, professional. I've modified the S3 bucket policy for
<BUCKET-NAME> to restrict access as requested. Please review the policy below
and confirm if this is the configuration you want before I apply it.

Policy:
<POLICY-JSON>
```

### Example 5: Discovered Prerequisite (Proactive)

**Use when:** You reviewed the ticket with a teammate and identified a prerequisite — you're already working on it.

**Prompt to Rovo:**
```
Reply to the reporter, professional. I reviewed the ticket and consulted with <TEAMMATE>.
We need to configure <PREREQUISITE> before proceeding with <TASK>.
I'm starting this configuration now and will update you once ready.
```

### Example 6: Discovered Prerequisite (Investigating)

**Use when:** You reviewed the ticket with a teammate and discovered complexity — still assessing the solution.

**Prompt to Rovo:**
```
Reply to the reporter, professional. I reviewed the ticket with <TEAMMATE> about <TOPIC>.
We're investigating the configuration needed before proceeding.
I'll update you once we have a clear path forward.
```

## Rovo Tips for This Template

| Element | Tip |
|---------|-----|
| **Recipient** | Name or "the reporter" |
| **Tone** | Specify "professional but friendly" or "formal" |
| **What was done** | Be specific: not just "updated" but "updated the IAM policy to grant read-only access to S3 bucket xyz" |
| **Details** | Include PR links, code blocks, config snippets, or screenshots |
| **Confirmation request** | Always ask explicitly: "please confirm", "let me know if this works" |
| **Next step** | Imply what happens after approval |

## When to Use Internal Note Instead

Add an **internal note** alongside the customer reply when:

- The code/config contains sensitive details the customer doesn't need to see
- You want to track technical reasoning for the team
- There's follow-up work another agent should know about

**Example internal note:**
> Internal: Created PR #1234 based on user's request. Waiting for approval before merging. Will monitor for merge conflicts.
