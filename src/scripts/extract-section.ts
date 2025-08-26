#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import semver from 'semver';
import { fetchAndCacheDoc } from '../utils/fetchDoc';

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.md') out.push(p);
  }
  return out;
}

function parseFrontmatter(content: string): { data: Record<string, any>; body: string } {
  if (!content.startsWith('---')) return { data: {}, body: content };
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: content };
  const yaml = content.slice(3, end).trim();
  const body = content.slice(end + 4).trim();
  const data: Record<string, any> = {};
  for (const line of yaml.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    data[key] = val;
  }
  return { data, body };
}

function matches(val: string, arrStr?: string): boolean {
  if (!arrStr) return true;
  const list = arrStr
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((s) => s.trim().replace(/^"|^'|"$|'$/g, ''))
    .filter(Boolean);
  if (!list.length) return true;
  return list.includes(val);
}

const argv = process.argv.slice(2);
let section = argv[0] || 'conventions';
let idOrFile = argv[1];
let scope = argv[2] && !argv[2].startsWith('--') ? argv[2] : undefined;
let versionReq: string | null = null;
for (const a of argv) {
  if (a.startsWith('--version=')) versionReq = a.substring(a.indexOf('=') + 1);
  if (a.startsWith('--scope=')) scope = a.substring(a.indexOf('=') + 1);
}
if (!idOrFile) {
  console.error(
    'Usage: node scripts/extract-section.js <section> <id-or-file> [scope] [--version=range]'
  );
  process.exit(1);
}

function semverSatisfies(docVersion: any, range?: string | null): boolean {
  if (!range) return true;
  if (!docVersion) return false;
  const dv = String(docVersion)
    .replace(/^\s*['"]?|['"]?\s*$/g, '')
    .trim();
  const r = String(range).trim();
  if (dv === 'any' || dv === 'index') return true;
  const looksLikeRange = /[\^~<>\-\s]/.test(dv) || dv.includes('x');
  let rangeNorm = r;
  if (/^\d+$/.test(rangeNorm)) rangeNorm = `^${rangeNorm}.0.0`;
  try {
    if (looksLikeRange) {
      const dvRange = dv.replace(/(\d+)\.x/g, '$1.0.0');
      const res = semver.intersects(dvRange, rangeNorm, { includePrerelease: true });
      if (process.env.EXTRACT_DEBUG === '1')
        console.error('semver check', { dv, r, dvRange, rangeNorm, res });
      return res;
    }
    const coerced = semver.coerce(dv.replace(/\.x$/, '.0'));
    if (!coerced) {
      if (process.env.EXTRACT_DEBUG === '1') console.error('semver fallback', { dv, r });
      return dv.includes(r) || r.includes(dv);
    }
    const res = semver.satisfies(String(coerced), rangeNorm, { includePrerelease: true });
    if (process.env.EXTRACT_DEBUG === '1')
      console.error('semver check single', { dv, r, coerced: String(coerced), rangeNorm, res });
    return res;
  } catch (e) {
    if (process.env.EXTRACT_DEBUG === '1')
      console.error('semver error', (e as Error).message, { dv, r });
    return dv.includes(r) || r.includes(dv);
  }
}

const root = process.cwd();
const docsRoot = join(root, 'docs');
const files = walk(docsRoot);

function pickFile(): string | null {
  for (const f of files) {
    const content = readFileSync(f, 'utf8');
    const { data } = parseFrontmatter(content);
    if (data.id === idOrFile || f.endsWith(`/${idOrFile}.md`) || f.endsWith(idOrFile)) {
      if (data.version && typeof data.version === 'string')
        data.version = data.version.replace(/^\s*['"]|['"]\s*$/g, '').trim();
      if (data.scope && typeof data.scope === 'string')
        data.scope = data.scope.replace(/^\s*\[|\]\s*$/g, '');
      if (scope && !matches(scope, data.scope)) continue;
      if (versionReq && !semverSatisfies(data.version, versionReq)) continue;
      return f;
    }
  }
  return null;
}

async function pickOrFetchFile(): Promise<string | null> {
  const found = pickFile();
  if (found) return found;
  // attempt remote fetch: try common filename patterns
  const owner = 'samuelcotterall';
  const repo = 'aigen-standards';
  const branch = 'main';
  const candidates = [
    `${idOrFile}.md`,
    `docs/${idOrFile}.md`,
    `${idOrFile}/index.md`,
    `docs/${idOrFile}/index.md`,
  ];
  const res = await fetchAndCacheDoc(owner, repo, branch, candidates, docsRoot);
  if (res) return res.savedPath;
  return null;
}

(async () => {
  const file = await pickOrFetchFile();
  if (!file) {
    console.error('Doc not found for', idOrFile);
    process.exit(2);
  }

  const content = readFileSync(file, 'utf8');
const { body } = parseFrontmatter(content);
const lines = body.split('\n');

const needle = `## ${section
  .replace(/(^.|-.)/g, (m) => (m[1] ? m[1].toUpperCase() : m[0].toUpperCase()))
  .replace(/-/g, ' ')}`;
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === needle) {
    start = i + 1;
    break;
  }
}
if (start === -1) {
  console.error(`Section not found: ${section}`);
  process.exit(3);
}
let end = lines.length;
for (let i = start; i < lines.length; i++) {
  if (lines[i].startsWith('## ')) {
    end = i;
    break;
  }
}
  console.log(lines.slice(start, end).join('\n').trim());
})();
