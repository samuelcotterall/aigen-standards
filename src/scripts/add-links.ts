import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getToolUrl, canonicalize, ALL_TOOLS } from '../data/tooling';

const indexPath = path.join(process.cwd(), 'docs', 'docs-index.json');
if (!fs.existsSync(indexPath)) {
  console.error('docs-index.json not found; run build-docs-index first');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as Array<any>;
let updated = 0;
for (const item of index) {
  const topics = (item.topics || []).map((t: unknown) => String(t).toLowerCase());
  const scopes = (item.scope || []).map((s: unknown) => String(s).toLowerCase());
  const toolingLinks: Record<string, string> = {};
  for (const raw of [...topics, ...scopes]) {
    const key = canonicalize(raw);
    const url = getToolUrl(key);
    if (url) toolingLinks[key || raw] = url;
  }
  // attach found toolingLinks to index entry
  item.toolingLinks = toolingLinks;
  updated++;
}

fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
console.log(`Updated ${updated} docs in ${indexPath} with resolved tooling links.`);
