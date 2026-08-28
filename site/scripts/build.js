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
const QUERIES_DIR = path.join(ROOT, 'queries', 'jql');

const CATEGORY_LABELS = {
  triage: 'Triage',
  tickets: 'Tickets',
  sla: 'SLA',
  communication: 'Communication',
  utilities: 'Utilities',
  confluence: 'Confluence',
};

const PROFILE_OWNED = new Set(['PROJECT', 'YOUR-USER', 'CONFLUENCE-PAGE-URL']);

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

function buildHubMaps(entries) {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const stepToHub = new Map();
  for (const e of entries) {
    if (!e.hub_steps) continue;
    for (const stepId of e.hub_steps) {
      stepToHub.set(stepId, e.id);
    }
  }
  return { byId, stepToHub };
}

function entryHref(e) {
  return rootPath(`prompts/${e.id}.html`);
}

function entryRow(e, opts) {
  const staticTags = opts && opts.staticTags;
  const showFavorites = opts && opts.showFavorites;
  const href = (opts && opts.href) || entryHref(e);
  const catLabel = CATEGORY_LABELS[e.category] || e.category || '';
  const catSpan = catLabel
    ? `<span class="prompt-cat">${escapeHtml(catLabel)}</span>`
    : '';
  const favBtn = showFavorites
    ? `<button type="button" class="favorite-toggle" data-favorite-id="${escapeHtml(e.id)}" aria-label="Toggle favorite" aria-pressed="false" title="Favorite">☆</button>`
    : '';
  return `
      <li class="prompt-row" data-id="${escapeHtml(e.id)}" data-category="${escapeHtml(e.category)}" data-tags="${escapeHtml(e.tags.join(','))}" data-search="${escapeHtml(
    `${e.title} ${e.use_when} ${e.tags.join(' ')}`
  ).toLowerCase()}">
        <div class="prompt-row-main">
          <a class="prompt-link" href="${href}">
            <span class="prompt-title">${escapeHtml(e.title)}</span>
            ${catSpan}
          </a>
          <p class="prompt-when">${escapeHtml(e.use_when)}</p>
          ${tagList(e.tags, { static: staticTags })}
        </div>
        ${favBtn}
      </li>`;
}

function orderedByCategory(entries) {
  const groups = groupByCategory(entries);
  const order = Object.keys(CATEGORY_LABELS);
  const ordered = [];
  for (const category of order) {
    if (groups.has(category)) ordered.push(...groups.get(category));
  }
  for (const [category, items] of groups) {
    if (!CATEGORY_LABELS[category]) ordered.push(...items);
  }
  return ordered;
}

function buildSections(entries, opts) {
  const heading = (opts && opts.listHeading) || 'Catalog';
  const rows = orderedByCategory(entries)
    .map((e) => entryRow(e, opts))
    .join('\n');
  return `
      <section class="category" id="catalog-list">
        <h2>${escapeHtml(heading)}</h2>
        <ul class="prompt-list">
          ${rows}
        </ul>
      </section>`;
}

