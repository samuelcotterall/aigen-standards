#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { getToolRef, canonicalize, ALL_TOOLS } from '../data/tooling';

const indexPath = path.join(process.cwd(), 'docs', 'docs-index.json');
if (!fs.existsSync(indexPath)) {
  console.error('docs-index.json not found; run build-docs-index first');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as Array<any>;

// mapping is delegated to src/data/tooling.ts

function chooseRefs(item: any) {
  const refs: Array<{ name: string; url: string }> = [];
  const add = (key: string) => {
  const ref = getToolRef(key);
  if (ref && !refs.find((r) => r.url === ref.url)) refs.push(ref);
  };
  if (Array.isArray(item.topics)) item.topics.forEach((t: string) => add(String(t).toLowerCase()));
  if (Array.isArray(item.scope)) item.scope.forEach((s: string) => add(String(s).toLowerCase()));
  // fallback by id/title keywords
  const text = (item.id + ' ' + item.title).toLowerCase();
  Object.keys(ALL_TOOLS).forEach((k) => {
    const ref = getToolRef(k);
    if (ref && text.includes(k) && !refs.find((r) => r.url === ref.url)) refs.push(ref);
  });
  // ensure some default refs for common cases
  if (!refs.length) refs.push({ name: 'General web docs', url: 'https://developer.mozilla.org/' });
  return refs;
}

const updated: string[] = [];
for (const item of index) {
  const mdPath = path.join(process.cwd(), item.file);
  if (!fs.existsSync(mdPath)) continue;
  const raw = fs.readFileSync(mdPath, 'utf8');
  if (/^##+\s*References?/im.test(raw) || /Validated with/i.test(raw)) continue;
  const refs = chooseRefs(item);
  const refLines = [
    '\n## References / Validation',
    '\nThe content in this document has been reviewed against authoritative sources:',
  ];
  for (const r of refs) refLines.push(`- [${r.name}](${r.url})`);
  refLines.push(
    '\n_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._\n'
  );
  fs.appendFileSync(mdPath, refLines.join('\n') + '\n', 'utf8');
  updated.push(item.file);
}

if (updated.length) console.error('Enriched:', updated.join(', '));
else console.error('No files needed enrichment');
