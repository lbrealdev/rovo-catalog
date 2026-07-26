'use strict';

const fs = require('fs');
const path = require('path');
const { loadAllPrompts } = require('./parse-prompts');

const ROOT = path.resolve(__dirname, '../..');
const SITE = path.join(ROOT, 'site');
const DIST = path.join(SITE, 'dist');
const TEMPLATES = path.join(SITE, 'templates');
const ASSETS = path.join(SITE, 'assets');
const CONTENT = path.join(SITE, 'content');
const PROMPTS_DIR = path.join(ROOT, 'prompts');

const CATEGORY_LABELS = {
  triage: 'Triage',
  tickets: 'Tickets',
  sla: 'SLA',
  communication: 'Communication',
  utilities: 'Utilities',
};

function normalizeBasePath(raw) {
  let base = (raw || '/').trim() || '/';
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return base;
}

const BASE = normalizeBasePath(process.env.SITE_BASE_PATH || '/');

function rootPath(rel) {
  return rel.replace(/^\//, '');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES, name), 'utf8');
}

function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : ''
  );
}

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function modeBadge(mode) {
  const label = mode === 'update' ? 'update' : 'read-only';
  const cls = mode === 'update' ? 'badge badge-update' : 'badge badge-readonly';
  return `<span class="${cls}">${label}</span>`;
}

function tagList(tags, opts) {
  if (!tags.length) return '';
  const staticTag = !!(opts && opts.static);
  const tagEl = staticTag
    ? (t) => `<span class="tag tag-static" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`
    : (t) => `<button type="button" class="tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`;
  return `<ul class="tag-list">${tags.map((t) => `<li>${tagEl(t)}</li>`).join('')}</ul>`;
}

function groupByCategory(entries) {
  const groups = new Map();
  for (const e of entries) {
    if (!groups.has(e.category)) groups.set(e.category, []);
    groups.get(e.category).push(e);
  }
  return groups;
}

function layoutNav(active) {
  return {
    NAV_PROMPTS: active === 'prompts' ? 'is-active' : '',
    NAV_COMMANDS: active === 'commands' ? 'is-active' : '',
    NAV_QUERIES: active === 'queries' ? 'is-active' : '',
  };
}

function pageScriptTag(src) {
  if (!src) return '';
  return `<script src="${src}" defer></script>`;
}

function layoutShell(vars) {
  const layout = readTemplate('layout.html');
  const pageJs = vars.ASSET_PAGE_JS || '';
  const { ASSET_PAGE_JS: _ignored, ...rest } = vars;
  return render(layout, {
    BASE: BASE,
    ASSET_CSS: rootPath('assets/css/catalog.css'),
    ASSET_THEME_JS: rootPath('assets/js/theme.js'),
    ASSET_PROFILE_JS: rootPath('assets/js/profile.js'),
    NAV_PROMPTS: '',
    NAV_COMMANDS: '',
    NAV_QUERIES: '',
    ...rest,
    PAGE_SCRIPTS: pageScriptTag(pageJs),
  });
}

function entryRow(e, opts) {
  const staticTags = opts && opts.staticTags;
  return `
      <li class="prompt-row" data-id="${escapeHtml(e.id)}" data-category="${escapeHtml(e.category)}" data-tags="${escapeHtml(e.tags.join(','))}" data-search="${escapeHtml(
    `${e.title} ${e.use_when} ${e.tags.join(' ')}`
  ).toLowerCase()}">
        <a class="prompt-link" href="${rootPath(`prompts/${e.id}.html`)}">
          <span class="prompt-title">${escapeHtml(e.title)}</span>
          ${modeBadge(e.mode)}
        </a>
        <p class="prompt-when">${escapeHtml(e.use_when)}</p>
        ${tagList(e.tags, { static: staticTags })}
      </li>`;
}

function buildSections(entries, opts) {
  const groups = groupByCategory(entries);
  const sections = [];
  for (const [category, items] of groups) {
    const label = CATEGORY_LABELS[category] || category;
    const rows = items.map((e) => entryRow(e, opts)).join('\n');
    sections.push(`
      <section class="category" id="cat-${escapeHtml(category)}" data-category="${escapeHtml(category)}">
        <h2>${escapeHtml(label)}</h2>
        <ul class="prompt-list">
          ${rows}
        </ul>
      </section>`);
  }
  return sections.join('\n');
}

