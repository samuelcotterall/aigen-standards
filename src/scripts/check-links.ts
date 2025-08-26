import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import fetch from 'node-fetch';
import { setTimeout as delay } from 'timers/promises';

async function checkUrl(url: string) {
  const headers = { 'user-agent': 'docs-link-check/1.0' } as Record<string, string>;
  // Try HEAD first, then GET if needed. Follow redirects.
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers,
      signal: controller.signal,
    } as any);
    clearTimeout(timer);
    if (res.ok) return true;
  } catch {
    // fall through
  }
  try {
    const controller2 = new AbortController();
    const timer2 = setTimeout(() => controller2.abort(), 15000);
    const resGet = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers,
      signal: controller2.signal,
    } as any);
    clearTimeout(timer2);
    return resGet.ok;
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
