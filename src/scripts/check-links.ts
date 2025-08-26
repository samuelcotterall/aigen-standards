import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import fetch from 'node-fetch';

async function checkUrl(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const files = globSync(path.join(process.cwd(), 'docs', '**/*.md'));
  const failures: Array<{ file: string; url: string }> = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = matter(raw);
    const links = parsed.data?.toolingLinks || {};
    for (const key of Object.keys(links)) {
      const ok = await checkUrl(links[key]);
      if (!ok) failures.push({ file, url: links[key] });
    }
  }
  if (failures.length) {
    console.error('Link check failed for:');
    for (const f of failures) console.error(`${f.file} -> ${f.url}`);
    process.exit(2);
  }
  console.log('All tooling links reachable.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
