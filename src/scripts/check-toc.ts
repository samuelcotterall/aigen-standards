#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.md' && f !== 'README.md') out.push(p.replace(process.cwd() + '/', ''));
  }
  return out;
}

const root = process.cwd();
const docsRoot = join(root, 'docs');
const files = walk(docsRoot).map((p) => p.replace(/^docs\//, 'docs/'));
const readme = readFileSync(join(root, 'README.md'), 'utf8');

const missing = files.filter((f) => !readme.includes(`(${f})`));
if (missing.length) {
  console.error('Missing from README TOC (expected links to docs/*):', missing.join(', '));
  process.exit(1);
}
console.log('TOC OK');
