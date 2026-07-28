Plan the "Recently Used / Favorites" feature for the Rovo Agent Toolkit static site.

## Context

This is a zero-dependency static site built with vanilla Node.js. The build script (`site/scripts/build.js`) reads YAML frontmatter from `prompts/**/*.md`, renders HTML templates, and outputs to `site/dist/`. There is no bundler, no SPA framework, no backend.

### Key files:

- `site/assets/js/catalog.js` — Client-side JS for the catalog home page. Handles category browsing, search filtering, tag filtering, pagination (10 per page). Uses `data-*` attributes on `.prompt-row` elements for filtering. State object: `{ mode, category, tag, query, page }`.
- `site/assets/js/prompt.js` — Client-side JS for individual prompt detail pages. Handles placeholder input rendering, profile prefill via `RovoProfile.read()`, copy-to-clipboard.
- `site/assets/js/profile.js` — Mini profile system using `localStorage` key `rovo-catalog-profile`. Exposes `window.RovoProfile` API (`read`, `write`, `clear`). Fires `rovo-profile-updated` custom event.
- `site/assets/js/theme.js` — Light/dark theme toggle, also `localStorage` based.
- `site/scripts/build.js` — Node build script. Reads prompts via `parse-prompts.js`, generates:
  - `index.html` — Prompt catalog with category hub, tag filters, search, pagination
  - `queries.html` — JQL queries list
  - `commands.html` — Slash command explainers
  - `prompts/<id>.html` — Individual prompt detail pages
  - `catalog.json` — Lightweight JSON index of all entries
- `site/scripts/parse-prompts.js` — Parses YAML frontmatter + fenced code blocks from markdown.
- `site/templates/layout.html` — Base HTML layout with nav, profile panel, theme toggle, footer.
- `site/templates/prompt.html` — Prompt detail template with placeholders form, preview, copy.
- `site/templates/index.html` — Catalog home template.
- `site/assets/css/catalog.css` — All styles.

### Prompt schema (frontmatter fields per entry):
```yaml
id, title, category, tags, use_when, placeholders, mode (read-only|update)
```

`catalog.json` is emitted during build with a lightweight index: `{ id, title, category, tags, use_when, mode, placeholders, lang, kind }`.

### Existing localStorage patterns:
- `rovo-catalog-profile` — User's PROJECT and YOUR-USER values
- `rovo-catalog-theme` — Light/dark theme preference

## Feature Requirements

### Recently Used (automatic)
1. Track when a user visits a prompt detail page (`prompts/<id>.html`)
2. Store the last N visited prompts in localStorage (suggest: last 10)
3. Store: `{ id, title, category, timestamp }` for each visit
4. Show "Recently Used" section at the top of the catalog home page when there are entries
5. Entries are clickable links to the prompt detail page, sorted by most recent first
6. Maximum N entries, oldest dropped when full

### Favorites (manual)
1. Add a star/heart toggle button on:
   - Prompt detail page (`prompts/<id>.html`) — in the header area
   - Catalog home page (`index.html`) — on each `.prompt-row`
2. Store favorited prompt IDs in localStorage (`rovo-catalog-favorites`)
3. Toggle visual state: filled star = favorited, outline star = not favorited
4. On the catalog home page:
   - A "Favorites" filter button (similar to category hub buttons) that shows only favorited prompts
   - Or a separate "⭐ Favorites" section at the top
5. The favorite state should persist across page loads

### Constraints
- No external dependencies, no CDN scripts
- Must work with JavaScript disabled for reading (but favorites/recent need JS)
- Follow existing code style (IIFE patterns, ES5-compatible syntax where the rest of the codebase uses it)
- Use the same `localStorage` conventions as profile.js
- Must integrate cleanly with existing catalog filtering, pagination, and search

## Output

Please provide:
1. A detailed implementation plan with file-by-file changes
2. The specific code changes needed for each file
3. Any new files required
4. Estimated order of implementation
