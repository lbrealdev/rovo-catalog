# Confluence Documentation Prompts

Prompts for summarizing and explaining Confluence documentation in context.

**Role:** Experimental Confluence explain/Q&A variants. For stable document summarization, see [Document Summaries](../guides/document-summaries.md).

**Use when:** You have a Confluence page URL and need Rovo to explain the documentation.

## Table of Contents

1. [Explain Document in Q&A](#1-explain-document-in-qa) - [A](#a-text-analysis) / [B](#b-with-visual-analysis)
2. [Procedure Q&A](#2-procedure-qa) - [A](#a-text-analysis) / [B](#b-with-visual-analysis)
3. [Technical Concept Explainer](#3-technical-concept-explainer) - [A](#a-text-analysis) / [B](#b-with-visual-analysis)
4. [Action Checklist](#4-action-checklist) - [A](#a-text-analysis) / [B](#b-with-visual-analysis)
5. [Multi-Page Comparison](#5-multi-page-comparison) - [A](#a-text-analysis) / [B](#b-with-visual-analysis)
6. [Quick Clarification](#6-quick-clarification) - [A](#a-text-analysis) / [B](#b-with-visual-context)

---

## 1) Explain Document in Q&A

Convert Confluence documentation into a Q&A format for quick understanding.

### A) Text Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following Confluence documentation and answer key questions about it:

Text Analysis:
1. What is this document about? (1-2 sentence summary)
2. What are the main concepts or steps covered?
3. Who is this intended for?
4. What should I know before proceeding?
5. What are the most important details to remember?
```

### B) With Visual Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following Confluence documentation and answer key questions about it:

Text Analysis:
1. What is this document about? (1-2 sentence summary)
2. What are the main concepts or steps covered?
3. Who is this intended for?
4. What should I know before proceeding?
5. What are the most important details to remember?

Visual Analysis:
1. What diagrams, charts, or images are on this page?
2. What does each visual convey?
3. How do the visuals support the text?
```

---

## 2) Procedure Q&A

For procedures, runbooks, and step-by-step guides.

### A) Text Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following procedure from Confluence and answer:

Text Analysis:
1. What is the goal of this procedure?
2. What are the prerequisites or preconditions?
3. What are the main steps (condensed)?
4. What could go wrong or need attention?
5. How do I know if it worked?
6. When should I escalate or ask for help?
```

### B) With Visual Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following procedure from Confluence and answer:

Text Analysis:
1. What is the goal of this procedure?
2. What are the prerequisites or preconditions?
3. What are the main steps (condensed)?
4. What could go wrong or need attention?
5. How do I know if it worked?
6. When should I escalate or ask for help?

Visual Analysis:
1. What diagrams, flowcharts, or screenshots are included?
2. What does each visual show (e.g., workflow, architecture, warning)?
3. How do the visuals help understand the procedure?
```

---

## 3) Technical Concept Explainer

For architecture, configuration, and technical concept docs.

### A) Text Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following Confluence documentation and explain it like I'm new:

Text Analysis:
1. What problem does this solve or what is this about?
2. What are the key components or concepts?
3. How do the parts fit together?
4. What is important to understand about this?
5. What questions should I ask to understand better?
```

### B) With Visual Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following Confluence documentation and explain it like I'm new:

Text Analysis:
1. What problem does this solve or what is this about?
2. What are the key components or concepts?
3. How do the parts fit together?
4. What is important to understand about this?
5. What questions should I ask to understand better?

Visual Analysis:
1. What diagrams, architecture charts, or flowcharts are shown?
2. What does each visual component represent?
3. How do the visuals clarify the relationships between components?
```

---

## 4) Action Checklist

Convert documentation into actionable steps.

### A) Text Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following Confluence documentation and extract:

Text Analysis:
1. A checklist of actions I need to take
2. Any decisions or choices I need to make
3. Things to verify or check
4. Warning signs to watch for
5. Who to contact if issues arise
```

### B) With Visual Analysis

```text
Context: [CONFLUENCE PAGE URL]

Read the following Confluence documentation and extract:

Text Analysis:
1. A checklist of actions I need to take
2. Any decisions or choices I need to make
3. Things to verify or check
4. Warning signs to watch for
5. Who to contact if issues arise

Visual Analysis:
1. Are there any warning icons or visual alerts shown?
2. What do status indicators or color codes mean?
3. Are there screenshots showing expected outcomes?
```

---

## 5) Multi-Page Comparison

Compare or connect information across multiple Confluence pages.

### A) Text Analysis

```text
Context: [CONFLUENCE PAGE URL 1]

Context: [CONFLUENCE PAGE URL 2]

I have multiple Confluence pages. Please read each one and:
1. Summarize what each page covers
2. Identify how they relate to each other
3. Note any conflicting information
4. Highlight any gaps or missing context
```

### B) With Visual Analysis

```text
Context: [CONFLUENCE PAGE URL 1]

Context: [CONFLUENCE PAGE URL 2]

I have multiple Confluence pages. Please read each one and:

Text Analysis:
1. Summarize what each page covers
2. Identify how they relate to each other
3. Note any conflicting information
4. Highlight any gaps or missing context

Visual Analysis:
1. What diagrams or visuals are on each page?
2. Are there inconsistencies in how information is visually represented?
3. How do the visuals complement or contradict each other?
```

---

## 6) Quick Clarification

Get a quick explanation of a specific section.

### A) Text Analysis

```text
Context: [CONFLUENCE PAGE URL]

In the following Confluence documentation, explain this section in plain language:
"[paste specific section or quote]"

Tell me what this means and why it matters.
```

### B) With Visual Context

```text
Context: [CONFLUENCE PAGE URL]

In the following Confluence documentation, explain this section in plain language:
"[paste specific section or quote]"

Text: Tell me what this means and why it matters.

Visuals: Are there any diagrams, screenshots, or images near this section that provide additional context?
```

---
