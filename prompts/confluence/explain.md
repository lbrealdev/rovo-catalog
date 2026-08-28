# Confluence Documentation Prompts

Daily Confluence explain / Q&A flows for Rovo — paste a page URL, get a clear read.

**Use when:** You have a Confluence page and need Rovo to explain, checklist, clarify, or compare docs.

---
id: confluence-explain-qa
title: Explain Document (Q&A)
category: confluence
tags: [confluence, explain, qa, documentation]
use_when: Turn a Confluence page into a short Q&A for quick understanding
placeholders:
  - name: CONFLUENCE-PAGE-URL
    required: true
    description: Full Confluence page URL
mode: read-only
---

```text
Context: <CONFLUENCE-PAGE-URL>

Read the following Confluence documentation and answer key questions about it:

Text Analysis:
1. What is this document about? (1-2 sentence summary)
2. What are the main concepts or steps covered?
3. Who is this intended for?
4. What should I know before proceeding?
5. What are the most important details to remember?

Visual Analysis (skip if the page has no useful visuals):
1. What diagrams, charts, or images are on this page?
2. What does each visual convey?
3. How do the visuals support the text?
```

---
id: confluence-procedure
title: Procedure Q&A
category: confluence
tags: [confluence, procedure, runbook, qa]
use_when: Explain a Confluence procedure, runbook, or step-by-step guide
placeholders:
  - name: CONFLUENCE-PAGE-URL
    required: true
    description: Full Confluence page URL
mode: read-only
---

```text
Context: <CONFLUENCE-PAGE-URL>

Read the following procedure from Confluence and answer:

Text Analysis:
1. What is the goal of this procedure?
2. What are the prerequisites or preconditions?
3. What are the main steps (condensed)?
4. What could go wrong or need attention?
5. How do I know if it worked?
6. When should I escalate or ask for help?

Visual Analysis (skip if the page has no useful visuals):
1. What diagrams, flowcharts, or screenshots are included?
2. What does each visual show (e.g., workflow, architecture, warning)?
3. How do the visuals help understand the procedure?
```

---
id: confluence-checklist
title: Action Checklist
category: confluence
tags: [confluence, checklist, actions]
use_when: Extract actionable steps, checks, and warnings from a Confluence page
placeholders:
  - name: CONFLUENCE-PAGE-URL
    required: true
    description: Full Confluence page URL
mode: read-only
---

```text
Context: <CONFLUENCE-PAGE-URL>

Read the following Confluence documentation and extract:

Text Analysis:
1. A checklist of actions I need to take
2. Any decisions or choices I need to make
3. Things to verify or check
4. Warning signs to watch for
5. Who to contact if issues arise

Visual Analysis (skip if the page has no useful visuals):
1. Are there any warning icons or visual alerts shown?
2. What do status indicators or color codes mean?
3. Are there screenshots showing expected outcomes?
```

---
id: confluence-quick-clarify
title: Quick Clarification
category: confluence
tags: [confluence, clarify, section]
use_when: Get a plain-language explanation of one section on a Confluence page
placeholders:
  - name: CONFLUENCE-PAGE-URL
    required: true
    description: Full Confluence page URL
  - name: SECTION-QUOTE
    required: true
    description: Paste the section title or quote to clarify
mode: read-only
---

```text
Context: <CONFLUENCE-PAGE-URL>

In the following Confluence documentation, explain this section in plain language:
"<SECTION-QUOTE>"

Tell me what this means and why it matters.
If there are diagrams, screenshots, or images near this section, say how they add context.
```

---
id: confluence-compare-pages
title: Multi-Page Comparison
category: confluence
tags: [confluence, compare, documentation]
use_when: Compare or connect information across two Confluence pages
placeholders:
  - name: CONFLUENCE-PAGE-URL
    required: true
    description: First Confluence page URL
  - name: CONFLUENCE-PAGE-URL-2
    required: true
    description: Second Confluence page URL
mode: read-only
---

```text
Context: <CONFLUENCE-PAGE-URL>

Context: <CONFLUENCE-PAGE-URL-2>

I have multiple Confluence pages. Please read each one and:

Text Analysis:
1. Summarize what each page covers
2. Identify how they relate to each other
3. Note any conflicting information
4. Highlight any gaps or missing context

Visual Analysis (skip if neither page has useful visuals):
1. What diagrams or visuals are on each page?
2. Are there inconsistencies in how information is visually represented?
3. How do the visuals complement or contradict each other?
```
