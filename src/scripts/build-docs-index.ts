#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseFrontmatter(content: string): Record<string, unknown> | null {
  const m = content.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const yaml = m[1];
  const data: Record<string, unknown> = {};
  for (const line of yaml.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const raw = line.slice(idx + 1).trim();
    let val: string | string[] = raw;
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      val = raw.slice(1, -1);
    }
    if (typeof val === 'string' && val.startsWith('[') && val.endsWith(']')) {
      try {
        const parsed = JSON.parse(val.replace(/'/g, '"')) as string[];
        val = parsed;
      } catch (e) {
        const inner = (val as string).slice(1, -1);
        const parsed = inner
          .split(',')
          .map((s: string) => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
        val = parsed;
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
const index: Record<string, unknown>[] = [];
for (const file of files) {
  const abs = path.join(root, file);
  const content = fs.readFileSync(abs, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) continue;
  if (!fm.id || !fm.title) continue;
  if (fm.sections && !Array.isArray(fm.sections)) {
    if (typeof fm.sections === 'string') {
      const s = (fm.sections as string)
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
