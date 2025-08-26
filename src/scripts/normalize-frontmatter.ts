#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}

function headingsToSections(body: string) {
  const lines = body.split('\n');
  const secs: string[] = [];
  for (const l of lines) {
    const m = l.match(/^##\s+(.+)$/);
    if (m) {
      const s = m[1]
        .toLowerCase()
        .replace(/[\s\/]+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/-+/g, '-');
      secs.push(s);
    }
  }
  return secs;
}

function ensureArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
  return String(val)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const docsRoot = path.join(process.cwd(), 'docs');
const files = walk(docsRoot);
const report: string[] = [];

for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const parsed = matter(raw);
  const body = parsed.content.trim();
  const fm = parsed.data || {};
  const rel = path.relative(process.cwd(), f);

  const nextFm: any = {};
  // id
  nextFm.id = fm.id ? String(fm.id) : path.basename(f, '.md');
  // title
  if (fm.title) nextFm.title = String(fm.title);
  else {
    const m = body.match(/^#\s+(.+)$/m);
    nextFm.title = m ? m[1].trim() : nextFm.id;
  }
  // topics / scope
  nextFm.topics = ensureArray(fm.topics || fm.topic || []);
  nextFm.scope = ensureArray(fm.scope || fm.scopes || []);
  // version
  nextFm.version = fm.version ? String(fm.version) : 'any';
  // sections
  if (fm.sections) nextFm.sections = ensureArray(fm.sections);
  else nextFm.sections = headingsToSections(body);

  const changed = JSON.stringify(parsed.data || {}) !== JSON.stringify(nextFm);
  if (changed) {
    const out = matter.stringify(body + '\n', nextFm);
    fs.writeFileSync(f, out, 'utf8');
    report.push(`${rel}: updated frontmatter`);
  }
}

if (!report.length) console.error('All docs already normalized');
else console.error('Normalized:', report.join('; '));