function categoryHubHtml(entries) {
  const groups = groupByCategory(entries);
  const order = Object.keys(CATEGORY_LABELS);
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
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
      )
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
  showFavorites,
  listHeading,
}) {
  const body = render(readTemplate(templateName), {
    SECTIONS: buildSections(entries, {
      staticTags: false,
      showFavorites: !!showFavorites,
      listHeading: listHeading || 'Catalog',
    }),
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

function buildCommandsPage() {
  const docPath = path.join(CONTENT, 'commands.md');
  const docHtml = simpleMarkdown(fs.readFileSync(docPath, 'utf8'));

  const body = render(readTemplate('commands.html'), {
    COMMANDS_DOC: docHtml,
  });

  const html = layoutShell({
    TITLE: 'Commands · Rovo Catalog',
    DESCRIPTION: 'Rovo slash commands that change Jira work items.',
    BODY: body,
    ASSET_PAGE_JS: '',
    BODY_CLASS: 'page-commands',
    ...layoutNav('commands'),
  });

  fs.writeFileSync(path.join(DIST, 'commands.html'), html);
}

function placeholderFieldsHtml(placeholders) {
  if (!placeholders || !placeholders.length) {
    return '<p class="muted">No placeholders — copy as-is.</p>';
  }
  return placeholders
    .map((p) => {
      const name = p.name;
      const required = p.required ? 'required' : '';
      const desc = p.description || name;
      const profileOwned = PROFILE_OWNED.has(name)
        ? ' data-profile-field="true"'
        : '';
      let control;
      if (p.type === 'select') {
        const options = (p.options || [])
          .map(
            (o, idx) =>
              `<option value="${escapeHtml(o)}"${idx === 0 ? ' selected' : ''}>${escapeHtml(o)}</option>`
          )
          .join('');
        control = `<select name="${escapeHtml(name)}" data-placeholder="${escapeHtml(name)}"${profileOwned} ${required}>${options}</select>`;
      } else if (p.type === 'tags') {
        control = `<div class="tags-input" data-tags-for="${escapeHtml(name)}">
  <div class="tags-chips" data-tags-chips></div>
  <input type="text" class="tags-entry" aria-label="${escapeHtml(name)}" autocomplete="off" />
  <input type="hidden" name="${escapeHtml(name)}" data-placeholder="${escapeHtml(name)}" value="" ${required} />
</div>`;
      } else {
        control = `<input type="text" name="${escapeHtml(name)}" data-placeholder="${escapeHtml(name)}"${profileOwned} ${required} autocomplete="off" />`;
      }
      return `
        <label class="field">
          <span class="field-label">${escapeHtml(name)}${p.required ? ' *' : ''}</span>
          <span class="field-desc">${escapeHtml(desc)}</span>
          ${control}
        </label>`;
    })
    .join('\n');
}

/** Union placeholders across hub steps by name (first occurrence wins). */
function unionPlaceholders(steps) {
  const seen = new Map();
  for (const step of steps) {
    for (const p of step.placeholders || []) {
      if (!seen.has(p.name)) seen.set(p.name, p);
    }
  }
  return [...seen.values()];
}

function renderSharedPlaceholders(placeholders) {
  return `
  <section class="placeholders hub-placeholders" aria-label="Placeholders">
    <h2>Placeholders</h2>
    <form id="placeholder-form" class="placeholder-form" data-hub-form="true">
      ${placeholderFieldsHtml(placeholders)}
    </form>
  </section>`;
}

function renderStepSection(step) {
  const stepId = step.id;
  const previewId = `prompt-preview-${stepId}`;
  const rawId = `prompt-body-raw-${stepId}`;
  const copyBtnId = `copy-btn-${stepId}`;
  const copyStatusId = `copy-status-${stepId}`;
  return `
  <section class="prompt-step mode-${escapeHtml(step.mode)}" id="step-${escapeHtml(stepId)}" data-step-id="${escapeHtml(stepId)}">
    <header class="step-header">
      <h2>${escapeHtml(step.title)}</h2>
      <p class="prompt-when">${escapeHtml(step.use_when)}</p>
    </header>
    <section class="preview-block" aria-label="Prompt preview for ${escapeHtml(step.title)}">
      <div class="preview-toolbar">
        <h3>Preview</h3>
        <button type="button" class="btn copy-btn" id="${escapeHtml(copyBtnId)}" data-copy-target="${escapeHtml(rawId)}" data-copy-status="${escapeHtml(copyStatusId)}">Copy</button>
        <span class="copy-status" id="${escapeHtml(copyStatusId)}" aria-live="polite"></span>
      </div>
      <pre class="prompt-body" id="${escapeHtml(previewId)}" data-lang="${escapeHtml(step.lang)}"><code class="prompt-body-raw" id="${escapeHtml(rawId)}">${escapeHtml(step.body)}</code></pre>
    </section>
  </section>`;
}

function renderSingleDetailBody(e) {
  return `
  <section class="placeholders" aria-label="Placeholders">
    <h2>Placeholders</h2>
    <form id="placeholder-form" class="placeholder-form" data-step-form="true">
      ${placeholderFieldsHtml(e.placeholders)}
    </form>
  </section>

  <section class="preview-block" aria-label="Prompt preview">
    <div class="preview-toolbar">
      <h2>Preview</h2>
      <button type="button" class="btn copy-btn" id="copy-btn" data-copy-target="prompt-body-raw" data-copy-status="copy-status">Copy</button>
      <span class="copy-status" id="copy-status" aria-live="polite"></span>
    </div>
    <pre class="prompt-body" id="prompt-preview" data-lang="${escapeHtml(e.lang)}"><code class="prompt-body-raw" id="prompt-body-raw">${escapeHtml(e.body)}</code></pre>
  </section>`;
}

function writeHubStepRedirect(outDir, stepId, hubId) {
  const target = rootPath(`prompts/${hubId}.html#step-${stepId}`);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <base href="${BASE}" />
  <meta http-equiv="refresh" content="0;url=${target}" />
  <link rel="canonical" href="${target}" />
  <title>Redirecting…</title>
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p><a href="${escapeHtml(target)}">Continue to prompt</a></p>
</body>
</html>
`;
  fs.writeFileSync(path.join(outDir, `${stepId}.html`), html);
}

function buildPromptPages(entries) {
  const promptTpl = readTemplate('prompt.html');
  const outDir = path.join(DIST, 'prompts');
  fs.mkdirSync(outDir, { recursive: true });
  const { byId, stepToHub } = buildHubMaps(entries);

  for (const e of entries) {
    const isQuery = e.lang === 'jql';

    // Hub-owned steps: redirect to hub anchor (avoid a second UI).
    if (!isQuery && stepToHub.has(e.id)) {
      writeHubStepRedirect(outDir, e.id, stepToHub.get(e.id));
      continue;
    }

    const isHub = !!(e.hub_steps && e.hub_steps.length);
    let detailBody;
    let sourceNote = e.source;

    if (isHub) {
      const steps = e.hub_steps.map((id) => byId.get(id)).filter(Boolean);
      const shared = unionPlaceholders(steps);
      detailBody =
        renderSharedPlaceholders(shared) +
        `<div class="hub-steps" aria-label="Copy flow">${steps.map(renderStepSection).join('\n')}</div>`;
      const sources = [...new Set(steps.map((s) => s.source).concat(e.source))];
      sourceNote = sources.join(', ');
    } else {
      detailBody = renderSingleDetailBody(e);
    }

    const favoriteToggle = isQuery
      ? ''
      : `<button type="button" class="favorite-toggle" data-favorite-id="${escapeHtml(e.id)}" aria-label="Toggle favorite" aria-pressed="false" title="Favorite">☆</button>`;

    const body = render(promptTpl, {
      ID: escapeHtml(e.id),
      TITLE: escapeHtml(e.title),
      USE_WHEN: escapeHtml(e.use_when),
      CATEGORY: escapeHtml(CATEGORY_LABELS[e.category] || e.category),
      CATEGORY_KEY: escapeHtml(e.category),
      FAVORITE_TOGGLE: favoriteToggle,
      TAGS: tagList(e.tags, { static: true }),
      DETAIL_BODY: detailBody,
      HOME_HREF: rootPath(isQuery ? 'queries.html' : 'index.html'),
      HOME_LABEL: isQuery ? 'Queries' : 'Prompts',
      SOURCE: escapeHtml(sourceNote),
    });

    const modeClass = isHub ? 'page-prompt-hub' : `mode-${e.mode}`;
    const html = layoutShell({
      TITLE: `${e.title} · Rovo Catalog`,
      DESCRIPTION: e.use_when,
      BODY: body,
      ASSET_PAGE_JS: rootPath('assets/js/prompt.js'),
      BODY_CLASS: `page-prompt ${modeClass}${isQuery ? ' kind-query' : ''}`,
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
    listed: e.listed !== false,
    hub_steps: e.hub_steps || null,
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
  const entries = loadAllPrompts([PROMPTS_DIR, QUERIES_DIR]);
  if (!entries.length) {
    throw new Error('No catalog entries found under prompts/');
  }

  const prompts = entries.filter((e) => e.lang !== 'jql');
  const listedPrompts = prompts.filter((e) => e.listed !== false);
  const queries = entries.filter((e) => e.lang === 'jql');

  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(ASSETS, path.join(DIST, 'assets'));

  buildListPage({
    entries: listedPrompts,
    templateName: 'index.html',
    title: 'Rovo Catalog',
    description:
      'Copy-paste Rovo prompts for Jira Service Management and Confluence — browse, fill, copy.',
    activeNav: 'prompts',
    bodyClass: 'page-home page-prompts',
    outFile: 'index.html',
    withHub: true,
    showFavorites: true,
    listHeading: 'Catalog',
  });

  buildListPage({
    entries: queries,
    templateName: 'queries.html',
    title: 'Queries · Rovo Catalog',
    description: 'Jira JQL snippets for Rovo and Jira search.',
    activeNav: 'queries',
    bodyClass: 'page-queries',
    outFile: 'queries.html',
    listHeading: 'All queries',
  });

  buildCommandsPage();
  buildPromptPages(entries);
  writeCatalogJson(entries);

  console.log(
    `Built toolkit → ${path.relative(ROOT, DIST)} (base=${BASE}): ` +
      `${listedPrompts.length} listed prompts (${prompts.length} total), ${queries.length} queries`
  );
}

main();
