#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '.github' || name === 'scripts')
      continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

function slugify(p) {
  return p
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase();
}

function getTitle(content) {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const m = line.trim().match(/^#\s+(.*)$/);
    if (m) return m[1].trim();
  }
  return null;
}

function getSections(content) {
  const lines = content.split(/\r?\n/);
  const secs = [];
  for (const line of lines) {
    const m = line.match(/^##+\s+(.*)$/);
    if (m) {
      const key = m[1]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      secs.push(key);
    }
  }
  return secs;
}

const files = walk(root).filter((f) => path.basename(f).toLowerCase() !== 'readme.md');
let changed = 0;
for (const f of files) {
  const rel = path.relative(root, f);
  let content = fs.readFileSync(f, 'utf8');
  if (content.trim().startsWith('---')) continue; // already has frontmatter
  const title = getTitle(content) || path.basename(f, '.md');
  const id = slugify(rel.replace(/\\.md$/, ''));
  const sections = getSections(content);
  const fm = [
    '---',
    `id: ${id}`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    'topics: []',
    'scope: []',
    'version: "any"',
    `sections: [${sections.map((s) => s).join(', ')}]`,
    '---',
    '',
  ].join('\n');
  content = fm + content;
  fs.writeFileSync(f, content, 'utf8');
  changed++;
}
console.log(`Frontmatter added to ${changed} files`);
process.exit(0);
