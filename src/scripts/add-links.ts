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

const files = globSync(path.join(process.cwd(), 'docs', '**/*.md'));
for (const f of files) addLinksToFile(f);
console.log(`Updated ${files.length} docs with tooling links where applicable.`);
