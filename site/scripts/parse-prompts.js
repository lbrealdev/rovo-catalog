'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED = ['id', 'title', 'category', 'tags', 'use_when', 'placeholders', 'mode'];
const ENTRY_RE = /^---\n([\s\S]*?)\n---\n\s*```(text|jql)\n([\s\S]*?)\n```/gm;

/**
 * Quote-aware split for inline YAML lists: [a, "b, c", 'd'].
 * Escape sequences inside quotes are not supported (see docs/prompt-schema.md).
 */
function parseInlineList(inner) {
  const s = String(inner).trim();
  if (!s) return [];
  const items = [];
  let cur = '';
  let inQuote = null;
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }
    if (ch === ',') {
      items.push(parseScalar(cur.trim()));
      cur = '';
      continue;
    }
    cur += ch;
  }
  items.push(parseScalar(cur.trim()));
  return items;
}

function parseValue(raw) {
  const s = String(raw).trim();
  if (s === '[]') return [];
  const inlineList = s.match(/^\[(.*)\]$/);
  if (inlineList) return parseInlineList(inlineList[1]);
  return parseScalar(s);
}

/**
 * Constrained YAML subset for prompt frontmatter:
 * - key: scalar
 * - key: [a, b]
 * - key: ["a b", "c"]
 * - key: []
 * - key:
 *     - name: X
 *       required: true
 *       description: ...
 *       type: select
 *       options: ["a", "b"]
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
        obj[itemStart[1]] = parseValue(itemStart[2]);
        i += 1;
        while (i < lines.length) {
          const propLine = lines[i];
          if (propLine.match(/^\s*-\s+/)) break;
          const prop = propLine.match(/^\s{2,}([A-Za-z0-9_]+):\s*(.*)$/);
          if (!prop) break;
          const propKey = prop[1];
          const propRest = prop[2];
          if (propRest === '' || propRest === null) {
            // Nested scalar list only when the next non-empty line is a list item
            let peek = i + 1;
            while (peek < lines.length && !lines[peek].trim()) peek += 1;
            const peekLine = peek < lines.length ? lines[peek] : '';
            const looksLikeNestedList =
              /^\s{2,}-\s+(.*)$/.test(peekLine) &&
              !/^\s*-\s+[A-Za-z0-9_]+:\s*/.test(peekLine);
            if (!looksLikeNestedList) {
              obj[propKey] = '';
              i += 1;
              continue;
            }
            const nested = [];
            i += 1;
            while (i < lines.length) {
              const nestedLine = lines[i];
              const nestedItem = nestedLine.match(/^\s{2,}-\s+(.*)$/);
              if (!nestedItem) break;
              // Stop if this looks like a new object list item with a key: `- name:`
              if (/^\s*-\s+[A-Za-z0-9_]+:\s*/.test(nestedLine)) break;
              nested.push(parseScalar(nestedItem[1]));
              i += 1;
            }
            obj[propKey] = nested;
            continue;
          }
          obj[propKey] = parseValue(propRest);
          i += 1;
        }
        items.push(obj);
      }
      meta[key] = items;
      continue;
    }

    meta[key] = parseValue(rest);
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

function normalizePlaceholder(p, filePath, entryId) {
  if (!p || typeof p !== 'object' || !p.name) {
    throw new Error(`${filePath}: placeholder missing name (${entryId})`);
  }
  const type = p.type || 'text';
  if (type !== 'text' && type !== 'select') {
    throw new Error(
      `${filePath}: placeholder ${p.name} type must be text|select (${entryId})`
    );
  }
  const out = {
    name: p.name,
    required: !!p.required,
    description: p.description || p.name,
    type,
  };
  if (type === 'select') {
    if (!Array.isArray(p.options) || !p.options.length) {
      throw new Error(
        `${filePath}: select placeholder ${p.name} requires non-empty options (${entryId})`
      );
    }
    out.options = p.options.map((o) => String(o));
  }
  return out;
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
  if (!/^[a-z0-9-]+$/.test(meta.id)) {
    throw new Error(
      `${filePath}: id must match /^[a-z0-9-]+$/ (got "${meta.id}")`
    );
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

  const placeholders = meta.placeholders.map((p) =>
    normalizePlaceholder(p, filePath, meta.id)
  );

  let hubSteps = null;
  if (meta.hub_steps !== undefined) {
    if (!Array.isArray(meta.hub_steps) || !meta.hub_steps.length) {
      throw new Error(`${filePath}: hub_steps must be a non-empty array (${meta.id})`);
    }
    hubSteps = meta.hub_steps.map((s) => String(s));
  }

  const listed = meta.listed === undefined ? true : !!meta.listed;

  return {
    id: meta.id,
    title: meta.title,
    category: meta.category,
    tags: meta.tags,
    use_when: meta.use_when,
    placeholders,
    mode: meta.mode,
    listed,
    hub_steps: hubSteps,
    lang,
    body: body.replace(/\s+$/, ''),
    source: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
  };
}

function parsePromptFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const entries = [];
  let match;
  ENTRY_RE.lastIndex = 0;
  while ((match = ENTRY_RE.exec(text)) !== null) {
    const yamlText = match[1];
    if (!/^id\s*:/m.test(yamlText)) {
      console.warn(`[parse-prompts] skipping frontmatter without id in ${filePath}`);
      continue;
    }
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

function validateHubSteps(entries) {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const owned = new Map();

  for (const entry of entries) {
    if (!entry.hub_steps) continue;
    for (const stepId of entry.hub_steps) {
      if (stepId === entry.id) {
        throw new Error(
          `${entry.source}: hub_steps cannot reference the hub's own id "${stepId}"`
        );
      }
      if (!byId.has(stepId)) {
        throw new Error(
          `${entry.source}: hub_steps references unknown id "${stepId}" (${entry.id})`
        );
      }
      if (owned.has(stepId)) {
        throw new Error(
          `Step "${stepId}" belongs to both "${owned.get(stepId)}" and "${entry.id}"`
        );
      }
      owned.set(stepId, entry.id);
    }
  }
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

  validateHubSteps(entries);

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
