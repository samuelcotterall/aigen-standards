#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

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

function parseFrontmatter(content: string) {
  if (!content.startsWith('---')) return { fm: null, body: content };
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { fm: null, body: content };
  const yaml = content.slice(3, end).trim();
  const body = content.slice(end + 4).trim();
  const data: Record<string, any> = {};
  for (const line of yaml.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // basic list normalization [a, b]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1);
      data[key] = val
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      continue;
    }
    // quoted string
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return { fm: data, body };
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
  const { fm, body } = parseFrontmatter(raw);
  const rel = path.relative(process.cwd(), f);
  const origFm = fm ? JSON.parse(JSON.stringify(fm)) : null;
  const newFm: any = {};
  // id
  newFm.id = fm && fm.id ? String(fm.id) : path.basename(f, '.md');
  // title
  newFm.title =
    fm && fm.title
      ? String(fm.title)
      : (() => {
          const m = body.match(/^#\s+(.+)$/m);
          return m ? m[1].trim() : newFm.id;
        })();
  // topics
  newFm.topics = ensureArray(fm && fm.topics ? fm.topics : fm && fm.topic ? fm.topic : []);
  // scope
  newFm.scope = ensureArray(fm && fm.scope ? fm.scope : fm && fm.scopes ? fm.scopes : []);
  // version
  newFm.version = fm && fm.version ? String(fm.version) : 'any';
  // sections: prefer explicit, else derive from headings
  if (fm && fm.sections) {
    newFm.sections = ensureArray(fm.sections);
  } else {
    newFm.sections = headingsToSections(body);
  }

  // write back only if different
  if (!origFm || JSON.stringify(origFm) !== JSON.stringify(newFm)) {
    // build YAML
    const parts: string[] = ['---'];
    parts.push(`id: ${yamlSafe(newFm.id)}`);
    parts.push(`title: ${yamlSafe(newFm.title)}`);
    parts.push(`topics: [${newFm.topics.map((s: string) => `"${s}"`).join(', ')}]`);
    parts.push(`scope: [${newFm.scope.map((s: string) => `"${s}"`).join(', ')}]`);
    parts.push(`version: "${String(newFm.version).replace(/"/g, '')}"`);
    parts.push(`sections:`);
    parts.push(`  [${newFm.sections.join(',')}]`);
    parts.push('---\n');
    const out = parts.join('\n') + '\n' + body.trim() + '\n';
    fs.writeFileSync(f, out, 'utf8');
    report.push(`${rel}: updated frontmatter`);
  }
}

if (!report.length) console.error('All docs already normalized');
else console.error('Normalized:', report.join('; '));

function yamlSafe(s: string) {
  if (!s) return '""';
  if (/[:\n\[\]\{\}]|"/.test(s)) return `"${String(s).replace(/"/g, '\\"')}"`;
  return s;
}
