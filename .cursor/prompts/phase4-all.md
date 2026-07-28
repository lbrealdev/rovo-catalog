Implement ALL THREE Phase 4 features for the Rovo Agent Toolkit static site. No questions. Follow every instruction below exactly.

## Context

Zero-dependency static site. Node.js build (`site/scripts/build.js`) reads YAML frontmatter from `prompts/**/*.md`, renders HTML templates to `site/dist/`. Client-side JS: vanilla IIFE patterns, `localStorage` for persistence. No bundler, no framework, no backend, no CDN.

### Key files you will modify:
- `site/assets/js/catalog.js` — catalog filtering (state machine: mode/category/tag/query/page), pagination (10/page)
- `site/assets/js/prompt.js` — placeholder form, copy-to-clipboard, profile prefill via `window.RovoProfile.read()`
- `site/assets/js/profile.js` — localStorage profile (`rovo-catalog-profile`), `window.RovoProfile` API, `rovo-profile-updated` event
- `site/templates/layout.html` — base shell (nav, profile panel, theme toggle, footer)
- `site/templates/prompt.html` — prompt detail template
- `site/templates/index.html` — catalog home template
- `site/assets/css/catalog.css` — all styles
- `site/scripts/build.js` — node build (generates index.html, queries.html, commands.html, prompts/*.html, catalog.json)
- `site/scripts/parse-prompts.js` — parses prompt frontmatter

### Existing localStorage keys:
- `rovo-catalog-profile` — `{PROJECT, YOUR-USER}`
- `rovo-catalog-theme` — `"light"` or `"dark"`

### catalog.json (emitted during build):
```json
[{"id": "...", "title": "...", "category": "...", "tags": [...], "use_when": "...", "mode": "...", "placeholders": [...], "lang": "...", "kind": "prompt|query"}]
```

---

## FEATURE 1: Recently Used (automatic tracking)

**Behavior:**
1. Every time a user visits a prompt detail page (`prompts/<id>.html`), record the visit
2. Store in localStorage key `rovo-catalog-recent`: array of `{id, title, category, timestamp}`, most recent first, max 10 entries
3. On the catalog home page (`index.html`), render a "Recently Used" strip ABOVE the category hub when the array is non-empty
4. Each entry: clickable link to the prompt detail page, shows title + category label
5. If user revisits a prompt already in the list, move it to position 0 (update timestamp), don't duplicate
6. Strip is hidden (via CSS `display:none` or `hidden` attribute) when the array is empty

**Files to change:**
- `prompt.js`: on load, read `rovo-catalog-recent`, prepend/update current prompt, write back, trim to 10
- `build.js`: inject `data-recent-count="0"` into a container element on index.html (or let JS create it)
- `catalog.js`: on load, read `rovo-catalog-recent` from localStorage, render strip if non-empty, render empty state if empty
- `index.html` template: add a `<div id="recent-strip" hidden>` placeholder above the search bar
- `catalog.css`: style the recent strip (horizontal scroll of small cards or compact list items)

---

## FEATURE 2: Favorites (manual toggle)

**Behavior:**
1. Toggle button on each prompt detail page (`prompts/<id>.html`) in the header area (next to the title or below the mode badge)
2. Toggle button on each prompt row in the catalog home page (`index.html`), at the right side of each `.prompt-row`
3. localStorage key `rovo-catalog-favorites`: Set of favorited prompt IDs (store as JSON array for simplicity)
4. Star icon: ★ (filled, Unicode U+2605) when favorited, ☆ (outline, U+2606) when not
5. Clicking the star toggles: add/remove ID from `rovo-catalog-favorites`, swap icon, no page reload
6. Both star buttons for the same prompt ID stay in sync (same localStorage key); use `storage` event or poll localStorage
7. Favorites persist across page loads

**Favorites section on catalog home:**
- A "★ Favorites" section above the category hub, BELOW the Recently Used strip
- Hidden when `rovo-catalog-favorites` is empty
- Each entry: same style as Recently Used items (title + category link)
- Sorted alphabetically by title
- Clicking any item navigates to the prompt detail page

**Files to change:**
- `prompt.html` template: add star toggle button in prompt header (build-time: `data-favorite-id="{{ID}}"`)
- `prompt.js`: handle star toggle click, read/write `rovo-catalog-favorites`, update icon
- `index.html` template: add star toggle button to each `.prompt-row` (build-time via `entryRow()` in `build.js`) AND add `<section id="favorites-strip" hidden>` placeholder above category hub
- `build.js`: in `entryRow()`, add star button markup with `data-favorite-id`
- `catalog.js`: on load, read favorites, render favorites strip if non-empty, handle star toggle clicks on rows, listen for `storage` event
- `catalog.css`: star button styles (no border, background transparent, cursor pointer, color gold for filled)

---

## FEATURE 3: Situation Shortcuts

**Behavior:**
A row of predefined shortcut buttons above the search bar (below Recently Used and Favorites strips) on the catalog home page. Each shortcut applies a filter combination.

**Shortcuts to implement:**
| Label | Filter |
|---|---|
| Monday Triage | category=triage, tag=morning |
| SLA at Risk | tag=sla |
| Reopened | category=tickets, tag=reopened |
| Proofreading | category=communication, tag=proofreading |

**Implementation:**
- Define shortcuts as a static array in `catalog.js` (hardcoded, not from localStorage or build)
- Render a `<div id="situation-shortcuts">` with shortcut buttons on catalog home
- Each button click: call existing filtering functions in catalog.js state machine
  - For category+tag combo: `state.mode = "filter"`, set `state.category` and `state.tag`, reset `state.page = 1`, re-render
  - For tag only: `state.mode = "filter"`, set `state.tag`, reset
- Active state: a shortcut button appears active (`.is-active` class) when its exact filter combo matches the current state
- Clicking an active shortcut deactivates it (returns to `browse` mode)
- Shortcuts should always be visible (no hidden logic — they're static UI)

**Files to change:**
- `catalog.js`: add `SHORTCUTS` constant, render shortcut bar on load, wire click handlers
- `index.html` template: add `<div id="situation-shortcuts">` placeholder in the search area
- `catalog.css`: shortcut button styles (similar to tag filter buttons, slight visual distinction)

---

## General Rules

1. **Follow existing patterns exactly:** IIFE wrappers, `data-*` attributes, `classList.toggle`, `Array.prototype.slice.call` for NodeLists
2. **No new external files** unless absolutely necessary. Prefer adding to existing JS files. If a new JS file is needed (e.g., `favorites.js`), add it to `site/assets/js/` and reference it in `layoutShell()` in `build.js`
3. **Build-time vs runtime:** Favorites and Recent data is runtime (localStorage). HTML placeholders can be build-time (injected by Node build) or created by JS at runtime. Prefer build-time for structural HTML, runtime for dynamic content.
4. **CSS:** Minimal, consistent with existing HonorBox style. Use the existing CSS custom properties (check `catalog.css` for `--color-*` vars). Gold/orange for star/favorites accent. No new design system.
5. **No breaking changes:** Existing search, category hub, tag filters, pagination, profile, theme must all continue working.
6. **Order of elements on catalog home (top to bottom):**
   - Recently Used strip (hidden when empty)
   - Favorites strip (hidden when empty)
   - Situation Shortcuts bar (always visible)
   - Search bar (existing)
   - Category hub (existing)
   - Tag filters (existing)
   - Catalog list (existing)
   - Pagination (existing)
7. **All prompts are `lang: text` (prompts), not `lang: jql` (queries).** Queries page is out of scope for this task.
8. **Do NOT ask clarifying questions.** If any detail is ambiguous, pick the most reasonable interpretation and implement it. If a shortcut tag doesn't exist in any prompt's frontmatter, skip that shortcut silently.

## Output

Execute all changes directly. Write code to files. Do not output a plan — implement it. When done, run `npm run build` to verify the build succeeds.

Work order: Feature 1 (Recently Used) → Feature 2 (Favorites) → Feature 3 (Shortcuts). Test each feature's build after implementation.
