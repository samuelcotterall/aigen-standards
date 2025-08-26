#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const root = process.cwd();
const docsRoot = path.join(root, 'docs');

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const yaml = m[1];
  const data = {};
  for (const line of yaml.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        val = JSON.parse(val.replace(/'/g, '"'));
      } catch (e) {
        val = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
      }
    }
    data[key] = val;
  }
  return data;
}

if (!fs.existsSync(docsRoot) || !fs.statSync(docsRoot).isDirectory()) {
  console.error('docs/ directory not found at', docsRoot);
  process.exit(1);
}

const start = performance.now();

const files = walk(docsRoot)
  .map((f) => path.relative(root, f))
  .sort();
const index = [];
for (const file of files) {
  const abs = path.join(root, file);
  const content = fs.readFileSync(abs, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) continue;
  if (!fm.id || !fm.title) continue;
  if (fm.sections && !Array.isArray(fm.sections)) {
    if (typeof fm.sections === 'string') {
      const s = fm.sections
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((x) => x.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
      fm.sections = s;
    } else fm.sections = [String(fm.sections)];
  }
  if (!fm.sections) fm.sections = [];
  if (fm.version) fm.version = String(fm.version);
  if (fm.scope && !Array.isArray(fm.scope)) fm.scope = String(fm.scope);
  index.push(Object.assign({ file }, fm));
}

const outPath = path.join(docsRoot, 'docs-index.json');
fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf8');
const elapsed = performance.now() - start;
console.log(outPath, 'written with', index.length, 'entries');
console.log(`build-docs-index: elapsed ${Math.round(elapsed)}ms`);
