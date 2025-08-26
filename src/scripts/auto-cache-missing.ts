#!/usr/bin/env node
import { fetchAndCacheDoc } from '../utils/fetchDoc';

async function main() {
  const owner = process.env.REPO_OWNER || 'samuelcotterall';
  const repo = process.env.REPO_NAME || 'aigen-standards';
  const branch = process.env.REPO_BASE || 'main';
  const raw = process.env.MISSING_DOCS || process.env.GITHUB_EVENT_PATH;
  let paths: string[] = [];
  if (process.env.MISSING_DOCS) {
    try {
      paths = JSON.parse(process.env.MISSING_DOCS);
    } catch {
      paths = process.env.MISSING_DOCS.split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  } else if (process.env.GITHUB_EVENT_PATH) {
    try {
      const payload = JSON.parse(require('fs').readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      // expect payload.client_payload.paths = []
      if (payload && payload.client_payload && Array.isArray(payload.client_payload.paths))
        paths = payload.client_payload.paths;
    } catch (e: any) {
      console.error('failed to read event payload', e && e.message);
    }
  }

  if (!paths.length) {
    console.error('no missing doc paths provided');
    process.exit(1);
  }

  process.env.EXTRACT_AUTO_COMMIT = '1';

  for (const p of paths) {
    const res = await fetchAndCacheDoc(owner, repo, branch, [p], 'docs');
    if (res) console.error('cached', res.savedPath);
    else console.error('failed to fetch', p);
  }
}

main().catch((e) => {
  console.error(e && e.message);
  process.exit(2);
});
