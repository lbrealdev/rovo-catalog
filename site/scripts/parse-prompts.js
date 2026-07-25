'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED = ['id', 'title', 'category', 'tags', 'use_when', 'placeholders', 'mode'];
const ENTRY_RE = /^---\n([\s\S]*?)\n---\n\s*```(text|jql)\n([\s\S]*?)\n```/gm;

/**
 * Constrained YAML subset for prompt frontmatter:
 * - key: scalar
 * - key: [a, b]
 * - key: []
 * - key:
 *     - name: X
 *       required: true
 *       description: ...
 */
function parseFrontmatter(yamlText) {
  const lines = yamlText.replace(/\r\n/g, '\n').split('\n');
  const meta = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i += 1;
      continue;
    }

    const mapMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!mapMatch) {
      throw new Error(`Unexpected frontmatter line: ${line}`);
    }

    const key = mapMatch[1];
    const rest = mapMatch[2];

    if (rest === '' || rest === null) {
      // Block list of objects or empty — peek next
      const items = [];
      i += 1;
      while (i < lines.length) {
        const next = lines[i];
        if (/^[A-Za-z0-9_]+:/.test(next) && !/^\s/.test(next)) break;
        if (!next.trim()) {
          i += 1;
          continue;
        }
        const itemStart = next.match(/^\s*-\s+([A-Za-z0-9_]+):\s*(.*)$/);
        if (!itemStart) {
          throw new Error(`Expected list item under ${key}, got: ${next}`);
        }
        const obj = {};
        obj[itemStart[1]] = parseScalar(itemStart[2]);
        i += 1;
        while (i < lines.length) {
          const prop = lines[i].match(/^\s{2,}([A-Za-z0-9_]+):\s*(.*)$/);
          if (!prop) break;
          if (lines[i].match(/^\s*-\s+/)) break;
          obj[prop[1]] = parseScalar(prop[2]);
          i += 1;
        }
        items.push(obj);
      }
      meta[key] = items;
      continue;
    }

    if (rest === '[]') {
      meta[key] = [];
      i += 1;
      continue;
    }

    const inlineList = rest.match(/^\[(.*)\]$/);
    if (inlineList) {
      const inner = inlineList[1].trim();
      meta[key] = inner
        ? inner.split(',').map((s) => parseScalar(s.trim()))
        : [];
      i += 1;
      continue;
    }

    meta[key] = parseScalar(rest);
    i += 1;
  }

  return meta;
}

function parseScalar(raw) {
  const s = String(raw).trim();
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === '[]') return [];
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function validateEntry(meta, body, lang, filePath) {
  for (const field of REQUIRED) {
    if (!(field in meta)) {
      throw new Error(`${filePath}: missing field "${field}" in entry ${meta.id || '(unknown)'}`);
    }
  }
  if (!meta.id || typeof meta.id !== 'string') {
    throw new Error(`${filePath}: invalid id`);
  }
  if (!Array.isArray(meta.tags)) {
    throw new Error(`${filePath}: tags must be an array (${meta.id})`);
  }
  if (!Array.isArray(meta.placeholders)) {
    throw new Error(`${filePath}: placeholders must be an array (${meta.id})`);
  }
  if (meta.mode !== 'read-only' && meta.mode !== 'update') {
    throw new Error(`${filePath}: mode must be read-only|update (${meta.id})`);
  }
  if (!body.trim()) {
    throw new Error(`${filePath}: empty body (${meta.id})`);
  }
  return {
    id: meta.id,
    title: meta.title,
    category: meta.category,
    tags: meta.tags,
    use_when: meta.use_when,
    placeholders: meta.placeholders,
    mode: meta.mode,
    lang,
    body: body.replace(/\s+$/, ''),
    source: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
  };
}

function parsePromptFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const entries = [];
  let match;
  ENTRY_RE.lastIndex = 0;
  while ((match = ENTRY_RE.exec(text)) !== null) {
    const yamlText = match[1];
    if (!/^id\s*:/m.test(yamlText)) continue;
    const meta = parseFrontmatter(yamlText);
    entries.push(validateEntry(meta, match[3], match[2], filePath));
  }
  return entries;
}

function walkMarkdownFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) out.push(...walkMarkdownFiles(full));
    else if (name.isFile() && name.name.endsWith('.md')) out.push(full);
  }
  return out.sort();
}

function loadAllPrompts(promptsDir) {
  const files = walkMarkdownFiles(promptsDir);
  const entries = [];
  const seen = new Map();

  for (const file of files) {
    for (const entry of parsePromptFile(file)) {
      if (seen.has(entry.id)) {
        throw new Error(
          `Duplicate id "${entry.id}" in ${entry.source} and ${seen.get(entry.id)}`
        );
      }
      seen.set(entry.id, entry.source);
      entries.push(entry);
    }
  }

  const order = ['triage', 'tickets', 'sla', 'communication', 'utilities'];
  entries.sort((a, b) => {
    const ai = order.indexOf(a.category);
    const bi = order.indexOf(b.category);
    const ac = (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    if (ac !== 0) return ac;
    return a.title.localeCompare(b.title);
  });

  return entries;
}

module.exports = {
  loadAllPrompts,
  parsePromptFile,
  parseFrontmatter,
};
