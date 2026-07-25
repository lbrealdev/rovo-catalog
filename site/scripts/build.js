'use strict';

const fs = require('fs');
const path = require('path');
const { loadAllPrompts } = require('./parse-prompts');

const ROOT = path.resolve(__dirname, '../..');
const SITE = path.join(ROOT, 'site');
const DIST = path.join(SITE, 'dist');
const TEMPLATES = path.join(SITE, 'templates');
const ASSETS = path.join(SITE, 'assets');
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

/** Site-root-relative path; resolved via <base href="BASE"> */
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

function tagList(tags) {
  if (!tags.length) return '';
  return `<ul class="tag-list">${tags
    .map((t) => `<li><button type="button" class="tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button></li>`)
    .join('')}</ul>`;
}

function groupByCategory(entries) {
  const groups = new Map();
  for (const e of entries) {
    if (!groups.has(e.category)) groups.set(e.category, []);
    groups.get(e.category).push(e);
  }
  return groups;
}

function buildIndex(entries) {
  const groups = groupByCategory(entries);
  const sections = [];
  for (const [category, items] of groups) {
    const label = CATEGORY_LABELS[category] || category;
    const rows = items
      .map(
        (e) => `
      <li class="prompt-row" data-id="${escapeHtml(e.id)}" data-category="${escapeHtml(e.category)}" data-tags="${escapeHtml(e.tags.join(','))}" data-search="${escapeHtml(
          `${e.title} ${e.use_when} ${e.tags.join(' ')} ${e.mode}`
        ).toLowerCase()}">
        <a class="prompt-link" href="${rootPath(`prompts/${e.id}.html`)}">
          <span class="prompt-title">${escapeHtml(e.title)}</span>
          ${modeBadge(e.mode)}
        </a>
        <p class="prompt-when">${escapeHtml(e.use_when)}</p>
        ${tagList(e.tags)}
      </li>`
      )
      .join('\n');

    sections.push(`
      <section class="category" id="cat-${escapeHtml(category)}" data-category="${escapeHtml(category)}">
        <h2>${escapeHtml(label)}</h2>
        <ul class="prompt-list">
          ${rows}
        </ul>
      </section>`);
  }

  const allTags = [...new Set(entries.flatMap((e) => e.tags))].sort();
  const tagFilters = allTags
    .map((t) => `<button type="button" class="tag-filter" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
    .join('\n');

  const layout = readTemplate('layout.html');
  const indexBody = readTemplate('index.html');
  const body = render(indexBody, {
    SECTIONS: sections.join('\n'),
    TAG_FILTERS: tagFilters,
    COUNT: String(entries.length),
  });

  const html = render(layout, {
    TITLE: 'Rovo Prompt Catalog',
    DESCRIPTION: 'Browse Rovo prompts by situation, fill placeholders, copy, paste.',
    BODY: body,
    BASE: BASE,
    ASSET_CSS: rootPath('assets/css/catalog.css'),
    ASSET_PROFILE_JS: rootPath('assets/js/profile.js'),
    ASSET_PAGE_JS: rootPath('assets/js/catalog.js'),
    NAV_EXTRA: '',
    BODY_CLASS: 'page-home',
  });

  fs.writeFileSync(path.join(DIST, 'index.html'), html);
}

function buildPromptPages(entries) {
  const layout = readTemplate('layout.html');
  const promptTpl = readTemplate('prompt.html');
  const outDir = path.join(DIST, 'prompts');
  fs.mkdirSync(outDir, { recursive: true });

  for (const e of entries) {
    const fields = (e.placeholders || [])
      .map((p) => {
        const name = p.name;
        const required = p.required ? 'required' : '';
        const desc = p.description || name;
        const profileOwned =
          name === 'PROJECT' || name === 'YOUR-USER' ? ' data-profile-field="true"' : '';
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
      TAGS: tagList(e.tags),
      FIELDS:
        fields ||
        '<p class="muted">No placeholders — copy the prompt as-is.</p>',
      BODY_RAW: escapeHtml(e.body),
      LANG: escapeHtml(e.lang),
      HOME_HREF: rootPath('index.html'),
      SOURCE: escapeHtml(e.source),
    });

    const html = render(layout, {
      TITLE: `${e.title} · Rovo Prompt Catalog`,
      DESCRIPTION: e.use_when,
      BODY: body,
      BASE: BASE,
      ASSET_CSS: rootPath('assets/css/catalog.css'),
      ASSET_PROFILE_JS: rootPath('assets/js/profile.js'),
      ASSET_PAGE_JS: rootPath('assets/js/prompt.js'),
      NAV_EXTRA: `<a href="${rootPath('index.html')}">Catalog</a>`,
      BODY_CLASS: `page-prompt mode-${e.mode}`,
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
  }));
  fs.writeFileSync(path.join(DIST, 'catalog.json'), `${JSON.stringify(lite, null, 2)}\n`);
}

function main() {
  const entries = loadAllPrompts(PROMPTS_DIR);
  if (!entries.length) {
    throw new Error('No catalog entries found under prompts/');
  }

  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(ASSETS, path.join(DIST, 'assets'));

  buildIndex(entries);
  buildPromptPages(entries);
  writeCatalogJson(entries);

  console.log(
    `Built ${entries.length} prompts → ${path.relative(ROOT, DIST)} (base=${BASE})`
  );
}

main();
