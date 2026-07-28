Plan the "Link Related Prompts" feature for the Rovo Agent Toolkit static site.

## Context

Same codebase. Zero-dependency static site built with vanilla Node.js. See `.cursor/prompts/01-favorites-plan.md` for full codebase context.

### Key files:
- `site/scripts/build.js` — Node build script that generates HTML pages from markdown frontmatter
- `site/scripts/parse-prompts.js` — Parses YAML frontmatter from prompts markdown files
- `site/templates/prompt.html` — Prompt detail page template
- `site/assets/css/catalog.css` — Styles
- `docs/prompt-schema.md` — Schema documentation

### Prompt frontmatter fields currently in use:
```
id, title, category, tags, use_when, placeholders, mode
```

`catalog.json` is emitted during build: `{ id, title, category, tags, use_when, mode, placeholders, lang, kind }`.

## Feature Requirements

### Related Prompts
Show related prompts at the bottom of each prompt detail page.

**Logic for determining related prompts:**
1. Primary: prompts that share 2+ tags with the current prompt
2. Secondary: prompts in the same category (if primary yields fewer than 3 results)
3. Exclude the current prompt itself
4. Max 4 related prompts shown
5. Sort by most tag overlap first, then alphabetically

### Implementation approach (build-time, preferred)
1. During the Node build (`build.js`), after loading all prompt entries:
   - Compute related prompts for each entry using tag overlap
   - Inject related prompt HTML into each prompt detail page at build time
2. Display related prompts as a small list below the prompt body, before the source note:
   - Title (linked), category badge, tags, brief use_when
3. No JavaScript needed for this feature — it's purely static HTML

### Alternative (runtime JS)
If build-time is not feasible, compute and render related prompts client-side using `catalog.json`.

### Constraints
- No external dependencies
- Build-time approach preferred (static HTML, works without JS)
- Must be compatible with zero-dep build (no npm packages beyond what's already there — fs, path only)

## Output

Please provide:
1. Detailed implementation plan (build-time preferred)
2. Code changes for build.js, prompt.html, and any other affected files
3. How to handle the tag overlap computation efficiently
4. CSS suggestions for the related prompts section
