import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { getToolUrl, canonicalize, ALL_TOOLS } from '../data/tooling';

function addLinksToFile(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const front = parsed.data || {};
  front.toolingLinks = front.toolingLinks || {};
  const topics = (front.topics || []).map((t: string) => String(t).toLowerCase());
  for (const raw of topics) {
    const key = canonicalize(raw);
    const url = getToolUrl(key);
    if (url) front.toolingLinks[key || raw] = url;
  }
  // also examine scope for potential links
  const scopes = (front.scope || []).map((s: string) => String(s).toLowerCase());
  for (const raw of scopes) {
    const key = canonicalize(raw);
    const url = getToolUrl(key);
    if (url) front.toolingLinks[key || raw] = url;
  }
  // provide any missing canonical keys with a base url
  const canonicalTopics = (front.topics || []).map((t: unknown) => canonicalize(String(t)));
  for (const k of Object.keys(ALL_TOOLS)) {
    if (!front.toolingLinks[k] && canonicalTopics.includes(k)) {
      front.toolingLinks[k] = getToolUrl(k) as string;
    }
  }
  const out = matter.stringify(parsed.content, front);
  fs.writeFileSync(file, out, 'utf8');
}

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
