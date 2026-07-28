Plan the "Situation Shortcuts" feature for the Rovo Agent Toolkit static site.

## Context

Same codebase as the Recently Used / Favorites feature. Zero-dependency static site, vanilla Node.js build, localStorage for persistence. See `.cursor/prompts/01-favorites-plan.md` for full codebase context.

### Key files:
- `site/assets/js/catalog.js` — Client-side catalog filtering, search, pagination
- `site/templates/layout.html` — Base layout with header nav
- `site/templates/index.html` — Catalog home template
- `site/assets/css/catalog.css` — Styles
- `site/scripts/build.js` — Node build that generates pages

The catalog already has:
- Category hub buttons (All, Triage, Tickets, SLA, etc.)
- Tag filter buttons
- Search input
- Pagination (10 per page)
- `data-category`, `data-tags`, `data-search` attributes on `.prompt-row` elements
- `data-prompt-id` attribute on each prompt detail page `<article>`

## Feature Requirements

### Situation Shortcuts
Predefined one-click shortcuts that combine category + tag + search filters to quickly surface relevant prompts for common daily situations.

**Suggested shortcuts:**

| Label | Filter combo |
|---|---|
| 📋 Monday Triage | category=triage, tag=morning |
| ⏰ SLA at Risk | tag=sla (any category) |
| 🏥 AWS Health Close-out | search="aws health" or tag=aws |
| 📝 Reopened Tickets | search="reopened" or category=tickets, tag=reopened |
| 🆕 Recently Added | tag=new (if it exists, otherwise skip) |

### Implementation
1. Add a shortcuts bar above the category hub on the catalog home page
2. Each shortcut is a button that, when clicked:
   - Applies the appropriate filter combination (category, tag, search)
   - Updates the catalog state (mode, category, tag, query, page)
   - Re-renders the visible prompts (reuses existing render pipeline)
3. Shortcut buttons have visual active state when their filter is active
4. If none of the shortcut filters match the current state, no shortcut appears active
5. Shortcuts should not conflict with existing manual filtering — user can always clear by clicking "All" or the shortcut again

### Constraints
- No external dependencies
- Must integrate with existing catalog.js filtering system (state machine with mode/category/tag/query/page)
- Follow existing code patterns (IIFE, `data-*` attributes, classList toggling)
- Should degrade gracefully — buttons are just links/filters, no JS needed for display

## Output

Please provide:
1. Detailed implementation plan with file-by-file changes
2. Specific code for each file
3. How shortcuts integrate with the existing catalog state machine