function categoryHubHtml(entries) {
  const groups = groupByCategory(entries);
  const order = ['triage', 'tickets', 'sla', 'communication', 'utilities'];
  const allBtn = `<button type="button" class="cat-hub-btn is-active" data-category="" aria-pressed="true"><span class="cat-hub-label">All</span><span class="cat-hub-count">${entries.length}</span></button>`;
  const buttons = order
    .filter((c) => groups.has(c))
    .map((c) => {
      const count = groups.get(c).length;
      const label = CATEGORY_LABELS[c] || c;
      return `<button type="button" class="cat-hub-btn" data-category="${escapeHtml(c)}" aria-pressed="false"><span class="cat-hub-label">${escapeHtml(label)}</span><span class="cat-hub-count">${count}</span></button>`;
    })
    .join('\n');
  return `<div class="category-hub" id="category-browse" hidden>\n${allBtn}\n${buttons}\n</div>`;
}

function tagFiltersHtml(entries) {
  const allTags = [...new Set(entries.flatMap((e) => e.tags))].sort();
  return allTags
    .map(
      (t) =>
        `<button type="button" class="tag-filter" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`
    )
    .join('\n');
}

/** Minimal markdown → HTML for site/content/*.md */
function simpleMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').trim().split('\n');
  const out = [];
  let i = 0;
  let inList = false;

  function closeList() {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  }

  function inlineFormat(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      closeList();
      i += 1;
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      out.push(`<h3>${inlineFormat(line.slice(4))}</h3>`);
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      out.push(`<h2>${inlineFormat(line.slice(3))}</h2>`);
      i += 1;
      continue;
    }
    if (line.startsWith('# ')) {
      closeList();
      out.push(`<h2 class="doc-title">${inlineFormat(line.slice(2))}</h2>`);
      i += 1;
      continue;
    }
    if (line.startsWith('- ')) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inlineFormat(line.slice(2))}</li>`);
      i += 1;
      continue;
    }
    closeList();
    out.push(`<p>${inlineFormat(line)}</p>`);
    i += 1;
  }
  closeList();
  return out.join('\n');
}

function buildListPage({
  entries,
  templateName,
  title,
  description,
  activeNav,
  bodyClass,
  outFile,
  withHub,
}) {
  const body = render(readTemplate(templateName), {
    SECTIONS: buildSections(entries, { staticTags: false }),
    CATEGORY_HUB: withHub ? categoryHubHtml(entries) : '',
    TAG_FILTERS: tagFiltersHtml(entries),
    COUNT: String(entries.length),
  });

  const html = layoutShell({
    TITLE: title,
    DESCRIPTION: description,
    BODY: body,
    ASSET_PAGE_JS: rootPath('assets/js/catalog.js'),
    BODY_CLASS: bodyClass,
    ...layoutNav(activeNav),
  });

  fs.writeFileSync(path.join(DIST, outFile), html);
}

function buildCommandsPage(updateEntries) {
  const docPath = path.join(CONTENT, 'commands.md');
  const docHtml = simpleMarkdown(fs.readFileSync(docPath, 'utf8'));
  const recipeRows = updateEntries.map((e) => entryRow(e, { staticTags: true })).join('\n') ||
    '<li class="muted">No update recipes found.</li>';

  const body = render(readTemplate('commands.html'), {
    COMMANDS_DOC: docHtml,
    RECIPE_ROWS: recipeRows,
  });

  const html = layoutShell({
    TITLE: 'Commands · Rovo Agent Toolkit',
    DESCRIPTION: 'Rovo slash commands and copyable update recipes.',
    BODY: body,
    ASSET_PAGE_JS: '',
    BODY_CLASS: 'page-commands',
    ...layoutNav('commands'),
  });

  fs.writeFileSync(path.join(DIST, 'commands.html'), html);
}

function buildPromptPages(entries) {
  const promptTpl = readTemplate('prompt.html');
  const outDir = path.join(DIST, 'prompts');
  fs.mkdirSync(outDir, { recursive: true });

  for (const e of entries) {
    const isQuery = e.lang === 'jql';
    const fields = (e.placeholders || [])
      .map((p) => {
        const name = p.name;
        const required = p.required ? 'required' : '';
        const desc = p.description || name;
        const profileOwned =
          name === 'PROJECT' || name === 'YOUR-USER'
            ? ' data-profile-field="true"'
            : '';
        return `
        <label class="field">
          <span class="field-label">${escapeHtml(name)}${p.required ? ' *' : ''}</span>
          <span class="field-desc">${escapeHtml(desc)}</span>
          <input type="text" name="${escapeHtml(name)}" data-placeholder="${escapeHtml(name)}"${profileOwned} ${required} autocomplete="off" />
        </label>`;
      })
      .join('\n');

    const body = render(promptTpl, {
      ID: escapeHtml(e.id),
      TITLE: escapeHtml(e.title),
      USE_WHEN: escapeHtml(e.use_when),
      MODE_BADGE: modeBadge(e.mode),
      CATEGORY: escapeHtml(CATEGORY_LABELS[e.category] || e.category),
      TAGS: tagList(e.tags, { static: true }),
      FIELDS:
        fields ||
        '<p class="muted">No placeholders — copy as-is.</p>',
      BODY_RAW: escapeHtml(e.body),
      LANG: escapeHtml(e.lang),
      HOME_HREF: rootPath(isQuery ? 'queries.html' : 'index.html'),
      HOME_LABEL: isQuery ? 'Queries' : 'Prompts',
      SOURCE: escapeHtml(e.source),
    });

    const html = layoutShell({
      TITLE: `${e.title} · Rovo Agent Toolkit`,
      DESCRIPTION: e.use_when,
      BODY: body,
      ASSET_PAGE_JS: rootPath('assets/js/prompt.js'),
      BODY_CLASS: `page-prompt mode-${e.mode}${isQuery ? ' kind-query' : ''}`,
      ...layoutNav(isQuery ? 'queries' : 'prompts'),
    });

    fs.writeFileSync(path.join(outDir, `${e.id}.html`), html);
  }
}

function writeCatalogJson(entries) {
  const lite = entries.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    tags: e.tags,
    use_when: e.use_when,
    mode: e.mode,
    placeholders: e.placeholders,
    lang: e.lang,
    kind: e.lang === 'jql' ? 'query' : 'prompt',
  }));
  fs.writeFileSync(
    path.join(DIST, 'catalog.json'),
    `${JSON.stringify(lite, null, 2)}\n`
  );
}

function main() {
  const entries = loadAllPrompts(PROMPTS_DIR);
  if (!entries.length) {
    throw new Error('No catalog entries found under prompts/');
  }

  const prompts = entries.filter((e) => e.lang !== 'jql');
  const queries = entries.filter((e) => e.lang === 'jql');
  const updateRecipes = prompts.filter((e) => e.mode === 'update');

  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(ASSETS, path.join(DIST, 'assets'));

  buildListPage({
    entries: prompts,
    templateName: 'index.html',
    title: 'Rovo Agent Toolkit',
    description: 'Browse Rovo prompts by situation, fill placeholders, copy, paste.',
    activeNav: 'prompts',
    bodyClass: 'page-home page-prompts',
    outFile: 'index.html',
    withHub: true,
  });

  buildListPage({
    entries: queries,
    templateName: 'queries.html',
    title: 'Queries · Rovo Agent Toolkit',
    description: 'Jira JQL snippets for Rovo and Jira search.',
    activeNav: 'queries',
    bodyClass: 'page-queries',
    outFile: 'queries.html',
  });

  buildCommandsPage(updateRecipes);
  buildPromptPages(entries);
  writeCatalogJson(entries);

  console.log(
    `Built toolkit → ${path.relative(ROOT, DIST)} (base=${BASE}): ` +
      `${prompts.length} prompts, ${queries.length} queries, ${updateRecipes.length} command recipes`
  );
}

main();
